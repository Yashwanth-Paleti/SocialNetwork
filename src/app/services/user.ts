import { Injectable } from '@angular/core';
import {
  doc, getDoc, getDocs, updateDoc,
  collection, arrayUnion, arrayRemove
} from 'firebase/firestore';
import { db } from '../firebase.config';

@Injectable({ providedIn: 'root' })
export class UserService {

  async getUserById(uid: string): Promise<any> {
    const snap = await getDoc(doc(db, 'users', uid));
    if (!snap.exists()) return null;
    return { uid: snap.id, ...snap.data() };
  }

  async getAllUsers(): Promise<any[]> {
    const snap = await getDocs(collection(db, 'users'));
    return snap.docs.map(d => ({ uid: d.id, ...d.data() }));
  }

  async updateProfile(uid: string, data: { displayName?: string; bio?: string; photoURL?: string }): Promise<void> {
    await updateDoc(doc(db, 'users', uid), data);
  }

  async toggleFollow(currentUserId: string, targetUserId: string): Promise<boolean> {
    const currentRef = doc(db, 'users', currentUserId);
    const targetRef = doc(db, 'users', targetUserId);
    const snap = await getDoc(currentRef);
    const following: string[] = snap.data()?.['following'] || [];
    const isFollowing = following.includes(targetUserId);

    if (isFollowing) {
      await updateDoc(currentRef, { following: arrayRemove(targetUserId) });
      await updateDoc(targetRef, { followers: arrayRemove(currentUserId) });
    } else {
      await updateDoc(currentRef, { following: arrayUnion(targetUserId) });
      await updateDoc(targetRef, { followers: arrayUnion(currentUserId) });
    }
    return !isFollowing;
  }
}
