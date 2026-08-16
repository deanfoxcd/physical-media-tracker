import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { SavedMedia, SavedMediaUpdates } from "@/types/media";
import { showToast } from "@/lib/toast";

const mediaCollection = collection(db, "savedMedia");

export async function addSavedMedia(item: SavedMedia) {
  const docRef = await addDoc(mediaCollection, item);
  showToast(
    item.status === "wishlist" ? "Added to Wishlist" : "Added to Collection",
  );
  return docRef.id;
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

export async function getSavedMediaByStatus(
  status: "owned" | "wishlist",
): Promise<(SavedMedia & { id: string })[]> {
  const q = query(mediaCollection, where("status", "==", status));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as SavedMedia) }));
}

export async function updateSavedMedia(
  id: string,
  updates: SavedMediaUpdates,
  message: string,
) {
  await updateDoc(doc(db, "savedMedia", id), updates);
  showToast(message);
}

export async function deleteSavedMedia(id: string) {
  await deleteDoc(doc(db, "savedMedia", id));
}
