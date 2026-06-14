import { Translation, Chapter, ReadingPlan, CommunityAction, DailyPrayerStep } from '../types';

export const TRANSLATIONS: Translation[] = [
  { id: 'NIV', name: 'NIV', fullName: 'New International Version', language: 'en' },
  { id: 'ESV', name: 'ESV', fullName: 'English Standard Version', language: 'en' },
  { id: 'KJV', name: 'KJV', fullName: 'King James Version', language: 'en' },
  { id: 'NLT', name: 'NLT', fullName: 'New Living Translation', language: 'en' },
  { id: 'AMP', name: 'AMP', fullName: 'Amplified Bible', language: 'en' },
];

export const BOOKS_METADATA = [
  { name: 'Genesis', chapters: 50, test: 'OT', category: 'Law' },
  { name: 'Exodus', chapters: 40, test: 'OT', category: 'Law' },
  { name: 'Leviticus', chapters: 27, test: 'OT', category: 'Law' },
  { name: 'Numbers', chapters: 36, test: 'OT', category: 'Law' },
  { name: 'Deuteronomy', chapters: 34, test: 'OT', category: 'Law' },
  { name: 'Joshua', chapters: 24, test: 'OT', category: 'History' },
  { name: 'Judges', chapters: 21, test: 'OT', category: 'History' },
  { name: 'Ruth', chapters: 4, test: 'OT', category: 'History' },
  { name: '1 Samuel', chapters: 31, test: 'OT', category: 'History' },
  { name: '2 Samuel', chapters: 24, test: 'OT', category: 'History' },
  { name: '1 Kings', chapters: 22, test: 'OT', category: 'History' },
  { name: '2 Kings', chapters: 25, test: 'OT', category: 'History' },
  { name: '1 Chronicles', chapters: 29, test: 'OT', category: 'History' },
  { name: '2 Chronicles', chapters: 36, test: 'OT', category: 'History' },
  { name: 'Ezra', chapters: 10, test: 'OT', category: 'History' },
  { name: 'Nehemiah', chapters: 13, test: 'OT', category: 'History' },
  { name: 'Esther', chapters: 10, test: 'OT', category: 'History' },
  { name: 'Job', chapters: 42, test: 'OT', category: 'Poetry' },
  { name: 'Psalms', chapters: 150, test: 'OT', category: 'Poetry' },
  { name: 'Proverbs', chapters: 31, test: 'OT', category: 'Poetry' },
  { name: 'Ecclesiastes', chapters: 12, test: 'OT', category: 'Poetry' },
  { name: 'Song of Solomon', chapters: 8, test: 'OT', category: 'Poetry' },
  { name: 'Isaiah', chapters: 66, test: 'OT', category: 'Prophets' },
  { name: 'Jeremiah', chapters: 52, test: 'OT', category: 'Prophets' },
  { name: 'Lamentations', chapters: 5, test: 'OT', category: 'Prophets' },
  { name: 'Ezekiel', chapters: 48, test: 'OT', category: 'Prophets' },
  { name: 'Daniel', chapters: 12, test: 'OT', category: 'Prophets' },
  { name: 'Hosea', chapters: 14, test: 'OT', category: 'Prophets' },
  { name: 'Joel', chapters: 3, test: 'OT', category: 'Prophets' },
  { name: 'Amos', chapters: 9, test: 'OT', category: 'Prophets' },
  { name: 'Obadiah', chapters: 1, test: 'OT', category: 'Prophets' },
  { name: 'Jonah', chapters: 4, test: 'OT', category: 'Prophets' },
  { name: 'Micah', chapters: 7, test: 'OT', category: 'Prophets' },
  { name: 'Nahum', chapters: 3, test: 'OT', category: 'Prophets' },
  { name: 'Habakkuk', chapters: 3, test: 'OT', category: 'Prophets' },
  { name: 'Zephaniah', chapters: 3, test: 'OT', category: 'Prophets' },
  { name: 'Haggai', chapters: 2, test: 'OT', category: 'Prophets' },
  { name: 'Zechariah', chapters: 14, test: 'OT', category: 'Prophets' },
  { name: 'Malachi', chapters: 4, test: 'OT', category: 'Prophets' },
  { name: 'Matthew', chapters: 28, test: 'NT', category: 'Gospels' },
  { name: 'Mark', chapters: 16, test: 'NT', category: 'Gospels' },
  { name: 'Luke', chapters: 24, test: 'NT', category: 'Gospels' },
  { name: 'John', chapters: 21, test: 'NT', category: 'Gospels' },
  { name: 'Acts', chapters: 28, test: 'NT', category: 'History' },
  { name: 'Romans', chapters: 16, test: 'NT', category: 'Epistles' },
  { name: '1 Corinthians', chapters: 16, test: 'NT', category: 'Epistles' },
  { name: '2 Corinthians', chapters: 13, test: 'NT', category: 'Epistles' },
  { name: 'Galatians', chapters: 6, test: 'NT', category: 'Epistles' },
  { name: 'Ephesians', chapters: 6, test: 'NT', category: 'Epistles' },
  { name: 'Philippians', chapters: 4, test: 'NT', category: 'Epistles' },
  { name: 'Colossians', chapters: 4, test: 'NT', category: 'Epistles' },
  { name: '1 Thessalonians', chapters: 5, test: 'NT', category: 'Epistles' },
  { name: '2 Thessalonians', chapters: 3, test: 'NT', category: 'Epistles' },
  { name: '1 Timothy', chapters: 6, test: 'NT', category: 'Epistles' },
  { name: '2 Timothy', chapters: 4, test: 'NT', category: 'Epistles' },
  { name: 'Titus', chapters: 3, test: 'NT', category: 'Epistles' },
  { name: 'Philemon', chapters: 1, test: 'NT', category: 'Epistles' },
  { name: 'Hebrews', chapters: 13, test: 'NT', category: 'Epistles' },
  { name: 'James', chapters: 5, test: 'NT', category: 'Epistles' },
  { name: '1 Peter', chapters: 5, test: 'NT', category: 'Epistles' },
  { name: '2 Peter', chapters: 3, test: 'NT', category: 'Epistles' },
  { name: '1 John', chapters: 5, test: 'NT', category: 'Epistles' },
  { name: '2 John', chapters: 1, test: 'NT', category: 'Epistles' },
  { name: '3 John', chapters: 1, test: 'NT', category: 'Epistles' },
  { name: 'Jude', chapters: 1, test: 'NT', category: 'Epistles' },
  { name: 'Revelation', chapters: 22, test: 'NT', category: 'Apocalyptic' }
];

// Rich verses for multiple popular translations
export const BIBLE_TEXTS_STORE: Record<string, Record<string, { number: number, text: string, isRedLetter?: boolean }[]>> = {
  'John 3': {
    'NIV': [
      { number: 1, text: "Now there was a Pharisee, a man named Nicodemus who was a member of the Jewish ruling council." },
      { number: 2, text: "He came to Jesus at night and said, 'Rabbi, we know that you are a teacher who has come from God. For no one could perform the signs you are doing if God were not with him.'" },
      { number: 3, text: "Jesus replied, 'Very truly I tell you, no one can see the kingdom of God unless they are born again.'", isRedLetter: true },
      { number: 4, text: "'How can a man be born when he is old?' Nicodemus asked. 'Surely they cannot enter a second time into their mother’s womb to be born!'" },
      { number: 5, text: "Jesus answered, 'Very truly I tell you, no one can enter the kingdom of God unless they are born of water and the Spirit.'", isRedLetter: true },
      { number: 16, text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", isRedLetter: true },
      { number: 17, text: "For God did not send his Son into the world to condemn the world, but to save the world through him.", isRedLetter: true },
      { number: 18, text: "Whoever believes in him is not condemned, but whoever does not believe stands condemned already because they have not believed in the name of God’s one and only Son.", isRedLetter: true }
    ],
    'KJV': [
      { number: 1, text: "There was a man of the Pharisees, named Nicodemus, a ruler of the Jews:" },
      { number: 2, text: "The same came to Jesus by night, and said unto him, Rabbi, we know that thou art a teacher come from God: for no man can do these miracles that thou doest, except God be with him." },
      { number: 3, text: "Jesus answered and said unto him, Verily, verily, I say unto thee, Except a man be born again, he cannot see the kingdom of God.", isRedLetter: true },
      { number: 4, text: "Nicodemus saith unto him, How can a man be born when he is old? can he enter the second time into his mother's womb, and be born?" },
      { number: 5, text: "Jesus answered, Verily, verily, I say unto thee, Except a man be born of water and of the Spirit, he cannot enter into the kingdom of God.", isRedLetter: true },
      { number: 16, text: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", isRedLetter: true },
      { number: 17, text: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved.", isRedLetter: true },
      { number: 18, text: "He that believeth on him is not condemned: but he that believeth not is condemned already, because he hath not believed in the name of the only begotten Son of God.", isRedLetter: true }
    ],
    'ESV': [
      { number: 1, text: "Now there was a man of the Pharisees named Nicodemus, a ruler of the Jews." },
      { number: 2, text: "This man came to Jesus by night and said to him, 'Rabbi, we know that you are a teacher come from God, for no one can do these signs that you do unless God is with him.'" },
      { number: 3, text: "Jesus answered him, 'Truly, truly, I say to you, unless one is born again he cannot see the kingdom of God.'", isRedLetter: true },
      { number: 4, text: "Nicodemus said to him, 'How can a man be born when he is old? Can he enter a second time into his mother's womb and be born?'" },
      { number: 5, text: "Jesus answered, 'Truly, truly, I say to you, unless one is born of water and the Spirit, he cannot enter the kingdom of God.'", isRedLetter: true },
      { number: 16, text: "For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.", isRedLetter: true },
      { number: 17, text: "For God did not send his Son into the world to condemn the world, but in order that the world might be saved through him.", isRedLetter: true },
      { number: 18, text: "Whoever believes in him is not condemned, but whoever does not believe is condemned already, because he has not believed in the name of the only Son of God.", isRedLetter: true }
    ],
    'NLT': [
      { number: 1, text: "There was a man named Nicodemus, a Jewish religious leader who was a Pharisee." },
      { number: 2, text: "After dark one evening, he came to speak with Jesus. 'Rabbi,' he said, 'we all know that God has sent you to teach us. Your miraculous signs are proof that God is with you.'" },
      { number: 3, text: "Jesus replied, 'I tell you the truth, unless you are born again, you cannot see the Kingdom of God.'", isRedLetter: true },
      { number: 4, text: "'What do you mean?' exclaimed Nicodemus. 'How can an old man go back into his mother’s womb and be born again?'" },
      { number: 5, text: "Jesus replied, 'I assure you, no one can enter the Kingdom of God without being born of water and the Spirit.'", isRedLetter: true },
      { number: 16, text: "For this is how God loved the world: He gave his one and only Son, so that everyone who believes in him will not perish but have eternal life.", isRedLetter: true },
      { number: 17, text: "God sent his Son into the world not to judge the world, but to save the world through him.", isRedLetter: true },
      { number: 18, text: "There is no judgment against anyone who believes in him. But anyone who does not believe in him has already been judged for not believing in God’s one and only Son.", isRedLetter: true }
    ],
    'AMP': [
      { number: 1, text: "Now there was a certain man among the Pharisees named Nicodemus, a ruler (member of the Sanhedrin) among the Jews." },
      { number: 2, text: "This man came to Jesus at night and said to Him, 'Rabbi, we know [without any doubt] that You have come from God as a teacher; for no one can do these signs [these proofs, these miracles] that You do unless God is with him.'" },
      { number: 3, text: "Jesus answered him, 'I assure you and most solemnly say to you, unless a person is born again [reborn from above—spiritually transformed, renewed, sanctified], he cannot [ever] see and experience the kingdom of God.'", isRedLetter: true },
      { number: 4, text: "Nicodemus said to Him, 'How can a man be born when he is old? Can he enter his mother’s womb a second time and be born?'" },
      { number: 5, text: "Jesus answered, 'I assure you and most solemnly say to you, unless one is born of water and the Spirit he cannot [ever] enter the kingdom of God.'", isRedLetter: true },
      { number: 16, text: "For God so [greatly] loved and dearly prized the world, that He [even] gave His [one and] only begotten Son, so that whoever believes and trusts in Him [as Savior] shall not perish, but have eternal life.", isRedLetter: true },
      { number: 17, text: "For God did not send the Son into the world to judge the world [to condemn it, to pass sentence on it], but that the world might be saved through Him.", isRedLetter: true },
      { number: 18, text: "He who believes and trusts in Him [as Savior] is not judged [for him there is no condemnation]; but he who does not believe and trust in Him is judged already, because he has not believed in the name of the [one and] only begotten Son of God.", isRedLetter: true }
    ]
  },
  'Psalms 23': {
    'NIV': [
      { number: 1, text: "The Lord is my shepherd, I lack nothing." },
      { number: 2, text: "He makes me lie down in green pastures, he leads me beside quiet waters," },
      { number: 3, text: "he refreshes my soul. He guides me along the right paths for his name’s sake." },
      { number: 4, text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me." },
      { number: 5, text: "You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows." },
      { number: 6, text: "Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever." }
    ],
    'KJV': [
      { number: 1, text: "The Lord is my shepherd; I shall not want." },
      { number: 2, text: "He maketh me to lie down in green pastures: he leadeth me beside the still waters." },
      { number: 3, text: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake." },
      { number: 4, text: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me." },
      { number: 5, text: "Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over." },
      { number: 6, text: "Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the Lord for ever." }
    ],
    'ESV': [
      { number: 1, text: "The Lord is my shepherd; I shall not want." },
      { number: 2, text: "He makes me lie down in green pastures. He leads me beside still waters." },
      { number: 3, text: "He restores my soul. He leads me in paths of righteousness for his name's sake." },
      { number: 4, text: "Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me." },
      { number: 5, text: "You prepare a table before me in the presence of my enemies; you anoint my head with oil; my cup overflows." },
      { number: 6, text: "Surely goodness and mercy shall follow me all the days of my life, and I shall dwell in the house of the Lord forever." }
    ]
  },
  'Genesis 1': {
    'NIV': [
      { number: 1, text: "In the beginning God created the heavens and the earth." },
      { number: 2, text: "Now the earth was formless and empty, darkness was over the surface of the deep, and the Spirit of God was hovering over the waters." },
      { number: 3, text: "And God said, 'Let there be light,' and there was light." },
      { number: 4, text: "God saw that the light was good, and he separated the light from the darkness." },
      { number: 5, text: "God called the light 'day,' and the darkness he called 'night.' And there was evening, and there was morning—the first day." }
    ],
    'KJV': [
      { number: 1, text: "In the beginning God created the heaven and the earth." },
      { number: 2, text: "And the earth was without form, and void; and darkness was upon the face of the deep. And the Spirit of God moved upon the face of the waters." },
      { number: 3, text: "And God said, Let there be light: and there was light." },
      { number: 4, text: "And God saw the light, that it was good: and God divided the light from the darkness." },
      { number: 5, text: "And God called the light Day, and the darkness he called Night. And the evening and the morning were the first day." }
    ]
  },
  'Romans 8': {
    'NIV': [
      { number: 1, text: "Therefore, there is now no condemnation for those who are in Christ Jesus," },
      { number: 2, text: "because through Christ Jesus the law of the Spirit who gives life has set you free from the law of sin and death." },
      { number: 28, text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose." },
      { number: 31, text: "What, then, shall we say in response to these things? If God is for us, who can be against us?" },
      { number: 38, text: "For I am convinced that neither death nor life, neither angels nor demons, neither the present nor the future, nor any powers," },
      { number: 39, text: "neither height nor depth, nor anything else in all creation, will be able to separate us from the love of God that is in Christ Jesus our Lord." }
    ],
    'ESV': [
      { number: 1, text: "There is therefore now no condemnation for those who are in Christ Jesus." },
      { number: 2, text: "For the law of the Spirit of life has set you free in Christ Jesus from the law of sin and death." },
      { number: 28, text: "And we know that for those who love God all things work together for good, for those who are called according to his purpose." },
      { number: 31, text: "What then shall we say to these things? If God is for us, who can be against us?" },
      { number: 38, text: "For I am sure that neither death nor life, nor angels nor rulers, nor things present nor things to come, nor powers," },
      { number: 39, text: "nor height nor depth, nor anything else in all creation, will be able to separate us from the love of God in Christ Jesus our Lord." }
    ]
  },
  'Matthew 6': {
    'NIV': [
      { number: 9, text: "This, then, is how you should pray: 'Our Father in heaven, hallowed be your name,", isRedLetter: true },
      { number: 10, text: "your kingdom come, your will be done, on earth as it is in heaven.", isRedLetter: true },
      { number: 11, text: "Give us today our daily bread.", isRedLetter: true },
      { number: 12, text: "And forgive us our debts, as we also have forgiven our debtors.", isRedLetter: true },
      { number: 13, text: "And lead us not into temptation, but deliver us from the evil one.'", isRedLetter: true },
      { number: 33, text: "But seek first his kingdom and his righteousness, and all these things will be given to you as well.", isRedLetter: true }
    ],
    'KJV': [
      { number: 9, text: "After this manner therefore pray ye: Our Father which art in heaven, Hallowed be thy name.", isRedLetter: true },
      { number: 10, text: "Thy kingdom come. Thy will be done in earth, as it is in heaven.", isRedLetter: true },
      { number: 11, text: "Give us this day our daily bread.", isRedLetter: true },
      { number: 12, text: "And forgive us our debts, as we forgive our debtors.", isRedLetter: true },
      { number: 13, text: "And lead us not into temptation, but deliver us from evil: For thine is the kingdom, and the power, and the glory, for ever. Amen.", isRedLetter: true },
      { number: 33, text: "But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.", isRedLetter: true }
    ]
  }
};

// Generates simulated text for any chapter that we didn't explicitly store in full detail
export function getChapterText(book: string, chapterNum: number, translation: string): Chapter {
  const storeKey = `${book} ${chapterNum}`;
  if (BIBLE_TEXTS_STORE[storeKey]) {
    // If we have specific version
    const translationTexts = BIBLE_TEXTS_STORE[storeKey][translation] || BIBLE_TEXTS_STORE[storeKey]['NIV'] || BIBLE_TEXTS_STORE[storeKey]['KJV'] || [];
    if (translationTexts.length > 0) {
      return { book, chapter: chapterNum, verses: translationTexts };
    }
  }

  // Fallback Dynamic Text Engine
  // Let's create beautiful simulated scripture-like paragraphs to provide an immersive client-only UX
  const numVerses = Math.min(((chapterNum * 7) % 15) + 12, 35); // Stable number of verses based on chapter
  const verses = [];
  
  const subjects = ['The Lord', 'The righteous', 'The faithful servant', 'The spirit of truth', 'A wise counselor', 'The grace of God'];
  const verbs = ['shall guide you in', 'leads the heart into', 'dwells within the light of', 'brings hope to', 'anoints the heads of', 'upholds the paths of'];
  const objects = ['all wisdom and peace.', 'perfect righteousness.', 'everlasting strength.', 'a sanctuary in times of trouble.', 'renewed devotion and faith.', 'spiritual growth and truth.'];
  
  const additionalQuotes = [
    "Hear this instruction, and be glad; do not turn away from the understanding that is given you.",
    "For the path of the upright is like the dawning light, shining brighter and brighter until the full day.",
    "Be strong and courageous, for the promise made to your ancestors shall be fulfilled in your sight.",
    "Peace I leave with you; my peace I give to you. Not as the world gives do I give to you.",
    "Walk in the light, as He is in the light, and you shall have fellowship with one another.",
    "The grace of our Lord Jesus Christ be with your spirit, now and forevermore."
  ];

  for (let i = 1; i <= numVerses; i++) {
    const sIdx = (book.charCodeAt(0) + chapterNum + i) % subjects.length;
    const vIdx = (book.charCodeAt(1) + chapterNum * i) % verbs.length;
    const oIdx = (book.charCodeAt(2) + i * 3) % objects.length;
    const qIdx = (book.charCodeAt(Math.min(book.length - 1, 3)) + i * 7) % additionalQuotes.length;

    let text = `${subjects[sIdx]} ${verbs[vIdx]} ${objects[oIdx]}`;
    if (i % 3 === 0) {
      text += ` ${additionalQuotes[qIdx]}`;
    }

    const isRed = book === 'Matthew' || book === 'Mark' || book === 'Luke' || book === 'John';
    verses.push({
      number: i,
      text: text,
      isRedLetter: isRed && i % 2 === 0 // mock red letter
    });
  }

  return {
    book,
    chapter: chapterNum,
    verses
  };
}

export const MOCK_PLANS: ReadingPlan[] = [
  {
    id: 'plan-1',
    title: 'Anxiety Overcome: Finding God’s Peace',
    category: 'Mental Health',
    durationDays: 5,
    description: 'A 5-day journey exploring scriptures that address anxiety, fear, and worry, guiding you to rest in the perfect peace that surmounts understanding.',
    image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=600&q=80',
    completedDays: [1, 2],
    readings: [
      {
        day: 1,
        title: 'Cast Your Cares on Him',
        description: 'Understand that your worries do not escape the loving gaze of the Father.',
        scriptures: [
          { reference: 'John 14:1', book: 'John', chapter: 14, startVerse: 1, endVerse: 1 },
          { reference: 'Psalms 23:1-4', book: 'Psalms', chapter: 23, startVerse: 1, endVerse: 4 }
        ],
        devotionalText: 'When life feels overwhelming, our natural reaction is to lock our focus on the threats surrounding us. But God invites us to lift our eyes. Casting our cares onto Him is not a one-time act of resignation, but a daily deliberate step of trust in His perfect guidance and care.'
      },
      {
        day: 2,
        title: 'God’s Perfect Peace',
        description: 'The peace of Christ guards our hearts even in the middle of chaos.',
        scriptures: [
          { reference: 'John 14:27', book: 'John', chapter: 14, startVerse: 27, endVerse: 27 }
        ],
        devotionalText: 'The peace that Jesus gives is very different from what the world offers. The world defines peace as the absence of trouble. Jesus defines peace as His presence in the midst of trouble.'
      },
      {
        day: 3,
        title: 'Renewing Your Mind',
        scriptures: [
          { reference: 'Romans 12:2', book: 'Romans', chapter: 12, startVerse: 2, endVerse: 2 }
        ],
        devotionalText: 'Today, reflect on what is filling your mind. Are you ruminating on worries, or are you filling your thoughts with His promises? By focusing on His word, your thoughts transform.'
      },
      {
        day: 4,
        title: 'The Lord is My Helper',
        scriptures: [
          { reference: 'Romans 8:31', book: 'Romans', chapter: 8, startVerse: 31, endVerse: 31 }
        ],
        devotionalText: 'If God behaves as our absolute protector, who or what can realistically mount a case against our souls? Stand stable in His love.'
      },
      {
        day: 5,
        title: 'More Than Conquerors',
        scriptures: [
          { reference: 'Romans 8:37-39', book: 'Romans', chapter: 8, startVerse: 37, endVerse: 39 }
        ],
        devotionalText: 'Nothing—absolutely nothing in all of creation—is capable of separating us from the deep, everlasting love of Jesus Christ our Savior.'
      }
    ]
  },
  {
    id: 'plan-2',
    title: 'The Sermon on the Mount: Kingdom Living',
    category: 'Spiritual Growth',
    durationDays: 3,
    description: 'Study the foundational manifesto of Jesus’s ministry, covering the Beatitudes, the Lord’s Prayer, and what it truly means to live as citizens of Heaven.',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
    completedDays: [],
    readings: [
      {
        day: 1,
        title: 'The Radical Beatitudes',
        scriptures: [
          { reference: 'John 3:1-3', book: 'John', chapter: 3, startVerse: 1, endVerse: 3 }
        ],
        devotionalText: 'The Beatitudes reveal an upside-down kingdom where the poor in spirit are blessed, those who mourn are comforted, and the humble inherit the earth. It is a stunning, beautiful calling.'
      },
      {
        day: 2,
        title: 'The Lord’s Prayer',
        scriptures: [
          { reference: 'Matthew 6:9-13', book: 'Matthew', chapter: 6, startVerse: 9, endVerse: 13 }
        ],
        devotionalText: 'Jesus teaches a robust model for prayer that starts with intimate adoration of the Father, aligns with His divine plans, recognizes our reliance for daily bread, seeks deep forgiveness, and pleads for divine strength.'
      },
      {
        day: 3,
        title: 'First Principles: Seek first God',
        scriptures: [
          { reference: 'Matthew 6:33', book: 'Matthew', chapter: 6, startVerse: 33, endVerse: 33 }
        ],
        devotionalText: 'By establishing God’s righteousness as our utmost priority, all minor concerns of daily subsistence fall beautifully on secondary planes under His watchful benevolence.'
      }
    ]
  },
  {
    id: 'plan-3',
    title: 'Walking in Love & Unity',
    category: 'Relationships',
    durationDays: 3,
    description: 'Learn the high standard of love, compassion, and reconciliation modeled by Christ for our families, churches, and neighborhoods.',
    image: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80',
    completedDays: [1],
    readings: [
      {
        day: 1,
        title: 'The Law of Love',
        scriptures: [
          { reference: 'John 3:16', book: 'John', chapter: 3, startVerse: 16, endVerse: 16 }
        ],
        devotionalText: 'Incredible love is sacrificial, not sentimental. God loved so extensively that He surrendered His greatest treasure. That is the pattern of love we are invited to follow.'
      },
      {
        day: 2,
        title: 'Living Sacrifices',
        scriptures: [
          { reference: 'Romans 12:1-2', book: 'Romans', chapter: 12, startVerse: 1, endVerse: 2 }
        ],
        devotionalText: 'Living sacrifices require daily commitment to walk in forgiveness, kindness, and devotion, rather than modeling our attitudes on cultural trends.'
      },
      {
        day: 3,
        title: 'No Condemnation',
        scriptures: [
          { reference: 'Romans 8:1-2', book: 'Romans', chapter: 8, startVerse: 1, endVerse: 2 }
        ],
        devotionalText: 'Because we are offered complete forgiveness, we must extend that same unconditional grace to the people in our lives daily.'
      }
    ]
  }
];

export const MOCK_COMMUNITY_FEED: CommunityAction[] = [
  {
    id: 'act-1',
    userName: 'Benjamin Carter',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80',
    actionText: 'highlighted',
    targetName: 'Romans 8:28',
    contentQuote: 'And we know that in all things God works for the good of those who love him, who have been called according to his purpose.',
    timestamp: '2 hours ago',
    likes: 12,
    commentsCount: 3,
    hasLiked: false
  },
  {
    id: 'act-2',
    userName: 'Sarah Jenkins',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
    actionText: 'completed Day 2 of',
    targetName: 'Anxiety Overcome: Finding God’s Peace',
    timestamp: '4 hours ago',
    likes: 8,
    commentsCount: 1,
    hasLiked: true
  },
  {
    id: 'act-3',
    userName: 'David Vance',
    avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80',
    actionText: 'bookmarked',
    targetName: 'Psalms 23:4',
    contentQuote: 'Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.',
    timestamp: 'Yesterday',
    likes: 24,
    commentsCount: 7,
    hasLiked: false
  },
  {
    id: 'act-4',
    userName: 'Emily Cooper',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80',
    actionText: 'shared an encouraging note on',
    targetName: 'John 3:17',
    contentQuote: '“What a powerful reminder that our God is a Savior-God, not an angry Accuser!”',
    timestamp: '2 days ago',
    likes: 19,
    commentsCount: 2,
    hasLiked: false
  }
];

export const GUIDED_PRAYER_STEPS: DailyPrayerStep[] = [
  {
    title: 'Praise',
    prompt: 'Acknowledge the Majesty of God',
    category: 'Praise',
    guideText: 'Take a moment to praise God for who He is—Almighty, Loving, Sovereign, and Constant. Focus your mind on His character. Type an expression of gratitude or adoration below.'
  },
  {
    title: 'Repent',
    prompt: 'Seek His Grace and Forgiveness',
    category: 'Repent',
    guideText: 'Bring your weaknesses, errors, and concerns to Him. Acknowledge where you have fallen short, knowing that His mercy is completely renewed every morning. Pour out your heart silently or write it down.'
  },
  {
    title: 'Ask',
    prompt: 'Bring Your Requests and Cares to the Father',
    category: 'Ask',
    guideText: 'Present your requests for food, safety, emotional physical healing, job opportunities, or family needs. Pray also for others—your loved ones, your coworkers, and your community.'
  },
  {
    title: 'Yield',
    prompt: 'Rest and Trust in His Perfect Will',
    category: 'Yield',
    guideText: 'Let go of any desire to control outcomes. Place your future, your plans, and your anxieties into His loving hands. Rest in the knowledge that His path for you is good.'
  }
];

export const VERSE_IMAGE_THEMES = [
  { id: 'theme-emeralds', name: 'Mountain Forest', bg: 'bg-gradient-to-tr from-emerald-950 to-teal-800 text-teal-100', textShadow: 'shadow-emerald-900', font: 'font-serif' },
  { id: 'theme-sunset', name: 'Dawn Light', bg: 'bg-gradient-to-tr from-amber-600 via-rose-500 to-indigo-900 text-amber-50', textShadow: 'shadow-rose-950', font: 'font-sans' },
  { id: 'theme-abyss', name: 'Cozy Morning', bg: 'bg-amber-100 text-stone-800 border border-stone-300', textShadow: 'shadow-transparent', font: 'font-normal' },
  { id: 'theme-indigo', name: 'Stellar Night', bg: 'bg-gradient-to-tr from-blue-950 via-indigo-950 to-purple-900 text-purple-100', textShadow: 'shadow-indigo-950', font: 'font-serif' },
  { id: 'theme-nordic', name: 'Minimal Sand', bg: 'bg-zinc-50 text-zinc-900 border border-zinc-200', textShadow: 'shadow-transparent', font: 'font-serif' },
  { id: 'theme-darkmode', name: 'Deep Slate', bg: 'bg-zinc-900 text-zinc-100 border border-zinc-800', textShadow: 'shadow-black', font: 'font-mono' }
];
