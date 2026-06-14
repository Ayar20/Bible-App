import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, Flame, Play, Share2, CheckCircle, Heart, MessageSquare, 
  BookOpen, PlusCircle, Volume2, ArrowRight, Video, FileText, Check,
  Compass, PenTool
} from 'lucide-react';
import { CommunityAction, Highlight } from '../types';
import { MOCK_COMMUNITY_FEED } from '../data/bibleData';

interface DailyFeedProps {
  streak: number;
  onLaunchPrayerByButton: () => void;
  onReadVerseOfDay: (book: string, chapter: number, verse: number) => void;
  onPreSelectTab: (tab: 'Home' | 'Bible' | 'Plans' | 'Profile' | 'Search') => void;
  latestPrayerText: string;
  lastReadPassage?: { book: string; chapter: number };
}

export default function DailyFeed({
  streak,
  onLaunchPrayerByButton,
  onReadVerseOfDay,
  onPreSelectTab,
  latestPrayerText,
  lastReadPassage
}: DailyFeedProps) {
  const [feedActions, setFeedActions] = useState<CommunityAction[]>(MOCK_COMMUNITY_FEED);
  
  // Morning Reflection internal state
  const [reflectionResponse, setReflectionResponse] = useState('');
  const [reflectionSaved, setReflectionSaved] = useState(false);

  // Helper generator for custom editorial contemplative prompts
  const getMorningReflection = (book: string, chapter: number) => {
    const b = book || 'John';
    const c = chapter || 3;
    
    if (b.toLowerCase() === 'john') {
      return {
        theme: "Quietness & Light",
        prompt: `As you recently rested in John Chapter ${c}, contemplate what it means for Light to enter the darkness. How can you carry this quiet, non-condemning light into your difficult conversations today?`,
        focusVerse: `John ${c}:17`,
        vibe: "A meditative reflection on sacrificial grace and renewal."
      };
    } else if (b.toLowerCase() === 'romans') {
      return {
        theme: "Unconditional Freedom",
        prompt: `Having read Romans Chapter ${c}, pause to absorb Paul's theme of full redemption. In what area of your life are you still performing for acceptance, rather than resting in His completed grace?`,
        focusVerse: `Romans ${c}:1`,
        vibe: "An intellectual inquiry into law, liberty, and the Spirit."
      };
    } else if (b.toLowerCase() === 'psalms') {
      return {
        theme: "Resting the Soul",
        prompt: `Your recent time in Psalms Chapter ${c} links your spirit with timeless prayers. When you look at the challenges ahead today, can you recite: 'The Lord is my shepherd, I shall not want'?`,
        focusVerse: `Psalms ${c}:1`,
        vibe: "A peaceful sanctuary of ancient poetical confidence."
      };
    } else if (b.toLowerCase() === 'matthew') {
      return {
        theme: "Active Obedience",
        prompt: `Matthew Chapter ${c} demands a practical application of faith. What is one specific, concrete way you can seek first God's kingdom and extend mercy to a difficult neighbor today?`,
        focusVerse: `Matthew ${c}:33`,
        vibe: "A practical guide to living the counter-cultural sermon of Christ."
      };
    } else {
      return {
        theme: "An Active Calling",
        prompt: `As you journey through ${b} Chapter ${c}, consider how history and promise converge in your life. What is the single, simple step of obedience God has illuminated for you this morning?`,
        focusVerse: `${b} ${c}`,
        vibe: `A tailored meditation on your journey through ${b}.`
      };
    }
  };

  const reflectionData = getMorningReflection(lastReadPassage?.book || 'John', lastReadPassage?.chapter || 3);

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reflectionResponse.trim()) return;
    
    // Save to local storage mock notes
    const existingNotes = JSON.parse(localStorage.getItem('bible_notes') || '[]');
    const newNote = {
      id: `reflection_${Date.now()}`,
      book: lastReadPassage?.book || 'John',
      chapter: lastReadPassage?.chapter || 3,
      verse: 1, // attach to verse 1 as general chapter note
      text: `[Morning Reflection Response]: ${reflectionResponse}`,
      createdAt: 'Just now'
    };
    
    localStorage.setItem('bible_notes', JSON.stringify([...existingNotes, newNote]));
    setReflectionSaved(true);
    setTimeout(() => {
      setReflectionSaved(false);
      setReflectionResponse('');
    }, 2500);
  };
  
  // Weekly devotions checklists
  const [checklist, setChecklist] = useState([
    { id: 'item-vod', title: 'Verse of the Day Reflection', type: 'scripture', done: false, detail: 'John 3:16' },
    { id: 'item-video', title: 'Daily Guided Video Reflection', type: 'video', done: false, detail: 'The Kingdom of Heaven by Dr. Tony Evans' },
    { id: 'item-prayer', title: 'Guided Daily Prayer Practice', type: 'prayer', done: false, detail: 'Praise, Repent, Ask, Yield' },
    { id: 'item-plan', title: 'Day 1 Devotional Reading', type: 'devotional', done: false, detail: 'Anxiety Overcome' }
  ]);

  const toggleChecklistItem = (id: string) => {
    setChecklist(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, done: !item.done };
      }
      return item;
    }));
  };

  const handleLikeAction = (actId: string) => {
    setFeedActions(prev => prev.map(act => {
      if (act.id === actId) {
        return {
          ...act,
          likes: act.hasLiked ? act.likes - 1 : act.likes + 1,
          hasLiked: !act.hasLiked
        };
      }
      return act;
    }));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4 space-y-8" id="daily-feed-container">
      
      {/* 1. TOP PROFILE SUMMARIZED ROW */}
      <div className="flex items-center justify-between bg-white border border-slate-200 p-5 rounded-3xl shadow-xs" id="feed-top-profile-row">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center font-serif font-bold text-blue-700 text-lg shadow-xs">
            BF
          </div>
          <div>
            <h3 className="font-serif font-bold text-slate-900 text-lg leading-tight">Welcome, Friend</h3>
            <p className="text-slate-400 text-xs">"Your word is a lamp for my feet."</p>
          </div>
        </div>

        {/* Flame streak */}
        <div 
          onClick={() => onPreSelectTab('Profile')}
          className="flex items-center gap-2 px-4 py-2 bg-orange-50 text-orange-700 hover:bg-orange-100 cursor-pointer rounded-2xl font-bold transition-all shadow-xs border border-orange-150"
          title="See Streak details"
          id="streak-badge-summary"
        >
          <Flame className="w-5 h-5 fill-current animate-pulse text-orange-600" />
          <span className="text-sm font-sans">{streak} Day Streak</span>
        </div>
      </div>

      {/* 1.5. DETAILED EDITORIAL MORNING REFLECTION CARD */}
      <div 
        className="bg-white border-2 border-blue-50/80 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden" 
        id="morning-reflection-editorial-card"
      >
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 opacity-5 pointer-events-none">
          <Compass className="w-64 h-64 text-blue-900" />
        </div>

        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="p-1.5 bg-blue-50 text-blue-700 rounded-xl">
              <Compass className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold font-sans text-blue-700 uppercase tracking-widest">
              Morning Reflection &bull; {reflectionData.theme}
            </span>
          </div>

          <p className="text-slate-400 text-xs italic font-serif mb-4 leading-normal">
            {reflectionData.vibe} Based on your last read passage: <strong className="text-slate-700 font-sans tracking-tight">{lastReadPassage?.book || 'John'} {lastReadPassage?.chapter || 3}</strong>
          </p>

          <h3 className="font-serif italic font-black text-xl md:text-2xl text-slate-900 mb-4 leading-relaxed tracking-tight">
            "{reflectionData.prompt}"
          </h3>

          <form onSubmit={handleSaveReflection} className="mt-6 space-y-4">
            <div className="relative">
              <textarea
                value={reflectionResponse}
                onChange={(e) => setReflectionResponse(e.target.value)}
                placeholder="Type your quiet soul reflection here..."
                className="w-full bg-[#FAF9F6] border border-slate-200 focus:border-blue-700 focus:ring-2 focus:ring-blue-100 rounded-2xl p-4 text-sm font-sans min-h-24 resize-none transition-all pr-12 text-slate-800"
              />
              <button
                type="submit"
                disabled={!reflectionResponse.trim() || reflectionSaved}
                className={`absolute bottom-3 right-3 p-2.5 rounded-xl transition-all ${
                  reflectionSaved 
                    ? 'bg-emerald-600 text-white' 
                    : reflectionResponse.trim()
                      ? 'bg-blue-700 hover:bg-blue-800 text-white' 
                      : 'bg-slate-100 text-slate-400'
                }`}
                title="Save reflection to notes"
              >
                {reflectionSaved ? <Check className="w-4 h-4" /> : <PenTool className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-[10px] text-slate-400 font-sans font-medium">
                {reflectionSaved ? (
                  <span className="text-emerald-600 font-semibold flex items-center gap-1 animate-pulse">
                    <CheckCircle className="w-3.5 h-3.5" /> Saved beautifully into your devotional workspace notes!
                  </span>
                ) : (
                  <span>Saving creates a private notes entry synced to {lastReadPassage?.book || 'John'} {lastReadPassage?.chapter || 3}:1.</span>
                )}
              </p>

              <button
                type="button"
                onClick={() => onReadVerseOfDay(lastReadPassage?.book || 'John', lastReadPassage?.chapter || 3, 1)}
                className="flex items-center gap-1 text-xs text-blue-700 hover:text-blue-800 font-bold uppercase tracking-wider font-sans ml-auto"
              >
                <span>Read Reference</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8" id="dashboard-bento-grid">
        {/* UPPER LEFT: DAILY VERSE OF THE DAY CARD */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-md flex flex-col justify-between relative overflow-hidden" id="verse-of-the-day-bento-card">
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-4 text-[10px] font-bold uppercase tracking-widest bg-blue-500/20 text-blue-300 px-3 py-1 rounded-full w-fit">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verse of the Day</span>
            </div>
            <p className="font-serif italic text-lg md:text-xl leading-relaxed mb-4 text-slate-100">
              "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life."
            </p>
            <span className="block font-sans font-bold text-xs tracking-widest uppercase opacity-80 text-blue-300">— John 3:16</span>
          </div>
          
          <div className="absolute -right-4 -bottom-4 opacity-10 w-24 h-24 bg-white rounded-full"></div>

          <div className="flex gap-2 mt-6 relative z-10">
            <button
              onClick={() => onReadVerseOfDay('John', 3, 16)}
              className="px-5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center gap-1.5 uppercase tracking-wider"
              id="vod-read-btn"
            >
              <BookOpen className="w-4 h-4 text-blue-700" />
              <span>Read Scripture</span>
            </button>
            <button
              onClick={() => onPreSelectTab('Bible')} // Open Bible and select images preset
              className="p-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white transition-all shadow-xs"
              title="Create Custom Verse Image"
              id="vod-card-image-btn"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* UPPER RIGHT: DAILY PRAYER FOCUS CARD */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs flex flex-col justify-between" id="guided-prayer-bento-card">
          <div>
            <span className="text-xs font-bold text-blue-700 uppercase tracking-widest block mb-1">Interactive Devotionals</span>
            <h3 className="text-2xl font-serif font-bold text-slate-900 leading-tight mb-2">Guided Daily Prayer</h3>
            <p className="text-slate-500 text-xs leading-relaxed mb-4">
              Step-by-step intimate reflection modeled around Praise, Repentance, Supplication, and Yielding to God.
            </p>
            
            {latestPrayerText && (
              <div className="bg-blue-50 border border-blue-100 p-3 rounded-2xl text-xs text-blue-900 italic font-serif leading-relaxed line-clamp-2">
                "Your latest saved prayer: {latestPrayerText.substring(0, 100)}..."
              </div>
            )}
          </div>

          <button
            onClick={onLaunchPrayerByButton}
            className="w-full mt-4 py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-2xl shadow-xs text-sm uppercase tracking-wider transition-all"
            id="guided-prayer-launch-btn"
          >
            Start Guided Prayer
          </button>
        </div>
      </div>

      {/* MID PANEL: DAILY SPIRITUAL DISCIPLINE CHECKLIST */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-xs" id="daily-checklist-interactive-card">
        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-serif font-bold text-slate-900">Your Daily Devotional Checklist</h3>
            <p className="text-slate-400 text-xs">Check items off as you grow in commitment today.</p>
          </div>
          <span className="text-xs font-bold text-blue-750 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
            {checklist.filter(c => c.done).length} / {checklist.length} Complete
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {checklist.map(item => (
            <div
              key={item.id}
              onClick={() => toggleChecklistItem(item.id)}
              className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between gap-4 transition-all ${
                item.done 
                  ? 'bg-slate-50 border-slate-150 text-slate-400 opacity-75' 
                  : 'bg-white border-slate-200 hover:border-blue-300 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`p-2.5 rounded-xl ${item.done ? 'bg-slate-100 text-slate-400' : 'bg-blue-50 text-blue-700'}`}>
                  {item.type === 'scripture' && <BookOpen className="w-4 h-4" />}
                  {item.type === 'video' && <Video className="w-4 h-4" />}
                  {item.type === 'prayer' && <Flame className="w-4 h-4" />}
                  {item.type === 'devotional' && <FileText className="w-4 h-4" />}
                </span>
                <div>
                  <h4 className={`text-xs font-bold leading-tight ${item.done ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {item.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.detail}</p>
                </div>
              </div>

              <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                item.done 
                  ? 'bg-blue-700 border-transparent text-white' 
                  : 'border-slate-300 bg-white'
              }`}>
                {item.done && <Check className="w-3.5 h-3.5" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* LOWER PANEL: COMMUNITY ACTIVITY TIMELINE */}
      <div className="space-y-4" id="community-activity-timeline-section">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 pl-2 font-sans">Friend Activity</h3>
        
        <div className="space-y-4 pb-12">
          {feedActions.map((act) => (
            <div
              key={act.id}
              className="p-5 bg-white border border-slate-200 rounded-3xl shadow-xs transition-all flex flex-col gap-4"
              id={`community-feed-item-${act.id}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={act.avatarUrl}
                    alt={act.userName}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900 font-sans">{act.userName}</h4>
                    <p className="text-[10px] text-slate-400">{act.timestamp}</p>
                  </div>
                </div>

                <span className="text-[10px] uppercase font-semibold text-blue-750 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                  {act.actionText.includes('highlight') ? 'Highlight' : act.actionText.includes('note') ? 'Note' : 'Plans'}
                </span>
              </div>

              <div>
                <p className="text-slate-600 text-sm">
                  {act.userName} <span className="text-slate-500 italic font-serif font-normal">{act.actionText}</span> <span className="font-bold text-slate-800">{act.targetName}</span>
                </p>

                {act.contentQuote && (
                  <div className="mt-3 bg-slate-50 border-l-4 border-blue-755 rounded-r-xl p-4 italic text-slate-800 font-serif text-sm leading-relaxed whitespace-pre-line">
                    "{act.contentQuote}"
                  </div>
                )}
              </div>

              {/* Likes and Comment rows */}
              <div className="flex items-center justify-between border-t border-slate-100 pt-3 mt-1">
                <div className="flex items-center gap-4 text-xs font-sans">
                  <button
                    onClick={() => handleLikeAction(act.id)}
                    className={`flex items-center gap-1 font-semibold transition-all ${
                      act.hasLiked ? 'text-orange-600' : 'text-slate-400 hover:text-orange-600'
                    }`}
                    id={`like-btn-${act.id}`}
                  >
                    <Heart className={`w-4 h-4 ${act.hasLiked ? 'fill-current' : ''}`} />
                    <span>{act.likes}</span>
                  </button>

                  <button className="flex items-center gap-1 font-semibold text-slate-400 hover:text-slate-600 transition-all">
                    <MessageSquare className="w-4 h-4" />
                    <span>{act.commentsCount}</span>
                  </button>
                </div>

                <button 
                  onClick={() => onPreSelectTab('Bible')}
                  className="flex items-center gap-0.5 text-xs font-semibold text-blue-700 hover:underline font-sans"
                >
                  <span>Read along</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
