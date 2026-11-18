import type { LessonCheck, LessonMistake, LessonModule, LessonStep } from './lessons';
import type { ColorId, SpriteGroup, Text } from './types';

/** Lesson roads for the world topics. */

const T = (en: string, id: string): Text => ({ en, id });
const g = (sprite: SpriteGroup['sprite'], color: ColorId, count: number): SpriteGroup => ({ sprite, color, count });
const step = (text: Text, more: Omit<LessonStep, 'text'> = {}): LessonStep => ({ text, ...more });
const oops = (wrong: Text, right: Text, why: Text): LessonMistake => ({ wrong, right, why });
const check = (prompt: Text, choices: Text[], answer: number): LessonCheck => ({ prompt, choices, answer });
const n = (s: string) => T(s, s);

export type WorldTopic = 'colors' | 'animals' | 'letters' | 'food' | 'body' | 'weather' | 'transport' | 'opposites' | 'feelings' | 'space';

export const WORLD_LESSONS: Record<WorldTopic, LessonModule[]> = {
  colors: [
    {
      id: 'color-1',
      title: T('1. Name the Colors', '1. Mengenal Warna'),
      goal: T('Learn 6 colors.', 'Mengenal 6 warna.'),
      steps: [
        step(T('Meet 6 color friends: red, orange, yellow, green, blue and purple.', 'Kenalan dengan 6 warna: merah, oranye, kuning, hijau, biru, dan ungu.'), {
          visual: [g('ball', 'red', 1), g('ball', 'orange', 1), g('ball', 'yellow', 1), g('ball', 'green', 1), g('ball', 'blue', 1), g('ball', 'purple', 1)],
        }),
        step(T('Red like a strawberry, yellow like a banana, blue like the sea.', 'Merah seperti stroberi, kuning seperti pisang, biru seperti laut.'), { emoji: '🍓🍌🌊' }),
        step(T('Colors can be light or dark: pink is a light red, and navy is a dark blue.', 'Warna bisa muda atau tua: merah muda itu merah yang terang, dan biru dongker itu biru yang gelap.'), { emoji: '🎨' }),
      ],
      mistakes: [
        oops(T('Purple and blue are the same color.', 'Ungu dan biru itu warna yang sama.'), T('Purple is blue with some red mixed in.', 'Ungu adalah biru yang dicampur sedikit merah.'), T('The red inside makes purple look warmer than blue.', 'Merah di dalamnya membuat ungu terlihat lebih hangat dari biru.')),
      ],
      check: check(T('What color is a banana?', 'Pisang berwarna apa?'), [T('Red', 'Merah'), T('Yellow', 'Kuning'), T('Blue', 'Biru')], 1),
    },
    {
      id: 'color-2',
      title: T('2. Colors Around Us', '2. Warna di Sekitar Kita'),
      goal: T('Match colors to things.', 'Mencocokkan warna dengan benda.'),
      steps: [
        step(T('Grass is green, the sun is yellow, and the sky is blue.', 'Rumput hijau, matahari kuning, dan langit biru.'), { emoji: '🌳☀️' }),
        step(T('Fruits have colors too: red apples, orange oranges and purple grapes.', 'Buah juga berwarna: apel merah, jeruk oranye, dan anggur ungu.'), { emoji: '🍎🍊🍇' }),
        step(T('Play "I spy": find something red in your room!', 'Main tebak-tebakan: temukan sesuatu yang merah di kamarmu!'), { emoji: '🔍' }),
      ],
      mistakes: [
        oops(T('Every thing has only one color.', 'Setiap benda hanya punya satu warna.'), T('Some things have many colors, like a rainbow or a zebra.', 'Ada benda yang punya banyak warna, seperti pelangi atau zebra.'), T('Look closely: lots of things have more than one color!', 'Lihat baik-baik: banyak benda punya lebih dari satu warna!')),
      ],
      check: check(T('What color is grass?', 'Rumput berwarna apa?'), [T('Green', 'Hijau'), T('Pink', 'Merah muda'), T('Black', 'Hitam')], 0),
    },
    {
      id: 'color-3',
      title: T('3. Mixing Colors', '3. Mencampur Warna'),
      goal: T('Make new colors.', 'Membuat warna baru.'),
      steps: [
        step(T('Red, yellow and blue are the PRIMARY colors.', 'Merah, kuning, dan biru adalah warna DASAR.'), {
          visual: [g('ball', 'red', 1), g('ball', 'yellow', 1), g('ball', 'blue', 1)],
        }),
        step(T('Mix two of them to make a new color! Red and yellow make orange.', 'Campur dua warna dasar untuk membuat warna baru! Merah dan kuning jadi oranye.'), {
          visual: [g('ball', 'red', 1), g('ball', 'yellow', 1), g('ball', 'orange', 1)],
          example: T('Red + yellow = orange', 'Merah + kuning = oranye'),
        }),
        step(T('Blue and yellow make green. Red and blue make purple.', 'Biru dan kuning jadi hijau. Merah dan biru jadi ungu.'), {
          visual: [g('ball', 'blue', 1), g('ball', 'yellow', 1), g('ball', 'green', 1)],
          example: T('Blue + yellow = green', 'Biru + kuning = hijau'),
        }),
      ],
      mistakes: [
        oops(T('Red + yellow = green', 'Merah + kuning = hijau'), T('Red + yellow = orange', 'Merah + kuning = oranye'), T('Green comes from blue + yellow.', 'Hijau berasal dari biru + kuning.')),
      ],
      check: check(T('Blue + yellow = ?', 'Biru + kuning = ?'), [T('Green', 'Hijau'), T('Orange', 'Oranye'), T('Purple', 'Ungu')], 0),
    },
  ],

  animals: [
    {
      id: 'animal-1',
      title: T('1. Animal Sounds', '1. Suara Hewan'),
      goal: T('Match sounds to animals.', 'Mencocokkan suara dengan hewan.'),
      steps: [
        step(T('A cow says "Moo", a cat says "Meow", and a dog says "Woof".', 'Sapi bilang "Mooo", kucing bilang "Meong", dan anjing bilang "Guk guk".'), { emoji: '🐮🐱🐶' }),
        step(T('A duck says "Quack", a sheep says "Baa", and a lion says "Roar"!', 'Bebek bilang "Kwek", domba bilang "Mbeee", dan singa bilang "Aum"!'), { emoji: '🦆🐑🦁' }),
        step(T('Animals use sounds to talk: to call friends, warn about danger, or find their babies.', 'Hewan memakai suara untuk berbicara: memanggil teman, memberi tanda bahaya, atau mencari anaknya.'), { emoji: '📣' }),
      ],
      mistakes: [
        oops(T('All birds say "tweet".', 'Semua burung bilang "cuit".'), T('Birds make many sounds: ducks quack, owls hoot, roosters crow!', 'Burung punya banyak suara: bebek "kwek", burung hantu "uhu", ayam jago "kukuruyuk"!'), T('Each kind of animal has its own voice.', 'Setiap jenis hewan punya suaranya sendiri.')),
      ],
      check: check(T('Which animal says "Moo"?', 'Hewan apa yang bilang "Mooo"?'), [T('Cat', 'Kucing'), T('Cow', 'Sapi'), T('Duck', 'Bebek')], 1),
    },
    {
      id: 'animal-2',
      title: T('2. Where Animals Live', '2. Tempat Tinggal Hewan'),
      goal: T('Water, land, or sky?', 'Air, darat, atau udara?'),
      steps: [
        step(T('Fish and whales live in the water.', 'Ikan dan paus hidup di air.'), { emoji: '🐟🐳' }),
        step(T('Birds fly in the sky and build nests in trees.', 'Burung terbang di langit dan membuat sarang di pohon.'), { emoji: '🐦🌳' }),
        step(T('Cows, lions and elephants live on land.', 'Sapi, singa, dan gajah hidup di darat.'), { emoji: '🐮🦁🐘' }),
      ],
      mistakes: [
        oops(T('A whale is a fish.', 'Paus itu ikan.'), T('A whale is a mammal that lives in water.', 'Paus adalah mamalia yang hidup di air.'), T('Whales breathe air through a blowhole and feed their babies milk.', 'Paus bernapas dengan udara lewat lubang di kepalanya dan menyusui anaknya.')),
      ],
      check: check(T('Where does a fish live?', 'Ikan hidup di mana?'), [T('In the water', 'Di air'), T('In the sky', 'Di langit'), T('In a tree', 'Di pohon')], 0),
    },
    {
      id: 'animal-3',
      title: T('3. Legs and Fun Facts', '3. Kaki dan Fakta Seru'),
      goal: T('Amazing animal facts.', 'Fakta hewan yang menakjubkan.'),
      steps: [
        step(T('Count the legs! Birds have 2, cats have 4, insects have 6 and spiders have 8.', 'Hitung kakinya! Burung 2, kucing 4, serangga 6, dan laba-laba 8.'), { emoji: '🐦🐱🐜🕷️' }),
        step(T('Elephants are the biggest land animals. Giraffes are the tallest.', 'Gajah adalah hewan darat terbesar. Jerapah yang paling tinggi.'), { emoji: '🐘🦒' }),
        step(T('Baby animals have special names: a puppy, a kitten, a calf.', 'Ada anak hewan yang punya nama khusus: anak sapi disebut pedet, anak katak disebut kecebong.'), { emoji: '🐶🐱🐮' }),
      ],
      mistakes: [
        oops(T('A spider is an insect.', 'Laba-laba itu serangga.'), T('A spider is NOT an insect.', 'Laba-laba BUKAN serangga.'), T('Insects have 6 legs; spiders have 8.', 'Serangga berkaki 6; laba-laba berkaki 8.')),
      ],
      check: check(T('How many legs does a spider have?', 'Laba-laba punya berapa kaki?'), [n('6'), n('8'), n('4')], 1),
    },
  ],

  letters: [
    {
      id: 'letter-1',
      title: T('1. The Alphabet', '1. Alfabet'),
      goal: T('26 letters, A to Z.', '26 huruf, A sampai Z.'),
      steps: [
        step(T('The alphabet has 26 letters, from A to Z.', 'Alfabet punya 26 huruf, dari A sampai Z.'), { emoji: '🔤' }),
        step(T('Every letter has a BIG (capital) shape and a small shape: A a, B b, C c.', 'Setiap huruf punya bentuk BESAR (kapital) dan bentuk kecil: A a, B b, C c.'), {
          emoji: '🅰️',
          narration: T('Every letter has a big capital shape and a small shape. Big A, small a.', 'Setiap huruf punya bentuk besar dan bentuk kecil. A besar, a kecil.'),
        }),
        step(T('Sing the ABC song to remember the order!', 'Nyanyikan lagu ABC untuk mengingat urutannya!'), { emoji: '🎵' }),
      ],
      mistakes: [
        oops(T('b and d are the same letter.', 'b dan d itu huruf yang sama.'), T('b has its tummy on the right; d has its tummy on the left.', 'Perut b ada di kanan; perut d ada di kiri.'), T('Make two thumbs-up fists: your left hand looks like b, your right hand looks like d!', 'Kepalkan dua tangan dengan jempol ke atas: tangan kiri seperti b, tangan kanan seperti d!')),
      ],
      check: check(T('How many letters are in the alphabet?', 'Ada berapa huruf dalam alfabet?'), [n('24'), n('26'), n('10')], 1),
    },
    {
      id: 'letter-2',
      title: T('2. First Letters', '2. Huruf Awal'),
      goal: T('Hear the first sound.', 'Mendengar bunyi pertama.'),
      steps: [
        step(T('"Apple" starts with A. "Ball" starts with B.', '"Apel" diawali A. "Bola" diawali B.'), { emoji: '🍎⚽' }),
        step(T('Say the word slowly and listen to the very first sound: c-c-cat.', 'Ucapkan katanya pelan-pelan dan dengar bunyi pertamanya: k-k-kucing.'), { emoji: '👂' }),
        step(T('Your name starts with a letter too! Which one is yours?', 'Namamu juga diawali sebuah huruf! Huruf apa?'), { emoji: '😊' }),
      ],
      mistakes: [
        oops(T('"Kite" starts with C.', '"Foto" diawali P.'), T('"Kite" starts with K.', '"Foto" diawali F.'), T('C and K can sound the same, so look at the written word too.', 'F dan P bunyinya mirip, jadi perhatikan tulisannya juga.')),
      ],
      check: check(T('"Dog" starts with which letter?', '"Domba" diawali huruf apa?'), [n('D'), n('B'), n('G')], 0),
    },
    {
      id: 'letter-3',
      title: T('3. Vowels', '3. Huruf Vokal'),
      goal: T('The 5 special letters.', '5 huruf istimewa.'),
      steps: [
        step(T('The vowels are A, E, I, O and U.', 'Huruf vokal adalah A, I, U, E, dan O.'), { emoji: '🔠' }),
        step(T('All the other letters are consonants, like B, C and D.', 'Huruf lainnya disebut konsonan, seperti B, C, dan D.'), { emoji: '🔡' }),
        step(T('Almost every word has a vowel: c-A-t, d-O-g.', 'Hampir setiap kata punya vokal: b-O-l-A, k-U-c-I-n-g.'), { emoji: '🐱' }),
      ],
      mistakes: [
        oops(T('B is a vowel.', 'B itu huruf vokal.'), T('B is a consonant. The vowels are A, E, I, O, U.', 'B itu konsonan. Vokalnya A, I, U, E, O.'), T('There are only 5 vowels to remember.', 'Hanya ada 5 huruf vokal yang perlu diingat.')),
      ],
      check: check(T('Which letter is a vowel?', 'Huruf mana yang vokal?'), [n('B'), n('O'), n('T')], 1),
    },
  ],

  food: [
    {
      id: 'food-1',
      title: T('1. Fruits', '1. Buah'),
      goal: T('Fruits have seeds.', 'Buah punya biji.'),
      steps: [
        step(T('Fruits grow from flowers and have seeds inside.', 'Buah tumbuh dari bunga dan punya biji di dalamnya.'), { emoji: '🍎' }),
        step(T('Many fruits are sweet: bananas, grapes, strawberries and watermelons!', 'Banyak buah rasanya manis: pisang, anggur, stroberi, dan semangka!'), { emoji: '🍌🍇🍓🍉' }),
        step(T('Surprise! A tomato has seeds, so it is a fruit too.', 'Kejutan! Tomat punya biji, jadi tomat juga buah.'), { emoji: '🍅' }),
      ],
      mistakes: [
        oops(T('A tomato is a vegetable.', 'Tomat itu sayur.'), T('A tomato is really a fruit.', 'Tomat sebenarnya buah.'), T('It grows from a flower and has seeds, even though we cook it like a vegetable.', 'Tomat tumbuh dari bunga dan berbiji, walaupun kita memasaknya seperti sayur.')),
      ],
      check: check(T('Which one is a fruit?', 'Mana yang termasuk buah?'), [T('Carrot', 'Wortel'), T('Banana', 'Pisang'), T('Spinach', 'Bayam')], 1),
    },
    {
      id: 'food-2',
      title: T('2. Vegetables', '2. Sayur'),
      goal: T('Plants we cook or eat fresh.', 'Tanaman yang dimasak atau dimakan segar.'),
      steps: [
        step(T('Vegetables are other parts of plants that we eat.', 'Sayur adalah bagian tanaman lain yang kita makan.'), { emoji: '🥕' }),
        step(T('We eat roots like carrots, leaves like spinach, and flowers like broccoli!', 'Kita makan akar seperti wortel, daun seperti bayam, dan bunga seperti brokoli!'), { emoji: '🥕🥬🥦' }),
        step(T('Vegetables help your body grow strong and healthy.', 'Sayur membantu tubuhmu tumbuh kuat dan sehat.'), { emoji: '💪' }),
      ],
      mistakes: [
        oops(T('Vegetables are always green.', 'Sayur selalu berwarna hijau.'), T('Vegetables come in many colors: orange carrots, purple eggplants, yellow corn.', 'Sayur punya banyak warna: wortel oranye, terong ungu, jagung kuning.'), T('Look at your plate: there is a rainbow of vegetables!', 'Lihat piringmu: sayur punya warna pelangi!')),
      ],
      check: check(T('Which one is a vegetable?', 'Mana yang termasuk sayur?'), [T('Apple', 'Apel'), T('Carrot', 'Wortel'), T('Grapes', 'Anggur')], 1),
    },
    {
      id: 'food-3',
      title: T('3. Eat a Rainbow', '3. Makan Pelangi'),
      goal: T('Many colors keep you strong.', 'Banyak warna membuatmu kuat.'),
      steps: [
        step(T('Foods of different colors give your body different good things.', 'Makanan berbeda warna memberi tubuhmu kebaikan yang berbeda.'), { emoji: '🌈' }),
        step(T('Try red, orange, yellow, green and purple foods every day!', 'Coba makanan merah, oranye, kuning, hijau, dan ungu setiap hari!'), { emoji: '🍎🥕🍌🥦🍆' }),
        step(T('Drink water, and keep sweets for "sometimes".', 'Minum air putih, dan makan permen hanya "kadang-kadang".'), { emoji: '💧' }),
      ],
      mistakes: [
        oops(T('Candy gives energy, so eat lots!', 'Permen memberi tenaga, jadi makan yang banyak!'), T('Candy is a "sometimes" treat.', 'Permen hanya camilan "kadang-kadang".'), T('Fruit and vegetables give energy that lasts longer and keep your teeth healthy.', 'Buah dan sayur memberi tenaga lebih lama dan menjaga gigimu tetap sehat.')),
      ],
      check: check(T('Which is a healthy snack?', 'Mana camilan yang sehat?'), [T('Candy', 'Permen'), T('An apple', 'Apel'), T('Soda', 'Minuman bersoda')], 1),
    },
  ],

  body: [
    {
      id: 'body-1',
      title: T('1. Name Your Body', '1. Bagian Tubuh'),
      goal: T('Point and say.', 'Tunjuk dan sebut.'),
      steps: [
        step(T('Point and say: eyes, ears, nose, mouth.', 'Tunjuk dan sebut: mata, telinga, hidung, mulut.'), { emoji: '👀👂👃👄' }),
        step(T('Now point to your hands and feet!', 'Sekarang tunjuk tangan dan kakimu!'), { emoji: '✋🦶' }),
        step(T('Head, shoulders, knees and toes! Can you touch them all?', 'Kepala, pundak, lutut, kaki! Bisakah kamu menyentuh semuanya?'), { emoji: '🙆' }),
      ],
      mistakes: [
        oops(T('We have 5 fingers in total.', 'Jari kita totalnya 5.'), T('We have 10 fingers: 5 on each hand.', 'Jari kita ada 10: 5 di setiap tangan.'), T('Count both hands together!', 'Hitung kedua tangan bersama!')),
      ],
      check: check(T('How many eyes do you have?', 'Kamu punya berapa mata?'), [n('1'), n('2'), n('3')], 1),
    },
    {
      id: 'body-2',
      title: T('2. Five Senses', '2. Lima Indra'),
      goal: T('How we learn about the world.', 'Cara kita mengenal dunia.'),
      steps: [
        step(T('We SEE with our eyes and HEAR with our ears.', 'Kita MELIHAT dengan mata dan MENDENGAR dengan telinga.'), { emoji: '👀👂' }),
        step(T('We SMELL with our nose and TASTE with our tongue.', 'Kita MENCIUM dengan hidung dan MENGECAP dengan lidah.'), { emoji: '👃👅' }),
        step(T('We TOUCH and FEEL with our skin: hot, cold, soft and rough.', 'Kita MERABA dengan kulit: panas, dingin, lembut, dan kasar.'), { emoji: '🖐️' }),
      ],
      mistakes: [
        oops(T('We taste with our nose.', 'Kita mengecap dengan hidung.'), T('We taste with our tongue.', 'Kita mengecap dengan lidah.'), T('Your nose helps, though: food tastes weaker when your nose is blocked!', 'Tapi hidung ikut membantu: makanan terasa hambar saat hidung tersumbat!')),
      ],
      check: check(T('What do we use to hear?', 'Kita mendengar dengan apa?'), [T('Eyes', 'Mata'), T('Ears', 'Telinga'), T('Nose', 'Hidung')], 1),
    },
    {
      id: 'body-3',
      title: T('3. Inside Your Body', '3. Di Dalam Tubuh'),
      goal: T('Hard-working helpers.', 'Pembantu yang rajin.'),
      steps: [
        step(T('Your brain thinks, learns and remembers.', 'Otakmu berpikir, belajar, dan mengingat.'), { emoji: '🧠' }),
        step(T('Your heart pumps blood all day and all night.', 'Jantungmu memompa darah siang dan malam.'), { emoji: '❤️' }),
        step(T('Your lungs fill with air. Take a big breath in... and out!', 'Paru-parumu terisi udara. Tarik napas dalam... lalu hembuskan!'), { emoji: '🫁' }),
      ],
      mistakes: [
        oops(T('Your heart is in your tummy.', 'Jantung ada di perut.'), T('Your heart is in your chest.', 'Jantung ada di dada.'), T('Put your hand on your chest and feel it beat!', 'Letakkan tanganmu di dada dan rasakan detaknya!')),
      ],
      check: check(T('What does your heart do?', 'Apa tugas jantungmu?'), [T('Pumps blood', 'Memompa darah'), T('Sees things', 'Melihat'), T('Hears sounds', 'Mendengar')], 0),
    },
  ],

  weather: [
    {
      id: 'weather-1',
      title: T('1. Kinds of Weather', '1. Jenis Cuaca'),
      goal: T('Look at the sky.', 'Lihat langit.'),
      steps: [
        step(T('Look at the sky! It can be sunny, rainy or cloudy.', 'Lihat langit! Cuaca bisa cerah, hujan, atau berawan.'), { emoji: '☀️🌧️☁️' }),
        step(T('It can also be windy, stormy or snowy.', 'Cuaca juga bisa berangin, badai, atau bersalju.'), { emoji: '💨⛈️❄️' }),
        step(T('When the sun shines while it rains, look for a rainbow!', 'Saat matahari bersinar ketika hujan, carilah pelangi!'), { emoji: '🌈' }),
      ],
      mistakes: [
        oops(T('Clouds are made of cotton.', 'Awan terbuat dari kapas.'), T('Clouds are made of tiny drops of water.', 'Awan terbuat dari tetes air yang sangat kecil.'), T('When the drops get big and heavy, they fall as rain!', 'Saat tetesnya jadi besar dan berat, jatuhlah hujan!')),
      ],
      check: check(T('What falls from the sky on a rainy day?', 'Apa yang jatuh dari langit saat hujan?'), [T('Water', 'Air'), T('Sand', 'Pasir'), T('Leaves', 'Daun')], 0),
    },
    {
      id: 'weather-2',
      title: T('2. Dress for the Weather', '2. Pakaian Sesuai Cuaca'),
      goal: T('Stay safe and comfy.', 'Tetap aman dan nyaman.'),
      steps: [
        step(T('Rainy? Take an umbrella and a raincoat.', 'Hujan? Bawa payung dan jas hujan.'), { emoji: '☂️' }),
        step(T('Cold? Wear a warm jacket. Hot and sunny? Wear a hat and drink water.', 'Dingin? Pakai jaket hangat. Panas terik? Pakai topi dan minum air.'), { emoji: '🧥🧢' }),
        step(T('Storm with lightning? Stay safely inside!', 'Badai dan petir? Tetap aman di dalam rumah!'), { emoji: '🏠' }),
      ],
      mistakes: [
        oops(T('Hiding under a tree in a lightning storm is safe.', 'Berteduh di bawah pohon saat petir itu aman.'), T('Go inside a building when there is lightning.', 'Masuk ke dalam bangunan saat ada petir.'), T('Lightning often strikes tall things like trees.', 'Petir sering menyambar benda tinggi seperti pohon.')),
      ],
      check: check(T('It is raining. What do you take?', 'Sedang hujan. Apa yang kamu bawa?'), [T('Sunglasses', 'Kacamata hitam'), T('An umbrella', 'Payung'), T('A swimsuit', 'Baju renang')], 1),
    },
    {
      id: 'weather-3',
      title: T('3. Seasons', '3. Musim'),
      goal: T('The year changes.', 'Tahun berganti musim.'),
      steps: [
        step(T('Some countries have 4 seasons: spring, summer, autumn and winter.', 'Beberapa negara punya 4 musim: semi, panas, gugur, dan dingin.'), { emoji: '🌸☀️🍂❄️' }),
        step(T('Indonesia has 2 seasons: the rainy season and the dry season.', 'Indonesia punya 2 musim: musim hujan dan musim kemarau.'), { emoji: '🌧️☀️' }),
        step(T('In autumn, leaves change color and fall. In winter, it can snow!', 'Di musim gugur, daun berubah warna dan berguguran. Di musim dingin, bisa turun salju!'), { emoji: '🍂❄️' }),
      ],
      mistakes: [
        oops(T('Every country gets snow.', 'Semua negara pasti turun salju.'), T('Many warm countries, like Indonesia, never get snow in their cities.', 'Banyak negara hangat, seperti Indonesia, tidak pernah turun salju di kotanya.'), T('Snow needs very cold air.', 'Salju butuh udara yang sangat dingin.')),
      ],
      check: check(T('How many seasons does Indonesia have?', 'Indonesia punya berapa musim?'), [n('2'), n('4'), n('1')], 0),
    },
  ],

  transport: [
    {
      id: 'transport-1',
      title: T('1. On Land', '1. Di Darat'),
      goal: T('Roads and rails.', 'Jalan dan rel.'),
      steps: [
        step(T('Cars, buses and bicycles move on roads.', 'Mobil, bus, dan sepeda bergerak di jalan.'), { emoji: '🚗🚌🚲' }),
        step(T('Trains run on rails, also called tracks.', 'Kereta berjalan di atas rel.'), { emoji: '🚆' }),
        step(T('In Indonesia you can also ride a becak or a bajaj!', 'Di Indonesia kamu juga bisa naik becak atau bajaj!'), { emoji: '🛺' }),
      ],
      mistakes: [
        oops(T('A bicycle has an engine.', 'Sepeda punya mesin.'), T('A bicycle moves with your leg power!', 'Sepeda bergerak dengan tenaga kakimu!'), T('You push the pedals to turn the wheels.', 'Kamu mengayuh pedal untuk memutar rodanya.')),
      ],
      check: check(T('Where does a train go?', 'Kereta berjalan di mana?'), [T('On rails', 'Di atas rel'), T('In the sky', 'Di langit'), T('Under the sea', 'Di bawah laut')], 0),
    },
    {
      id: 'transport-2',
      title: T('2. Water and Sky', '2. Air dan Udara'),
      goal: T('Float or fly.', 'Mengapung atau terbang.'),
      steps: [
        step(T('Boats and ships float on water.', 'Perahu dan kapal mengapung di air.'), { emoji: '⛵🚢' }),
        step(T('A submarine can travel under the water.', 'Kapal selam bisa berjalan di bawah air.'), { emoji: '🌊' }),
        step(T('Planes and helicopters fly in the sky. Rockets go all the way to space!', 'Pesawat dan helikopter terbang di langit. Roket pergi sampai ke luar angkasa!'), { emoji: '✈️🚁🚀' }),
      ],
      mistakes: [
        oops(T('Big ships sink because they are heavy.', 'Kapal besar tenggelam karena berat.'), T('Big ships float!', 'Kapal besar bisa mengapung!'), T('Their shape pushes away lots of water, and the water holds them up.', 'Bentuknya mendorong banyak air, dan air itulah yang menahannya.')),
      ],
      check: check(T('Which one flies?', 'Mana yang terbang?'), [T('Ship', 'Kapal'), T('Airplane', 'Pesawat'), T('Bus', 'Bus')], 1),
    },
    {
      id: 'transport-3',
      title: T('3. Helper Vehicles', '3. Kendaraan Penolong'),
      goal: T('They help people.', 'Mereka menolong orang.'),
      steps: [
        step(T('Fire trucks bring water and ladders to put out fires.', 'Mobil pemadam membawa air dan tangga untuk memadamkan api.'), { emoji: '🚒' }),
        step(T('Ambulances take sick or hurt people to the hospital.', 'Ambulans membawa orang sakit atau terluka ke rumah sakit.'), { emoji: '🚑' }),
        step(T('Police cars help keep everyone safe.', 'Mobil polisi membantu menjaga semua orang tetap aman.'), { emoji: '🚓' }),
      ],
      mistakes: [
        oops(T('A siren means a race.', 'Sirene artinya sedang balapan.'), T('A siren means: make way, someone needs help!', 'Sirene artinya: beri jalan, ada yang butuh pertolongan!'), T('Cars move aside so helpers can get there fast.', 'Kendaraan lain menepi supaya penolong cepat sampai.')),
      ],
      check: check(T('Which vehicle helps put out fires?', 'Kendaraan apa yang memadamkan api?'), [T('Fire truck', 'Mobil pemadam'), T('Ambulance', 'Ambulans'), T('Taxi', 'Taksi')], 0),
    },
  ],

  opposites: [
    {
      id: 'opp-1',
      title: T('1. What Is an Opposite?', '1. Apa Itu Lawan Kata?'),
      goal: T('Words that are totally different.', 'Kata yang sangat berbeda.'),
      steps: [
        step(T('Opposites are words that mean very different things.', 'Lawan kata adalah kata yang artinya sangat berbeda.'), {
          emoji: '↔️',
        }),
        step(T('Big and small. Hot and cold.', 'Besar dan kecil. Panas dan dingin.'), { emoji: '🐘🐭' }),
        step(T('Fast and slow. Happy and sad.', 'Cepat dan lambat. Senang dan sedih.'), { emoji: '🐇🐢' }),
      ],
      mistakes: [
        oops(T('The opposite of big is huge.', 'Lawan kata besar adalah raksasa.'), T('The opposite of big is small.', 'Lawan kata besar adalah kecil.'), T('Huge means VERY big, so it goes the same way, not the opposite way.', 'Raksasa artinya SANGAT besar, jadi searah, bukan berlawanan.')),
      ],
      check: check(T('What is the opposite of hot?', 'Apa lawan kata panas?'), [T('Warm', 'Hangat'), T('Cold', 'Dingin'), T('Sunny', 'Cerah')], 1),
    },
    {
      id: 'opp-2',
      title: T('2. Opposites Around You', '2. Lawan Kata di Sekitarmu'),
      goal: T('Look around!', 'Lihat sekitar!'),
      steps: [
        step(T('A door can be open or closed.', 'Pintu bisa terbuka atau tertutup.'), { emoji: '🚪' }),
        step(T('It is light in the day and dark at night.', 'Siang hari terang dan malam hari gelap.'), { emoji: '🌞🌙' }),
        step(T('A glass can be full or empty.', 'Gelas bisa penuh atau kosong.'), { emoji: '🥛' }),
      ],
      mistakes: [
        oops(T('The opposite of up is over.', 'Lawan kata atas adalah samping.'), T('The opposite of up is down.', 'Lawan kata atas adalah bawah.'), T('Point up, then point the other way: down!', 'Tunjuk ke atas, lalu tunjuk arah sebaliknya: bawah!')),
      ],
      check: check(T('What is the opposite of full?', 'Apa lawan kata penuh?'), [T('Empty', 'Kosong'), T('Big', 'Besar'), T('Wet', 'Basah')], 0),
    },
    {
      id: 'opp-3',
      title: T('3. Opposite Game', '3. Permainan Lawan Kata'),
      goal: T('Say the opposite fast!', 'Sebut lawannya cepat!'),
      steps: [
        step(T('Ready? Up!', 'Siap? Atas!'), { emoji: '⬆️', example: T('Down!', 'Bawah!') }),
        step(T('Near!', 'Dekat!'), { emoji: '📍', example: T('Far!', 'Jauh!') }),
        step(T('Clean!', 'Bersih!'), { emoji: '🧼', example: T('Dirty!', 'Kotor!') }),
      ],
      mistakes: [
        oops(T('Every word has an opposite.', 'Setiap kata punya lawan kata.'), T('Some words have no opposite, like "apple" or "table".', 'Ada kata yang tidak punya lawan, seperti "apel" atau "meja".'), T('Opposites work for words about size, heat, speed, feelings and places.', 'Lawan kata ada untuk kata tentang ukuran, suhu, kecepatan, perasaan, dan tempat.')),
      ],
      check: check(T('What is the opposite of fast?', 'Apa lawan kata cepat?'), [T('Slow', 'Lambat'), T('Quick', 'Kilat'), T('Big', 'Besar')], 0),
    },
  ],

  feelings: [
    {
      id: 'feel-1',
      title: T('1. Name Your Feelings', '1. Kenali Perasaan'),
      goal: T('Faces tell feelings.', 'Wajah menunjukkan perasaan.'),
      steps: [
        step(T('Our faces show our feelings: happy, sad, angry.', 'Wajah kita menunjukkan perasaan: senang, sedih, marah.'), { emoji: '😊😢😠' }),
        step(T('We can also feel scared, surprised or sleepy.', 'Kita juga bisa merasa takut, terkejut, atau mengantuk.'), { emoji: '😨😲😴' }),
        step(T('Naming a feeling helps: "I feel sad because my tower fell."', 'Menyebut perasaan itu membantu: "Aku sedih karena menaraku roboh."'), { emoji: '🗣️' }),
      ],
      mistakes: [
        oops(T('Boys should not cry.', 'Anak laki-laki tidak boleh menangis.'), T('Everyone can cry: boys, girls and grown-ups.', 'Semua orang boleh menangis: anak laki-laki, perempuan, dan orang dewasa.'), T('Crying is a normal way to let big feelings out.', 'Menangis adalah cara wajar untuk melepas perasaan yang besar.')),
      ],
      check: check(T('A friend is smiling and laughing. How do they feel?', 'Temanmu tersenyum dan tertawa. Bagaimana perasaannya?'), [T('Happy', 'Senang'), T('Angry', 'Marah'), T('Scared', 'Takut')], 0),
    },
    {
      id: 'feel-2',
      title: T('2. All Feelings Are Okay', '2. Semua Perasaan Boleh'),
      goal: T('Everyone feels them.', 'Semua orang merasakannya.'),
      steps: [
        step(T('Everyone feels sad or angry sometimes. That is okay!', 'Semua orang kadang merasa sedih atau marah. Itu tidak apa-apa!'), { emoji: '💛' }),
        step(T('What matters is what we DO with the feeling.', 'Yang penting adalah apa yang kita LAKUKAN dengan perasaan itu.'), { emoji: '🤔' }),
        step(T('Hitting is not okay, but saying "I am angry" is!', 'Memukul tidak boleh, tapi bilang "Aku marah" itu boleh!'), { emoji: '🙅' }),
      ],
      mistakes: [
        oops(T('If I feel angry, I am a bad kid.', 'Kalau aku marah, berarti aku anak nakal.'), T('Feeling angry is okay. You are still a good kid.', 'Merasa marah itu wajar. Kamu tetap anak yang baik.'), T('Feelings come and go. What we choose to do is what counts.', 'Perasaan datang dan pergi. Yang penting pilihan tindakan kita.')),
      ],
      check: check(T('You feel angry. What is a good thing to do?', 'Kamu merasa marah. Apa yang baik dilakukan?'), [T('Hit something', 'Memukul sesuatu'), T('Take deep breaths', 'Tarik napas dalam-dalam'), T('Yell at a friend', 'Membentak teman')], 1),
    },
    {
      id: 'feel-3',
      title: T('3. Be Kind', '3. Bersikap Baik'),
      goal: T('Help yourself and others.', 'Bantu diri sendiri dan orang lain.'),
      steps: [
        step(T('When feelings get big, take 3 deep breaths: in... and out.', 'Saat perasaan terasa besar, tarik napas dalam 3 kali: tarik... hembuskan.'), { emoji: '🌬️' }),
        step(T('Talk to someone you trust, like a parent or a teacher.', 'Bicaralah dengan orang yang kamu percaya, seperti orang tua atau guru.'), { emoji: '🤗' }),
        step(T('Help a friend who feels sad. Ask: "Are you okay?"', 'Bantu teman yang sedih. Tanyakan: "Kamu tidak apa-apa?"'), { emoji: '🤝' }),
      ],
      mistakes: [
        oops(T('Laughing when a friend falls is funny.', 'Menertawakan teman yang jatuh itu lucu.'), T('Ask "Are you okay?" and help them up.', 'Tanyakan "Kamu tidak apa-apa?" dan bantu dia berdiri.'), T('Think how you would feel if it happened to you.', 'Bayangkan perasaanmu kalau itu terjadi padamu.')),
      ],
      check: check(T('Your friend is crying. What can you say?', 'Temanmu menangis. Apa yang bisa kamu katakan?'), [T('"Go away!"', '"Pergi sana!"'), T('"Are you okay?"', '"Kamu tidak apa-apa?"'), T('Nothing at all', 'Diam saja')], 1),
    },
  ],

  space: [
    {
      id: 'space-1',
      title: T('1. Sun, Moon and Stars', '1. Matahari, Bulan, dan Bintang'),
      goal: T('Look up!', 'Lihat ke atas!'),
      steps: [
        step(T('The Sun is a star! It gives us light and warmth.', 'Matahari adalah bintang! Ia memberi kita cahaya dan kehangatan.'), { emoji: '☀️' }),
        step(T('The Moon goes around the Earth. It shines because the Sun lights it up.', 'Bulan mengelilingi Bumi. Bulan bersinar karena disinari Matahari.'), { emoji: '🌙' }),
        step(T('The stars at night are other suns, very, very far away.', 'Bintang di malam hari adalah matahari lain yang sangat, sangat jauh.'), { emoji: '✨' }),
      ],
      mistakes: [
        oops(T('The Sun goes around the Earth.', 'Matahari mengelilingi Bumi.'), T('The Earth goes around the Sun!', 'Bumi yang mengelilingi Matahari!'), T('The Sun only looks like it moves because the Earth is spinning.', 'Matahari terlihat bergerak karena Bumi berputar.')),
      ],
      check: check(T('What is the Sun?', 'Matahari itu apa?'), [T('A planet', 'Planet'), T('A star', 'Bintang'), T('A moon', 'Bulan')], 1),
    },
    {
      id: 'space-2',
      title: T('2. Our Planets', '2. Planet Kita'),
      goal: T('8 planets in order.', '8 planet berurutan.'),
      steps: [
        step(T('8 planets travel around the Sun.', '8 planet mengelilingi Matahari.'), { emoji: '🪐' }),
        step(T('From the Sun: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune. We live on Earth!', 'Dari Matahari: Merkurius, Venus, Bumi, Mars, Yupiter, Saturnus, Uranus, Neptunus. Kita tinggal di Bumi!'), { emoji: '🌍' }),
        step(T('Jupiter is the biggest planet. Saturn has beautiful rings.', 'Yupiter adalah planet terbesar. Saturnus punya cincin yang indah.'), { emoji: '🟠🪐' }),
      ],
      mistakes: [
        oops(T('Pluto is the 9th planet.', 'Pluto adalah planet ke-9.'), T('There are 8 planets. Pluto is a dwarf planet.', 'Ada 8 planet. Pluto adalah planet kerdil.'), T('Pluto is very small, so scientists call it a dwarf planet.', 'Pluto sangat kecil, jadi ilmuwan menyebutnya planet kerdil.')),
      ],
      check: check(T('Which planet do we live on?', 'Kita tinggal di planet apa?'), [T('Mars', 'Mars'), T('Earth', 'Bumi'), T('Venus', 'Venus')], 1),
    },
    {
      id: 'space-3',
      title: T('3. Astronauts', '3. Astronot'),
      goal: T('Space explorers.', 'Penjelajah angkasa.'),
      steps: [
        step(T('Astronauts are people who travel to space.', 'Astronot adalah orang yang pergi ke luar angkasa.'), { emoji: '👩‍🚀' }),
        step(T('They ride in rockets that blast up into the sky.', 'Mereka naik roket yang meluncur ke langit.'), { emoji: '🚀' }),
        step(T('On the space station, astronauts and their food float around!', 'Di stasiun luar angkasa, astronot dan makanannya melayang-layang!'), { emoji: '🧑‍🚀' }),
      ],
      mistakes: [
        oops(T('Astronauts can breathe in space on their own.', 'Astronot bisa bernapas sendiri di luar angkasa.'), T('Astronauts need space suits with air inside.', 'Astronot butuh baju antariksa yang berisi udara.'), T('Space has no air to breathe.', 'Di luar angkasa tidak ada udara untuk bernapas.')),
      ],
      check: check(T('What do astronauts ride to space?', 'Astronot naik apa ke luar angkasa?'), [T('A rocket', 'Roket'), T('A bus', 'Bus'), T('A boat', 'Perahu')], 0),
    },
  ],
};
