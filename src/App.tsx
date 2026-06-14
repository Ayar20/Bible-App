import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home as HomeIcon, BookOpen, Calendar, Search, User, Flame, 
  MapPin, Settings, AlertCircle, Heart, Star, Compass
} from 'lucide-react';
import { Highlight, Note, Bookmark, ReadingPlan } from './types';
import DailyFeed from './components/DailyFeed';
import BibleReader from './components/BibleReader';
import PlansView from './components/PlansView';
import SearchModule from './components/SearchModule';
import ProfileView from './components/ProfileView';
import GuidedPrayer from './components/GuidedPrayer';

export default function App() {
  const [activeTab, setActiveTab] = useState<'Home' | 'Bible' | 'Plans' | 'Search' | 'Profile'>('Home');
  const [streak, setStreak] = useState<number>(3); // start at 3 days streak
  
  // Database state persisting across active session
  const [highlights, setHighlights] = useState<Highlight[]>([
    {
      id: 'h-1',
      book: 'John',
      chapter: 3,
      verse: 16,
      color: '#fef08a', // pale yellow
      createdAt: 'Two days ago'
    }
  ]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  
  // Global book & chapter memory
  const [selectedBook, setSelectedBook] = useState<string>('John');
  const [selectedChapter, setSelectedChapter] = useState<number>(3);
  const [jumpVerseNum, setJumpVerseNum] = useState<number | undefined>(undefined);

  // Prayer integration
  const [showGuidedPrayer, setShowGuidedPrayer] = useState(false);
  const [latestPrayer, setLatestPrayer] = useState('');
  const [hasNewPrayerBadge, setHasNewPrayerBadge] = useState(false);

  // Load state from localStorage on mount (optional fallback for perfect durable simulation)
  useEffect(() => {
    const savedStreak = localStorage.getItem('bible_streak');
    if (savedStreak) setStreak(parseInt(savedStreak, 10));

    const savedHighlights = localStorage.getItem('bible_highlights');
    if (savedHighlights) setHighlights(JSON.parse(savedHighlights));

    const savedNotes = localStorage.getItem('bible_notes');
    if (savedNotes) setNotes(JSON.parse(savedNotes));

    const savedBookmarks = localStorage.getItem('bible_bookmarks');
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));

    const savedPrayer = localStorage.getItem('bible_last_prayer');
    if (savedPrayer) setLatestPrayer(savedPrayer);
  }, []);

  // Update helper saving state
  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleUpdateStreak = () => {
    setStreak(prev => {
      const nextStreak = prev + 1;
      localStorage.setItem('bible_streak', String(nextStreak));
      return nextStreak;
    });
  };

  const handleAddHighlight = (book: string, chapter: number, verse: number, color: string) => {
    setHighlights(prev => {
      // Remove previous color if exists
      const cleanList = prev.filter(h => !(h.book === book && h.chapter === chapter && h.verse === verse));
      const nextList = [
        ...cleanList,
        {
          id: `h_${Date.now()}`,
          book,
          chapter,
          verse,
          color,
          createdAt: 'Just now'
        }
      ];
      saveToStorage('bible_highlights', nextList);
      return nextList;
    });
  };

  const handleRemoveHighlight = (book: string, chapter: number, verse: number) => {
    setHighlights(prev => {
      const nextList = prev.filter(h => !(h.book === book && h.chapter === chapter && h.verse === verse));
      saveToStorage('bible_highlights', nextList);
      return nextList;
    });
  };

  const handleAddNote = (book: string, chapter: number, verse: number, text: string) => {
    setNotes(prev => {
      const nextList = [
        ...prev,
        {
          id: `n_${Date.now()}`,
          book,
          chapter,
          verse,
          text,
          createdAt: 'Just now'
        }
      ];
      saveToStorage('bible_notes', nextList);
      return nextList;
    });
  };

  const handleRemoveNote = (id: string) => {
    setNotes(prev => {
      const nextList = prev.filter(n => n.id !== id);
      saveToStorage('bible_notes', nextList);
      return nextList;
    });
  };

  const handleAddBookmark = (book: string, chapter: number, verse: number) => {
    setBookmarks(prev => {
      const nextList = [
        ...prev,
        {
          id: `b_${Date.now()}`,
          book,
          chapter,
          verse,
          createdAt: 'Just now'
        }
      ];
      saveToStorage('bible_bookmarks', nextList);
      return nextList;
    });
  };

  const handleRemoveBookmark = (book: string, chapter: number, verse: number) => {
    setBookmarks(prev => {
      const nextList = prev.filter(b => !(b.book === book && b.chapter === chapter && b.verse === verse));
      saveToStorage('bible_bookmarks', nextList);
      return nextList;
    });
  };

  const handleJumpToLocation = (book: string, chapter: number, verse: number) => {
    setSelectedBook(book);
    setSelectedChapter(chapter);
    setJumpVerseNum(verse);
    setActiveTab('Bible');
  };

  const handleCompletePrayerSession = (prayerText: string) => {
    setLatestPrayer(prayerText);
    localStorage.setItem('bible_last_prayer', prayerText);
    setHasNewPrayerBadge(true);
    handleUpdateStreak(); // completing a guided prayer adds to streak!
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col font-sans text-slate-900" id="app-root-layout">
      
      {/* 1. TOP PREMIUM HEADER BRANDING */}
      <header className="sticky top-0 bg-white border-b border-slate-250 text-slate-900 z-40 shadow-xs" id="brand-header-navigation">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-blue-700 text-white rounded-xl shadow-xs font-serif font-serif font-black text-[10px] tracking-wider leading-none shrink-0">
              BIBLE
              <br />
              .WEB
            </span>
            <div>
              <h1 className="text-base font-serif font-bold tracking-tight text-slate-900 leading-none">
                YouVersion
              </h1>
              <p className="text-[10px] text-blue-700 font-semibold uppercase tracking-widest mt-1">Editorial Workspace</p>
            </div>
          </div>

          {/* Desktop Right items */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-blue-50 px-3.5 py-1.5 rounded-2xl border border-blue-200 font-sans">
              <Flame className="w-4 h-4 text-blue-700 fill-current animate-pulse" />
              <span className="text-xs text-blue-850 font-bold">{streak} Day Streak &bull; Editorial Scholar</span>
            </div>
          </div>
        </div>
      </header>

      {/* 2. MAIN LAYOUT PORTION FOR SELECTED TAB */}
      <main className="flex-1 max-w-6xl w-full mx-auto pb-24 md:pb-12 pt-4 md:pt-6" id="main-content-viewport">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'Home' && (
              <DailyFeed
                streak={streak}
                onLaunchPrayerByButton={() => setShowGuidedPrayer(true)}
                onReadVerseOfDay={handleJumpToLocation}
                onPreSelectTab={(tab) => {
                  setActiveTab(tab);
                  if (tab === 'Profile') setHasNewPrayerBadge(false);
                }}
                latestPrayerText={latestPrayer}
                lastReadPassage={{ book: selectedBook, chapter: selectedChapter }}
              />
            )}

            {activeTab === 'Bible' && (
              <BibleReader
                highlights={highlights}
                notes={notes}
                bookmarks={bookmarks}
                onAddHighlight={handleAddHighlight}
                onRemoveHighlight={handleRemoveHighlight}
                onAddNote={handleAddNote}
                onAddBookmark={handleAddBookmark}
                onRemoveBookmark={handleRemoveBookmark}
                selectedBook={selectedBook}
                selectedChapter={selectedChapter}
                highlightedVerseIndex={jumpVerseNum}
                onResetVerseJump={() => setJumpVerseNum(undefined)}
                onChangeChapter={(b, c) => {
                  setSelectedBook(b);
                  setSelectedChapter(c);
                }}
              />
            )}

            {activeTab === 'Plans' && (
              <PlansView
                onUpdateStreak={handleUpdateStreak}
                onJumpToVerse={handleJumpToLocation}
                highlights={highlights}
                notes={notes}
                onAddHighlight={handleAddHighlight}
              />
            )}

            {activeTab === 'Search' && (
              <SearchModule
                onJumpToVerse={handleJumpToLocation}
              />
            )}

            {activeTab === 'Profile' && (
              <ProfileView
                streak={streak}
                highlights={highlights}
                notes={notes}
                bookmarks={bookmarks}
                onRemoveHighlight={handleRemoveHighlight}
                onRemoveBookmark={handleRemoveBookmark}
                onRemoveNote={handleRemoveNote}
                onJumpToVerse={handleJumpToLocation}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. RESPONSIVE FLOATING HUD NAVIGATION (BOTTOM TABS BAR) */}
      <nav 
        className="fixed bottom-0 left-0 right-0 bg-white/95 border-t border-slate-200 text-slate-500 p-2 z-40 backdrop-blur-md shadow-md"
        id="app-bottom-hud-navigation"
      >
        <div className="max-w-md mx-auto flex items-center justify-around h-14">
          {[
            { id: 'Home', icon: HomeIcon, label: 'Today' },
            { id: 'Bible', icon: BookOpen, label: 'Bible' },
            { id: 'Plans', icon: Calendar, label: 'Plans' },
            { id: 'Search', icon: Search, label: 'Search' },
            { id: 'Profile', icon: User, label: 'Profile', badge: hasNewPrayerBadge }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  if (tab.id === 'Profile') setHasNewPrayerBadge(false);
                }}
                className={`flex flex-col items-center justify-center flex-1 h-full relative transition-all ${
                  isSelected ? 'text-blue-700 scale-105 font-semibold' : 'hover:text-slate-900'
                }`}
                style={{ touchAction: 'manipulation' }}
                id={`nav-link-${tab.id.toLowerCase()}`}
              >
                {/* Touch targets are at least 44px */}
                <span className="p-1">
                  <Icon className={`w-5 h-5 ${isSelected ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider mt-0.5">
                  {tab.label}
                </span>

                {/* Optional notification badge for new prayers completed */}
                {tab.badge && (
                  <span className="absolute top-1 right-5 bg-sky-500 w-2.5 h-2.5 rounded-full border border-white animate-pulse" />
                )}

                {/* Glow ring indicator under selection */}
                {isSelected && (
                  <motion.div
                    layoutId="hud-glow-line"
                    className="absolute -bottom-1 w-8 h-1 bg-blue-700 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* 4. GUIDED PRAYER INTERACTIVE OVERLAY MODAL */}
      {showGuidedPrayer && (
        <GuidedPrayer
          onClose={() => setShowGuidedPrayer(false)}
          onCompletePrayer={handleCompletePrayerSession}
        />
      )}

    </div>
  );
}
