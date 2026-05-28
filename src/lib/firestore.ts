import {
  collection, doc, setDoc, deleteDoc, onSnapshot, getDoc,
  serverTimestamp, writeBatch,
  type Firestore, type Unsubscribe,
} from 'firebase/firestore';
import type { Word } from '@/types';

// Profile stored at users/{uid}/profile/main — 4 path segments (valid Firestore doc path).
// users/{uid}/profile would be 3 segments (a collection ref), which Firestore rejects.
const profileRef = (db: Firestore, uid: string) =>
  doc(db, 'users', uid, 'profile', 'main');

export interface UserProfile {
  username: string;
  maxStreak: number;
  masteredTags?: Record<string, number> | string[];
  createdAt: unknown;
}

export async function getProfile(db: Firestore, uid: string): Promise<UserProfile | null> {
  const snap = await getDoc(profileRef(db, uid));
  return snap.exists() ? (snap.data() as UserProfile) : null;
}

export async function saveProfile(
  db: Firestore,
  uid: string,
  username: string,
  maxStreak = 0,
): Promise<void> {
  await setDoc(profileRef(db, uid), { username, maxStreak, createdAt: serverTimestamp() });
}

export async function saveMaxStreak(db: Firestore, uid: string, maxStreak: number): Promise<void> {
  await setDoc(profileRef(db, uid), { maxStreak }, { merge: true });
}

export async function saveMasteredTags(db: Firestore, uid: string, masteredTags: Record<string, number>): Promise<void> {
  await setDoc(profileRef(db, uid), { masteredTags }, { merge: true });
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
