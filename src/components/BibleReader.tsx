import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BookOpen, ChevronDown, Type, Play, Pause, ChevronLeft, ChevronRight, 
  Volume2, VolumeX, Highlighter, BookMarked, MessageSquare, Share2, 
  Settings, Grid, Sliders, Image as ImageIcon, CheckCircle, Ban, Check,
  Clock, Download
} from 'lucide-react';
import { Translation, Chapter, Highlight, Note, Bookmark } from '../types';
import { BOOKS_METADATA, TRANSLATIONS, getChapterText, VERSE_IMAGE_THEMES } from '../data/bibleData';

interface BibleReaderProps {
  highlights: Highlight[];
  notes: Note[];
  bookmarks: Bookmark[];
  onAddHighlight: (book: string, chapter: number, verse: number, color: string) => void;
  onRemoveHighlight: (book: string, chapter: number, verse: number) => void;
  onAddNote: (book: string, chapter: number, verse: number, text: string) => void;
  onAddBookmark: (book: string, chapter: number, verse: number) => void;
  onRemoveBookmark: (book: string, chapter: number, verse: number) => void;
  selectedBook: string;
  selectedChapter: number;
  highlightedVerseIndex?: number;
  onResetVerseJump?: () => void;
  onChangeChapter: (book: string, chapter: number) => void;
}

export default function BibleReader({
  highlights,
  notes,
  bookmarks,
  onAddHighlight,
  onRemoveHighlight,
  onAddNote,
  onAddBookmark,
  onRemoveBookmark,
  selectedBook,
  selectedChapter,
  highlightedVerseIndex,
  onResetVerseJump,
  onChangeChapter
}: BibleReaderProps) {
  // Navigation
  const [selectedTranslation, setSelectedTranslation] = useState<string>('NIV');
  const [showBookSelector, setShowBookSelector] = useState(false);
  const [showChapterSelector, setShowChapterSelector] = useState(false);
  const [testamentFilter, setTestamentFilter] = useState<'ALL' | 'OT' | 'NT'>('ALL');

  // Reader Settings & Styling
  const [fontSize, setFontSize] = useState<number>(18); // px
  const [readerTheme, setReaderTheme] = useState<'clean' | 'warm' | 'dark' | 'slate'>('clean');
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans' | 'mono'>('serif');
  const [showTextSettings, setShowTextSettings] = useState(false);

  // Audio Playback Sync
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<number>(1);
  const [activeVoice, setActiveVoice] = useState<'David (British)' | 'Sarah (Natural)' | 'Rachel (Warm)'>('David (British)');
  const [currentAudioVerse, setCurrentAudioVerse] = useState<number | null>(null);
  const audioIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Verse Interaction state
  const [selectedVerses, setSelectedVerses] = useState<number[]>([]);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNoteText, setNewNoteText] = useState('');
  const [showImageCreator, setShowImageCreator] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(VERSE_IMAGE_THEMES[0]);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Photographic Background Image selection state
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>(''); // empty means use theme default gradient

  // Scroll Progress and Reading Speed states
  const [scrollProgress, setScrollProgress] = useState(0);

  // Quick Save long-press states
  const [quickSaveActiveVerse, setQuickSaveActiveVerse] = useState<number | null>(null);
  const [quickNoteText, setQuickNoteText] = useState('');
  const [quickNoteSaved, setQuickNoteSaved] = useState(false);

  const longPressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Photo backgrounds library
  const PHOTO_BACKGROUNDS = [
    { name: 'None (Gradient)', url: '' },
    { name: 'Misty Mountains', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80' },
    { name: 'Golden Coast', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80' },
    { name: 'Deep Forest Pines', url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80' },
    { name: 'Starlit Cosmos', url: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?auto=format&fit=crop&w=800&q=80' },
    { name: 'Serene Clouds', url: 'https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?auto=format&fit=crop&w=800&q=80' },
    { name: 'Minimal Sand', url: 'https://images.unsplash.com/photo-1601662539747-211c6b421110?auto=format&fit=crop&w=800&q=80' }
  ];

  // Track window scroll progress for Reading Progress Bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const totalScroll = docHeight - winHeight;
      if (totalScroll > 0) {
        setScrollProgress((scrollTop / totalScroll) * 100);
      } else {
        setScrollProgress(0);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial trigger

    return () => window.removeEventListener('scroll', handleScroll);
  }, [selectedBook, selectedChapter]);

  // Load Scripture text
  const chapterData: Chapter = getChapterText(selectedBook, selectedChapter, selectedTranslation);

  // Handle jump scroll to verse if provided
  const verseRefs = useRef<Record<number, HTMLDivElement | null>>({});

  useEffect(() => {
    if (highlightedVerseIndex && verseRefs.current[highlightedVerseIndex]) {
      setTimeout(() => {
        verseRefs.current[highlightedVerseIndex]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setSelectedVerses([highlightedVerseIndex]);
        if (onResetVerseJump) onResetVerseJump();
      }, 300);
    }
  }, [highlightedVerseIndex]);

  // Clean selection on book/chapter change
  useEffect(() => {
    setSelectedVerses([]);
    setCurrentAudioVerse(null);
    setIsAudioPlaying(false);
    if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
  }, [selectedBook, selectedChapter]);

  // Audio Playback simulation logic! Highlight verses one by one matching speech
  const startAudioPlayback = () => {
    if (isAudioPlaying) {
      setIsAudioPlaying(false);
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
      setCurrentAudioVerse(null);
    } else {
      setIsAudioPlaying(true);
      let index = 0;
      setCurrentAudioVerse(chapterData.verses[0].number);
      
      const intervalMs = (4000 / audioSpeed); // speed determines delay

      audioIntervalRef.current = setInterval(() => {
        index += 1;
        if (index < chapterData.verses.length) {
          const vNum = chapterData.verses[index].number;
          setCurrentAudioVerse(vNum);
          // scroll into view smoothly while reading
          verseRefs.current[vNum]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        } else {
          setIsAudioPlaying(false);
          setCurrentAudioVerse(null);
          if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
        }
      }, intervalMs);
    }
  };

  useEffect(() => {
    return () => {
      if (audioIntervalRef.current) clearInterval(audioIntervalRef.current);
    };
  }, []);

  const handleNextChapter = () => {
    const bMeta = BOOKS_METADATA.find(b => b.name === selectedBook);
    if (bMeta && selectedChapter < bMeta.chapters) {
      onChangeChapter(selectedBook, selectedChapter + 1);
    } else {
      // jump to next book
      const currentIdx = BOOKS_METADATA.findIndex(b => b.name === selectedBook);
      if (currentIdx !== -1 && currentIdx < BOOKS_METADATA.length - 1) {
        onChangeChapter(BOOKS_METADATA[currentIdx + 1].name, 1);
      }
    }
  };

  const handlePrevChapter = () => {
    if (selectedChapter > 1) {
      onChangeChapter(selectedBook, selectedChapter - 1);
    } else {
      // go to previous book
      const currentIdx = BOOKS_METADATA.findIndex(b => b.name === selectedBook);
      if (currentIdx > 0) {
        const prevBook = BOOKS_METADATA[currentIdx - 1];
        onChangeChapter(prevBook.name, prevBook.chapters);
      }
    }
  };

  // Toggle verse selection
  const handleVerseClick = (num: number) => {
    if (selectedVerses.includes(num)) {
      setSelectedVerses(selectedVerses.filter(v => v !== num));
    } else {
      setSelectedVerses([...selectedVerses, num].sort((a, b) => a - b));
    }
  };

  // Apply colors
  const handleApplyHighlight = (color: string) => {
    selectedVerses.forEach(vNum => {
      onAddHighlight(selectedBook, selectedChapter, vNum, color);
    });
    setSelectedVerses([]);
  };

  const handleClearHighlight = () => {
    selectedVerses.forEach(vNum => {
      onRemoveHighlight(selectedBook, selectedChapter, vNum);
    });
    setSelectedVerses([]);
  };

  const handleToggleBookmark = () => {
    selectedVerses.forEach(vNum => {
      const isBookmarked = bookmarks.some(b => b.book === selectedBook && b.chapter === selectedChapter && b.verse === vNum);
      if (isBookmarked) {
        onRemoveBookmark(selectedBook, selectedChapter, vNum);
      } else {
        onAddBookmark(selectedBook, selectedChapter, vNum);
      }
    });
    setSelectedVerses([]);
  };

  // Quick Save Event Handlers & Timing Helpers
  const handleVerseTouchStart = (verseNum: number) => {
    if (longPressTimeoutRef.current) clearTimeout(longPressTimeoutRef.current);
    longPressTimeoutRef.current = setTimeout(() => {
      triggerQuickSave(verseNum);
    }, 550); // 550ms threshold
  };

  const handleVerseTouchEnd = () => {
    if (longPressTimeoutRef.current) {
      clearTimeout(longPressTimeoutRef.current);
      longPressTimeoutRef.current = null;
    }
  };

  const triggerQuickSave = (verseNum: number) => {
    // Clear and sound haptic setup
    setQuickSaveActiveVerse(verseNum);
    setQuickNoteText('');
    setQuickNoteSaved(false);
    setSelectedVerses([verseNum]);
  };

  const handleQuickToggleBookmark = (vNum: number) => {
    const isBookmarked = bookmarks.some(b => b.book === selectedBook && b.chapter === selectedChapter && b.verse === vNum);
    if (isBookmarked) {
      onRemoveBookmark(selectedBook, selectedChapter, vNum);
    } else {
      onAddBookmark(selectedBook, selectedChapter, vNum);
    }
  };

  const handleQuickHighlight = (vNum: number, color: string) => {
    if (color === 'clear') {
      onRemoveHighlight(selectedBook, selectedChapter, vNum);
    } else {
      onAddHighlight(selectedBook, selectedChapter, vNum, color);
    }
  };

  const handleQuickSaveNote = (vNum: number) => {
    if (!quickNoteText.trim()) return;
    onAddNote(selectedBook, selectedChapter, vNum, quickNoteText);
    setQuickNoteSaved(true);
    setTimeout(() => {
      setQuickSaveActiveVerse(null);
      setSelectedVerses([]);
    }, 1200);
  };

  const handleSaveNote = () => {
    if (!newNoteText.trim()) return;
    selectedVerses.forEach(vNum => {
      onAddNote(selectedBook, selectedChapter, vNum, newNoteText);
    });
    setNewNoteText('');
    setShowNoteModal(false);
    setSelectedVerses([]);
  };

  const handleShare = () => {
    const textToShare = selectedVerses.map(vNum => {
      const vText = chapterData.verses.find(v => v.number === vNum)?.text;
      return `[${vNum}] ${vText}`;
    }).join(' ');

    const shareString = `"${textToShare}" — ${selectedBook} ${selectedChapter}:${selectedVerses.join(',')} (${selectedTranslation})`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Scripture Share',
        text: shareString,
      }).catch(console.error);
    } else {
      // Fallback copy to clipboard
      navigator.clipboard.writeText(shareString);
      alert('Scripture copied to clipboard!');
    }
    setSelectedVerses([]);
  };

  const handleExportVerseImage = () => {
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 1080;
      canvas.height = 1080;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const drawAndDownload = (imgObj?: HTMLImageElement) => {
        // 1. Draw Background
        if (imgObj) {
          // Cover layout math
          const scale = Math.max(canvas.width / imgObj.width, canvas.height / imgObj.height);
          const x = (canvas.width / 2) - (imgObj.width / 2) * scale;
          const y = (canvas.height / 2) - (imgObj.height / 2) * scale;
          ctx.drawImage(imgObj, x, y, imgObj.width * scale, imgObj.height * scale);
        } else {
          // Draw editorial theme backing color or gradient
          const gradient = ctx.createLinearGradient(0, 0, 1080, 1080);
          if (selectedTheme.id === 'theme-emeralds') {
            gradient.addColorStop(0, '#022c22');
            gradient.addColorStop(1, '#0f766e');
          } else if (selectedTheme.id === 'theme-sunset') {
            gradient.addColorStop(0, '#f97316');
            gradient.addColorStop(0.5, '#ec4899');
            gradient.addColorStop(1, '#4c1d95');
          } else if (selectedTheme.id === 'theme-indigo') {
            gradient.addColorStop(0, '#0f172a');
            gradient.addColorStop(0.5, '#1e1b4b');
            gradient.addColorStop(1, '#311042');
          } else if (selectedTheme.id === 'theme-abyss') {
            ctx.fillStyle = '#faf9f6';
            ctx.fillRect(0, 0, 1080, 1080);
            // Draw a subtle border accent
            ctx.strokeStyle = '#e2e8f0';
            ctx.lineWidth = 40;
            ctx.strokeRect(20, 20, 1040, 1040);
          } else {
            gradient.addColorStop(0, '#1c1917');
            gradient.addColorStop(1, '#0c0a09');
          }
          
          if (selectedTheme.id !== 'theme-abyss') {
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 1080, 1080);
          }
        }

        // 2. Add Dark Ambient Overlay Tint if using photo to provide sufficient typography contrast
        if (imgObj || selectedTheme.id !== 'theme-abyss') {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
          ctx.fillRect(0, 0, 1080, 1080);
        }

        // 3. Setup text context
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        const isDarkThemeTheme = selectedTheme.id === 'theme-abyss' && !selectedPhotoUrl;
        const mainTextColor = isDarkThemeTheme ? '#1e293b' : '#ffffff';
        const subtitleTextColor = isDarkThemeTheme ? '#64748b' : '#cbd5e1';

        ctx.fillStyle = mainTextColor;

        // Custom Font selectors mapped cleanly for canvas compatibility
        let canvasFont = 'Georgia, serif';
        if (selectedTheme.font === 'font-sans') {
          canvasFont = 'system-ui, -apple-system, sans-serif';
        } else if (selectedTheme.font === 'font-mono') {
          canvasFont = 'monospace';
        }

        ctx.font = `italic 38px ${canvasFont}`;

        // Word wrapping routine
        const verseText = `"${selectedVerses.map(vNum => chapterData.verses.find(v => v.number === vNum)?.text || '').join(' ')}"`;
        const words = verseText.split(' ');
        let currentLine = '';
        const lines: string[] = [];
        const maxWidth = 820;
        const lineHeight = 55;

        for (let idx = 0; idx < words.length; idx++) {
          const testStr = currentLine + words[idx] + ' ';
          const testWidth = ctx.measureText(testStr).width;
          if (testWidth > maxWidth && idx > 0) {
            lines.push(currentLine.trim());
            currentLine = words[idx] + ' ';
          } else {
            currentLine = testStr;
          }
        }
        lines.push(currentLine.trim());

        // Center rendering vertically
        const startY = 540 - ((lines.length - 1) * lineHeight) / 2;
        for (let l_idx = 0; l_idx < lines.length; l_idx++) {
          ctx.fillText(lines[l_idx], 540, startY + (l_idx * lineHeight));
        }

        // 4. Citation Block
        ctx.fillStyle = mainTextColor;
        ctx.font = `bold 28px ${selectedTheme.font === 'font-sans' ? 'sans-serif' : 'Georgia, serif'}`;
        ctx.fillText(`— ${selectedBook} ${selectedChapter}:${selectedVerses.join(', ')}`, 540, 890);

        // 5. Translation Label
        ctx.fillStyle = subtitleTextColor;
        ctx.font = `18px ${selectedTheme.font === 'font-sans' ? 'sans-serif' : 'Georgia, serif'}`;
        ctx.fillText(`${selectedTranslation} VERSION`, 540, 930);

        // 6. trigger downlaod anchor
        try {
          const downloadAnchor = document.createElement('a');
          downloadAnchor.download = `${selectedBook}_${selectedChapter}_${selectedVerses[0]}_verse_card.png`;
          downloadAnchor.href = canvas.toDataURL('image/png');
          document.body.appendChild(downloadAnchor);
          downloadAnchor.click();
          document.body.removeChild(downloadAnchor);
        } catch (e) {
          console.warn("Direct download failed due to sandbox constraints. Opening in new tab instead.", e);
          const dataUrl = canvas.toDataURL('image/png');
          window.open(dataUrl, '_blank');
        }

        setDownloadSuccess(true);
        setTimeout(() => {
          setDownloadSuccess(false);
          setShowImageCreator(false);
          setSelectedVerses([]);
          setSelectedPhotoUrl('');
        }, 1500);
      };

      if (selectedPhotoUrl) {
        const remoteImg = new Image();
        remoteImg.crossOrigin = 'anonymous'; // critical for handling Unsplash URLs without security origin errors
        remoteImg.src = selectedPhotoUrl;
        remoteImg.onload = () => drawAndDownload(remoteImg);
        remoteImg.onerror = () => {
          console.warn("Failed loading photographic backdrop. Falling back to default styling.");
          drawAndDownload();
        };
      } else {
        drawAndDownload();
      }
    } catch (error) {
      console.error("Critical Failure drawing Canvas:", error);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    }
  };

  // Filtering books for dropdown lists
  const filteredBooks = BOOKS_METADATA.filter(b => testamentaryFilter(b.test));

  function testamentaryFilter(test: string) {
    if (testamentFilter === 'ALL') return true;
    return test === testamentFilter;
  }

  // Active theme classes for scripture viewport
  const themeClasses: Record<string, { view: string, font: string, verseText: string }> = {
    clean: { view: 'bg-[#FAF9F6] text-slate-900 border-slate-200 shadow-sm', font: 'text-slate-400 font-bold', verseText: 'text-slate-800' },
    warm: { view: 'bg-orange-50/75 text-orange-950 border-orange-200 shadow-sm', font: 'text-orange-600 font-bold', verseText: 'text-orange-950' },
    dark: { view: 'bg-zinc-900 text-zinc-100 border-zinc-800', font: 'text-zinc-500 font-bold', verseText: 'text-zinc-200 bg-zinc-900' },
    slate: { view: 'bg-slate-800 text-slate-100 border-slate-750', font: 'text-slate-400 font-bold', verseText: 'text-slate-200' },
  };

  // Font Family class mapping
  const fontFamilies: Record<string, string> = {
    serif: 'font-serif tracking-normal leading-relaxed',
    sans: 'font-sans tracking-wide leading-relaxed',
    mono: 'font-mono tracking-tight leading-relaxed text-sm',
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-4" id="bible-reader-workspace">

      {/* Sticky Blue Reading Progress Bar positioned at top-16 just under our sticky header */}
      <div className="fixed top-16 left-0 right-0 h-1 bg-slate-100 z-50 pointer-events-none">
        <div 
          className="h-full bg-blue-700 transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4 mb-6">
        <div className="flex items-center gap-3">
          {/* Book Selector Launcher */}
          <div className="relative">
            <button
              onClick={() => { setShowBookSelector(!showBookSelector); setShowChapterSelector(false); }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-slate-800 hover:bg-slate-50 border border-slate-250 rounded-2xl text-base font-serif font-semibold shadow-xs transition-all"
              id="reader-selector-book"
            >
              <BookOpen className="w-4 h-4 text-blue-700" />
              <span>{selectedBook}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
            
            {/* Book Selector Dropdown overlay */}
            <AnimatePresence>
              {showBookSelector && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 mt-2 w-72 bg-white rounded-3xl shadow-xl border border-stone-150 p-4 z-40 max-h-96 overflow-y-auto"
                  id="book-selector-dropdown"
                >
                  <div className="flex items-center justify-between border-b pb-2 mb-3">
                    <span className="font-bold text-xs uppercase text-stone-400 tracking-wider">Select Book</span>
                    <div className="flex bg-stone-100 rounded-lg p-0.5 text-[10px]">
                      {(['ALL', 'OT', 'NT'] as const).map(tab => (
                        <button
                          key={tab}
                          onClick={() => setTestamentFilter(tab)}
                          className={`px-2 py-1 rounded-md font-semibold transition-colors ${
                            testamentFilter === tab ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                          }`}
                        >
                          {tab}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 h-64 overflow-y-auto pr-1">
                    {filteredBooks.map(b => (
                      <button
                        key={b.name}
                        onClick={() => {
                          onChangeChapter(b.name, 1);
                          setShowBookSelector(false);
                          setShowChapterSelector(true); // Launch chapter selection next
                        }}
                        className={`text-left text-sm px-3 py-2 rounded-xl border transition-all ${
                          selectedBook === b.name
                            ? 'bg-blue-50 text-blue-800 border-blue-200 font-bold'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-100'
                        }`}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chapter Selector Launcher */}
          <div className="relative">
            <button
              onClick={() => { setShowChapterSelector(!showChapterSelector); setShowBookSelector(false); }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-white text-slate-800 hover:bg-slate-50 border border-slate-250 rounded-2xl text-base font-serif font-semibold shadow-xs transition-all"
              id="reader-selector-chapter"
            >
              <span>Chapter {selectedChapter}</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

            {/* Chapter Selector Dropdown overlay */}
            <AnimatePresence>
              {showChapterSelector && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute left-0 mt-2 w-64 bg-white rounded-3xl shadow-xl border border-stone-150 p-4 z-40"
                  id="chapter-selector-dropdown"
                >
                  <span className="block font-bold text-xs uppercase text-stone-400 tracking-wider border-b pb-2 mb-3">
                    {selectedBook} Chapters
                  </span>
                  <div className="grid grid-cols-5 gap-2 max-h-56 overflow-y-auto pr-1">
                    {Array.from(
                      { length: BOOKS_METADATA.find(b => b.name === selectedBook)?.chapters || 1 },
                      (_, i) => i + 1
                    ).map(chapNum => (
                      <button
                        key={chapNum}
                        onClick={() => {
                          onChangeChapter(selectedBook, chapNum);
                          setShowChapterSelector(false);
                        }}
                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-semibold border transition-all ${
                          selectedChapter === chapNum
                            ? 'bg-blue-700 text-white border-transparent'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border-slate-100'
                        }`}
                      >
                        {chapNum}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Translation Tabs Selector */}
        <div className="flex items-center gap-2">
          <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200 shadow-inner">
            {TRANSLATIONS.slice(0, 4).map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTranslation(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition-all ${
                  selectedTranslation === t.id 
                    ? 'bg-blue-700 text-white shadow-xs' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
                id={`translation-tab-${t.id}`}
              >
                {t.name}
              </button>
            ))}
          </div>

          {/* Text Settings Toggle */}
          <button
            onClick={() => setShowTextSettings(!showTextSettings)}
            className={`p-2.5 rounded-2xl border transition-all ${
              showTextSettings ? 'bg-stone-900 border-transparent text-white' : 'bg-white border-stone-200 text-stone-500 hover:bg-stone-50 shadow-sm'
            }`}
            id="text-settings-toggle-btn"
          >
            <Type className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. TEXT SETTINGS & STYLING OVERLAY DRAWER */}
      <AnimatePresence>
        {showTextSettings && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-white rounded-3xl border border-stone-200 p-5 mb-6 shadow-xs flex flex-col md:flex-row items-center gap-6"
            id="text-settings-drawer"
          >
            {/* Font Family Preference */}
            <div className="flex-1 w-full">
              <span className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Font Family</span>
              <div className="flex gap-2">
                {[
                  { id: 'serif', label: 'Eb Garamond (Serif)' },
                  { id: 'sans', label: 'Inter (Sans)' },
                  { id: 'mono', label: 'Fira Mono (Mono)' }
                ].map(font => (
                  <button
                    key={font.id}
                    onClick={() => setFontFamily(font.id as any)}
                    className={`flex-1 py-2 text-xs font-medium rounded-xl border transition-all ${
                      fontFamily === font.id ? 'bg-amber-50 text-amber-800 border-amber-250 font-bold' : 'bg-stone-50 border-stone-100 hover:bg-stone-100'
                    }`}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size Selector */}
            <div className="flex-1 w-full">
              <span className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2 flex justify-between">
                <span>Font Size</span>
                <span className="font-mono text-stone-600 font-semibold">{fontSize}px</span>
              </span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setFontSize(Math.max(14, fontSize - 1))}
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                >
                  A-
                </button>
                <input
                  type="range"
                  min="14"
                  max="28"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                  className="flex-1 h-1.5 bg-stone-200 rounded-full appearance-none cursor-pointer accent-amber-600"
                />
                <button 
                  onClick={() => setFontSize(Math.min(28, fontSize + 1))}
                  className="w-8 h-8 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                >
                  A+
                </button>
              </div>
            </div>

            {/* Display Theme preference */}
            <div className="flex-1 w-full">
              <span className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">Theme color</span>
              <div className="flex gap-2">
                {[
                  { id: 'clean', bg: 'bg-stone-50', border: 'border-stone-300', text: 'text-stone-800', name: 'White' },
                  { id: 'warm', bg: 'bg-orange-50', border: 'border-amber-200', text: 'text-amber-950', name: 'Warm Sepia' },
                  { id: 'dark', bg: 'bg-zinc-900', border: 'border-zinc-800', text: 'text-zinc-100', name: 'Black' },
                  { id: 'slate', bg: 'bg-slate-800', border: 'border-slate-700', text: 'text-slate-100', name: 'Slate' }
                ].map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => setReaderTheme(theme.id as any)}
                    className={`flex-1 py-1.5 border rounded-xl flex flex-col items-center gap-1 transition-all ${
                      readerTheme === theme.id ? 'ring-2 ring-amber-600 ring-offset-2' : 'hover:scale-105'
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full border ${theme.bg} ${theme.border}`} />
                    <span className="text-[9px] font-semibold text-stone-500">{theme.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. AUDIO PLAYBACK PLAYER PANEL */}
      <div className="bg-blue-50 border border-blue-200/60 rounded-3xl p-4 md:p-5 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm text-slate-900" id="voiceover-player-panel">
        <div className="flex items-center gap-3">
          <button
            onClick={startAudioPlayback}
            className={`w-11 h-11 rounded-full flex items-center justify-center transition-all ${
              isAudioPlaying ? 'bg-blue-800 hover:bg-blue-900 text-white' : 'bg-blue-700 hover:bg-blue-800 text-white'
            }`}
            id="audio-playing-trigger-btn"
          >
            {isAudioPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current ml-0.5" />}
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-blue-850 uppercase tracking-wider">Audio Bible Playback</span>
              {isAudioPlaying && (
                 <span className="flex gap-0.5 items-end h-2 w-3">
                   <span className="bg-blue-600 animate-bounce h-full w-0.5 [animation-delay:0.1s]" />
                   <span className="bg-blue-600 animate-bounce h-2/3 w-0.5 [animation-delay:0.3s]" />
                   <span className="bg-blue-600 animate-bounce h-full w-0.5 [animation-delay:0.5s]" />
                 </span>
              )}
            </div>
            <p className="text-slate-500 text-xs">Currently narrating: {selectedBook} Chapter {selectedChapter} in {selectedTranslation}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Voice selector */}
          <div className="flex flex-col">
            <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider mb-1">Narrator voice</span>
            <select
              value={activeVoice}
              onChange={(e) => setActiveVoice(e.target.value as any)}
              className="bg-white border border-blue-200 text-xs rounded-xl px-2.5 py-1 text-slate-700 font-medium outline-none focus:border-blue-500"
            >
              <option value="David (British)">David (British male)</option>
              <option value="Sarah (Natural)">Sarah (American female)</option>
              <option value="Rachel (Warm)">Rachel (Soft female)</option>
            </select>
          </div>

          {/* Speed settings */}
          <div className="flex flex-col">
            <span className="text-[10px] text-blue-700 font-bold uppercase tracking-wider mb-1">Playback speed</span>
            <div className="flex bg-white rounded-xl border border-blue-200 p-0.5">
              {[0.75, 1.0, 1.25, 1.5].map(speed => (
                <button
                  key={speed}
                  onClick={() => setAudioSpeed(speed)}
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-bold ${
                    audioSpeed === speed ? 'bg-blue-700 text-white' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 4. MAIN SCRIPTURE VIEWPORT BOX */}
      <div 
        className={`rounded-3xl border p-6 md:p-8 relative ${themeClasses[readerTheme].view} shadow-xs min-h-[400px] transition-all`}
        id="scripture-viewport-box"
      >
        {/* Navigation jump arrows */}
        <button
          onClick={handlePrevChapter}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full hover:bg-stone-200/40 text-stone-400 hover:text-stone-700 transition"
          title="Previous Chapter"
          id="btn-nav-prev-chap"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={handleNextChapter}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full hover:bg-stone-200/40 text-stone-400 hover:text-stone-700 transition"
          title="Next Chapter"
          id="btn-nav-next-chap"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="max-w-xl mx-auto py-4">
          {/* Chapter title header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-extrabold tracking-tight mb-2 flex items-center justify-center gap-3">
              <span>{selectedBook} {selectedChapter}</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-sans font-bold bg-blue-50 text-blue-700 rounded-full border border-blue-100 self-center" title="Estimated reading completion time">
                <Clock className="w-3.5 h-3.5 animate-pulse" />
                <span>{Math.max(1, Math.round(chapterData.verses.reduce((acc, v) => acc + v.text.split(' ').length, 0) / 220))} min read</span>
              </span>
            </h2>
            <span className="text-xs uppercase font-serif tracking-widest text-stone-400 font-semibold">
              {TRANSLATIONS.find(t => t.id === selectedTranslation)?.fullName || selectedTranslation} Translation
            </span>
          </div>

          {/* Verses rendering */}
          <div className={`space-y-4 md:space-y-5 select-text ${fontFamilies[fontFamily]}`} style={{ fontSize: `${fontSize}px` }}>
            {chapterData.verses.map((v) => {
              const isSelected = selectedVerses.includes(v.number);
              const isAudioActive = currentAudioVerse === v.number;
              const verseKey = `${selectedBook}_${selectedChapter}_${v.number}`;
              const highlightRec = highlights.find(h => h.book === selectedBook && h.chapter === selectedChapter && h.verse === v.number);
              const hasNote = notes.some(n => n.book === selectedBook && n.chapter === selectedChapter && n.verse === v.number);
              const isBookmarked = bookmarks.some(b => b.book === selectedBook && b.chapter === selectedChapter && b.verse === v.number);

               return (
                <div
                  key={v.number}
                  ref={el => { verseRefs.current[v.number] = el; }}
                  onClick={() => handleVerseClick(v.number)}
                  onMouseDown={() => handleVerseTouchStart(v.number)}
                  onMouseUp={handleVerseTouchEnd}
                  onMouseLeave={handleVerseTouchEnd}
                  onTouchStart={() => handleVerseTouchStart(v.number)}
                  onTouchEnd={handleVerseTouchEnd}
                  onContextMenu={(e) => { e.preventDefault(); triggerQuickSave(v.number); }}
                  className={`p-3 rounded-xl transition-all duration-300 select-text cursor-pointer relative group-verse ${
                    isSelected ? 'ring-2 ring-blue-700 bg-blue-700/5 shadow-xs' : ''
                  } ${isAudioActive ? 'bg-blue-50 ring-1 ring-blue-200' : ''}`}
                  title="Hold for inline Quick Save or right-click"
                >
                  {/* Badge Row on bottom details */}
                  <div className="absolute right-2 top-2 flex items-center gap-1">
                    {hasNote && <span className="w-2.5 h-2.5 bg-sky-500 rounded-full shadow-xs" title="Attached Note" />}
                    {isBookmarked && <span className="w-2.5 h-2.5 bg-blue-700 rounded-full shadow-xs" title="Bookmarked" />}
                  </div>

                  <p 
                    className={`inline tracking-normal font-medium leading-relaxed md:leading-loose ${
                      v.isRedLetter ? 'text-red-600 font-bold' : themeClasses[readerTheme].verseText
                    }`}
                    style={highlightRec ? { textDecorationLine: 'underline', textDecorationColor: highlightRec.color, textDecorationStyle: 'solid', textDecorationThickness: '3px' } : undefined}
                  >
                    <sup className={`text-xs mr-2 select-none select-none select-none font-bold ${themeClasses[readerTheme].font}`}>
                      {v.number}
                    </sup>
                    {v.text}
                  </p>

                  {/* Inline Quick Save Menu Panel triggered on Right-Click or Long-Press */}
                  <AnimatePresence>
                    {quickSaveActiveVerse === v.number && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 p-4 bg-zinc-900 text-white rounded-2xl border border-zinc-800 shadow-xl space-y-3 relative z-10 cursor-default"
                        onClick={(e) => e.stopPropagation()} // stop click from de-selecting we are typing or selecting
                      >
                        <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-300">
                            Quick Save &bull; Verse {v.number}
                          </span>
                          <button
                            onClick={(e) => { 
                              e.stopPropagation(); 
                              setQuickSaveActiveVerse(null); 
                              setSelectedVerses([]); 
                            }}
                            className="text-xs text-slate-400 hover:text-white"
                          >
                            Close
                          </button>
                        </div>
                        
                        {/* Highlight color bubbles */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Color</span>
                          <div className="flex items-center gap-1.5 bg-zinc-800 p-1.5 rounded-xl border border-zinc-700/50">
                            {['#fef08a', '#bbf7d0', '#99f6e4', '#fbcfe8'].map(color => {
                              const activeColor = highlightRec?.color === color;
                              return (
                                <button
                                  key={color}
                                  onClick={(e) => { e.stopPropagation(); handleQuickHighlight(v.number, color); }}
                                  className={`w-5 h-5 rounded-full border hover:scale-110 transition-transform ${
                                    activeColor ? 'border-white scale-110 ring-1 ring-slate-300' : 'border-white/20'
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              );
                            })}
                            <button
                              onClick={(e) => { e.stopPropagation(); handleQuickHighlight(v.number, 'clear'); }}
                              className="px-1.5 py-0.5 rounded-md bg-zinc-750 text-[9px] font-bold text-slate-300 hover:text-white"
                              title="Clear color"
                            >
                              Clear
                            </button>
                          </div>
                        </div>

                        {/* Bookmark and Rapid actions */}
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Save Bookmark</span>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleQuickToggleBookmark(v.number); }}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                              isBookmarked 
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 font-bold' 
                                : 'bg-zinc-800 text-slate-300 hover:bg-zinc-750'
                            }`}
                          >
                            <BookMarked className="w-3.5 h-3.5" />
                            <span>{isBookmarked ? 'Bookmarked' : 'Add'}</span>
                          </button>
                        </div>

                        {/* Note Input inside menu */}
                        <div className="space-y-1.5 pt-1.5 border-t border-zinc-800">
                          <span className="block text-[10px] uppercase font-bold text-slate-400">Private Note</span>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={quickNoteText}
                              onChange={(e) => setQuickNoteText(e.target.value)}
                              onClick={(e) => e.stopPropagation()} // keep focus
                              placeholder={hasNote ? "Append note..." : "Add reflection note..."}
                              className="flex-1 bg-zinc-800 border border-zinc-700 text-white rounded-xl px-3 py-1.5 text-xs outline-none focus:border-blue-500"
                            />
                            <button
                              onClick={(e) => { e.stopPropagation(); handleQuickSaveNote(v.number); }}
                              disabled={quickNoteSaved || !quickNoteText.trim()}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                quickNoteSaved
                                  ? 'bg-emerald-600 text-white'
                                  : quickNoteText.trim()
                                    ? 'bg-blue-700 hover:bg-blue-800 text-white shadow-xs'
                                    : 'bg-zinc-800 text-slate-500 cursor-not-allowed'
                              }`}
                            >
                              {quickNoteSaved ? 'Saved!' : 'Save'}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* Prompt at bottom of chapter */}
          <div className="text-center border-t border-stone-200/50 mt-12 pt-6">
            <span className="text-xs text-stone-400 font-medium">End of {selectedBook} {selectedChapter}</span>
          </div>
        </div>
      </div>

      {/* 5. YOUVERSION STYLED CONTEXT ACTIONS PERSISTENT FOOTER TOOLBAR */}
      <AnimatePresence>
        {selectedVerses.length > 0 && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-lg bg-zinc-900 border border-zinc-800 text-white rounded-3xl p-4 md:p-5 shadow-2xl z-50 flex flex-col gap-4"
            id="verse-actions-toolbar"
          >
            {/* selected count & header close */}
            <div className="flex items-center justify-between border-b border-zinc-805 pb-3">
              <span className="text-xs font-semibold tracking-wider text-stone-300">
                {selectedBook} {selectedChapter}:{selectedVerses.join(', ')} Selected
              </span>
              <button 
                onClick={() => setSelectedVerses([])}
                className="text-stone-400 hover:text-white transition-colors"
              >
                <Ban className="w-4 h-4" />
              </button>
            </div>

            {/* Quick action highlights picker */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 bg-zinc-850 p-1.5 rounded-2xl border border-zinc-800/50">
                {['#fef08a', '#bbf7d0', '#99f6e4', '#fbcfe8'].map(color => (
                  <button
                    key={color}
                    onClick={() => handleApplyHighlight(color)}
                    className="w-7 h-7 rounded-full border border-white/20 hover:scale-110 active:scale-95 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
                <button
                  onClick={handleClearHighlight}
                  className="w-7 h-7 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-stone-400 hover:text-stone-100 transition-colors border border-zinc-700"
                  title="Remove Highlight"
                >
                  <Ban className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Utility action links */}
              <div className="flex gap-1">
                <button
                  onClick={() => setShowNoteModal(true)}
                  className="p-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-750 text-stone-300 hover:text-white transition-all flex flex-col items-center gap-0.5 scale-90"
                  id="toolbar-note-btn"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-[9px] font-bold">Note</span>
                </button>

                <button
                  onClick={handleToggleBookmark}
                  className="p-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-750 text-stone-300 hover:text-white transition-all flex flex-col items-center gap-0.5 scale-90"
                  id="toolbar-bookmark-btn"
                >
                  <BookMarked className="w-4 h-4" />
                  <span className="text-[9px] font-bold">Save</span>
                </button>

                <button
                  onClick={() => setShowImageCreator(true)}
                  className="p-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-750 text-stone-300 hover:text-white transition-all flex flex-col items-center gap-0.5 scale-90"
                  id="toolbar-image-card-btn"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span className="text-[9px] font-bold">Image</span>
                </button>

                <button
                  onClick={handleShare}
                  className="p-2.5 rounded-2xl bg-zinc-800 hover:bg-zinc-750 text-stone-300 hover:text-white transition-all flex flex-col items-center gap-0.5 scale-90"
                  id="toolbar-share-btn"
                >
                  <Share2 className="w-4 h-4" />
                  <span className="text-[9px] font-bold">Share</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 6. NOTE MODAL POPUP */}
      <AnimatePresence>
        {showNoteModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 border border-stone-200 shadow-2xl relative"
            >
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">Write a Devotional Note</h3>
              <p className="text-xs text-stone-400 mb-4">Attaching to {selectedBook} {selectedChapter}:{selectedVerses.join(',')}</p>
              
              <textarea
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                placeholder="Type your notes here, reflection what this verse speaks to your heart..."
                className="w-full bg-stone-50 border border-stone-200 text-stone-800 rounded-2xl p-4 text-sm font-sans h-32 outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-50 mb-6 resize-none"
              />

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowNoteModal(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-semibold shadow-sm"
                >
                  Save Note
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 7. HIGH-FIDELITY VERSE-IMAGE CARD CREATOR OVERLAY */}
      <AnimatePresence>
        {showImageCreator && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border rounded-3xl w-full max-w-2xl p-6 md:p-8 flex flex-col md:flex-row gap-8 relative shadow-2xl"
              id="verse-image-creator-modal"
            >
              {/* Close icon */}
              <button
                onClick={() => { setShowImageCreator(false); setSelectedPhotoUrl(''); }}
                className="absolute right-5 top-5 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
              >
                <Ban className="w-5 h-5" />
              </button>

              {/* CARD PREVIEW WINDOW LEFT */}
              <div className="flex-1 flex flex-col gap-4">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">Card Preview</span>
                <div
                  className={`aspect-square w-full rounded-3xl p-6 flex flex-col justify-between shadow-xl transition-all relative overflow-hidden`}
                  style={
                    selectedPhotoUrl 
                      ? { 
                          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.48), rgba(0, 0, 0, 0.48)), url(${selectedPhotoUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }
                      : undefined
                  }
                  id="generated-verse-card-view"
                >
                  {/* Fallback to simple gradient background if no photo chosen */}
                  {!selectedPhotoUrl && <div className={`absolute inset-0 z-0 ${selectedTheme.bg}`} />}

                  <div className="text-center w-full h-full flex flex-col justify-center relative z-10">
                    <p className={`font-serif align-middle text-center italic leading-relaxed text-base md:text-lg text-slate-100 ${
                      selectedTheme.font === 'font-sans' ? 'font-sans tracking-wide' : 
                      selectedTheme.font === 'font-mono' ? 'font-mono tracking-tight text-xs' : 'font-serif'
                    } ${
                      !selectedPhotoUrl && selectedTheme.id === 'theme-abyss' ? 'text-stone-800' : 'text-white'
                    }`}>
                      "{selectedVerses.map(vNum => chapterData.verses.find(v => v.number === vNum)?.text).join(' ')}"
                    </p>
                  </div>
                  <div className={`text-center w-full mt-2 relative z-10 ${
                    !selectedPhotoUrl && selectedTheme.id === 'theme-abyss' ? 'text-stone-600' : 'text-white'
                  }`}>
                    <p className="text-xs font-bold tracking-wider opacity-90 uppercase">
                      — {selectedBook} {selectedChapter}:{selectedVerses.join(',')}
                    </p>
                    <p className="text-[9px] font-semibold opacity-70 tracking-widest uppercase mt-0.5">
                      {selectedTranslation} Translation
                    </p>
                  </div>
                </div>
              </div>

              {/* CARD THEMES & SETTINGS PANEL RIGHT */}
              <div className="w-full md:w-64 flex flex-col justify-between" id="image-creator-settings-panel">
                <div>
                  <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">Create Verse Card</h3>
                  <p className="text-xs text-stone-500 mb-4">Select templates or professional backdrops to personalize your card.</p>
                  
                  {/* Photo preseters row */}
                  <span className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">1. Photo Backdrops</span>
                  <div className="grid grid-cols-4 gap-1.5 mb-4">
                    {PHOTO_BACKGROUNDS.map(photo => (
                      <button
                        key={photo.name}
                        onClick={() => setSelectedPhotoUrl(photo.url)}
                        className={`aspect-square rounded-lg border overflow-hidden relative cursor-pointer group hover:scale-105 active:scale-95 transition-all ${
                          selectedPhotoUrl === photo.url ? 'ring-2 ring-blue-700 font-bold border-transparent' : 'border-slate-200'
                        }`}
                        title={photo.name}
                      >
                        {photo.url ? (
                          <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <span className="w-full h-full bg-gradient-to-tr from-slate-200 to-indigo-150 flex items-center justify-center text-[8px] font-sans text-slate-500 leading-none">Grad</span>
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Gradient Themes Selector */}
                  <span className="block text-xs font-bold text-stone-400 uppercase tracking-widest mb-2">2. Font & Gradient Theme</span>
                  <div className="grid grid-cols-2 gap-2 mb-6 max-h-40 overflow-y-auto pr-1">
                    {VERSE_IMAGE_THEMES.map(theme => (
                      <button
                        key={theme.id}
                        onClick={() => setSelectedTheme(theme)}
                        className={`p-2 rounded-xl border flex flex-col text-left transition-all ${
                          selectedTheme.id === theme.id 
                            ? 'bg-blue-50 border-blue-500 shadow-xs ring-1 ring-blue-200' 
                            : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        <span className="text-xs font-bold text-stone-800 line-clamp-1">{theme.name}</span>
                        <span className="text-[9px] text-stone-400 capitalize mt-0.5">{theme.font.replace('font-', '')} typography</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <button
                    onClick={handleExportVerseImage}
                    disabled={downloadSuccess}
                    className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-bold rounded-2xl shadow-md transition-all text-sm uppercase flex items-center justify-center gap-2"
                  >
                    {downloadSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Saved to Device!</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 animate-bounce" />
                        <span>Download Verse Card</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => { setShowImageCreator(false); setSelectedPhotoUrl(''); }}
                    className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-2xl text-xs font-bold transition-all uppercase"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
