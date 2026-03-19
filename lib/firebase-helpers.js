import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

const TTL_MINUTES = 10;

export async function getCached(key) {
  try {
    const ref = doc(db, "espn-cache", key);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;

    const { data, fetchedAt } = snap.data();
    const ageMs = Date.now() - fetchedAt;
    if (ageMs > TTL_MINUTES * 60 * 1000) return null;

    return data;
  } catch {
    return null;
  }
}

export async function setCached(key, data) {
  try {
    const ref = doc(db, "espn-cache", key);
    await setDoc(ref, { data, fetchedAt: Date.now() });
  } catch {
    // Cache write failure is non-fatal
  }
}
