import {
  collection, doc, setDoc, deleteDoc, onSnapshot, getDoc,
  serverTimestamp, writeBatch,
  type Firestore, type Unsubscribe,
} from 'firebase/firestore';
import type { Word } from '@/types';

export interface UserProfile {
  username: string;
  createdAt: unknown;
}

export async function getProfile(db: Firestore, uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(doc(db, 'users', uid, 'profile'));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function saveProfile(db: Firestore, uid: string, username: string): Promise<void> {
  await setDoc(doc(db, 'users', uid, 'profile'), { username, createdAt: serverTimestamp() });
}

export function subscribeWords(
  db: Firestore,
  uid: string,
  cb: (words: Word[]) => void,
): Unsubscribe {
  return onSnapshot(collection(db, 'users', uid, 'words'), snap => {
    cb(snap.docs.map(d => d.data() as Word));
  });
}

export async function upsertWord(db: Firestore, uid: string, word: Word): Promise<void> {
  await setDoc(doc(db, 'users', uid, 'words', word.id), word);
}

export async function removeWords(db: Firestore, uid: string, ids: string[]): Promise<void> {
  const batch = writeBatch(db);
  ids.forEach(id => batch.delete(doc(db, 'users', uid, 'words', id)));
  await batch.commit();
}
