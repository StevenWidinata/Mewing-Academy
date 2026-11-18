import type { FigureConfig, FigureId, LessonMore } from './lessons';

/**
 * "Want to know more?" notes: one per lesson step (same order as the steps),
 * 1–2 short sentences with a picture, for curious kids.
 */

const m = (emoji: string, en: string, id: string, figure?: FigureId, config?: FigureConfig): LessonMore => ({
  emoji,
  text: { en, id },
  ...(figure ? { figure, config } : {}),
});

export const LESSON_MORE: Record<string, LessonMore[]> = {
  // ---------------- Counting ----------------
  'count-1': [
    m('👆', 'Long ago, people counted on their fingers too. That is one reason we count in tens: we have 10 fingers!', 'Dulu orang juga berhitung dengan jari. Itulah salah satu alasan kita berhitung per sepuluh: jari kita ada 10!'),
    m('🧺', 'A trick: move each thing to a new pile as you count it. Then you never count one twice.', 'Trik: pindahkan setiap benda ke tumpukan baru saat menghitungnya. Jadi tidak ada yang terhitung dua kali.'),
    m('🎲', 'Dice dots are arranged so you can see 5 without counting one by one. Look at a die and try it!', 'Titik dadu disusun supaya kamu bisa melihat 5 tanpa menghitung satu per satu. Coba lihat dadu!'),
  ],
  'count-2': [
    m('🐊', 'Some kids draw the < and > signs as a hungry crocodile mouth: it always opens toward the bigger number!', 'Ada anak yang menggambar tanda < dan > seperti mulut buaya lapar: selalu terbuka ke angka yang lebih besar!'),
    m('📏', 'Lining things up in two rows makes comparing easy: the longer row has more.', 'Menyusun benda dalam dua baris membuat membandingkan jadi mudah: baris yang lebih panjang lebih banyak.'),
    m('⚖️', 'Equal is like a balanced seesaw: both sides have the same amount.', 'Sama banyak itu seperti jungkat-jungkit yang seimbang: kedua sisi sama jumlahnya.'),
  ],
  'count-3': [
    m('♾️', 'Numbers never end! Whatever number you think of, you can always add 1 more.', 'Angka tidak pernah habis! Angka berapa pun yang kamu pikirkan, selalu bisa ditambah 1 lagi.'),
    m('🚀', 'Counting up is like climbing stairs: one step at a time, always one more.', 'Menghitung naik seperti menaiki tangga: satu anak tangga setiap kali, selalu tambah satu.'),
    m('🛸', 'Rockets count backwards before launch: 5, 4, 3, 2, 1... blast off!', 'Roket menghitung mundur sebelum meluncur: 5, 4, 3, 2, 1... meluncur!'),
  ],
  // ---------------- Plus & minus ----------------
  'math-1': [
    m('🔄', 'You can add in any order: 2 + 3 and 3 + 2 both make 5!', 'Kamu bisa menambah dengan urutan apa saja: 2 + 3 dan 3 + 2 sama-sama 5!'),
    m('💡', 'A quick trick: start from the bigger number and count on. For 6 + 2, say "6... 7, 8".', 'Trik cepat: mulai dari angka yang lebih besar lalu hitung lanjut. Untuk 6 + 2, ucapkan "6... 7, 8".'),
    m('📜', 'The + sign is about 500 years old. Before that, people wrote the word "and".', 'Tanda + sudah berumur sekitar 500 tahun. Sebelumnya, orang menulis kata "dan".'),
  ],
  'math-2': [
    m('↩️', 'Taking away is the opposite of adding: 3 + 2 = 5, so 5 − 2 = 3.', 'Mengurang adalah kebalikan menambah: 3 + 2 = 5, jadi 5 − 2 = 3.'),
    m('⬇️', 'You can count back to take away. For 7 − 2, say "7... 6, 5".', 'Kamu bisa menghitung mundur untuk mengurang. Untuk 7 − 2, ucapkan "7... 6, 5".'),
    m('🟰', 'Take away everything, and you get 0: 4 − 4 = 0.', 'Kalau semuanya diambil, hasilnya 0: 4 − 4 = 0.'),
  ],
  'math-3': [
    m('🖍️', 'Drawing a quick picture of the story makes the maths easy to see.', 'Menggambar cerita dengan cepat membuat hitungannya mudah dilihat.'),
    m('🕵️', 'Be a maths detective: what do you start with, what changes, and what is the question?', 'Jadilah detektif matematika: mulai dengan apa, apa yang berubah, dan apa pertanyaannya?'),
    m('🍪', 'Make up your own story: "I had 4 cookies and ate 1..." Can a friend solve it?', 'Buat ceritamu sendiri: "Aku punya 4 kue dan makan 1..." Bisakah temanmu menjawabnya?'),
  ],
  // ---------------- Skip counting ----------------
  'skip-1': [
    m('💰', 'Money uses 10s a lot: 10 coins of 10 make 100!', 'Uang banyak memakai puluhan: 10 koin bernilai 10 menjadi 100!'),
    m('🙌', 'Count your class by 10s using everyone’s fingers. Two kids = 20 fingers!', 'Hitung teman sekelas per 10 memakai jari semua orang. Dua anak = 20 jari!'),
    m('🦘', 'Jumping by 10 is fast, like a kangaroo. Counting by 1 is slow, like a snail.', 'Loncat 10-10 itu cepat seperti kanguru. Berhitung 1-1 itu lambat seperti siput.'),
  ],
  'skip-2': [
    m('⏰', 'A clock counts minutes by 5s: each number on the clock is 5 more minutes.', 'Jam menghitung menit per 5: setiap angka di jam berarti 5 menit lagi.'),
    m('⭐', 'A star has 5 points. Count the points on 3 stars: 5, 10, 15!', 'Bintang punya 5 ujung. Hitung ujung 3 bintang: 5, 10, 15!'),
    m('🎵', 'Clap and count by 5s to music: 5, 10, 15, 20... it sounds like a song!', 'Bertepuk dan hitung per 5 dengan musik: 5, 10, 15, 20... seperti lagu!'),
  ],
  'skip-3': [
    m('🧦', 'Socks, shoes and gloves come in pairs, so counting them by 2s is quicker.', 'Kaus kaki, sepatu, dan sarung tangan berpasangan, jadi menghitungnya per 2 lebih cepat.'),
    m('🔢', 'Counting by 2s from 2 gives the even numbers: 2, 4, 6, 8, 10.', 'Berhitung per 2 dari angka 2 menghasilkan bilangan genap: 2, 4, 6, 8, 10.'),
    m('🐸', 'Numbers you skip (1, 3, 5, 7, 9) are the odd numbers.', 'Angka yang terlewati (1, 3, 5, 7, 9) adalah bilangan ganjil.'),
  ],
  // ---------------- Time ----------------
  'time-1': [
    m('⏳', 'Before clocks, people used sundials, sand timers and even candles to tell the time!', 'Sebelum ada jam, orang memakai jam matahari, jam pasir, bahkan lilin untuk tahu waktu!'),
    m('🔄', 'The short hand goes around the clock 2 times every day.', 'Jarum pendek berputar mengelilingi jam 2 kali setiap hari.'),
    m('🌙', 'Clocks show 12 hours, so 9 o’clock happens twice a day: morning and night.', 'Jam menunjukkan 12 jam, jadi jam 9 terjadi dua kali sehari: pagi dan malam.'),
  ],
  'time-2': [
    m('🍕', 'Half past is like half a pizza: the long hand has gone halfway around.', 'Setengah itu seperti setengah pizza: jarum panjang sudah berjalan setengah putaran.'),
    m('⏱️', 'One full trip of the long hand takes 60 minutes. Half a trip is 30 minutes.', 'Satu putaran penuh jarum panjang butuh 60 menit. Setengah putaran 30 menit.'),
    m('🕤', 'At half past, the short hand is halfway between two numbers, never right on one.', 'Saat setengah, jarum pendek ada di tengah dua angka, tidak pernah tepat di satu angka.'),
  ],
  'time-3': [
    m('🌕', 'A week has 7 days. Long ago, people may have chosen 7 because the Moon changes shape about every 7 days.', 'Seminggu ada 7 hari. Dulu orang mungkin memilih 7 karena Bulan berubah bentuk kira-kira setiap 7 hari.'),
    m('📆', '4 weeks is about one month, and 52 weeks make a year.', '4 minggu kira-kira satu bulan, dan 52 minggu menjadi satu tahun.'),
    m('🎂', 'Your birthday falls on a different day of the week each year!', 'Hari ulang tahunmu jatuh di hari yang berbeda setiap tahun!'),
  ],
  // ---------------- Patterns ----------------
  'pattern-1': [
    m('🦓', 'Nature loves patterns: zebra stripes, bee honeycombs and flower petals.', 'Alam suka pola: belang zebra, sarang lebah, dan kelopak bunga.'),
    m('👏', 'You can make sound patterns too: clap, stomp, clap, stomp!', 'Kamu juga bisa membuat pola suara: tepuk, hentak, tepuk, hentak!'),
    m('🧵', 'Batik cloth from Indonesia is full of beautiful repeating patterns.', 'Kain batik dari Indonesia penuh pola berulang yang indah.'),
  ],
  'pattern-2': [
    m('🧱', 'Brick walls use a pattern so they are strong and look neat.', 'Dinding bata memakai pola supaya kuat dan terlihat rapi.'),
    m('🎨', 'Try making a pattern with your toys: car, block, car, block...', 'Coba buat pola dengan mainanmu: mobil, balok, mobil, balok...'),
    m('📅', 'The days of the week are a pattern too: they repeat every 7 days!', 'Nama hari juga pola: berulang setiap 7 hari!'),
  ],
  'pattern-3': [
    m('🔍', 'To find the rule, look at the jump between two numbers next to each other.', 'Untuk menemukan aturannya, lihat loncatan antara dua angka yang bersebelahan.'),
    m('🐌', 'Shells and pinecones grow in special number patterns too!', 'Cangkang siput dan buah pinus juga tumbuh dengan pola angka khusus!'),
    m('⬇️', 'A countdown is a going-down pattern: 10, 9, 8, 7...', 'Hitung mundur adalah pola turun: 10, 9, 8, 7...'),
  ],
  // ---------------- Shapes ----------------
  'shape-1': [
    m('🛞', 'Wheels are circles because a circle rolls smoothly. A square wheel would go bump, bump!', 'Roda berbentuk lingkaran karena lingkaran berguling dengan mulus. Roda kotak akan berguncang!'),
    m('🧇', 'Squares fit together with no gaps, like floor tiles and waffles.', 'Persegi bisa disusun tanpa celah, seperti ubin lantai dan wafel.'),
    m('🏗️', 'Triangles are very strong. Bridges and roofs use them to stay up.', 'Segitiga sangat kuat. Jembatan dan atap memakainya supaya tidak roboh.'),
  ],
  'shape-2': [
    m('📐', 'A corner is called an angle. A square’s corners are all "square corners".', 'Sudut juga disebut sudut siku. Sudut persegi semuanya siku-siku.'),
    m('🔺', 'Every shape with straight sides has the same number of sides and corners.', 'Setiap bentuk bersisi lurus punya jumlah sisi dan sudut yang sama.'),
    m('📱', 'Phones, books and TVs are rectangles. Look around: how many can you find?', 'Ponsel, buku, dan TV berbentuk persegi panjang. Lihat sekitar: berapa yang kamu temukan?'),
  ],
  'shape-3': [
    m('🍩', 'A donut is a circle with a hole. A ball is a sphere, round in every direction.', 'Donat adalah lingkaran berlubang. Bola adalah bangun bulat ke segala arah.'),
    m('🪟', 'Look out of a window: can you spot a square, a circle and a triangle?', 'Lihat ke luar jendela: bisakah kamu menemukan persegi, lingkaran, dan segitiga?'),
    m('🛑', 'A stop sign has 8 sides. It is called an octagon.', 'Rambu berhenti punya 8 sisi. Namanya segi delapan.', 'corners', { shape: 'hexagon' }),
  ],
  // ---------------- Colors ----------------
  'color-1': [
    m('🌈', 'Sunlight has all the colors mixed together. A rainbow splits them apart!', 'Sinar matahari berisi semua warna yang bercampur. Pelangi memisahkannya!'),
    m('👁️', 'Your eyes have special cells that see red, green and blue light.', 'Matamu punya sel khusus yang melihat cahaya merah, hijau, dan biru.'),
    m('🐝', 'Bees can see colors we cannot see, like ultraviolet!', 'Lebah bisa melihat warna yang tidak bisa kita lihat, seperti ultraungu!'),
  ],
  'color-2': [
    m('🍂', 'Leaves are green because of chlorophyll. In autumn it fades, and yellow and red show up.', 'Daun hijau karena klorofil. Di musim gugur klorofil memudar, lalu muncul kuning dan merah.'),
    m('🦩', 'Flamingos are pink because of the shrimp they eat!', 'Flamingo berwarna merah muda karena udang yang mereka makan!'),
    m('🚦', 'Traffic lights use red for stop and green for go, so everyone knows what to do.', 'Lampu lalu lintas memakai merah untuk berhenti dan hijau untuk jalan, supaya semua orang tahu.'),
  ],
  'color-3': [
    m('🎨', 'Painters mix colors on a palette before painting.', 'Pelukis mencampur warna di palet sebelum melukis.'),
    m('⚫', 'Mix lots of colors together and you get a muddy brown!', 'Campur banyak warna sekaligus dan hasilnya cokelat keruh!'),
    m('🖌️', 'Add white to any color to make it lighter, like red + white = pink.', 'Tambahkan putih ke warna apa pun supaya lebih muda, seperti merah + putih = merah muda.', 'mixer'),
  ],
  // ---------------- Animals ----------------
  'animal-1': [
    m('🐱', 'Cats meow mostly to talk to people, not to other cats!', 'Kucing mengeong terutama untuk berbicara dengan manusia, bukan dengan kucing lain!'),
    m('🐓', 'In Indonesian a rooster says "kukuruyuk", in English "cock-a-doodle-doo". Same sound, different words!', 'Dalam bahasa Indonesia ayam jago bilang "kukuruyuk", dalam bahasa Inggris "cock-a-doodle-doo". Suaranya sama, katanya beda!'),
    m('🐋', 'Whales sing songs that can travel very far under the sea.', 'Paus bernyanyi dan lagunya bisa terdengar sangat jauh di bawah laut.'),
  ],
  'animal-2': [
    m('🐸', 'Frogs live both in water and on land. They are called amphibians.', 'Katak hidup di air dan di darat. Mereka disebut amfibi.'),
    m('🦇', 'Bats can fly, but they are mammals, not birds.', 'Kelelawar bisa terbang, tapi mereka mamalia, bukan burung.'),
    m('🐫', 'Camels live in deserts and can go a long time without drinking water.', 'Unta hidup di gurun dan bisa lama tidak minum air.'),
  ],
  'animal-3': [
    m('🐙', 'An octopus has 8 arms and 3 hearts!', 'Gurita punya 8 lengan dan 3 jantung!', 'legs', { mode: 'legs' }),
    m('🐆', 'The cheetah is the fastest land animal, as fast as a car on the highway.', 'Cheetah adalah hewan darat tercepat, secepat mobil di jalan tol.'),
    m('🐣', 'A baby kangaroo is called a joey, and a baby frog is called a tadpole.', 'Bayi kanguru disebut joey, dan bayi katak disebut kecebong.'),
  ],
  // ---------------- Letters ----------------
  'letter-1': [
    m('🇬🇷', 'The word "alphabet" comes from the first two Greek letters: alpha and beta.', 'Kata "alfabet" berasal dari dua huruf Yunani pertama: alfa dan beta.'),
    m('✍️', 'Capital letters start names and sentences, like "Mewy" and "I like cats."', 'Huruf kapital dipakai di awal nama dan kalimat, seperti "Mewy" dan "Aku suka kucing."'),
    m('🇮🇩', 'Indonesian and English use the same 26 letters, but they sound a little different!', 'Bahasa Indonesia dan Inggris memakai 26 huruf yang sama, tapi bunyinya sedikit berbeda!'),
  ],
  'letter-2': [
    m('🎤', 'Say your name slowly. Can you hear the first sound?', 'Ucapkan namamu pelan-pelan. Bisakah kamu mendengar bunyi pertamanya?'),
    m('🔊', 'Some letters work together to make one sound, like "ny" in "nyanyi" or "sh" in "ship".', 'Ada huruf yang bekerja sama membuat satu bunyi, seperti "ny" di "nyanyi" atau "sh" di "ship".'),
    m('🗂️', 'Dictionaries put words in alphabet order by their first letter.', 'Kamus menyusun kata sesuai urutan alfabet berdasarkan huruf pertamanya.'),
  ],
  'letter-3': [
    m('😮', 'You make vowel sounds with your mouth open and nothing blocking the air.', 'Bunyi vokal dibuat dengan mulut terbuka tanpa ada yang menghalangi udara.'),
    m('👅', 'Consonants use your lips, teeth or tongue to stop or squeeze the air: b, t, s.', 'Konsonan memakai bibir, gigi, atau lidah untuk menahan atau menekan udara: b, t, s.'),
    m('🔤', 'In Indonesian, vowels are usually said A, I, U, E, O.', 'Dalam bahasa Indonesia, vokal biasanya diurutkan A, I, U, E, O.', 'letters', { mode: 'vowels' }),
  ],
  // ---------------- Fruits & veggies ----------------
  'food-1': [
    m('🍓', 'Strawberries wear their seeds on the outside, about 200 of them!', 'Stroberi membawa bijinya di luar, sekitar 200 biji!'),
    m('🍌', 'Bananas grow in big bunches that hang down from the plant.', 'Pisang tumbuh dalam tandan besar yang menggantung dari pohonnya.'),
    m('🥒', 'Cucumbers and peppers have seeds too, so they are really fruits!', 'Mentimun dan paprika juga punya biji, jadi sebenarnya buah!'),
  ],
  'food-2': [
    m('🥕', 'Carrots are roots. They grow under the ground and store food for the plant.', 'Wortel adalah akar. Tumbuh di dalam tanah dan menyimpan makanan untuk tanamannya.'),
    m('🥬', 'Spinach and lettuce are leaves we can eat.', 'Bayam dan selada adalah daun yang bisa kita makan.'),
    m('🌱', 'You can grow green onions again from their roots in a glass of water!', 'Kamu bisa menumbuhkan daun bawang lagi dari akarnya di segelas air!'),
  ],
  'food-3': [
    m('🫐', 'Each color brings different good things: orange carrots help your eyes, and green veggies help you grow strong.', 'Setiap warna membawa kebaikan berbeda: wortel oranye baik untuk mata, dan sayur hijau membantumu tumbuh kuat.'),
    m('💧', 'Your body is more than half water, so drinking water keeps it working well.', 'Lebih dari setengah tubuhmu adalah air, jadi minum air membuatnya bekerja dengan baik.'),
    m('🦷', 'Sticky sweets stay on your teeth. Brush after eating them!', 'Permen lengket menempel di gigi. Sikat gigi setelah memakannya!'),
  ],
  // ---------------- My body ----------------
  'body-1': [
    m('🦴', 'A grown-up has 206 bones. Babies are born with even more, and some join as they grow.', 'Orang dewasa punya 206 tulang. Bayi lahir dengan lebih banyak, lalu sebagian menyatu saat tumbuh.'),
    m('🖐️', 'Your fingerprints are yours alone. Nobody else in the world has the same ones!', 'Sidik jarimu hanya milikmu. Tidak ada orang lain di dunia yang sama!'),
    m('💪', 'You use about 200 muscles every time you take a step.', 'Kamu memakai sekitar 200 otot setiap kali melangkah.'),
  ],
  'body-2': [
    m('👃', 'Your nose can tell apart thousands of different smells.', 'Hidungmu bisa membedakan ribuan bau yang berbeda.'),
    m('👅', 'Your tongue is covered with tiny taste buds that tell sweet, salty, sour and bitter.', 'Lidahmu dipenuhi pengecap kecil yang membedakan manis, asin, asam, dan pahit.'),
    m('👂', 'Ears also help you balance. That is why spinning makes you dizzy!', 'Telinga juga membantu keseimbangan. Itulah kenapa berputar membuatmu pusing!'),
  ],
  'body-3': [
    m('🧠', 'Your brain is busy even when you sleep: it sorts what you learned today.', 'Otakmu tetap sibuk saat kamu tidur: ia merapikan apa yang kamu pelajari hari ini.'),
    m('❤️', 'Your heart is about as big as your fist and beats about 100,000 times a day.', 'Jantungmu kira-kira sebesar kepalan tangan dan berdetak sekitar 100.000 kali sehari.'),
    m('🫁', 'Put a hand on your chest and breathe in deeply: you can feel your lungs fill up.', 'Letakkan tangan di dada dan tarik napas dalam: kamu bisa merasakan paru-parumu terisi.'),
  ],
  // ---------------- Weather ----------------
  'weather-1': [
    m('⚡', 'Lightning is hotter than the surface of the Sun!', 'Petir lebih panas dari permukaan Matahari!'),
    m('❄️', 'Every snowflake has 6 sides, and no two look exactly the same.', 'Setiap kepingan salju punya 6 sisi, dan tidak ada dua yang persis sama.'),
    m('🌈', 'To see a rainbow, stand with the Sun behind you and the rain in front.', 'Untuk melihat pelangi, berdirilah dengan Matahari di belakang dan hujan di depan.', 'weather', { mode: 'cycle' }),
  ],
  'weather-2': [
    m('🧴', 'Sunscreen protects your skin from sunburn, even on cloudy days.', 'Tabir surya melindungi kulit dari terbakar matahari, bahkan saat berawan.'),
    m('⛈️', 'Count the seconds between lightning and thunder: the longer it is, the farther away the storm.', 'Hitung detik antara petir dan guntur: makin lama, makin jauh badainya.'),
    m('🌡️', 'A thermometer tells us how hot or cold it is.', 'Termometer memberi tahu seberapa panas atau dingin udaranya.'),
  ],
  'weather-3': [
    m('🌍', 'Seasons happen because the Earth is tilted as it goes around the Sun.', 'Musim terjadi karena Bumi miring saat mengelilingi Matahari.'),
    m('🌴', 'Places near the middle of the Earth, like Indonesia, stay warm all year.', 'Tempat di dekat tengah Bumi, seperti Indonesia, tetap hangat sepanjang tahun.'),
    m('☔', 'In Indonesia the rainy season often lasts from about October to March.', 'Di Indonesia musim hujan sering berlangsung kira-kira dari Oktober sampai Maret.'),
  ],
  // ---------------- Vehicles ----------------
  'transport-1': [
    m('🚄', 'Some trains go faster than 300 km an hour!', 'Ada kereta yang melaju lebih cepat dari 300 km per jam!'),
    m('🚲', 'Riding a bike is great exercise and does not make any smoke.', 'Bersepeda adalah olahraga yang hebat dan tidak menghasilkan asap.'),
    m('🛺', 'A becak has 3 wheels and is pedalled by its driver.', 'Becak punya 3 roda dan dikayuh oleh pengemudinya.'),
  ],
  'transport-2': [
    m('🚢', 'Huge ships float because their shape pushes away lots of water.', 'Kapal besar mengapung karena bentuknya mendorong banyak air.'),
    m('✈️', 'Planes fly because air rushing over their wings pushes them up.', 'Pesawat terbang karena udara yang mengalir di sayapnya mendorongnya ke atas.'),
    m('🚀', 'Rockets are the only vehicles that can fly where there is no air at all.', 'Roket adalah satu-satunya kendaraan yang bisa terbang di tempat tanpa udara sama sekali.'),
  ],
  'transport-3': [
    m('🚨', 'When you hear a siren, help by staying calm and moving to the side.', 'Saat mendengar sirene, bantulah dengan tetap tenang dan menepi.'),
    m('🚒', 'Fire trucks carry ladders that can reach very high windows.', 'Mobil pemadam membawa tangga yang bisa mencapai jendela sangat tinggi.'),
    m('☎️', 'In Indonesia, 112 is a number for emergencies. Ask a grown-up to show you.', 'Di Indonesia, 112 adalah nomor darurat. Minta orang dewasa menunjukkannya padamu.'),
  ],
  // ---------------- Opposites ----------------
  'opp-1': [
    m('🔄', 'Opposites help us describe things: is the soup hot or cold?', 'Lawan kata membantu kita menjelaskan sesuatu: supnya panas atau dingin?'),
    m('🧲', 'Magnets have two opposite ends called north and south.', 'Magnet punya dua ujung berlawanan yang disebut utara dan selatan.'),
    m('🎭', 'Some opposites make new words: happy and unhappy!', 'Ada lawan kata yang membuat kata baru: senang dan tidak senang!', 'seesaw'),
  ],
  'opp-2': [
    m('🚪', 'Look around your room and find something open and something closed.', 'Lihat sekeliling kamarmu dan temukan sesuatu yang terbuka dan tertutup.'),
    m('🌗', 'When it is day where you live, it is night on the other side of the Earth!', 'Saat siang di tempatmu, di sisi Bumi yang lain sedang malam!'),
    m('🥤', 'Between full and empty there is "half full". Opposites can have steps in between.', 'Di antara penuh dan kosong ada "setengah penuh". Lawan kata bisa punya tingkat di antaranya.'),
  ],
  'opp-3': [
    m('🎯', 'Playing opposite games makes your brain think fast!', 'Bermain lawan kata membuat otakmu berpikir cepat!'),
    m('🪞', 'A mirror shows left and right swapped, like opposites!', 'Cermin menukar kiri dan kanan, seperti lawan kata!'),
    m('🗣️', 'Try saying opposites in Indonesian and English: big/besar, small/kecil.', 'Coba sebut lawan kata dalam bahasa Indonesia dan Inggris: besar/big, kecil/small.'),
  ],
  // ---------------- Feelings ----------------
  'feel-1': [
    m('🪞', 'Make faces in a mirror: happy, sad, surprised. Can a friend guess the feeling?', 'Buat ekspresi di depan cermin: senang, sedih, terkejut. Bisakah temanmu menebak perasaannya?'),
    m('🐶', 'Animals show feelings too: a dog wags its tail when it is happy.', 'Hewan juga menunjukkan perasaan: anjing mengibaskan ekor saat senang.'),
    m('🌡️', 'Feelings can be big or small, like being a little sad or very sad.', 'Perasaan bisa besar atau kecil, seperti sedikit sedih atau sangat sedih.', 'faces', { mode: 'faces' }),
  ],
  'feel-2': [
    m('🌦️', 'Feelings change like the weather: a stormy feeling passes, and the sun comes back.', 'Perasaan berubah seperti cuaca: perasaan seperti badai berlalu, lalu matahari datang lagi.'),
    m('🤝', 'It helps to name your feeling out loud: "I feel worried."', 'Menyebut perasaanmu dengan keras itu membantu: "Aku merasa khawatir."'),
    m('🏃', 'Moving your body, like jumping or dancing, can help big feelings calm down.', 'Menggerakkan tubuh, seperti melompat atau menari, bisa membantu perasaan besar jadi tenang.'),
  ],
  'feel-3': [
    m('🌬️', 'Slow breathing tells your body it is safe, so you feel calmer.', 'Bernapas pelan memberi tahu tubuhmu bahwa kamu aman, jadi kamu merasa lebih tenang.', 'faces', { mode: 'breathe' }),
    m('🧡', 'Kind words are free, and they can make someone’s whole day better.', 'Kata-kata baik itu gratis, dan bisa membuat hari seseorang jadi lebih baik.'),
    m('👂', 'Listening is a kind of helping too. Sometimes friends just need you to listen.', 'Mendengarkan juga cara menolong. Kadang teman hanya butuh didengarkan.'),
  ],
  // ---------------- Space ----------------
  'space-1': [
    m('☀️', 'The Sun is so big that about a million Earths could fit inside it.', 'Matahari sangat besar, sekitar satu juta Bumi bisa masuk ke dalamnya.'),
    m('🌙', 'The Moon looks like it changes shape, but we just see different parts lit by the Sun.', 'Bulan terlihat berubah bentuk, padahal kita hanya melihat bagian berbeda yang disinari Matahari.'),
    m('✨', 'Some stars you see at night are so far away that their light left them long before you were born!', 'Beberapa bintang yang kamu lihat di malam hari sangat jauh, cahayanya berangkat jauh sebelum kamu lahir!'),
  ],
  'space-2': [
    m('🪐', 'A trick to remember the planets: "My Very Easy Method Just Speeds Up Naming".', 'Trik mengingat planet (Inggris): "My Very Easy Method Just Speeds Up Naming".'),
    m('🌍', 'Earth is the only planet we know with liquid water on its surface and living things.', 'Bumi adalah satu-satunya planet yang kita tahu punya air di permukaan dan makhluk hidup.', 'planets'),
    m('💨', 'Neptune has the fastest winds in the whole solar system.', 'Neptunus punya angin tercepat di seluruh tata surya.'),
  ],
  'space-3': [
    m('👨‍🚀', 'The first person to walk on the Moon was Neil Armstrong, in 1969.', 'Orang pertama yang berjalan di Bulan adalah Neil Armstrong, pada tahun 1969.'),
    m('🛰️', 'The International Space Station goes around the Earth about every 90 minutes!', 'Stasiun Luar Angkasa Internasional mengelilingi Bumi kira-kira setiap 90 menit!'),
    m('🍽️', 'Astronauts eat from pouches, because crumbs would float everywhere!', 'Astronot makan dari kantong, karena remah-remah akan melayang ke mana-mana!'),
  ],
};
