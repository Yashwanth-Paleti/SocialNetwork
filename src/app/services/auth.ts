import { Injectable } from '@angular/core';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.config';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  authReady$ = new BehaviorSubject<boolean>(false);

  constructor() {
    onAuthStateChanged(auth, (user) => {
      this.currentUserSubject.next(user);
      this.authReady$.next(true);
    });
  }

  get currentUser(): User | null {
    return this.currentUserSubject.value;
  }

  async register(email: string, password: string, name: string): Promise<void> {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      // Wait for profile update and then Firestore document creation
      await updateProfile(cred.user, { displayName: name });
      
      const userDocData = {
        uid: cred.user.uid,
        email,
        displayName: name,
        photoURL: '',
        bio: '',
        followers: [],
        following: [],
        createdAt: new Date().toISOString() // Use standard ISO string for better reliability
      };

      await setDoc(doc(db, 'users', cred.user.uid), userDocData);
      
      // Force update of internal observation state
      this.currentUserSubject.next(cred.user);
    } catch (error) {
      console.error('Error during registration phase:', error);
      throw error;
    }
  }

  async login(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async loginWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    const cred = await signInWithPopup(auth, provider);
    const userRef = doc(db, 'users', cred.user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName,
        photoURL: cred.user.photoURL,
        bio: '',
        followers: [],
        following: [],
        createdAt: new Date().toISOString()
      });
    }
    this.currentUserSubject.next(cred.user);
  }

  async logout(): Promise<void> {
    await signOut(auth);
  }
}
