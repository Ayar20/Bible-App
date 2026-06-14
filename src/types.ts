export interface Translation {
  id: string;
  name: string;
  fullName: string;
  language: string;
}

export interface Verse {
  number: number;
  text: string;
  isRedLetter?: boolean;
}

export interface Chapter {
  book: string;
  chapter: number;
  verses: Verse[];
}

export interface Highlight {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  color: string; // hex or tailwind class name
  createdAt: string;
}

export interface Note {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  book: string;
  chapter: number;
  verse: number;
  createdAt: string;
}

export interface ReadingPlan {
  id: string;
  title: string;
  category: string;
  durationDays: number;
  description: string;
  image: string;
  completedDays: number[]; // index of completed days, e.g. [1, 2]
  readings: {
    day: number;
    title: string;
    description?: string;
    scriptures: {
      reference: string; // e.g. "Romans 8:28-39"
      book: string;
      chapter: number;
      startVerse: number;
      endVerse: number;
    }[];
    devotionalText?: string;
  }[];
}

export interface CommunityAction {
  id: string;
  userName: string;
  avatarUrl: string;
  actionText: string; // e.g., "highlighted" | "completed a day of" | "shared a verse"
  targetName: string; // e.g., "John 3:16" | "Day 4 of 'Overcoming Anxiety'"
  contentQuote?: string;
  timestamp: string;
  likes: number;
  commentsCount: number;
  hasLiked?: boolean;
}

export interface DailyPrayerStep {
  title: string;
  prompt: string;
  category: 'Praise' | 'Repent' | 'Ask' | 'Yield';
  guideText: string;
}
