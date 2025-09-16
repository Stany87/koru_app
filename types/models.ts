export type Sex = "male" | "female" | "other" | "prefer_not_to_say";

export interface Profile {
  name: string;
  age: number;
  sex: Sex;
  weight?: number;
  avatarUrl?: string | null;
}

export interface MessageReactions {
  thumbsUp: boolean;
  thumbsDown: boolean;
}

export interface Message {
  sender: "user" | "ai";
  content: string;
  reactions?: MessageReactions;
  ts: any; // Firestore Timestamp
}

export interface AchievementDaily {
  journalCompleted?: boolean;
  habits?: Record<string, boolean>;
  moodAvg?: number;
  tasksCompleted?: number;
}

export interface AchievementWeekly {
  habits?: Record<string, number>; // progress 0-100
  moodAvg?: number;
  tasksCompleted?: number;
}

export interface ExerciseLog {
  type: "breathing" | "reframe" | "body_scan" | "box_breathing" | string;
  notes?: string;
}



