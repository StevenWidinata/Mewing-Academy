import type { Text } from '../types';

/** Pre-written, age-appropriate replies the matcher can pick from. */

export interface Intent {
  id: string;
  keywords: string[];
  reply: Text;
}

export const INTENTS: Intent[] = [
  {
    id: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'halo', 'hai', 'pagi', 'siang', 'sore', 'malam'],
    reply: {
      en: 'Hi friend! I am Mewy, your learning buddy. Ask me about numbers, colors, shapes, animals, letters or space!',
      id: 'Halo teman! Aku Mewy, teman belajarmu. Tanya aku soal angka, warna, bentuk, hewan, huruf, atau luar angkasa!',
    },
  },
  {
    id: 'help',
    keywords: ['help', 'what', 'can', 'do', 'bantu', 'bisa', 'apa'],
    reply: {
      en: 'I can do maths like "3 + 4", and tell you fun facts about colors, shapes, animals, letters, plants and space. Try asking: "How many legs does a spider have?"',
      id: 'Aku bisa berhitung seperti "3 + 4", dan cerita fakta seru tentang warna, bentuk, hewan, huruf, tanaman, dan luar angkasa. Coba tanya: "Laba-laba kakinya berapa?"',
    },
  },
  {
    id: 'colors',
    keywords: ['color', 'colour', 'colors', 'rainbow', 'warna', 'pelangi', 'mix', 'campur'],
    reply: {
      en: 'The 3 primary colors are red, yellow and blue. Mix red + yellow = orange, blue + yellow = green, red + blue = purple. A rainbow has 7 colors!',
      id: 'Tiga warna dasar adalah merah, kuning, dan biru. Merah + kuning = oranye, biru + kuning = hijau, merah + biru = ungu. Pelangi punya 7 warna!',
    },
  },
  {
    id: 'shapes',
    keywords: ['shape', 'shapes', 'triangle', 'square', 'circle', 'corner', 'bentuk', 'segitiga', 'persegi', 'lingkaran', 'sudut'],
    reply: {
      en: 'A triangle has 3 sides and 3 corners. A square has 4 equal sides. A circle is round and has no corners at all!',
      id: 'Segitiga punya 3 sisi dan 3 sudut. Persegi punya 4 sisi yang sama panjang. Lingkaran bulat dan tidak punya sudut!',
    },
  },
  {
    id: 'spider',
    keywords: ['spider', 'legs', 'insect', 'laba', 'kaki', 'serangga'],
    reply: {
      en: 'Spiders have 8 legs. Insects like ants and butterflies have 6 legs. So a spider is not an insect!',
      id: 'Laba-laba punya 8 kaki. Serangga seperti semut dan kupu-kupu punya 6 kaki. Jadi laba-laba bukan serangga!',
    },
  },
  {
    id: 'animals',
    keywords: ['animal', 'animals', 'cat', 'dog', 'cow', 'elephant', 'fish', 'bird', 'hewan', 'binatang', 'kucing', 'anjing', 'sapi', 'gajah', 'ikan', 'burung'],
    reply: {
      en: 'Fun fact: elephants are the biggest land animals, fish breathe with gills, and birds have hollow bones to help them fly!',
      id: 'Fakta seru: gajah adalah hewan darat terbesar, ikan bernapas dengan insang, dan tulang burung berongga supaya bisa terbang!',
    },
  },
  {
    id: 'dinosaurs',
    keywords: ['dinosaur', 'dinosaurs', 'dino', 'trex', 'rex', 'dinosaurus'],
    reply: {
      en: 'Dinosaurs lived millions of years ago. T-Rex had teeth as big as bananas! Birds today are relatives of dinosaurs.',
      id: 'Dinosaurus hidup jutaan tahun lalu. Gigi T-Rex sebesar pisang! Burung zaman sekarang adalah kerabat dinosaurus.',
    },
  },
  {
    id: 'letters',
    keywords: ['letter', 'letters', 'alphabet', 'vowel', 'vowels', 'abc', 'huruf', 'alfabet', 'vokal'],
    reply: {
      en: 'There are 26 letters in the alphabet. The vowels are A, E, I, O, U. Every word needs at least one vowel sound!',
      id: 'Ada 26 huruf dalam alfabet. Huruf vokal adalah A, I, U, E, O. Hampir setiap kata punya huruf vokal!',
    },
  },
  {
    id: 'counting',
    keywords: ['count', 'counting', 'number', 'numbers', 'hitung', 'berhitung', 'angka'],
    reply: {
      en: 'Counting tip: touch each thing once and say a number: 1, 2, 3... The last number you say is how many there are!',
      id: 'Tips berhitung: sentuh setiap benda satu kali sambil sebut angka: 1, 2, 3... Angka terakhir adalah jumlahnya!',
    },
  },
  {
    id: 'space',
    keywords: ['space', 'planet', 'planets', 'sun', 'moon', 'star', 'stars', 'earth', 'angkasa', 'matahari', 'bulan', 'bintang', 'bumi'],
    reply: {
      en: 'The Sun is a star! There are 8 planets. We live on Earth, the third planet from the Sun. The Moon goes around the Earth.',
      id: 'Matahari adalah bintang! Ada 8 planet. Kita tinggal di Bumi, planet ketiga dari Matahari. Bulan mengelilingi Bumi.',
    },
  },
  {
    id: 'plants',
    keywords: ['plant', 'plants', 'tree', 'flower', 'grow', 'tanaman', 'pohon', 'bunga', 'tumbuh'],
    reply: {
      en: 'Plants need sunlight, water and air to grow. They make their own food from sunlight. That is called photosynthesis!',
      id: 'Tanaman butuh sinar matahari, air, dan udara untuk tumbuh. Mereka membuat makanan sendiri dari sinar matahari. Namanya fotosintesis!',
    },
  },
  {
    id: 'patterns',
    keywords: ['pattern', 'patterns', 'repeat', 'pola', 'berulang'],
    reply: {
      en: 'A pattern is something that repeats, like red, blue, red, blue. Find what repeats, then guess what comes next!',
      id: 'Pola adalah sesuatu yang berulang, seperti merah, biru, merah, biru. Temukan yang berulang, lalu tebak selanjutnya!',
    },
  },
  {
    id: 'camera',
    keywords: ['camera', 'finger', 'fingers', 'hand', 'answer', 'kamera', 'jari', 'tangan', 'jawab'],
    reply: {
      en: 'To answer with your hand, count with your fingers: 1 finger for A, 2 for B, 3 for C, 4 for D (tuck your thumb in). Keep it still until the bar fills up! The camera only works on this device.',
      id: 'Untuk menjawab dengan tangan, hitung dengan jarimu: 1 jari untuk A, 2 untuk B, 3 untuk C, 4 untuk D (lipat jempolmu). Tahan sampai bar penuh! Kamera hanya bekerja di perangkat ini.',
    },
  },
  {
    id: 'ai',
    keywords: ['ai', 'robot', 'computer', 'smart', 'artificial', 'komputer', 'pintar', 'buatan'],
    reply: {
      en: 'AI means a computer that learned patterns from lots of examples. My camera AI learned what hands look like from thousands of pictures, so it can find your fingers!',
      id: 'AI artinya komputer yang belajar pola dari banyak contoh. AI kameraku belajar bentuk tangan dari ribuan gambar, jadi bisa menemukan jarimu!',
    },
  },
  {
    id: 'sad',
    keywords: ['sad', 'hard', 'difficult', 'cant', 'stupid', 'sedih', 'susah', 'sulit', 'bodoh', 'gabisa'],
    reply: {
      en: 'It is okay to find things hard! Every mistake helps your brain grow. Take a deep breath, and let us try an easier one together. You can do it!',
      id: 'Tidak apa-apa kalau terasa sulit! Setiap salah membuat otakmu tumbuh. Tarik napas, ayo coba yang lebih mudah bersama. Kamu pasti bisa!',
    },
  },
  {
    id: 'thanks',
    keywords: ['thanks', 'thank', 'makasih', 'terima', 'kasih'],
    reply: { en: 'You are welcome! Keep learning, superstar!', id: 'Sama-sama! Terus belajar ya, bintang!' },
  },
  {
    id: 'bye',
    keywords: ['bye', 'goodbye', 'dadah', 'sampai', 'jumpa'],
    reply: { en: 'Bye bye! Come back soon to play again!', id: 'Dadah! Kembali lagi ya untuk main lagi!' },
  },
];

export const PRIVACY: Text = {
  en: 'Please do not share your name, address, school, phone number or passwords online. Ask a grown-up you trust instead. Let us keep learning!',
  id: 'Jangan bagikan nama lengkap, alamat, sekolah, nomor HP, atau kata sandi di internet ya. Tanya orang dewasa yang kamu percaya. Ayo lanjut belajar!',
};

export const FALLBACK: Text = {
  en: 'Hmm, I am not sure about that one yet. Try asking about numbers, colors, shapes, animals, letters, plants or space!',
  id: 'Hmm, aku belum tahu soal itu. Coba tanya tentang angka, warna, bentuk, hewan, huruf, tanaman, atau luar angkasa!',
};
