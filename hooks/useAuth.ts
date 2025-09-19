"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Check for demo user first
    const demoUserData = localStorage.getItem('koru-demo-user')
    if (demoUserData) {
      try {
        const demoUser = JSON.parse(demoUserData) as User
        setUser(demoUser)
        setReady(true)
        return
      } catch (error) {
        console.error('Failed to parse demo user data:', error)
        localStorage.removeItem('koru-demo-user')
      }
    }
    
    if (!auth) {
      // Fallback to a stable local user when Firebase auth is not configured.
      // This enables one-time onboarding/profile stored in localStorage.
      const localUser = { uid: "local" } as unknown as User;
      setUser(localUser);
      setReady(true);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setReady(true);
    });
    return () => unsub();
  }, []);

  return { user, ready };
}



