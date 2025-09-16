import { db } from "@/lib/firebase";
import { addDoc, collection, doc, getDoc, serverTimestamp, setDoc, updateDoc } from "firebase/firestore";
import type { Profile, Message, AchievementDaily, AchievementWeekly, ExerciseLog } from "@/types/models";

function requireDb() {
  if (!db) throw new Error("Firestore is not enabled. Provide Firebase env vars.");
  return db;
}

export async function ensureUserDocument(uid: string, profile?: Profile) {
  const database = requireDb();
  const ref = doc(database, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(
      ref,
      {
        profile: profile ?? null,
        settings: { termsAcceptedAt: null, privacyAcceptedAt: null, onboardingDone: false, notifications: true, theme: "system" },
        streaks: { journalDaysInARow: 0, lastJournalDate: null },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  }
}

export async function saveProfile(uid: string, profile: Profile, acceptedNow?: boolean) {
  const database = requireDb();
  const ref = doc(database, "users", uid);
  await setDoc(
    ref,
    {
      profile,
      updatedAt: serverTimestamp(),
      ...(acceptedNow ? { settings: { termsAcceptedAt: serverTimestamp(), privacyAcceptedAt: serverTimestamp() } } : {}),
    },
    { merge: true }
  );
}

export async function setOnboardingDone(uid: string) {
  const database = requireDb();
  const ref = doc(database, "users", uid);
  await setDoc(ref, { settings: { onboardingDone: true }, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getUserSettings(uid: string): Promise<any | null> {
  const database = requireDb();
  const ref = doc(database, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const data = snap.data() as any;
  return data?.settings ?? null;
}

export async function createChat(uid: string, title: string) {
  const database = requireDb();
  const ref = await addDoc(collection(database, "users", uid, "chats"), {
    title,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function saveMessage(uid: string, chatId: string, message: Omit<Message, "ts">) {
  const database = requireDb();
  await addDoc(collection(database, "users", uid, "chats", chatId, "messages"), {
    ...message,
    ts: serverTimestamp(),
  });
  await updateDoc(doc(database, "users", uid, "chats", chatId), { updatedAt: serverTimestamp() });
}

export async function upsertDaily(uid: string, ymd: string, data: AchievementDaily) {
  const database = requireDb();
  const ref = doc(database, "users", uid, "achievements", `daily-${ymd}`);
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function upsertWeekly(uid: string, isoWeek: string, data: AchievementWeekly) {
  const database = requireDb();
  const ref = doc(database, "users", uid, "achievements", `weekly-${isoWeek}`);
  await setDoc(ref, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}

export async function logExercise(uid: string, entry: ExerciseLog) {
  const database = requireDb();
  await addDoc(collection(database, "users", uid, "exercises"), {
    ...entry,
    ts: serverTimestamp(),
  });
}

// Mood tracking: store per-day mood value (1-5) under users/{uid}/moods/{YYYY-MM-DD}
export async function setDailyMood(uid: string, ymd: string, mood: number) {
  const database = requireDb();
  const ref = doc(database, "users", uid, "moods", ymd);
  await setDoc(ref, { mood, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getDailyMoods(uid: string, ymds: string[]) {
  const database = requireDb();
  const tasks = ymds.map(async (d) => {
    const ref = doc(database, "users", uid, "moods", d);
    const snap = await getDoc(ref);
    return { date: d, mood: snap.exists() ? (snap.data() as any)?.mood ?? null : null } as { date: string; mood: number | null };
  });
  return Promise.all(tasks);
}



