import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, Calendar, Highlighter, MessageSquare, BookMarked, UserPlus, 
  Trash2, BookOpen, Quote, ShieldAlert, Sparkles, CheckCircle, ArrowRight
} from 'lucide-react';
import { Highlight, Note, Bookmark } from '../types';

interface ProfileViewProps {
  streak: number;
  highlights: Highlight[];
  notes: Note[];
  bookmarks: Bookmark[];
  onRemoveHighlight: (book: string, chapter: number, verse: number) => void;
  onRemoveBookmark: (book: string, chapter: number, verse: number) => void;
  onRemoveNote: (id: string) => void;
  onJumpToVerse: (book: string, chapter: number, verse: number) => void;
}

interface Friend {
  id: string;
  name: string;
  avatar: string;
  streak: number;
}

export default function ProfileView({
  streak,
  highlights,
  notes,
  bookmarks,
  onRemoveHighlight,
  onRemoveBookmark,
  onRemoveNote,
  onJumpToVerse
}: ProfileViewProps) {
  const [profileTab, setProfileTab] = useState<'highlights' | 'notes' | 'bookmarks' | 'friends'>('highlights');
  
  // Interactive mock friends list
  const [friends, setFriends] = useState<Friend[]>([
    { id: 'f-1', name: 'Benjamin Carter', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80', streak: 12 },
    { id: 'f-2', name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80', streak: 4 },
    { id: 'f-3', name: 'David Vance', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80', streak: 24 }
  ]);
  const [newFriendName, setNewFriendName] = useState('');
  const [addSuccess, setAddSuccess] = useState(false);

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFriendName.trim()) return;
    
    const newFriend: Friend = {
      id: `f-${Date.now()}`,
      name: newFriendName,
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&q=80', // generic placeholder
      streak: 1
    };

    setFriends([...friends, newFriend]);
    setNewFriendName('');
    setAddSuccess(true);
    setTimeout(() => {
      setAddSuccess(false);
    }, 1500);
  };

  // Mock calendar activity heat map days
  const calendarDays = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    active: i === 12 || i === 13 || i === 14 || i === 15 || i === 16 || i === 23 || i === 24 || i === 29
  }));

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-8" id="profile-view-workspace">
      
      {/* 1. TOP HERO LEVEL SUMMARY CARD */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col md:flex-row gap-6 justify-between items-center" id="profile-summary-header-card">
        <div className="flex flex-col md:flex-row gap-5 items-center">
          <div className="w-20 h-20 bg-slate-900 text-blue-50 rounded-3xl flex items-center justify-center font-serif font-bold text-3xl shadow-xs relative border border-slate-800">
            BF
            <div className="absolute -bottom-1.5 -right-1.5 bg-blue-700 border-2 border-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white">
              ★
            </div>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-2xl font-serif font-bold text-slate-900 leading-tight">Bible Friend</h3>
            <p className="text-slate-400 text-xs">Member since June 2026</p>
            <div className="flex items-center gap-1.5 mt-2 justify-center md:justify-start">
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 border border-emerald-100 rounded-full uppercase">Verified Scholar</span>
              <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 border border-blue-105 rounded-full uppercase font-sans">Guided prayer star</span>
            </div>
          </div>
        </div>

        {/* Dynamic Streak box */}
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm w-full md:w-auto md:shrink-0 justify-center">
          <div className="p-3 bg-white rounded-xl shadow-xs">
            <Flame className="w-8 h-8 text-rose-500 fill-current animate-pulse" />
          </div>
          <div>
            <span className="block text-2xl font-black text-rose-700 leading-none">{streak} Days</span>
            <span className="text-rose-500 text-[10px] font-bold uppercase tracking-wider">Active Reading Streak</span>
          </div>
        </div>
      </div>

      {/* 2. ACTIVITY HEAT MAP STATISTICS GRID */}
      <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 shadow-xs" id="activity-metrics-card">
        <h4 className="font-serif font-black text-slate-900 mb-4 flex items-center gap-1.5">
          <Calendar className="w-5 h-5 text-blue-700" />
          <span>Spiritual Habit Heatmap (Last 30 Days)</span>
        </h4>
        <div className="grid grid-cols-10 gap-2 mb-4">
          {calendarDays.map(d => (
            <div
              key={d.day}
              className={`aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold ${
                d.active 
                  ? 'bg-blue-700 text-white shadow-xs' 
                  : 'bg-white text-slate-450 border border-slate-200'
              }`}
              title={`Day ${d.day} status: ${d.active ? 'Sufficient activity logged' : 'No logs recorded'}`}
            >
              {d.day}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-400 text-right leading-none uppercase tracking-wide">
          <span className="inline-block w-2.5 h-2.5 bg-blue-700 rounded-xs mr-1 align-middle" />
          Scripture or guided prayers completed
        </p>
      </div>

      {/* 3. PROFILE DETAILS TAB CONTENT CONTROL */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-xs" id="profile-library-tabs-card">
        {/* Nav tabs bar */}
        <div className="flex border-b border-slate-100 p-2 overflow-x-auto gap-2">
          {[
            { id: 'highlights', label: 'Highlights', count: highlights.length },
            { id: 'notes', label: 'Notes', count: notes.length },
            { id: 'bookmarks', label: 'Bookmarks', count: bookmarks.length },
            { id: 'friends', label: 'Friends', count: friends.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setProfileTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-2xl whitespace-nowrap transition-all ${
                profileTab === tab.id 
                  ? 'bg-blue-700 text-white shadow-xs' 
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
              id={`profile-tab-${tab.id}`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* View box */}
        <div className="p-6 min-h-[300px]" id="profile-tab-viewport">
          <AnimatePresence mode="wait">
            {/* TAB 1: HIGHLIGHTED VERSES LIST */}
            {profileTab === 'highlights' && (
              <motion.div
                key="highlights-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                {highlights.length > 0 ? (
                  <div className="grid gap-4">
                    {highlights.map(h => (
                      <div
                        key={h.id}
                        className="p-4 rounded-2xl border border-slate-200 flex items-start gap-4 hover:border-blue-200 shadow-xs transition-colors relative group"
                      >
                        <div className="w-1.5 h-12 rounded-full shrink-0" style={{ backgroundColor: h.color }} />
                        <div className="flex-1">
                          <span className="font-serif font-bold text-sm text-slate-800">
                            {h.book} {h.chapter}:{h.verse}
                          </span>
                          <span className="text-[9px] text-slate-400 block mt-0.5">Highlighted on {h.createdAt}</span>
                          
                          <button
                            onClick={() => onJumpToVerse(h.book, h.chapter, h.verse)}
                            className="text-xs text-blue-750 hover:underline flex items-center gap-0.5 mt-2 font-sans"
                          >
                            <span>Open in reader</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveHighlight(h.book, h.chapter, h.verse)}
                          className="p-1 px-2 text-xs bg-stone-100 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-lg shrink-0 transition-colors opacity-0 group-hover:opacity-100 absolute right-4 top-4"
                          title="Delete highlight"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-stone-400">
                    <Highlighter className="w-10 h-10 mx-auto text-stone-300 mb-3" />
                    <p className="text-sm font-serif">No highlights saved yet.</p>
                    <p className="text-xs text-stone-400 mt-1">Tap verses in the reader and choose a color to save them here.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 2: PERSONAL NOTES LIST */}
            {profileTab === 'notes' && (
              <motion.div
                key="notes-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                {notes.length > 0 ? (
                  <div className="grid gap-4">
                    {notes.map(n => (
                      <div
                        key={n.id}
                        className="p-5 rounded-2xl bg-slate-50 border border-slate-200 relative group hover:border-blue-200/60 shadow-xs transition-all"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-serif font-bold text-slate-900">
                            {n.book} {n.chapter}:{n.verse}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium font-sans font-medium">| {n.createdAt}</span>
                        </div>
                        <p className="text-slate-750 font-serif leading-relaxed text-sm italic whitespace-pre-line bg-white/70 p-3 rounded-xl border border-slate-150">
                          "{n.text}"
                        </p>

                        <div className="flex items-center gap-3 mt-4">
                          <button
                            onClick={() => onJumpToVerse(n.book, n.chapter, n.verse)}
                            className="text-xs text-blue-750 hover:underline flex items-center gap-0.5 font-sans"
                          >
                            <span>Open Context</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemoveNote(n.id)}
                          className="p-1 px-2 text-xs bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all absolute right-4 top-4 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-400">
                    <MessageSquare className="w-10 h-10 mx-auto text-slate-300 mb-3" />
                    <p className="text-sm font-serif">Your devotional notebook is empty.</p>
                    <p className="text-xs text-slate-400 mt-1">Tap verses and select "Note" to write your spiritual reflection.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 3: BOOKMARKS COLLECTION */}
            {profileTab === 'bookmarks' && (
              <motion.div
                key="bookmarks-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                {bookmarks.length > 0 ? (
                  <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
                    {bookmarks.map(b => (
                      <div
                        key={b.id}
                        className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-blue-200 transition-colors flex justify-between items-center group relative shadow-xs"
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-4 h-4 text-blue-700 shrink-0" />
                          <div>
                            <span className="font-serif font-black text-sm text-slate-950 block">
                              {b.book} {b.chapter}:{b.verse}
                            </span>
                            <span className="text-[9px] text-slate-400">Saved on {b.createdAt}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onJumpToVerse(b.book, b.chapter, b.verse)}
                            className="p-2 border rounded-xl hover:bg-stone-50 block"
                          >
                            <ArrowRight className="w-4 h-4 text-stone-500" />
                          </button>
                          
                          <button
                            onClick={() => onRemoveBookmark(b.book, b.chapter, b.verse)}
                            className="p-1 px-2 text-xs bg-stone-100 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded-lg absolute right-4 top-4 opacity-0 group-hover:opacity-100"
                            title="Delete bookmark"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-stone-400">
                    <BookMarked className="w-10 h-10 mx-auto text-stone-300 mb-3" />
                    <p className="text-sm font-serif">No bookmarks saved.</p>
                    <p className="text-xs text-stone-400 mt-1">Bookmark key verses in the reader to quickly access them later.</p>
                  </div>
                )}
              </motion.div>
            )}

            {/* TAB 4: MOCK FRIENDS SEARCH AND MANAGEMENT */}
            {profileTab === 'friends' && (
              <motion.div
                key="friends-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-6"
              >
                {/* Form to add friend */}
                <form onSubmit={handleAddFriend} className="flex gap-2 relative">
                  <input
                    type="text"
                    value={newFriendName}
                    onChange={(e) => setNewFriendName(e.target.value)}
                    placeholder="Enter friend's full name to add..."
                    className="flex-1 bg-slate-50 text-slate-800 rounded-xl p-2.5 px-4 text-sm font-sans outline-none border border-slate-200 focus:bg-[#FAF9F6] focus:ring-2 focus:ring-blue-105 transition-all"
                    id="add-friend-name-input"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all hover:bg-slate-800 shrink-0 flex items-center gap-1 shadow-xs"
                    id="add-friend-submit-btn"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Invite</span>
                  </button>

                  {addSuccess && (
                    <span className="absolute -bottom-5 left-2 text-[10px] text-emerald-600 font-semibold animate-fade-in">
                      Friend added successfully!
                    </span>
                  )}
                </form>

                <div className="divide-y divide-stone-100" id="friends-avatar-list">
                  {friends.map(f => (
                    <div key={f.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={f.avatar}
                          alt={f.name}
                          className="w-10 h-10 rounded-full object-cover border"
                        />
                        <div>
                          <h4 className="text-sm font-semibold text-stone-900">{f.name}</h4>
                          <span className="text-[10px] text-stone-400">Friend since June 2026</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-full">
                        <Flame className="w-4 h-4 fill-current" />
                        <span>{f.streak} Days</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

    </div>
  );
}
