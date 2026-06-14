import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Calendar, CheckCircle2, ChevronRight, Bookmark, ArrowLeft, Play, Award } from 'lucide-react';
import { ReadingPlan, Highlight, Note } from '../types';
import { MOCK_PLANS, getChapterText } from '../data/bibleData';

interface PlansViewProps {
  onUpdateStreak: () => void;
  onJumpToVerse: (book: string, chapter: number, verse: number) => void;
  highlights: Highlight[];
  notes: Note[];
  onAddHighlight: (book: string, chapter: number, verse: number, color: string) => void;
}

export default function PlansView({ onUpdateStreak, onJumpToVerse, highlights, notes, onAddHighlight }: PlansViewProps) {
  const [plans, setPlans] = useState<ReadingPlan[]>(MOCK_PLANS);
  const [activeTab, setActiveTab] = useState<'My Plans' | 'Discover'>('My Plans');
  const [selectedPlan, setSelectedPlan] = useState<ReadingPlan | null>(null);
  const [activeReadingDay, setActiveReadingDay] = useState<{ planId: string; dayIndex: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Discover plans filter
  const categories = ['All', 'Mental Health', 'Spiritual Growth', 'Relationships'];
  const filteredPlans = selectedCategory === 'All' 
    ? plans 
    : plans.filter(p => p.category === selectedCategory);

  const handleCompleteDay = (planId: string, day: number) => {
    setPlans(prev => prev.map(p => {
      if (p.id === planId) {
        const completed = [...p.completedDays];
        if (!completed.includes(day)) {
          completed.push(day);
          // If this is a new day complete, trigger streak update!
          onUpdateStreak();
        }
        return { ...p, completedDays: completed };
      }
      return p;
    }));

    // Trigger success notification or close day reader
    setActiveReadingDay(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6" id="plans-view-container">
      {/* Tab Selectors */}
      <div className="flex items-center gap-6 border-b border-slate-200 mb-8 pb-1">
        <button
          onClick={() => { setActiveTab('My Plans'); setSelectedPlan(null); }}
          className={`pb-3 font-serif text-lg font-semibold border-b-2 transition-all ${
            activeTab === 'My Plans' ? 'border-blue-700 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          id="plans-tab-myplans"
        >
          My Plans
        </button>
        <button
          onClick={() => { setActiveTab('Discover'); setSelectedPlan(null); }}
          className={`pb-3 font-serif text-lg font-semibold border-b-2 transition-all ${
            activeTab === 'Discover' ? 'border-blue-700 text-slate-900' : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
          id="plans-tab-discover"
        >
          Discover Plans
        </button>
      </div>

      <AnimatePresence mode="wait">
        {/* VIEW 1: DAY DEVOTIONAL & SCRIPTURE READER */}
        {activeReadingDay && (
          <motion.div
            key="day-reader"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-[#FAF9F6] min-h-[500px] rounded-3xl border border-slate-200 p-6 md:p-8 relative shadow-sm"
            id="day-reader-interface"
          >
            {(() => {
              const plan = plans.find(p => p.id === activeReadingDay.planId)!;
              const reading = plan.readings.find(r => r.day === activeReadingDay.dayIndex)!;

              return (
                <div>
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-200">
                    <button
                      onClick={() => setActiveReadingDay(null)}
                      className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium"
                      id="day-reader-back-btn"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Plan</span>
                    </button>
                    <span className="text-xs font-semibold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-105 px-3 py-1 rounded-full">
                      Day {reading.day} of {plan.durationDays}
                    </span>
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">{reading.title}</h3>
                  <p className="text-slate-500 text-sm mb-6 flex items-center gap-1.5 font-sans">
                    <Calendar className="w-4 h-4 text-blue-700" />
                    <span>Focus Scriptures: {reading.scriptures.map(s => s.reference).join(', ')}</span>
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Devotional Text Left */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 h-[380px] overflow-y-auto shadow-sm">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Daily Devotional Reflection</h4>
                      <p className="text-slate-800 font-serif leading-relaxed text-base whitespace-pre-line">
                        {reading.devotionalText}
                      </p>
                    </div>

                    {/* Integrated Scripture Reader Right */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-200 h-[380px] overflow-y-auto shadow-sm">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Scripture Passage</h4>
                      {reading.scriptures.map((scriptReference) => {
                        const chapterObj = getChapterText(scriptReference.book, scriptReference.chapter, 'NIV');
                        // Filter verses to only show the plan scripture range
                        const visibleVerses = chapterObj.verses.filter(v => 
                          v.number >= scriptReference.startVerse && v.number <= scriptReference.endVerse
                        );

                        return (
                          <div key={scriptReference.reference} className="mb-6">
                            <h5 className="font-serif font-bold text-blue-800 text-sm mb-3 border-b border-slate-100 pb-1 flex items-center justify-between">
                              <span>{scriptReference.reference}</span>
                              <button 
                                onClick={() => onJumpToVerse(scriptReference.book, scriptReference.chapter, scriptReference.startVerse)}
                                className="text-[10px] text-blue-700 hover:underline flex items-center gap-0.5"
                              >
                                <span>Open Full</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </h5>
                            <div className="space-y-3">
                              {visibleVerses.map(verse => {
                                const verseKey = `${scriptReference.book}_${scriptReference.chapter}_${verse.number}`;
                                const isHighlighted = highlights.some(h => `${h.book}_${h.chapter}_${h.verse}` === verseKey);
                                const vHighlight = highlights.find(h => `${h.book}_${h.chapter}_${h.verse}` === verseKey);

                                return (
                                  <div 
                                    key={verse.number}
                                    onClick={() => onAddHighlight(scriptReference.book, scriptReference.chapter, verse.number, '#FFF9A6')}
                                    className={`p-2.5 rounded-xl cursor-pointer hover:bg-stone-50 transition-colors ${
                                      isHighlighted ? '' : ''
                                    }`}
                                    style={vHighlight ? { backgroundColor: vHighlight.color + '40' } : undefined}
                                  >
                                    <p className="text-stone-800 font-serif text-sm leading-relaxed">
                                      <sup className="text-[10px] font-bold text-stone-400 mr-1.5">{verse.number}</sup>
                                      {verse.text}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex justify-end border-t border-slate-200 pt-6">
                    <button
                      onClick={() => handleCompleteDay(plan.id, reading.day)}
                      className="flex items-center gap-2 px-8 py-3.5 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl font-semibold text-sm shadow-xs transition-all uppercase tracking-wider"
                      id={`day-reader-complete-btn-${reading.day}`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Complete Day {reading.day} Reading</span>
                    </button>
                  </div>
                </div>
              );
            })()}
          </motion.div>
        )}

        {/* VIEW 2: SINGLE PLAN OVERVIEW */}
        {selectedPlan && !activeReadingDay && (
          <motion.div
            key="plan-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-xs"
            id="plan-detail-card"
          >
            <button
              onClick={() => setSelectedPlan(null)}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium mb-6"
              id="plan-detail-back-btn"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Plans</span>
            </button>

            <div className="flex flex-col md:flex-row gap-6 md:items-start mb-8">
              <img
                src={selectedPlan.image}
                alt={selectedPlan.title}
                className="w-full md:w-48 h-36 rounded-2xl object-cover shadow-xs"
              />
              <div className="flex-1">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-700">
                  {selectedPlan.category}
                </span>
                <h3 className="text-2xl font-serif font-bold text-slate-950 mt-1 mb-2">{selectedPlan.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{selectedPlan.description}</p>
                
                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                  <span className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {selectedPlan.durationDays} Days Duration
                  </span>
                  <span className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
                    {selectedPlan.completedDays.length} / {selectedPlan.durationDays} Days Complete
                  </span>
                </div>
              </div>
            </div>

            <h4 className="font-serif font-semibold text-lg text-slate-900 border-b border-slate-100 pb-3 mb-4">Reading Schedule</h4>
            
            <div className="space-y-3">
              {selectedPlan.readings.map((reading) => {
                const isCompleted = selectedPlan.completedDays.includes(reading.day);

                return (
                  <div
                    key={reading.day}
                    className={`p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all ${
                      isCompleted 
                        ? 'bg-slate-50 border-slate-150 opacity-75' 
                        : 'bg-white border-slate-200 hover:border-blue-300 shadow-xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-bold text-blue-800">Day {reading.day}</span>
                        {isCompleted && (
                          <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Completed</span>
                          </span>
                        )}
                      </div>
                      <h5 className="font-semibold text-slate-900 text-sm md:text-base font-sans">{reading.title}</h5>
                      <p className="text-slate-400 text-xs mt-1">
                        {reading.scriptures.map(s => s.reference).join(', ')}
                      </p>
                    </div>

                    <button
                      onClick={() => setActiveReadingDay({ planId: selectedPlan.id, dayIndex: reading.day })}
                      className={`flex items-center justify-center p-3 rounded-xl transition-all ${
                        isCompleted
                          ? 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                          : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
                      }`}
                      id={`start-day-${reading.day}`}
                    >
                      <Play className="w-4 h-4 fill-current" />
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* VIEW 3: DISCOVER PLANS TAB */}
        {activeTab === 'Discover' && !selectedPlan && !activeReadingDay && (
          <motion.div
            key="discover-plans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-8"
          >
            {/* Category tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                      ? 'bg-stone-900 text-white shadow-sm' 
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                  id={`discover-category-${cat.replace(/\s+/g, '-').toLowerCase()}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
              {filteredPlans.map(plan => {
                const completedProgress = plan.completedDays.length / plan.durationDays;

                return (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan)}
                    className="p-5 bg-white border border-stone-200 rounded-3xl hover:border-amber-200 shadow-sm cursor-pointer transition-all flex flex-col gap-4 group"
                  >
                    <div className="relative">
                      <img
                        src={plan.image}
                        alt={plan.title}
                        className="w-full h-36 rounded-2xl object-cover"
                      />
                      <span className="absolute left-3 top-3 bg-stone-900/60 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {plan.category}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-slate-950 text-lg group-hover:text-blue-800 transition-colors leading-snug mb-1">
                        {plan.title}
                      </h4>
                      <p className="text-slate-500 text-xs line-clamp-1 mb-3">{plan.description}</p>
                      
                      <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                        <span className="text-xs text-slate-400 font-medium">{plan.durationDays} Days</span>
                        <span className="text-xs text-blue-750 font-semibold group-hover:underline flex items-center gap-0.5">
                          <span>View Plan</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* VIEW 4: MY CURRENT PLANS LIST */}
        {activeTab === 'My Plans' && !selectedPlan && !activeReadingDay && (
          <motion.div
            key="my-current-plans"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6 pb-12"
          >
            {plans.map(plan => {
              const numCompleted = plan.completedDays.length;
              const percentComplete = Math.round((numCompleted / plan.durationDays) * 100);

              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan)}
                  className="p-5 bg-white border border-slate-200 rounded-3xl hover:border-blue-300 shadow-xs transition-all cursor-pointer flex flex-col md:flex-row gap-5"
                >
                  <img
                    src={plan.image}
                    alt={plan.title}
                    className="w-full md:w-32 h-24 rounded-2xl object-cover self-center"
                  />

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
                          {plan.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">
                          {numCompleted} of {plan.durationDays} Days
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-slate-950 text-base md:text-lg hover:text-blue-800 transition-colors">
                        {plan.title}
                      </h4>
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      {/* Custom progress loading bar */}
                      <div className="flex-1">
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-700 rounded-full transition-all duration-500"
                            style={{ width: `${percentComplete}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-slate-600 shrink-0">
                        {percentComplete}% Completed
                      </span>
                    </div>
                  </div>

                  <div className="self-center flex items-center justify-center p-2 rounded-full border border-slate-100 text-blue-700 group hover:bg-slate-50 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </div>
              );
            })}

            {plans.every(p => p.completedDays.length === p.durationDays) && (
              <div className="text-center py-16 bg-[#FAF9F6] rounded-3xl border border-dashed border-slate-300">
                <Award className="w-12 h-12 text-blue-700 mx-auto mb-4" />
                <h4 className="text-lg font-serif font-semibold text-slate-800">Incredible Commitment!</h4>
                <p className="text-slate-500 text-sm mt-1">You have successfully completed all your active reading plans.</p>
                <button
                  onClick={() => setActiveTab('Discover')}
                  className="mt-6 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold transition-all hover:bg-slate-800"
                >
                  Find a New Plan
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
