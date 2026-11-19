import type { Lang } from '../../../shared/types';

/** UI strings. Keep keys flat and short; questions come from the shared bank. */
export const STRINGS = {
  appName: { en: 'Mewing Academy', id: 'Mewing Academy' },
  tagline: {
    en: 'Learn with your hands. Play with AI.',
    id: 'Belajar pakai tangan. Bermain dengan AI.',
  },
  // Navigation
  navHome: { en: 'Home', id: 'Beranda' },
  navGroupPlay: { en: 'Play', id: 'Main' },
  navGroupLearn: { en: 'Learn', id: 'Belajar' },
  navGroupMe: { en: 'Me', id: 'Aku' },
  navMenu: { en: 'Menu', id: 'Menu' },
  navClose: { en: 'Close menu', id: 'Tutup menu' },
  navLessons: { en: 'Lessons', id: 'Pelajaran' },
  navQuiz: { en: 'Hand Quiz', id: 'Kuis Tangan' },
  navMemory: { en: 'Memory', id: 'Ingatan' },
  navTutor: { en: 'Ask Mewy', id: 'Tanya Mewy' },
  navProgress: { en: 'My Stars', id: 'Bintangku' },
  navHowAi: { en: 'How AI Works', id: 'Cara Kerja AI' },
  navAbout: { en: 'About', id: 'Tentang' },
  navSettings: { en: 'Settings', id: 'Pengaturan' },
  skipToContent: { en: 'Skip to content', id: 'Lewati ke konten' },

  // Home
  heroPlay: { en: 'Start Playing', id: 'Mulai Bermain' },
  heroHow: { en: 'How does it work?', id: 'Bagaimana caranya?' },
  nextStepLabel: { en: 'Mewy suggests', id: 'Saran Mewy' },
  nextStepGo: { en: 'Go', id: 'Ayo' },
  pickGame: { en: 'Pick a game', id: 'Pilih permainan' },

  // Generic
  start: { en: 'Start', id: 'Mulai' },
  next: { en: 'Next', id: 'Lanjut' },
  back: { en: 'Back', id: 'Kembali' },
  tryAgain: { en: 'Try again', id: 'Coba lagi' },
  playAgain: { en: 'Play again', id: 'Main lagi' },
  loading: { en: 'Loading...', id: 'Memuat...' },
  correct: { en: 'Correct!', id: 'Benar!' },
  notQuite: { en: 'Not quite!', id: 'Belum tepat!' },
  level: { en: 'Level', id: 'Tingkat' },
  roundSize: { en: 'How many questions?', id: 'Berapa soal?' },
  questionWord: { en: 'Question', id: 'Soal' },
  easy: { en: 'Easy', id: 'Mudah' },
  medium: { en: 'Medium', id: 'Sedang' },
  hard: { en: 'Hard', id: 'Sulit' },
  score: { en: 'Score', id: 'Skor' },
  chooseTopic: { en: 'Choose a topic', id: 'Pilih topik' },

  // Quiz / camera
  answerWithHand: { en: 'Answer with your hand', id: 'Jawab dengan tanganmu' },
  answerWithFingers: { en: '✋ Show your answer with your fingers!', id: '✋ Tunjukkan jawabanmu dengan jari!' },
  cameraNudge: {
    en: '📷 Turn on the camera for the real game! For now, tap an answer.',
    id: '📷 Nyalakan kamera untuk main yang seru! Untuk sementara, ketuk jawaban.',
  },
  preloadLoading: { en: 'Getting the camera AI ready...', id: 'Menyiapkan AI kamera...' },
  preloadDone: { en: 'Camera AI is ready!', id: 'AI kamera sudah siap!' },
  cameraStart: { en: 'Turn on camera', id: 'Nyalakan kamera' },
  cameraStop: { en: 'Turn off camera', id: 'Matikan kamera' },
  cameraLoading: { en: 'Waking up the camera AI...', id: 'Membangunkan AI kamera...' },
  cameraDenied: {
    en: 'Camera is off. You can still tap your answers below!',
    id: 'Kamera mati. Kamu tetap bisa mengetuk jawaban di bawah!',
  },
  cameraInsecure: {
    en: 'Camera needs a secure (https://) link. You can still tap your answers below!',
    id: 'Kamera butuh tautan aman (https://). Kamu tetap bisa mengetuk jawaban di bawah!',
  },
  cameraNoDevice: {
    en: 'No camera found on this device. You can still tap your answers below!',
    id: 'Kamera tidak ditemukan di perangkat ini. Kamu tetap bisa mengetuk jawaban di bawah!',
  },
  cameraBusy: {
    en: 'The camera is busy in another app. Close it and try again!',
    id: 'Kamera sedang dipakai aplikasi lain. Tutup lalu coba lagi!',
  },
  cameraError: {
    en: 'The camera AI could not start on this device. You can still tap your answers below!',
    id: 'AI kamera tidak bisa berjalan di perangkat ini. Kamu tetap bisa mengetuk jawaban di bawah!',
  },
  handOpen: {
    en: 'Whole hand = no answer',
    id: 'Satu tangan penuh = bukan jawaban',
  },
  handTooMany: { en: 'Too many fingers', id: 'Jarinya terlalu banyak' },
  fingersPickLetter: {
    en: '✋ Fingers pick the LETTER, not the number!',
    id: '✋ Jari memilih HURUF, bukan angka!',
  },
  cameraPrivacy: {
    en: 'The camera runs only on this device. No video is sent or saved.',
    id: 'Kamera hanya berjalan di perangkat ini. Video tidak dikirim atau disimpan.',
  },
  camTutorialStart: { en: 'Practice time! Show Mewy', id: 'Ayo latihan! Tunjukkan ke Mewy' },
  camTutorialNow: { en: 'Great! Now show', id: 'Hebat! Sekarang tunjukkan' },
  camTutorialFinger: { en: 'finger', id: 'jari' },
  camTutorialFingers: { en: 'fingers', id: 'jari' },
  camTutorialDone: { en: "You're ready! Let's play!", id: 'Kamu siap! Ayo main!' },
  camTutorialSkip: { en: 'Skip practice', id: 'Lewati latihan' },
  settingsHoldSpeed: { en: 'Hold fingers still for', id: 'Tahan jari selama' },
  holdSlow: { en: 'Slow', id: 'Lambat' },
  holdNormal: { en: 'Normal', id: 'Normal' },
  holdFast: { en: 'Fast', id: 'Cepat' },
  settingsCamTutorial: { en: 'Camera practice', id: 'Latihan kamera' },
  settingsCamTutorialAgain: { en: 'Play it again', id: 'Ulangi latihan' },
  settingsCamTutorialQueued: { en: 'It starts the next time the camera turns on.', id: 'Akan mulai saat kamera dinyalakan lagi.' },
  showFingers: { en: 'Show your fingers', id: 'Tunjukkan jarimu' },
  holdSteady: { en: 'Hold steady...', id: 'Tahan...' },
  noHand: { en: 'I cannot see your hand yet', id: 'Aku belum melihat tanganmu' },

  // Memory
  memoryWatch: { en: 'Look carefully!', id: 'Perhatikan baik-baik!' },
  memoryRemember: { en: 'Now, remember...', id: 'Sekarang, ingat...' },
  memoryGetReady: { en: 'Get ready!', id: 'Bersiap!' },

  // Tutor
  tutorIntro: {
    en: 'Hi! I am Mewy. Ask me anything about your lessons!',
    id: 'Halo! Aku Mewy. Tanya aku apa saja tentang pelajaranmu!',
  },
  tutorPlaceholder: { en: 'Type your question...', id: 'Tulis pertanyaanmu...' },
  tutorSend: { en: 'Send', id: 'Kirim' },
  tutorThinking: { en: 'Mewy is thinking...', id: 'Mewy sedang berpikir...' },
  tutorTellMore: { en: 'Tell me more!', id: 'Ceritakan lagi!' },
  tutorLearnMore: { en: 'Learn more', id: 'Pelajari lagi' },
  tutorMedium: { en: "💡 Here's what I know!", id: '💡 Ini yang aku tahu!' },
  tutorUnknown: { en: "🤔 I'm still learning about that! Try one of these:", id: '🤔 Aku masih belajar soal itu! Coba tanya ini:' },

  // Round recap + fix my mistakes
  whyBtn: { en: 'Why?', id: 'Kenapa?' },
  whyLesson: { en: 'Learn more in the lesson', id: 'Pelajari lagi di pelajaran' },
  recapTitle: { en: 'My answers', id: 'Jawabanku' },
  recapYours: { en: 'You picked', id: 'Pilihanmu' },
  recapRight: { en: 'Right answer', id: 'Jawaban benar' },
  fixMistakes: { en: 'Fix my mistakes', id: 'Perbaiki kesalahanku' },
  reviewIntro: {
    en: 'Let’s try the questions you missed. Get one right and it disappears!',
    id: 'Ayo coba lagi soal yang tadi salah. Jawab dengan benar, soalnya hilang!',
  },
  reviewToFix: { en: 'questions to fix', id: 'soal untuk diperbaiki' },
  reviewEmpty: { en: 'No mistakes to fix. Amazing!', id: 'Tidak ada kesalahan. Hebat!' },
  reviewAllFixed: { en: '🎉 All mistakes fixed!', id: '🎉 Semua kesalahan sudah diperbaiki!' },

  // Progress
  progressTitle: { en: 'My Stars', id: 'Bintangku' },
  progressEmpty: { en: 'Play a game to earn your first star!', id: 'Main dulu untuk dapat bintang pertama!' },
  progressTotal: { en: 'Total stars', id: 'Total bintang' },
  progressReset: { en: 'Clear my stars', id: 'Hapus bintangku' },
  handHero: { en: 'Hand Hero answers', id: 'Jawaban Pahlawan Tangan' },
  handHeroNext: { en: 'Right camera answers to the next +1 ⭐', id: 'Jawaban kamera benar menuju +1 ⭐ berikutnya' },
  weeklyGoal: { en: 'This week', id: 'Minggu ini' },
  weeklyDays: { en: 'play days', id: 'hari main' },
  shieldReady: {
    en: 'Streak shield ready: miss 1 day this week and your streak stays safe!',
    id: 'Perisai siap: bolos 1 hari minggu ini, hari beruntunmu tetap aman!',
  },
  shieldUsed: {
    en: 'Streak shield used this week. It comes back on Monday!',
    id: 'Perisai sudah dipakai minggu ini. Kembali lagi hari Senin!',
  },
  progressStreak: { en: 'Day streak', id: 'Hari beruntun' },

  // Closet / rewards
  navCloset: { en: "Mewy's Closet", id: 'Lemari Mewy' },
  closetItems: { en: 'Outfits', id: 'Pakaian' },
  closetFur: { en: 'Fur colors', id: 'Warna bulu' },
  closetNone: { en: 'No outfit', id: 'Tanpa baju' },
  shopIntro: {
    en: 'Finish game rounds to collect items in your bag, then trade them for outfits and fur colors. Save up for the special ones!',
    id: 'Selesaikan ronde permainan untuk mengumpulkan item di tasmu, lalu tukar dengan baju dan warna bulu. Menabunglah untuk yang spesial!',
  },
  shopBuy: { en: 'Buy', id: 'Beli' },
  shopSure: { en: 'Buy it with these items?', id: 'Beli dengan item ini?' },
  shopYes: { en: 'Yes, buy', id: 'Ya, beli' },
  shopNotNow: { en: 'Not now', id: 'Nanti saja' },
  shopNeed: { en: 'Need', id: 'Kurang' },
  shopWear: { en: 'Wear', id: 'Pakai' },
  shopWearing: { en: 'Wearing', id: 'Dipakai' },
  mewyAge: { en: "Mewy's age", id: 'Umur Mewy' },
  mewyAgeNext: {
    en: 'Next: {stage} at a {n}-day streak (best so far {b}, now {c})',
    id: 'Berikutnya: {stage} di {n} hari beruntun (terbaik {b}, sekarang {c})',
  },
  mewyAgeTop: { en: 'Mewy is a Legend! The highest stage. 🏆', id: 'Mewy sudah Legenda! Tahap tertinggi. 🏆' },
  bagTitle: { en: 'My bag', id: 'Tasku' },
  bagEmpty: { en: 'Finish a game round to earn your first items!', id: 'Selesaikan satu ronde permainan untuk dapat item pertamamu!' },
  lootTitle: { en: 'You got:', id: 'Kamu dapat:' },
  stickerBook: { en: 'Sticker book', id: 'Buku stiker' },
  stickerGot: { en: 'Got it!', id: 'Sudah dapat!' },
  newUnlock: { en: 'New unlock!', id: 'Hadiah baru!' },
  openCloset: { en: 'Open closet', id: 'Buka lemari' },
  nextBadge: { en: 'Next badge', id: 'Lencana berikutnya' },

  // Mewy reactions + read aloud
  mewyThink: { en: 'Take your time, you can do it!', id: 'Pelan-pelan, kamu pasti bisa!' },
  mewyHappy: { en: 'Yay! You got it!', id: 'Hore! Kamu benar!' },
  mewySad: { en: 'Nice try! Let’s keep learning.', id: 'Sudah bagus! Ayo terus belajar.' },
  readAloud: { en: 'Read aloud', id: 'Bacakan' },
  settingsAutoRead: { en: 'Read questions aloud automatically', id: 'Bacakan soal otomatis' },
  settingsSpeechRate: { en: 'Read-aloud speed', id: 'Kecepatan membaca' },
  settingsSpeechRateDesc: { en: 'How fast Mewy talks. Pick one to hear a sample.', id: 'Seberapa cepat Mewy berbicara. Pilih satu untuk mendengar contoh.' },
  speechSample: { en: 'Hi! I am Mewy. What color is the sky?', id: 'Halo! Aku Mewy. Apa warna langit?' },

  // Adaptive difficulty, daily challenge, parents
  adaptUp: { en: 'Wow! You are ready for a harder level!', id: 'Wah! Kamu siap untuk tingkat lebih sulit!' },
  adaptDown: { en: 'Let’s warm up with an easier level first.', id: 'Ayo pemanasan dulu dengan tingkat lebih mudah.' },
  adaptStay: { en: 'Great practice! This level is just right for you.', id: 'Latihan hebat! Tingkat ini pas untukmu.' },
  adaptGo: { en: 'Try', id: 'Coba' },
  navDaily: { en: 'Daily Challenge', id: 'Tantangan Harian' },
  dailyText: { en: '5 mixed questions every day. Finish to earn +2 bonus stars!', id: '5 soal campuran setiap hari. Selesaikan untuk +2 bintang bonus!' },
  dailyDone: { en: 'Done for today! Come back tomorrow for new questions.', id: 'Selesai untuk hari ini! Kembali besok untuk soal baru.' },
  dailyBonus: { en: '+2 bonus stars!', id: '+2 bintang bonus!' },
  navParents: { en: 'Parents & Teachers', id: 'Orang Tua & Guru' },

  // Break reminder
  breakTitle: { en: 'Stretch break time!', id: 'Waktunya istirahat!' },
  breakBack: { en: "I'm back!", id: 'Aku kembali!' },

  // Settings
  settingsLang: { en: 'Language', id: 'Bahasa' },
  settingsTheme: { en: 'Look', id: 'Tampilan' },
  settingsHighContrast: { en: 'High contrast', id: 'Kontras tinggi' },
  settingsReduceMotion: { en: 'Calm mode (less motion)', id: 'Mode tenang (gerak sedikit)' },
  settingsReadable: { en: 'Easy-to-read font', id: 'Huruf mudah dibaca' },
  settingsTextSize: { en: 'Text size', id: 'Ukuran teks' },
  settingsSound: { en: 'Sounds', id: 'Suara' },
  settingsMusic: { en: '8-bit music', id: 'Musik 8-bit' },
  settingsMusicVolume: { en: 'Music volume', id: 'Volume musik' },
  settingsSfxVolume: { en: 'Sound effects volume', id: 'Volume efek suara' },
  settingsSfxVolumeDesc: { en: 'How loud the blips and dings are. Let go of the slider to hear it.', id: 'Seberapa keras bunyi efeknya. Lepaskan penggeser untuk mendengarnya.' },
  settingsPaw: { en: 'Paw cursor', id: 'Kursor kaki kucing' },
  // Settings tabs and the one-line help under each setting
  tabDisplay: { en: 'Display', id: 'Layar' },
  tabSound: { en: 'Sound', id: 'Suara' },
  tabPlay: { en: 'Play', id: 'Main' },
  tabHelp: { en: 'Help', id: 'Bantuan' },
  settingsLangDesc: { en: 'Words on buttons, questions and read-aloud.', id: 'Kata di tombol, soal, dan suara bacaan.' },
  settingsThemeDesc: { en: 'Colors of the whole site.', id: 'Warna seluruh situs.' },
  settingsTextSizeDesc: { en: 'Make all the letters bigger.', id: 'Buat semua huruf lebih besar.' },
  settingsHighContrastDesc: { en: 'Dark background and strong colors that are easier to see.', id: 'Latar gelap dan warna tegas yang lebih mudah dilihat.' },
  settingsReadableDesc: { en: 'Swap the pixel letters for a simple, clear font.', id: 'Ganti huruf piksel dengan huruf yang sederhana dan jelas.' },
  settingsReduceMotionDesc: { en: 'Turns off shaking, floating and confetti.', id: 'Mematikan goyangan, gerakan melayang, dan konfeti.' },
  settingsPawDesc: { en: 'A cat paw mouse pointer that leaves paw prints.', id: 'Penunjuk mouse kaki kucing yang meninggalkan jejak.' },
  settingsSoundDesc: { en: 'Blips for right and wrong answers and rewards.', id: 'Bunyi untuk jawaban benar, salah, dan hadiah.' },
  settingsMusicDesc: { en: 'Retro background music while you play.', id: 'Musik latar retro saat bermain.' },
  settingsMusicVolumeDesc: { en: 'How loud the music is.', id: 'Seberapa keras musiknya.' },
  settingsAutoReadDesc: { en: 'Mewy reads every new question and its answers out loud.', id: 'Mewy membacakan setiap soal baru dan jawabannya.' },
  settingsHoldSpeedDesc: { en: 'How long to keep your fingers still before the answer counts.', id: 'Berapa lama jari harus diam sebelum jawaban dihitung.' },
  settingsCamTutorialDesc: { en: 'The "show 1, 2, 3, 4 fingers" warm-up for the camera.', id: 'Pemanasan "tunjukkan 1, 2, 3, 4 jari" untuk kamera.' },
  on: { en: 'On', id: 'Nyala' },
  off: { en: 'Off', id: 'Mati' },

  // Lesson player
  lessonPick: { en: 'Pick a lesson to start. Each one is short!', id: 'Pilih pelajaran untuk mulai. Semuanya singkat!' },
  lessonStep: { en: 'Step', id: 'Langkah' },
  lessonSteps: { en: 'steps', id: 'langkah' },
  lessonOf: { en: 'of', id: 'dari' },
  lessonReadToMe: { en: 'Read to me', id: 'Bacakan' },
  lessonMistakes: { en: 'Common mistakes', id: 'Kesalahan umum' },
  lessonTry: { en: 'Try it yourself!', id: 'Coba sendiri!' },
  lessonMoreDetail: { en: 'Want to know more?', id: 'Mau tahu lebih?' },
  lessonLessDetail: { en: 'Hide the extra', id: 'Sembunyikan' },
  lessonCheck: { en: 'Quick check', id: 'Cek cepat' },
  lessonTryAgain: { en: 'Not yet! Look again and try another one.', id: 'Belum tepat! Lihat lagi dan coba yang lain.' },
  lessonDone: { en: 'Lesson complete! Great job!', id: 'Pelajaran selesai! Hebat!' },
  lessonNext: { en: 'Next lesson', id: 'Pelajaran berikutnya' },
  lessonPractice: { en: 'Practice in the quiz', id: 'Latihan di kuis' },
  lessonAll: { en: 'All lessons', id: 'Semua pelajaran' },

  // How AI
  howAiTitle: { en: 'How does the AI work?', id: 'Bagaimana AI bekerja?' },

  // About
  aboutTitle: { en: 'About Mewing Academy', id: 'Tentang Mewing Academy' },
} as const;

export type StringKey = keyof typeof STRINGS;

export function t(key: StringKey, lang: Lang): string {
  return STRINGS[key][lang];
}
