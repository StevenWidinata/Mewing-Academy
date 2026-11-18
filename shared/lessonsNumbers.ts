import type { LessonCheck, LessonMistake, LessonModule, LessonStep } from './lessons';
import type { ColorId, SpriteGroup, Text } from './types';

/** Lesson roads for the number topics: counting, math, skip counting, time, patterns, shapes. */

const T = (en: string, id: string): Text => ({ en, id });
const g = (sprite: SpriteGroup['sprite'], color: ColorId, count: number): SpriteGroup => ({ sprite, color, count });
const step = (text: Text, more: Omit<LessonStep, 'text'> = {}): LessonStep => ({ text, ...more });
const oops = (wrong: Text, right: Text, why: Text): LessonMistake => ({ wrong, right, why });
const check = (prompt: Text, choices: Text[], answer: number): LessonCheck => ({ prompt, choices, answer });
const n = (s: string) => T(s, s);

export type NumberTopic = 'counting' | 'math' | 'skipcount' | 'time' | 'patterns' | 'shapes';

export const NUMBER_LESSONS: Record<NumberTopic, LessonModule[]> = {
  counting: [
    {
      id: 'count-1',
      tryIt: { figure: 'tenframe', config: { target: 5 }, prompt: T('Put 5 counters in the frame. Touch each box once!', 'Taruh 5 penghitung di bingkai. Sentuh tiap kotak sekali!') },
      title: T('1. Count to 5', '1. Berhitung sampai 5'),
      goal: T('Touch and say each number.', 'Sentuh dan sebut tiap angka.'),
      steps: [
        step(T('Point at each apple and say a number: one, two, three.', 'Tunjuk tiap apel dan sebut angkanya: satu, dua, tiga.'), { visual: [g('apple', 'red', 3)] }),
        step(T('Touch each apple only ONCE. Do not skip one, and do not count one twice!', 'Sentuh tiap apel SATU kali saja. Jangan ada yang terlewat atau dihitung dua kali!'), {
          visual: [g('apple', 'red', 4)],
          example: T('1, 2, 3, 4', '1, 2, 3, 4'),
        }),
        step(T('The LAST number you say tells how many there are.', 'Angka TERAKHIR yang kamu sebut adalah jumlahnya.'), {
          visual: [g('apple', 'red', 5)],
          example: T('There are 5 apples.', 'Ada 5 apel.'),
        }),
      ],
      mistakes: [
        oops(T('Counting the same apple two times.', 'Menghitung apel yang sama dua kali.'), T('Touch each thing once, then move on.', 'Sentuh tiap benda sekali, lalu pindah.'), T('If you count one twice, your number gets too big!', 'Kalau dihitung dua kali, angkanya jadi terlalu besar!')),
      ],
      check: check(T('You count the stars: 1, 2, 3, 4. How many stars are there?', 'Kamu menghitung bintang: 1, 2, 3, 4. Ada berapa bintang?'), [n('3'), n('4'), n('5')], 1),
    },
    {
      id: 'count-2',
      tryIt: { figure: 'tenframe', config: { target: 7 }, prompt: T('Make 7. Is 7 more or fewer than a full row of 5?', 'Buat 7. Apakah 7 lebih banyak atau lebih sedikit dari satu baris penuh berisi 5?') },
      title: T('2. More or Fewer', '2. Lebih Banyak atau Lebih Sedikit'),
      goal: T('Compare two groups.', 'Membandingkan dua kelompok.'),
      steps: [
        step(T('MORE means a bigger group. FEWER means a smaller group.', 'LEBIH BANYAK artinya kelompok yang lebih besar. LEBIH SEDIKIT artinya kelompok yang lebih kecil.'), {
          visual: [g('star', 'blue', 2), g('star', 'orange', 4)],
          example: T('4 is more than 2.', '4 lebih banyak dari 2.'),
        }),
        step(T('Count both groups, then compare the numbers. The bigger number has more.', 'Hitung kedua kelompok, lalu bandingkan angkanya. Angka yang lebih besar berarti lebih banyak.'), {
          visual: [g('heart', 'red', 3), g('heart', 'purple', 5)],
          example: T('5 is more than 3. 3 is fewer than 5.', '5 lebih banyak dari 3. 3 lebih sedikit dari 5.'),
        }),
        step(T('If both groups have the same number, they are EQUAL.', 'Kalau jumlah kedua kelompok sama, berarti SAMA BANYAK.'), {
          visual: [g('ball', 'green', 3), g('ball', 'blue', 3)],
          example: T('3 and 3 are equal.', '3 dan 3 sama banyak.'),
        }),
      ],
      mistakes: [
        oops(T('Big pictures mean more.', 'Gambar yang besar berarti lebih banyak.'), T('Count them! More means a bigger NUMBER.', 'Hitung dulu! Lebih banyak artinya ANGKANYA lebih besar.'), T('3 big balls are still fewer than 5 tiny balls.', '3 bola besar tetap lebih sedikit dari 5 bola kecil.')),
      ],
      check: check(T('Which is more: 6 or 4?', 'Mana yang lebih banyak: 6 atau 4?'), [n('6'), n('4')], 0),
    },
    {
      id: 'count-3',
      tryIt: { figure: 'hopper', config: { step: 1, max: 10 }, prompt: T('Hop one number at a time and say each number out loud.', 'Loncat satu angka setiap kali dan ucapkan angkanya keras-keras.') },
      title: T('3. What Comes Next', '3. Angka Berikutnya'),
      goal: T('Know the number order.', 'Tahu urutan angka.'),
      steps: [
        step(T('Numbers go in order: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10.', 'Angka berurutan: 1, 2, 3, 4, 5, 6, 7, 8, 9, 10.'), { emoji: '🔢' }),
        step(T('To find what comes AFTER, count up one more.', 'Untuk mencari angka SETELAH, hitung naik satu.'), {
          emoji: '➡️',
          example: T('After 6 comes 7.', 'Setelah 6 adalah 7.'),
        }),
        step(T('To find what comes BEFORE, count back one.', 'Untuk mencari angka SEBELUM, hitung mundur satu.'), {
          emoji: '⬅️',
          example: T('Before 9 comes 8.', 'Sebelum 9 adalah 8.'),
        }),
      ],
      mistakes: [
        oops(T('After 9 comes 1.', 'Setelah 9 adalah 1.'), T('After 9 comes 10!', 'Setelah 9 adalah 10!'), T('Numbers keep growing: 9, 10, 11, 12...', 'Angka terus bertambah: 9, 10, 11, 12...')),
      ],
      check: check(T('What comes after 7?', 'Angka apa setelah 7?'), [n('6'), n('8'), n('9')], 1),
    },
  ],

  math: [
    {
      id: 'math-1',
      tryIt: { figure: 'apples', config: { op: 'plus', a: 2, b: 1 }, prompt: T('Change the two groups of apples and count them all together.', 'Ubah dua kelompok apel dan hitung semuanya bersama.') },
      title: T('1. Adding (+)', '1. Menambah (+)'),
      goal: T('Put groups together.', 'Menggabungkan kelompok.'),
      steps: [
        step(T('Adding means putting groups together. 2 balls and 1 more ball...', 'Menambah artinya menggabungkan kelompok. 2 bola dan 1 bola lagi...'), {
          visual: [g('ball', 'blue', 2), g('ball', 'green', 1)],
          example: T('2 + 1 = 3', '2 + 1 = 3'),
        }),
        step(T('Count them all together to find the answer.', 'Hitung semuanya bersama untuk menemukan jawabannya.'), {
          visual: [g('apple', 'red', 3), g('apple', 'green', 2)],
          example: T('3 + 2 = 5', '3 + 2 = 5'),
        }),
        step(T('The plus sign (+) means "add". The equals sign (=) means "makes".', 'Tanda tambah (+) artinya "tambah". Tanda sama dengan (=) artinya "hasilnya".'), {
          emoji: '➕',
          narration: T('The plus sign means add. The equals sign means makes.', 'Tanda tambah artinya tambah. Tanda sama dengan artinya hasilnya.'),
        }),
      ],
      mistakes: [
        oops(T('2 + 2 = 22', '2 + 2 = 22'), T('2 + 2 = 4', '2 + 2 = 4'), T('Adding means counting all of them, not writing the numbers side by side.', 'Menambah artinya menghitung semuanya, bukan menulis angkanya berdampingan.')),
      ],
      check: check(T('3 + 1 = ?', '3 + 1 = ?'), [n('2'), n('4'), n('31')], 1),
    },
    {
      id: 'math-2',
      tryIt: { figure: 'apples', config: { op: 'minus', start: 5 }, prompt: T('Eat 2 apples by tapping them. How many are left?', 'Makan 2 apel dengan mengetuknya. Sisa berapa?') },
      title: T('2. Taking Away (-)', '2. Mengurang (-)'),
      goal: T('Take some away and count what is left.', 'Ambil sebagian dan hitung sisanya.'),
      steps: [
        step(T('Start with 5 balls. Take away 2. Count what is left.', 'Mulai dengan 5 bola. Ambil 2. Hitung sisanya.'), {
          visual: [g('ball', 'orange', 5)],
          example: T('5 − 2 = 3', '5 − 2 = 3'),
          narration: T('Start with 5 balls. Take away 2. Count what is left: 5 minus 2 is 3.', 'Mulai dengan 5 bola. Ambil 2. Hitung sisanya: 5 kurang 2 sama dengan 3.'),
        }),
        step(T('Taking away makes the number SMALLER.', 'Mengurang membuat angkanya jadi LEBIH KECIL.'), {
          emoji: '➖',
          example: T('4 − 1 = 3', '4 − 1 = 3'),
        }),
        step(T('Take away 0, and nothing changes!', 'Kurangi 0, dan tidak ada yang berubah!'), {
          emoji: '🍪',
          example: T('6 − 0 = 6', '6 − 0 = 6'),
        }),
      ],
      mistakes: [
        oops(T('5 − 2 = 7', '5 − 2 = 7'), T('5 − 2 = 3', '5 − 2 = 3'), T('Minus takes away, so the answer gets smaller, not bigger.', 'Kurang berarti mengambil, jadi hasilnya lebih kecil, bukan lebih besar.')),
      ],
      check: check(T('You have 4 cookies and eat 1. How many are left?', 'Kamu punya 4 kue dan makan 1. Sisa berapa?'), [n('5'), n('3'), n('1')], 1),
    },
    {
      id: 'math-3',
      tryIt: { figure: 'apples', config: { op: 'plus', a: 3, b: 2 }, prompt: T('Story time: 3 apples, then 2 more. Show it with the apples!', 'Cerita: 3 apel, lalu dapat 2 lagi. Tunjukkan dengan apel!') },
      title: T('3. Story Problems', '3. Soal Cerita'),
      goal: T('Find the maths in a story.', 'Menemukan hitungan dalam cerita.'),
      steps: [
        step(T('"You have 3 apples and get 2 more." Getting MORE means add.', '"Kamu punya 3 apel dan dapat 2 lagi." Dapat LAGI artinya tambah.'), {
          visual: [g('apple', 'red', 3), g('apple', 'red', 2)],
          example: T('3 + 2 = 5 apples', '3 + 2 = 5 apel'),
        }),
        step(T('"5 birds sit on a tree. 1 flies away." Going AWAY means take away.', '"5 burung hinggap di pohon. 1 terbang pergi." PERGI artinya kurang.'), {
          emoji: '🐦',
          example: T('5 − 1 = 4 birds', '5 − 1 = 4 burung'),
        }),
        step(T('Clue words! "more", "together", "in all" mean add. "left", "away", "ate" mean take away.', 'Kata petunjuk! "lagi", "semuanya", "jumlah" artinya tambah. "sisa", "pergi", "dimakan" artinya kurang.'), { emoji: '🔎' }),
      ],
      mistakes: [
        oops(T('Seeing "how many are left?" and adding.', 'Melihat "sisa berapa?" lalu menambah.'), T('"Left" means take away.', '"Sisa" artinya dikurangi.'), T('Some things went away, so there are fewer now.', 'Ada yang pergi, jadi sekarang lebih sedikit.')),
      ],
      check: check(T('2 cats are playing. 2 more cats come. How many cats now?', '2 kucing sedang bermain. Datang 2 kucing lagi. Sekarang ada berapa kucing?'), [n('2'), n('4'), n('0')], 1),
    },
  ],

  skipcount: [
    {
      id: 'skip-1',
      tryIt: { figure: 'hopper', config: { step: 10, max: 100 }, prompt: T('Help the frog hop by 10s all the way to 100!', 'Bantu katak meloncat 10-10 sampai ke 100!') },
      title: T('1. Count by 10s', '1. Hitung Loncat 10'),
      goal: T('Big jumps!', 'Loncatan besar!'),
      steps: [
        step(T('10, 20, 30, 40, 50... Each jump adds 10.', '10, 20, 30, 40, 50... Setiap loncatan tambah 10.'), {
          emoji: '🔟',
          example: T('After 40 comes 50.', 'Setelah 40 adalah 50.'),
        }),
        step(T('Each friend has 10 fingers. 3 friends: 10, 20, 30 fingers!', 'Setiap teman punya 10 jari. 3 teman: 10, 20, 30 jari!'), { emoji: '🙌🙌🙌' }),
        step(T('Counting by 10s reaches 100 in only 10 jumps!', 'Hitung loncat 10 sampai ke 100 hanya dengan 10 loncatan!'), { emoji: '💯' }),
      ],
      mistakes: [
        oops(T('10, 20, 30, 31', '10, 20, 30, 31'), T('10, 20, 30, 40', '10, 20, 30, 40'), T('Keep jumping by 10 every time.', 'Terus loncat 10 setiap kali.')),
      ],
      check: check(T('10, 20, 30, ... what comes next?', '10, 20, 30, ... berikutnya?'), [n('31'), n('40'), n('50')], 1),
    },
    {
      id: 'skip-2',
      tryIt: { figure: 'hopper', config: { step: 5, max: 50 }, prompt: T('Hop by 5s, like counting fingers on hands.', 'Loncat 5-5, seperti menghitung jari tangan.') },
      title: T('2. Count by 5s', '2. Hitung Loncat 5'),
      goal: T('Like the fingers on a hand.', 'Seperti jari di satu tangan.'),
      steps: [
        step(T('5, 10, 15, 20, 25, 30... Each jump adds 5.', '5, 10, 15, 20, 25, 30... Setiap loncatan tambah 5.'), { emoji: '🖐️' }),
        step(T('Each hand has 5 fingers. 2 hands: 5, 10 fingers!', 'Satu tangan punya 5 jari. 2 tangan: 5, 10 jari!'), {
          emoji: '🖐️🖐️',
          example: T('5, 10', '5, 10'),
        }),
        step(T('When you count by 5s, the numbers end in 5 or 0.', 'Saat hitung loncat 5, angkanya selalu berakhir dengan 5 atau 0.'), {
          emoji: '✨',
          example: T('15, 20, 25, 30', '15, 20, 25, 30'),
        }),
      ],
      mistakes: [
        oops(T('5, 10, 15, 16', '5, 10, 15, 16'), T('5, 10, 15, 20', '5, 10, 15, 20'), T('Every jump is 5, not 1.', 'Setiap loncatan 5, bukan 1.')),
      ],
      check: check(T('5, 10, 15, ... what comes next?', '5, 10, 15, ... berikutnya?'), [n('20'), n('16'), n('25')], 0),
    },
    {
      id: 'skip-3',
      tryIt: { figure: 'hopper', config: { step: 2, max: 20 }, prompt: T('Hop by 2s, like counting pairs of shoes.', 'Loncat 2-2, seperti menghitung pasang sepatu.') },
      title: T('3. Count by 2s', '3. Hitung Loncat 2'),
      goal: T('Pairs of things.', 'Benda berpasangan.'),
      steps: [
        step(T('2, 4, 6, 8, 10... Each jump adds 2.', '2, 4, 6, 8, 10... Setiap loncatan tambah 2.'), {
          visual: [g('ball', 'blue', 2), g('ball', 'red', 2), g('ball', 'green', 2)],
          example: T('2, 4, 6', '2, 4, 6'),
        }),
        step(T('Lots of things come in pairs of 2: eyes, ears, shoes and socks!', 'Banyak benda berpasangan 2: mata, telinga, sepatu, dan kaus kaki!'), { emoji: '👟👟' }),
        step(T('Counting by 2s hops over every other number, like a frog jumping over rocks!', 'Hitung loncat 2 melompati satu angka, seperti katak melompati batu!'), {
          emoji: '🐸',
          example: T('1, (2), 3, (4), 5, (6)', '1, (2), 3, (4), 5, (6)'),
          narration: T('Counting by 2s hops over every other number, like a frog jumping over rocks! 2, 4, 6.', 'Hitung loncat 2 melompati satu angka, seperti katak melompati batu! 2, 4, 6.'),
        }),
      ],
      mistakes: [
        oops(T('2, 4, 6, 7', '2, 4, 6, 7'), T('2, 4, 6, 8', '2, 4, 6, 8'), T('Jump 2 every time.', 'Loncat 2 setiap kali.')),
      ],
      check: check(T('How many shoes are in 3 pairs?', 'Ada berapa sepatu dalam 3 pasang?'), [n('3'), n('6'), n('5')], 1),
    },
  ],

  time: [
    {
      id: 'time-1',
      tryIt: { figure: 'clock', config: { hour: 3, half: 0 }, prompt: T('Move the hands to show 3 o\'clock.', 'Gerakkan jarumnya untuk menunjukkan jam 3.') },
      title: T("1. O'clock", '1. Jam Tepat'),
      goal: T('Read the short hand.', 'Membaca jarum pendek.'),
      steps: [
        step(T('A clock has a SHORT hand and a LONG hand.', 'Jam punya jarum PENDEK dan jarum PANJANG.'), { emoji: '🕰️' }),
        step(T("The short hand shows the hour. When the long hand points straight up at 12, we say o'clock.", 'Jarum pendek menunjukkan jam. Saat jarum panjang lurus ke atas di angka 12, itu jam tepat.'), {
          emoji: '🕒',
          example: T("It is 3 o'clock.", 'Sekarang jam 3.'),
        }),
        step(T('Short hand on 9, long hand on 12...', 'Jarum pendek di 9, jarum panjang di 12...'), {
          emoji: '🕘',
          example: T("It is 9 o'clock!", 'Sekarang jam 9!'),
        }),
      ],
      mistakes: [
        oops(T('Reading the LONG hand as the hour.', 'Membaca jarum PANJANG sebagai jam.'), T('The SHORT hand tells the hour.', 'Jarum PENDEK menunjukkan jam.'), T('The long hand counts the minutes.', 'Jarum panjang menghitung menit.')),
      ],
      check: check(
        T('The short hand points at 7 and the long hand points at 12. What time is it?', 'Jarum pendek menunjuk 7 dan jarum panjang menunjuk 12. Jam berapa?'),
        [T("12 o'clock", 'Jam 12'), T("7 o'clock", 'Jam 7'), T('Half past 7', 'Jam setengah 8')],
        1,
      ),
    },
    {
      id: 'time-2',
      tryIt: { figure: 'clock', config: { hour: 6, half: 1 }, prompt: T('Move the hands to show half past 6.', 'Gerakkan jarumnya untuk menunjukkan jam setengah 7.') },
      title: T('2. Half Past', '2. Setengah'),
      goal: T('The long hand points at 6.', 'Jarum panjang menunjuk angka 6.'),
      steps: [
        step(T('When the long hand points DOWN at 6, it is half past.', 'Saat jarum panjang menunjuk ke BAWAH di angka 6, itu setengah.'), { emoji: '🕞' }),
        step(T('Half past means 30 minutes after the hour. The short hand sits between two numbers.', 'Setengah artinya kurang 30 menit menuju jam berikutnya. Jarum pendek ada di antara dua angka.'), {
          emoji: '🕡',
          example: T('Half past 6 (6:30)', 'Jam setengah 7 (6:30)'),
          narration: T('Half past means 30 minutes after the hour. The short hand sits between two numbers. Half past 6.', 'Setengah artinya kurang 30 menit menuju jam berikutnya. Jarum pendek ada di antara dua angka. Jam setengah 7.'),
        }),
        step(T('Short hand between 9 and 10, long hand on 6...', 'Jarum pendek di antara 9 dan 10, jarum panjang di 6...'), {
          emoji: '🕤',
          example: T('Half past 9 (9:30)', 'Jam setengah 10 (9:30)'),
        }),
      ],
      mistakes: [
        oops(T('Half past 3 is 4:30.', 'Jam setengah 4 itu 4:30.'), T('Half past 3 is 3:30.', 'Jam setengah 4 itu 3:30.'), T('Half past means 30 minutes AFTER 3 o’clock.', 'Setengah 4 artinya setengah jalan menuju jam 4.')),
      ],
      check: check(
        T('The long hand points at 6, and the short hand is between 2 and 3. What time is it?', 'Jarum panjang menunjuk 6, dan jarum pendek di antara 2 dan 3. Jam berapa?'),
        [T('Half past 2', 'Jam setengah 3'), T('Half past 3', 'Jam setengah 4'), T("6 o'clock", 'Jam 6')],
        0,
      ),
    },
    {
      id: 'time-3',
      tryIt: { figure: 'week', config: {}, prompt: T('Tap through the week. What comes after Sunday?', 'Ketuk untuk melewati seminggu. Apa yang datang setelah Minggu?') },
      title: T('3. Days of the Week', '3. Nama Hari'),
      goal: T('7 days, in order.', '7 hari, berurutan.'),
      steps: [
        step(T('There are 7 days in a week.', 'Ada 7 hari dalam seminggu.'), { emoji: '📅' }),
        step(T('Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday. Then it starts again!', 'Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu. Lalu mulai lagi!'), { emoji: '🔁' }),
        step(T('In many places, Saturday and Sunday are the weekend.', 'Di banyak tempat, Sabtu dan Minggu adalah akhir pekan.'), {
          emoji: '🎉',
          example: T('After Friday comes Saturday.', 'Setelah Jumat adalah Sabtu.'),
        }),
      ],
      mistakes: [
        oops(T('A week has 5 days.', 'Seminggu ada 5 hari.'), T('A week has 7 days.', 'Seminggu ada 7 hari.'), T('5 school days plus 2 weekend days make 7.', '5 hari sekolah ditambah 2 hari akhir pekan jadi 7.')),
      ],
      check: check(T('What day comes after Tuesday?', 'Hari apa setelah Selasa?'), [T('Monday', 'Senin'), T('Wednesday', 'Rabu'), T('Friday', 'Jumat')], 1),
    },
  ],

  patterns: [
    {
      id: 'pattern-1',
      tryIt: { figure: 'pattern', config: { kind: 'ab' }, prompt: T('Finish the color pattern.', 'Selesaikan pola warnanya.') },
      title: T('1. Repeating Colors', '1. Warna Berulang'),
      goal: T('Find what repeats.', 'Temukan yang berulang.'),
      steps: [
        step(T('Red, blue, red, blue... The colors take turns!', 'Merah, biru, merah, biru... Warnanya bergantian!'), {
          visual: [g('ball', 'red', 1), g('ball', 'blue', 1), g('ball', 'red', 1), g('ball', 'blue', 1)],
          example: T('Next is red.', 'Selanjutnya merah.'),
        }),
        step(T('Say the pattern out loud: red, blue, red, blue. Your voice helps you hear it!', 'Ucapkan polanya keras-keras: merah, biru, merah, biru. Suaramu membantu mendengarnya!'), { emoji: '🗣️' }),
        step(T('The part that repeats is the pattern’s CORE. Here the core is: red, blue.', 'Bagian yang berulang disebut INTI pola. Di sini intinya: merah, biru.'), {
          visual: [g('ball', 'red', 1), g('ball', 'blue', 1)],
        }),
      ],
      mistakes: [
        oops(T('Guessing a brand-new color for what comes next.', 'Menebak warna baru untuk yang berikutnya.'), T('Copy the core again: red, blue, red, blue.', 'Ulangi intinya: merah, biru, merah, biru.'), T('A pattern repeats; it does not surprise you.', 'Pola selalu berulang; tidak ada kejutan.')),
      ],
      check: check(T('Red, yellow, red, yellow, ... what comes next?', 'Merah, kuning, merah, kuning, ... berikutnya?'), [T('Red', 'Merah'), T('Yellow', 'Kuning'), T('Blue', 'Biru')], 0),
    },
    {
      id: 'pattern-2',
      tryIt: { figure: 'pattern', config: { kind: 'abc' }, prompt: T('This pattern has 3 parts. Finish it!', 'Pola ini punya 3 bagian. Selesaikan!') },
      title: T('2. Shape Patterns', '2. Pola Bentuk'),
      goal: T('Shapes can repeat too.', 'Bentuk juga bisa berulang.'),
      steps: [
        step(T('Square, triangle, square, triangle... What comes next?', 'Persegi, segitiga, persegi, segitiga... Apa selanjutnya?'), {
          visual: [g('square', 'green', 1), g('triangle', 'green', 1), g('square', 'green', 1), g('triangle', 'green', 1)],
          example: T('A square!', 'Persegi!'),
        }),
        step(T('A core can have 3 parts: circle, square, triangle, circle, square, triangle.', 'Inti pola bisa punya 3 bagian: lingkaran, persegi, segitiga, lingkaran, persegi, segitiga.'), {
          visual: [g('ball', 'blue', 1), g('square', 'blue', 1), g('triangle', 'blue', 1), g('ball', 'blue', 1), g('square', 'blue', 1), g('triangle', 'blue', 1)],
        }),
        step(T('Some patterns repeat one thing twice: star, star, heart, star, star, heart.', 'Ada pola yang mengulang satu benda dua kali: bintang, bintang, hati, bintang, bintang, hati.'), {
          visual: [g('star', 'yellow', 2), g('heart', 'red', 1), g('star', 'yellow', 2), g('heart', 'red', 1)],
          example: T('Next: star!', 'Berikutnya: bintang!'),
        }),
      ],
      mistakes: [
        oops(T('Star, star, heart, then heart.', 'Bintang, bintang, hati, lalu hati.'), T('Star, star, heart, star, star, heart.', 'Bintang, bintang, hati, bintang, bintang, hati.'), T('Count the stars before each heart: always 2.', 'Hitung bintang sebelum setiap hati: selalu 2.')),
      ],
      check: check(T('Square, triangle, square, triangle, ... what comes next?', 'Persegi, segitiga, persegi, segitiga, ... berikutnya?'), [T('Triangle', 'Segitiga'), T('Square', 'Persegi'), T('Star', 'Bintang')], 1),
    },
    {
      id: 'pattern-3',
      tryIt: { figure: 'pattern', config: { kind: 'aab' }, prompt: T('Star, star, heart... finish the pattern!', 'Bintang, bintang, hati... selesaikan polanya!') },
      title: T('3. Number Patterns', '3. Pola Angka'),
      goal: T('Find the jump.', 'Temukan loncatannya.'),
      steps: [
        step(T('2, 4, 6, 8... each number jumps up by 2.', '2, 4, 6, 8... setiap angka naik 2.'), {
          emoji: '🔢',
          example: T('Next is 10.', 'Selanjutnya 10.'),
        }),
        step(T('Find the jump: what is added each time? 5, 10, 15 adds 5 each time.', 'Temukan loncatannya: berapa yang ditambah setiap kali? 5, 10, 15 tambah 5 setiap kali.'), { emoji: '🦘' }),
        step(T('Patterns can go down too: 10, 8, 6, 4...', 'Pola juga bisa turun: 10, 8, 6, 4...'), {
          emoji: '⬇️',
          example: T('Next is 2.', 'Selanjutnya 2.'),
        }),
      ],
      mistakes: [
        oops(T('1, 3, 5, ... next is 6.', '1, 3, 5, ... berikutnya 6.'), T('1, 3, 5, 7', '1, 3, 5, 7'), T('The jump is 2 every time.', 'Loncatannya selalu 2.')),
      ],
      check: check(T('3, 6, 9, ... what comes next?', '3, 6, 9, ... berikutnya?'), [n('10'), n('12'), n('11')], 1),
    },
  ],

  shapes: [
    {
      id: 'shape-1',
      tryIt: { figure: 'corners', config: { shape: 'triangle' }, prompt: T('Tap every corner of the triangle, then try the other shapes.', 'Ketuk setiap sudut segitiga, lalu coba bentuk lainnya.') },
      title: T('1. Basic Shapes', '1. Bentuk Dasar'),
      goal: T('Know the circle, square and triangle.', 'Mengenal lingkaran, persegi, dan segitiga.'),
      steps: [
        step(T('A circle is round, with no corners.', 'Lingkaran itu bulat, tanpa sudut.'), { visual: [g('ball', 'blue', 1)] }),
        step(T('A square has 4 sides that are all the same length.', 'Persegi punya 4 sisi yang sama panjang.'), { visual: [g('square', 'red', 1)] }),
        step(T('A triangle has 3 sides.', 'Segitiga punya 3 sisi.'), { visual: [g('triangle', 'green', 1)] }),
      ],
      mistakes: [
        oops(T('A circle has 1 corner.', 'Lingkaran punya 1 sudut.'), T('A circle has no corners at all.', 'Lingkaran tidak punya sudut sama sekali.'), T('It is round all the way around.', 'Bentuknya bulat di sekelilingnya.')),
      ],
      check: check(T('Which shape has 3 sides?', 'Bentuk apa yang punya 3 sisi?'), [T('Circle', 'Lingkaran'), T('Square', 'Persegi'), T('Triangle', 'Segitiga')], 2),
    },
    {
      id: 'shape-2',
      tryIt: { figure: 'corners', config: { shape: 'square' }, prompt: T('Count the corners of a square and a rectangle.', 'Hitung sudut persegi dan persegi panjang.') },
      title: T('2. Counting Corners', '2. Menghitung Sudut'),
      goal: T('Corners are the pointy bits.', 'Sudut adalah bagian yang lancip.'),
      steps: [
        step(T('A corner is the pointy place where two sides meet.', 'Sudut adalah bagian lancip tempat dua sisi bertemu.'), { emoji: '📐' }),
        step(T('A triangle has 3 corners. A square has 4.', 'Segitiga punya 3 sudut. Persegi punya 4.'), {
          visual: [g('triangle', 'purple', 1), g('square', 'orange', 1)],
        }),
        step(T('A rectangle has 4 corners too, but 2 long sides and 2 short sides.', 'Persegi panjang juga punya 4 sudut, tapi 2 sisi panjang dan 2 sisi pendek.'), { emoji: '🚪' }),
      ],
      mistakes: [
        oops(T('A rectangle is a square.', 'Persegi panjang itu persegi.'), T('A square has 4 EQUAL sides; a rectangle has 2 long and 2 short sides.', 'Persegi punya 4 sisi SAMA panjang; persegi panjang punya 2 sisi panjang dan 2 pendek.'), T('Both have 4 corners, but their sides are different.', 'Keduanya punya 4 sudut, tapi sisinya berbeda.')),
      ],
      check: check(T('How many corners does a square have?', 'Persegi punya berapa sudut?'), [n('3'), n('4'), n('0')], 1),
    },
    {
      id: 'shape-3',
      tryIt: { figure: 'corners', config: { shape: 'hexagon' }, prompt: T('Bees love hexagons! How many corners does one have?', 'Lebah suka segi enam! Ada berapa sudutnya?') },
      title: T('3. Shapes Around Us', '3. Bentuk di Sekitar Kita'),
      goal: T('Find shapes in real life.', 'Menemukan bentuk di sekitar kita.'),
      steps: [
        step(T('A wheel is a circle.', 'Roda berbentuk lingkaran.'), { emoji: '🛞' }),
        step(T('A window can be a square, and a door is a rectangle.', 'Jendela bisa berbentuk persegi, dan pintu berbentuk persegi panjang.'), { emoji: '🪟' }),
        step(T('A slice of pizza and a roof look like triangles!', 'Sepotong pizza dan atap rumah mirip segitiga!'), { emoji: '🍕' }),
      ],
      mistakes: [
        oops(T('A ball is a circle.', 'Bola itu lingkaran.'), T('A ball is a SPHERE. Its outline looks like a circle.', 'Bola itu BOLA (bangun ruang). Garis tepinya terlihat seperti lingkaran.'), T('A circle is flat like paper; a ball is round in every direction.', 'Lingkaran itu datar seperti kertas; bola bulat ke segala arah.')),
      ],
      check: check(T('What shape is a slice of pizza?', 'Sepotong pizza berbentuk apa?'), [T('Triangle', 'Segitiga'), T('Circle', 'Lingkaran'), T('Square', 'Persegi')], 0),
    },
  ],
};
