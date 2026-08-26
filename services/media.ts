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

export async function addSavedMedia(
  item: SavedMedia,
): Promise<SavedMedia & { id: string }> {
  try {
    const docRef = await addDoc(mediaCollection, item);
    showToast(
      item.status === "wishlist" ? "Added to Wishlist" : "Added to Collection",
    );
    return { ...item, id: docRef.id };
  } catch (err) {
    showToast("Failed to save item. Please try again.", "error");
    throw err;
  }
}

export async function getAllSavedMedia(
  userId: string,
): Promise<(SavedMedia & { id: string })[]> {
  try {
    const q = query(mediaCollection, where("userId", "==", userId));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as SavedMedia),
    }));
  } catch (err) {
    showToast("Failed to load your media. Please try again.", "error");
    throw err;
  }
}

export async function getSavedMediaByStatus(
  status: "owned" | "wishlist",
  userId: string,
): Promise<(SavedMedia & { id: string })[]> {
  try {
    const q = query(
      mediaCollection,
      where("userId", "==", userId),
      where("status", "==", status),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((d) => ({
      id: d.id,
      ...(d.data() as SavedMedia),
    }));
  } catch (err) {
    showToast("Failed to load your media. Please try again.", "error");
    throw err;
  }
}

export async function updateSavedMedia(
  id: string,
  updates: SavedMediaUpdates,
  message: string,
) {
  try {
    await updateDoc(doc(db, "savedMedia", id), updates);
    showToast(message);
  } catch (err) {
    showToast("Failed to update item. Please try again.", "error");
    throw err;
  }
}

export async function deleteSavedMedia(id: string) {
  try {
    await deleteDoc(doc(db, "savedMedia", id));
  } catch (err) {
    showToast("Failed to remove item. Please try again.", "error");
    throw err;
  }
}
