import { Injectable } from '@angular/core';
import {
  collection, addDoc, getDocs, doc, getDoc,
  updateDoc, arrayUnion, arrayRemove, orderBy, query, serverTimestamp
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, auth } from '../firebase.config';
import { Post } from '../models/post';

@Injectable({ providedIn: 'root' })
export class ImageService {

  async uploadImage(file: File, caption: string): Promise<void> {
    const user = auth.currentUser;
    if (!user) throw new Error('Not authenticated');

    const storageRef = ref(storage, `posts/${user.uid}/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    const imageUrl = await getDownloadURL(storageRef);

    await addDoc(collection(db, 'posts'), {
      imageUrl,
      caption,
      userId: user.uid,
      userName: user.displayName || 'User',
      userPhoto: user.photoURL || '',
      createdAt: serverTimestamp(),
      likes: [],
      comments: []
    });
  }

  async getAllPosts(): Promise<Post[]> {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as Post));
  }

  async getPostById(postId: string): Promise<Post | null> {
    const snap = await getDoc(doc(db, 'posts', postId));
    if (!snap.exists()) return null;
    return { id: snap.id, ...snap.data() } as Post;
  }

  async getPostsByUser(userId: string): Promise<Post[]> {
    const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs
      .map(d => ({ id: d.id, ...d.data() } as Post))
      .filter(p => p.userId === userId);
  }

  async likePost(postId: string, userId: string): Promise<void> {
    await updateDoc(doc(db, 'posts', postId), {
      likes: arrayUnion(userId)
    });
  }

  async unlikePost(postId: string, userId: string): Promise<void> {
    await updateDoc(doc(db, 'posts', postId), {
      likes: arrayRemove(userId)
    });
  }

  async addComment(postId: string, comment: any): Promise<void> {
    const postRef = doc(db, 'posts', postId);
    const snap = await getDoc(postRef);
    const data = snap.data();
    const comments = Array.isArray(data?.['comments']) ? data!['comments'] : [];
    comments.push({ ...comment, createdAt: new Date() });
    await updateDoc(postRef, { comments });
  }
}
