import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SavedMedia } from "@/types/media";

const mediaCollection = collection(db, "savedMedia");

export async function addSavedMedia(item: SavedMedia) {
  const docRef = await addDoc(mediaCollection, item);
  return docRef.id; // Firestore-generated document ID
}

export async function getAllSavedMedia(): Promise<
  (SavedMedia & { id: string })[]
> {
  const snapshot = await getDocs(mediaCollection);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as SavedMedia),
  }));
}

export async function updateSavedMedia(
  id: string,
  updates: Partial<SavedMedia>,
) {
  await updateDoc(doc(db, "savedMedia", id), updates);
}

export async function deleteSavedMedia(id: string) {
  await deleteDoc(doc(db, "savedMedia", id));
}
