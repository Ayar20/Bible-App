import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, ChevronLeft, Check, Heart, HeartHandshake, ShieldAlert, Sparkles } from 'lucide-react';
import { GUIDED_PRAYER_STEPS } from '../data/bibleData';

interface GuidedPrayerProps {
  onClose: () => void;
  onCompletePrayer: (prayerText: string) => void;
}

export default function GuidedPrayer({ onClose, onCompletePrayer }: GuidedPrayerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [reflections, setReflections] = useState<Record<number, string>>({
    0: '',
    1: '',
    2: '',
    3: ''
  });
  const [isCompleted, setIsCompleted] = useState(false);

  const stepInfo = GUIDED_PRAYER_STEPS[currentStep];

  const handleNext = () => {
    if (currentStep < GUIDED_PRAYER_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    // Merge all user prayers into one single text
    const fullTextArray = GUIDED_PRAYER_STEPS.map((step, idx) => {
      const userRef = reflections[idx].trim();
      return `[${step.title}] ${userRef || 'Passed in silent reflection.'}`;
    });
    onCompletePrayer(fullTextArray.join('\n\n'));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto" id="guided-prayer-overlay">
      <AnimatePresence mode="wait">
        {!isCompleted ? (
          <motion.div
            key="prayer-active"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-slate-200 w-full max-w-2xl rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col relative"
            id="guided-prayer-modal"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute right-5 top-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
              id="guided-prayer-btn-close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Stepper bar */}
            <div className="flex items-center gap-1.5 mb-8">
              {GUIDED_PRAYER_STEPS.map((step, idx) => (
                <div key={step.title} className="flex-1 flex flex-col gap-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx <= currentStep ? 'bg-blue-700' : 'bg-slate-100'
                    }`}
                  />
                  <span
                    className={`text-[10px] font-semibold text-center tracking-wider uppercase transition-colors duration-300 ${
                      idx === currentStep ? 'text-blue-800 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Decorative Icon */}
            <div className="flex justify-center mb-4">
              <span className="p-3 bg-blue-50 text-blue-700 rounded-2xl">
                {stepInfo.category === 'Praise' && <Sparkles className="w-6 h-6" />}
                {stepInfo.category === 'Repent' && <ShieldAlert className="w-6 h-6" />}
                {stepInfo.category === 'Ask' && <Heart className="w-6 h-6" />}
                {stepInfo.category === 'Yield' && <HeartHandshake className="w-6 h-6" />}
              </span>
            </div>

            {/* Prompt & Title */}
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 mb-1">
                {stepInfo.title}
              </h3>
              <p className="text-blue-700 text-sm font-medium">
                {stepInfo.prompt}
              </p>
            </div>

            {/* Guide body */}
            <div className="bg-slate-50 rounded-2xl p-4 md:p-5 border border-slate-200 mb-6">
              <p className="text-slate-600 text-sm leading-relaxed text-center font-sans">
                {stepInfo.guideText}
              </p>
            </div>

            {/* Reflection text-area */}
            <div className="flex-1 mb-6">
              <textarea
                className="w-full bg-[#FAF9F6] text-slate-800 placeholder-slate-400 rounded-2xl p-4 border border-slate-250 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-105 transition-all font-sans text-sm resize-none h-36"
                placeholder="Write your prayers, reflections, or thoughts here, or rest in silence..."
                value={reflections[currentStep]}
                onChange={(e) => setReflections({ ...reflections, [currentStep]: e.target.value })}
                id={`reflection-textarea-${currentStep}`}
              />
            </div>

            {/* Navigation buttons */}
            <div className="flex items-center justify-between gap-4 mt-auto">
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-210 text-sm font-medium transition-all ${
                  currentStep === 0
                    ? 'opacity-0 pointer-events-none'
                    : 'bg-white hover:bg-slate-50 text-slate-700'
                }`}
                id="guided-prayer-btn-prev"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-xs transition-all"
                id="guided-prayer-btn-next"
              >
                <span>{currentStep === GUIDED_PRAYER_STEPS.length - 1 ? 'Finish Prayer' : 'Next'}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="prayer-completed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white border border-slate-200 w-full max-w-lg rounded-3xl shadow-2xl p-8 text-center flex flex-col items-center relative"
            id="guided-prayer-complete-modal"
          >
            <div className="w-16 h-16 bg-blue-50 text-blue-650 rounded-full flex items-center justify-center mb-6 shadow-xs border border-blue-100">
              <Check className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2">Amen</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6 px-4">
              Your guided prayer session is complete. "Be anxious for nothing, but in everything by prayer and supplication, with thanksgiving, let your requests be made known to God."
            </p>

            <button
              onClick={handleFinish}
              className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-2xl font-bold tracking-wider shadow-xs transition-all text-sm uppercase"
              id="guided-prayer-btn-finish"
            >
              Continue to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
