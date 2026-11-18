import type { Text, TopicId } from '../types';

/**
 * Offline fact tables for Ask Mewy. Every answer is built from these with
 * simple templates, so it stays correct, short and kid-safe.
 * `names` are lowercase EN + ID words (hyphens written as spaces).
 */

const t = (en: string, id: string): Text => ({ en, id });

export type Kind = 'animal' | 'space' | 'shape' | 'food' | 'thing' | 'vehicle' | 'body' | 'weather';

export const KIND_LESSON: Record<Kind, Exclude<TopicId, 'memory'>> = {
  animal: 'animals',
  space: 'space',
  shape: 'shapes',
  food: 'food',
  thing: 'colors',
  vehicle: 'transport',
  body: 'body',
  weather: 'weather',
};

export interface Entity {
  id: string;
  kind: Kind;
  emoji: string;
  names: string[];
  /** Singular, lowercase (EN "dog", ID "anjing"). */
  name: Text;
  /** EN sentence subject when "A dog" does not fit ("The sky", "Grass"). */
  subj?: string;
  fact: Text;
  legs?: number;
  /** Replaces the legs template when the plain number would mislead. */
  legsText?: Text;
  says?: Text;
  home?: Text;
  food?: Text;
  baby?: Text;
  color?: Text;
  sides?: number;
  corners?: number;
  wheels?: number;
  where?: Text;
  group?: 'fruit' | 'veg';
  /** Full "how many" sentence (body parts). */
  count?: Text;
}

const animal = (
  id: string,
  emoji: string,
  names: string[],
  name: Text,
  f: Omit<Entity, 'id' | 'kind' | 'emoji' | 'names' | 'name'>,
): Entity => ({ id, kind: 'animal', emoji, names, name, ...f });

export const ANIMALS: Entity[] = [
  animal('dog', '🐶', ['dog', 'dogs', 'puppy', 'puppies', 'anjing'], t('dog', 'anjing'), {
    legs: 4, says: t('Woof woof!', 'Guk guk!'), home: t('a house with its family, or a cozy kennel', 'rumah bersama keluarganya, atau kandang yang nyaman'),
    food: t('meat and dog food', 'daging dan makanan anjing'), baby: t('puppy', 'anak anjing'),
    fact: t('Dogs smell things about 10,000 times better than we do!', 'Penciuman anjing sekitar 10.000 kali lebih tajam dari kita!'),
  }),
  animal('cat', '🐱', ['cat', 'cats', 'kitten', 'kittens', 'kitty', 'kucing'], t('cat', 'kucing'), {
    legs: 4, says: t('Meow!', 'Meong!'), home: t('a house with its family', 'rumah bersama keluarganya'),
    food: t('fish, meat and cat food', 'ikan, daging, dan makanan kucing'), baby: t('kitten', 'anak kucing'),
    fact: t('Cats sleep for about 15 hours a day, just like Mewy!', 'Kucing tidur sekitar 15 jam sehari, sama seperti Mewy!'),
  }),
  animal('cow', '🐮', ['cow', 'cows', 'sapi'], t('cow', 'sapi'), {
    legs: 4, says: t('Moo!', 'Mooo!'), home: t('a farm or a barn', 'peternakan atau kandang'),
    food: t('grass and hay', 'rumput dan jerami'), baby: t('calf', 'pedet'),
    fact: t('Cows give us milk, and they have 4 parts in their tummy!', 'Sapi memberi kita susu, dan perutnya punya 4 bagian!'),
  }),
  animal('chicken', '🐔', ['chicken', 'chickens', 'hen', 'hens', 'rooster', 'ayam'], t('chicken', 'ayam'), {
    legs: 2, says: t('Cluck cluck! (A rooster says cock-a-doodle-doo!)', 'Petok petok! (Ayam jago bilang kukuruyuk!)'),
    home: t('a chicken coop on a farm', 'kandang ayam'), food: t('seeds, grains and little bugs', 'biji-bijian dan serangga kecil'),
    baby: t('chick', 'anak ayam'), fact: t('Chickens lay eggs, and they are relatives of dinosaurs!', 'Ayam bertelur, dan mereka kerabat dinosaurus!'),
  }),
  animal('duck', '🦆', ['duck', 'ducks', 'duckling', 'bebek', 'itik'], t('duck', 'bebek'), {
    legs: 2, says: t('Quack quack!', 'Kwek kwek!'), home: t('ponds and lakes', 'kolam dan danau'),
    food: t('water plants, seeds and small fish', 'tanaman air, biji, dan ikan kecil'), baby: t('duckling', 'meri'),
    fact: t('Ducks have waterproof feathers, so they stay dry in the water!', 'Bulu bebek tahan air, jadi tetap kering di air!'),
  }),
  animal('spider', '🕷️', ['spider', 'spiders', 'laba laba'], t('spider', 'laba-laba'), {
    legs: 8, home: t('a web it spins itself', 'jaring yang ia buat sendiri'), food: t('insects', 'serangga'),
    baby: t('spiderling', 'anak laba-laba'),
    fact: t('A spider is not an insect: insects have 6 legs, spiders have 8!', 'Laba-laba bukan serangga: serangga berkaki 6, laba-laba berkaki 8!'),
  }),
  animal('ant', '🐜', ['ant', 'ants', 'semut'], t('ant', 'semut'), {
    legs: 6, home: t('a nest under the ground', 'sarang di dalam tanah'), food: t('sweet things, seeds and tiny bugs', 'makanan manis, biji, dan serangga kecil'),
    baby: t('larva', 'larva'), fact: t('Ants can carry things much heavier than their own body!', 'Semut bisa mengangkat benda yang jauh lebih berat dari tubuhnya!'),
  }),
  animal('butterfly', '🦋', ['butterfly', 'butterflies', 'kupu kupu'], t('butterfly', 'kupu-kupu'), {
    legs: 6, home: t('gardens and fields full of flowers', 'taman dan padang penuh bunga'), food: t('sweet nectar from flowers', 'nektar manis dari bunga'),
    baby: t('caterpillar', 'ulat'), fact: t('A butterfly starts as a caterpillar, then grows inside a cocoon!', 'Kupu-kupu awalnya ulat, lalu tumbuh di dalam kepompong!'),
  }),
  animal('bee', '🐝', ['bee', 'bees', 'lebah'], t('bee', 'lebah'), {
    legs: 6, says: t('Bzzzz!', 'Bzzzz!'), home: t('a hive', 'sarang lebah'), food: t('nectar and pollen from flowers', 'nektar dan serbuk sari bunga'),
    baby: t('larva', 'larva'), fact: t('Bees make honey and help flowers grow new seeds!', 'Lebah membuat madu dan membantu bunga membuat biji baru!'),
  }),
  animal('fish', '🐟', ['fish', 'fishes', 'ikan'], t('fish', 'ikan'), {
    legs: 0, home: t('water: rivers, lakes and the sea', 'air: sungai, danau, dan laut'), food: t('tiny plants and water bugs', 'tumbuhan kecil dan serangga air'),
    baby: t('fry', 'burayak'), fact: t('Fish breathe under water with gills and swim with their fins!', 'Ikan bernapas di air dengan insang dan berenang dengan siripnya!'),
  }),
  animal('bird', '🐦', ['bird', 'birds', 'burung'], t('bird', 'burung'), {
    legs: 2, says: t('Tweet tweet!', 'Cuit cuit!'), home: t('a nest in a tree', 'sarang di pohon'), food: t('seeds, worms and berries', 'biji, cacing, dan buah beri'),
    baby: t('chick', 'anak burung'), fact: t('Birds have light, hollow bones that help them fly!', 'Tulang burung ringan dan berongga supaya bisa terbang!'),
  }),
  animal('elephant', '🐘', ['elephant', 'elephants', 'gajah'], t('elephant', 'gajah'), {
    legs: 4, says: t('a loud trumpet: Pawoooo!', 'terompet yang keras: Pawoooo!'), home: t('grasslands and forests', 'padang rumput dan hutan'),
    food: t('grass, leaves and fruit', 'rumput, daun, dan buah'), baby: t('calf', 'anak gajah'),
    fact: t('Elephants are the biggest animals on land, and they use their trunk like a hand!', 'Gajah adalah hewan darat terbesar, dan belalainya dipakai seperti tangan!'),
  }),
  animal('lion', '🦁', ['lion', 'lions', 'singa'], t('lion', 'singa'), {
    legs: 4, says: t('ROAR!', 'AUM!'), home: t('the grassy savanna', 'padang rumput sabana'), food: t('meat', 'daging'),
    baby: t('cub', 'anak singa'), fact: t('A lion family is called a pride, and a roar can be heard far away!', 'Keluarga singa disebut kawanan, dan aumannya terdengar sangat jauh!'),
  }),
  animal('tiger', '🐯', ['tiger', 'tigers', 'harimau', 'macan'], t('tiger', 'harimau'), {
    legs: 4, says: t('ROAR!', 'AUM!'), home: t('jungles and forests', 'hutan rimba'), food: t('meat', 'daging'),
    baby: t('cub', 'anak harimau'), color: t('orange with black stripes', 'oranye dengan belang hitam'),
    fact: t('Every tiger has its own stripe pattern, like a fingerprint!', 'Setiap harimau punya pola belang sendiri, seperti sidik jari!'),
  }),
  animal('monkey', '🐵', ['monkey', 'monkeys', 'monyet', 'kera'], t('monkey', 'monyet'), {
    legsText: t('A monkey has 2 legs and 2 arms, and climbs with all four!', 'Monyet punya 2 kaki dan 2 tangan, dan memanjat dengan keempatnya!'),
    says: t('Ooh ooh aah aah!', 'Uuk uuk aak aak!'), home: t('trees in the forest', 'pohon di hutan'), food: t('fruit, leaves and bugs', 'buah, daun, dan serangga'),
    baby: t('baby monkey', 'anak monyet'), fact: t('Some monkeys can hold branches with their tail!', 'Beberapa monyet bisa berpegangan pada dahan dengan ekornya!'),
  }),
  animal('horse', '🐴', ['horse', 'horses', 'pony', 'kuda'], t('horse', 'kuda'), {
    legs: 4, says: t('Neigh!', 'Hiiii-hiii!'), home: t('a farm or a stable', 'peternakan atau istal'), food: t('grass and hay', 'rumput dan jerami'),
    baby: t('foal', 'anak kuda'), fact: t('Horses can sleep standing up!', 'Kuda bisa tidur sambil berdiri!'),
  }),
  animal('pig', '🐷', ['pig', 'pigs', 'piglet', 'babi'], t('pig', 'babi'), {
    legs: 4, says: t('Oink oink!', 'Ngok ngok!'), home: t('a farm', 'peternakan'), food: t('vegetables and grains', 'sayuran dan biji-bijian'),
    baby: t('piglet', 'anak babi'), fact: t('Pigs roll in mud to keep cool on hot days!', 'Babi berguling di lumpur supaya sejuk saat panas!'),
  }),
  animal('sheep', '🐑', ['sheep', 'lamb', 'domba'], t('sheep', 'domba'), {
    legs: 4, says: t('Baa!', 'Mbeee!'), home: t('a farm with green fields', 'peternakan berpadang rumput'), food: t('grass', 'rumput'),
    baby: t('lamb', 'anak domba'), fact: t('Sheep give us wool to make warm sweaters!', 'Domba memberi kita wol untuk membuat baju hangat!'),
  }),
  animal('goat', '🐐', ['goat', 'goats', 'kambing'], t('goat', 'kambing'), {
    legs: 4, says: t('Maa!', 'Mbeek!'), home: t('farms and rocky hills', 'peternakan dan bukit berbatu'), food: t('grass and leaves', 'rumput dan daun'),
    baby: t('kid', 'cempe'), fact: t('Goats are great climbers, even on steep rocks!', 'Kambing jago memanjat, bahkan di batu yang curam!'),
  }),
  animal('frog', '🐸', ['frog', 'frogs', 'katak', 'kodok'], t('frog', 'katak'), {
    legs: 4, says: t('Ribbit!', 'Kwok kwok!'), home: t('ponds and swamps', 'kolam dan rawa'), food: t('insects', 'serangga'),
    baby: t('tadpole', 'kecebong'), fact: t('Frogs catch bugs with their long sticky tongue!', 'Katak menangkap serangga dengan lidahnya yang panjang dan lengket!'),
  }),
  animal('snake', '🐍', ['snake', 'snakes', 'ular'], t('snake', 'ular'), {
    legs: 0, says: t('Hissss!', 'Sssss!'), home: t('grass, forests and deserts', 'rerumputan, hutan, dan gurun'), food: t('mice and eggs', 'tikus dan telur'),
    baby: t('hatchling', 'anak ular'), fact: t('Snakes have no legs; they slither by moving their whole body!', 'Ular tidak berkaki; mereka melata dengan menggerakkan seluruh tubuh!'),
  }),
  animal('rabbit', '🐰', ['rabbit', 'rabbits', 'bunny', 'bunnies', 'kelinci'], t('rabbit', 'kelinci'), {
    legs: 4, home: t('a burrow under the ground', 'liang di dalam tanah'), food: t('grass, leaves and carrots', 'rumput, daun, dan wortel'),
    baby: t('kit', 'anak kelinci'), fact: t('Rabbits thump their back feet to warn their friends!', 'Kelinci menghentakkan kaki belakang untuk memberi tanda bahaya!'),
  }),
  animal('bear', '🐻', ['bear', 'bears', 'beruang'], t('bear', 'beruang'), {
    legs: 4, says: t('Grrrr!', 'Grrrr!'), home: t('forests and caves', 'hutan dan gua'), food: t('fish, berries and honey', 'ikan, buah beri, dan madu'),
    baby: t('cub', 'anak beruang'), fact: t('Some bears sleep all winter long. That is called hibernation!', 'Beberapa beruang tidur sepanjang musim dingin. Namanya hibernasi!'),
  }),
  animal('giraffe', '🦒', ['giraffe', 'giraffes', 'jerapah'], t('giraffe', 'jerapah'), {
    legs: 4, home: t('the grassy savanna', 'padang rumput sabana'), food: t('leaves from tall trees', 'daun dari pohon tinggi'),
    baby: t('calf', 'anak jerapah'), fact: t('Giraffes are the tallest animals in the world!', 'Jerapah adalah hewan paling tinggi di dunia!'),
  }),
  animal('zebra', '🦓', ['zebra', 'zebras'], t('zebra', 'zebra'), {
    legs: 4, says: t('a barky "hee-haw"!', '"hii-haw" seperti menggonggong!'), home: t('the grassy savanna', 'padang rumput sabana'), food: t('grass', 'rumput'),
    baby: t('foal', 'anak zebra'), color: t('black and white', 'hitam dan putih'),
    fact: t('No two zebras have the same stripes!', 'Tidak ada dua zebra yang belangnya sama!'),
  }),
  animal('penguin', '🐧', ['penguin', 'penguins'], t('penguin', 'penguin'), {
    legs: 2, says: t('Squawk!', 'Kwaak!'), home: t('icy cold places like Antarctica', 'tempat dingin bersalju seperti Antartika'), food: t('fish', 'ikan'),
    baby: t('chick', 'anak penguin'), color: t('black and white', 'hitam dan putih'),
    fact: t('Penguins are birds that cannot fly, but they are super swimmers!', 'Penguin adalah burung yang tidak bisa terbang, tapi jago berenang!'),
  }),
  animal('owl', '🦉', ['owl', 'owls', 'burung hantu'], t('owl', 'burung hantu'), {
    legs: 2, says: t('Hoo hoo!', 'Uhu uhu!'), home: t('holes in trees', 'lubang di pohon'), food: t('mice and bugs', 'tikus dan serangga'),
    baby: t('owlet', 'anak burung hantu'), fact: t('Owls are awake at night and can turn their heads very far!', 'Burung hantu bangun di malam hari dan bisa memutar kepalanya jauh sekali!'),
  }),
  animal('shark', '🦈', ['shark', 'sharks', 'hiu', 'ikan hiu'], t('shark', 'hiu'), {
    legs: 0, home: t('the ocean', 'laut'), food: t('fish', 'ikan'), baby: t('pup', 'anak hiu'),
    fact: t('Sharks grow new teeth all their lives!', 'Hiu terus menumbuhkan gigi baru seumur hidupnya!'),
  }),
  animal('whale', '🐳', ['whale', 'whales', 'paus', 'ikan paus'], t('whale', 'paus'), {
    legs: 0, says: t('long songs: Ooooooo~', 'lagu panjang: Ooooooo~'), home: t('the ocean', 'laut'), food: t('tiny krill and small fish', 'udang kecil (krill) dan ikan kecil'),
    baby: t('calf', 'anak paus'), fact: t('The blue whale is the biggest animal ever. It breathes air, so it is not a fish!', 'Paus biru adalah hewan terbesar. Ia bernapas dengan udara, jadi bukan ikan!'),
  }),
  animal('dolphin', '🐬', ['dolphin', 'dolphins', 'lumba lumba'], t('dolphin', 'lumba-lumba'), {
    legs: 0, says: t('clicks and whistles!', 'klik-klik dan siulan!'), home: t('the ocean', 'laut'), food: t('fish', 'ikan'),
    baby: t('calf', 'anak lumba-lumba'), fact: t('Dolphins are very smart and call each other with whistles!', 'Lumba-lumba sangat pintar dan saling memanggil dengan siulan!'),
  }),
  animal('crocodile', '🐊', ['crocodile', 'crocodiles', 'buaya'], t('crocodile', 'buaya'), {
    legs: 4, says: t('Hiss! (and a deep grunt)', 'Desis! (dan geraman berat)'), home: t('rivers and swamps', 'sungai dan rawa'), food: t('fish and meat', 'ikan dan daging'),
    baby: t('hatchling', 'anak buaya'), fact: t('Crocodiles have been around since the time of the dinosaurs!', 'Buaya sudah ada sejak zaman dinosaurus!'),
  }),
  animal('turtle', '🐢', ['turtle', 'turtles', 'tortoise', 'kura kura', 'penyu'], t('turtle', 'kura-kura'), {
    legs: 4, home: t('the sea, ponds or land', 'laut, kolam, atau darat'), food: t('plants and jellyfish', 'tumbuhan dan ubur-ubur'),
    baby: t('hatchling', 'tukik'), fact: t('A turtle carries its home, its shell, everywhere it goes!', 'Kura-kura membawa rumahnya, yaitu cangkang, ke mana pun!'),
  }),
  animal('octopus', '🐙', ['octopus', 'octopuses', 'gurita'], t('octopus', 'gurita'), {
    legsText: t('An octopus has 8 arms! 🐙', 'Gurita punya 8 lengan! 🐙'), home: t('the sea', 'laut'), food: t('crabs and fish', 'kepiting dan ikan'),
    fact: t('An octopus has 3 hearts and can change color to hide!', 'Gurita punya 3 jantung dan bisa berubah warna untuk bersembunyi!'),
  }),
  animal('kangaroo', '🦘', ['kangaroo', 'kangaroos', 'kanguru'], t('kangaroo', 'kanguru'), {
    legsText: t('A kangaroo has 2 big strong legs for hopping, plus 2 small arms!', 'Kanguru punya 2 kaki besar untuk melompat, dan 2 tangan kecil!'),
    home: t('the grasslands of Australia', 'padang rumput Australia'), food: t('grass and leaves', 'rumput dan daun'), baby: t('joey', 'joey'),
    fact: t('A baby kangaroo lives in its mom’s pouch!', 'Bayi kanguru tinggal di kantong ibunya!'),
  }),
  animal('mouse', '🐭', ['mouse', 'mice', 'tikus'], t('mouse', 'tikus'), {
    legs: 4, says: t('Squeak!', 'Cit cit!'), home: t('small holes and nests', 'lubang dan sarang kecil'), food: t('seeds, grains and fruit', 'biji, gandum, dan buah'),
    baby: t('pup', 'anak tikus'), fact: t('Mice use their whiskers to feel their way in the dark!', 'Tikus memakai kumisnya untuk merasakan jalan di gelap!'),
  }),
  animal('flamingo', '🦩', ['flamingo', 'flamingos', 'flamingoes'], t('flamingo', 'flamingo'), {
    legs: 2, home: t('lakes and lagoons', 'danau dan laguna'), food: t('tiny shrimp', 'udang kecil'), baby: t('chick', 'anak flamingo'),
    color: t('pink', 'merah muda'), fact: t('Flamingos are pink because of the shrimp they eat, and they often stand on one leg!', 'Flamingo berwarna merah muda karena udang yang dimakannya, dan sering berdiri dengan satu kaki!'),
  }),
];

const sp = (id: string, emoji: string, names: string[], name: Text, fact: Text, color?: Text): Entity => ({
  id, kind: 'space', emoji, names, name, fact, color, subj: `${name.en[0].toUpperCase()}${name.en.slice(1)}`,
});

export const SPACE: Entity[] = [
  sp('sun', '☀️', ['sun', 'matahari', 'mentari'], t('the Sun', 'Matahari'), t('The Sun is a star! It is so big that about a million Earths could fit inside.', 'Matahari adalah bintang! Ukurannya sangat besar, sekitar satu juta Bumi bisa masuk ke dalamnya.')),
  sp('moon', '🌙', ['moon', 'bulan'], t('the Moon', 'Bulan'), t('The Moon goes around the Earth. It has no light of its own; it shines because the Sun lights it up!', 'Bulan mengelilingi Bumi. Bulan tidak punya cahaya sendiri; ia bersinar karena disinari Matahari!'), t('gray', 'abu-abu')),
  sp('earth', '🌍', ['earth', 'bumi'], t('Earth', 'Bumi'), t('Earth is the 3rd planet from the Sun and the only one we know with living things!', 'Bumi adalah planet ke-3 dari Matahari dan satu-satunya yang kita tahu punya makhluk hidup!'), t('blue and green', 'biru dan hijau')),
  sp('mercury', '🪨', ['mercury', 'merkurius'], t('Mercury', 'Merkurius'), t('Mercury is the closest planet to the Sun and the smallest planet.', 'Merkurius adalah planet terdekat dari Matahari dan planet terkecil.'), t('gray', 'abu-abu')),
  sp('venus', '🌕', ['venus'], t('Venus', 'Venus'), t('Venus is the 2nd planet and the hottest one, even hotter than Mercury!', 'Venus adalah planet ke-2 dan yang paling panas, bahkan lebih panas dari Merkurius!'), t('yellowish white', 'putih kekuningan')),
  sp('mars', '🔴', ['mars'], t('Mars', 'Mars'), t('Mars is the 4th planet. It is called the Red Planet because of its rusty red dust!', 'Mars adalah planet ke-4. Disebut Planet Merah karena debunya merah seperti karat!'), t('red', 'merah')),
  sp('jupiter', '🟠', ['jupiter', 'yupiter'], t('Jupiter', 'Yupiter'), t('Jupiter is the 5th planet and the biggest one. It has a giant storm called the Great Red Spot!', 'Yupiter adalah planet ke-5 dan yang terbesar. Ia punya badai raksasa bernama Bintik Merah Besar!'), t('orange and white stripes', 'belang oranye dan putih')),
  sp('saturn', '🪐', ['saturn', 'saturnus'], t('Saturn', 'Saturnus'), t('Saturn is the 6th planet. Its beautiful rings are made of ice and rock!', 'Saturnus adalah planet ke-6. Cincinnya yang indah terbuat dari es dan batu!'), t('pale yellow', 'kuning pucat')),
  sp('uranus', '🔵', ['uranus'], t('Uranus', 'Uranus'), t('Uranus is the 7th planet. It spins lying on its side!', 'Uranus adalah planet ke-7. Ia berputar sambil "berbaring" miring!'), t('light blue', 'biru muda')),
  sp('neptune', '🔵', ['neptune', 'neptunus'], t('Neptune', 'Neptunus'), t('Neptune is the 8th planet, the farthest from the Sun, with super fast winds!', 'Neptunus adalah planet ke-8, paling jauh dari Matahari, dengan angin yang sangat kencang!'), t('deep blue', 'biru tua')),
];

const shape = (id: string, emoji: string, names: string[], name: Text, sides: number, corners: number, fact: Text): Entity => ({
  id, kind: 'shape', emoji, names, name, sides, corners, fact,
});

export const SHAPES: Entity[] = [
  shape('circle', '⚪', ['circle', 'circles', 'lingkaran', 'bulat'], t('circle', 'lingkaran'), 0, 0, t('Wheels, coins and pizzas are circles!', 'Roda, koin, dan pizza berbentuk lingkaran!')),
  shape('oval', '🥚', ['oval', 'ovals', 'lonjong'], t('oval', 'oval'), 0, 0, t('An egg is shaped like an oval, a stretched circle!', 'Telur berbentuk oval, seperti lingkaran yang ditarik!')),
  shape('triangle', '🔺', ['triangle', 'triangles', 'segitiga'], t('triangle', 'segitiga'), 3, 3, t('A slice of pizza and a mountain top look like triangles!', 'Sepotong pizza dan puncak gunung mirip segitiga!')),
  shape('square', '🟥', ['square', 'squares', 'persegi', 'kotak', 'bujur sangkar'], t('square', 'persegi'), 4, 4, t('All 4 sides of a square are the same length!', 'Keempat sisi persegi sama panjang!')),
  shape('rectangle', '▭', ['rectangle', 'rectangles', 'persegi panjang'], t('rectangle', 'persegi panjang'), 4, 4, t('A door and a book are rectangles: 2 long sides and 2 short sides!', 'Pintu dan buku berbentuk persegi panjang: 2 sisi panjang dan 2 sisi pendek!')),
  shape('diamond', '🔷', ['diamond', 'rhombus', 'belah ketupat', 'ketupat'], t('diamond', 'belah ketupat'), 4, 4, t('A diamond (rhombus) is like a square standing on one corner!', 'Belah ketupat seperti persegi yang berdiri di salah satu sudutnya!')),
  shape('pentagon', '⬟', ['pentagon', 'pentagons', 'segilima', 'segi lima'], t('pentagon', 'segi lima'), 5, 5, t('"Penta" means 5!', '"Penta" artinya 5!')),
  shape('hexagon', '⬢', ['hexagon', 'hexagons', 'segienam', 'segi enam'], t('hexagon', 'segi enam'), 6, 6, t('Bees build their honeycomb out of hexagons!', 'Lebah membuat sarang madu dari bentuk segi enam!')),
  shape('octagon', '🛑', ['octagon', 'octagons', 'segidelapan', 'segi delapan'], t('octagon', 'segi delapan'), 8, 8, t('A stop sign is an octagon!', 'Rambu berhenti (STOP) berbentuk segi delapan!')),
  shape('star', '⭐', ['star', 'stars', 'bintang'], t('star', 'bintang'), 10, 10, t('A star shape has 5 pointy tips!', 'Bentuk bintang punya 5 ujung lancip!')),
];

const food = (id: string, emoji: string, names: string[], name: Text, group: 'fruit' | 'veg', color: Text, fact: Text): Entity => ({
  id, kind: 'food', emoji, names, name, group, color, fact,
});

export const FOODS: Entity[] = [
  food('banana', '🍌', ['banana', 'bananas', 'pisang'], t('banana', 'pisang'), 'fruit', t('yellow', 'kuning'), t('Bananas grow in big bunches called hands!', 'Pisang tumbuh bergerombol dalam satu tandan!')),
  food('apple', '🍎', ['apple', 'apples', 'apel'], t('apple', 'apel'), 'fruit', t('red, green or yellow', 'merah, hijau, atau kuning'), t('There are thousands of kinds of apples!', 'Ada ribuan jenis apel!')),
  food('orange', '🍊', ['oranges', 'jeruk'], t('orange', 'jeruk'), 'fruit', t('orange', 'oranye'), t('Oranges are full of vitamin C to help you stay healthy!', 'Jeruk penuh vitamin C supaya kamu tetap sehat!')),
  food('grape', '🍇', ['grape', 'grapes', 'anggur'], t('grape', 'anggur'), 'fruit', t('purple or green', 'ungu atau hijau'), t('Dried grapes are called raisins!', 'Anggur yang dikeringkan disebut kismis!')),
  food('strawberry', '🍓', ['strawberry', 'strawberries', 'stroberi'], t('strawberry', 'stroberi'), 'fruit', t('red', 'merah'), t('Strawberries wear their seeds on the outside!', 'Biji stroberi ada di bagian luarnya!')),
  food('watermelon', '🍉', ['watermelon', 'watermelons', 'semangka'], t('watermelon', 'semangka'), 'fruit', t('green on the outside and red on the inside', 'hijau di luar dan merah di dalam'), t('A watermelon is mostly water, so it is great on a hot day!', 'Semangka sebagian besar berisi air, cocok saat cuaca panas!')),
  food('lemon', '🍋', ['lemon', 'lemons'], t('lemon', 'lemon'), 'fruit', t('yellow', 'kuning'), t('Lemons taste very sour!', 'Lemon rasanya sangat asam!')),
  food('mango', '🥭', ['mango', 'mangoes', 'mangos', 'mangga'], t('mango', 'mangga'), 'fruit', t('green or yellow outside, and orange-yellow inside', 'hijau atau kuning di luar, dan kuning-oranye di dalam'), t('Mangoes grow on big trees in warm places like Indonesia!', 'Mangga tumbuh di pohon besar di tempat hangat seperti Indonesia!')),
  food('pineapple', '🍍', ['pineapple', 'pineapples', 'nanas', 'nanas'], t('pineapple', 'nanas'), 'fruit', t('yellow inside with a spiky brown-green skin', 'kuning di dalam dengan kulit cokelat-hijau berduri'), t('A pineapple takes about 2 years to grow!', 'Nanas butuh sekitar 2 tahun untuk tumbuh!')),
  food('blueberry', '🫐', ['blueberry', 'blueberries'], t('blueberry', 'bluberi'), 'fruit', t('blue', 'biru'), t('Blueberries are one of the few blue foods!', 'Bluberi adalah salah satu dari sedikit makanan berwarna biru!')),
  food('tomato', '🍅', ['tomato', 'tomatoes', 'tomat'], t('tomato', 'tomat'), 'fruit', t('red', 'merah'), t('Surprise: a tomato is really a fruit because it has seeds inside, but we cook it like a vegetable!', 'Kejutan: tomat sebenarnya buah karena ada bijinya, tapi kita memasaknya seperti sayur!')),
  food('carrot', '🥕', ['carrot', 'carrots', 'wortel'], t('carrot', 'wortel'), 'veg', t('orange', 'oranye'), t('Carrots grow under the ground and are good for your eyes!', 'Wortel tumbuh di dalam tanah dan baik untuk matamu!')),
  food('broccoli', '🥦', ['broccoli', 'brokoli'], t('broccoli', 'brokoli'), 'veg', t('green', 'hijau'), t('Broccoli looks like a tiny tree!', 'Brokoli mirip pohon kecil!')),
  food('eggplant', '🍆', ['eggplant', 'eggplants', 'terong', 'terung'], t('eggplant', 'terong'), 'veg', t('purple', 'ungu'), t('Eggplants are soft and yummy when cooked!', 'Terong jadi lembut dan enak saat dimasak!')),
  food('corn', '🌽', ['corn', 'jagung'], t('corn', 'jagung'), 'veg', t('yellow', 'kuning'), t('Popcorn is made from corn kernels that pop when hot!', 'Popcorn dibuat dari biji jagung yang meletus saat panas!')),
  food('potato', '🥔', ['potato', 'potatoes', 'kentang'], t('potato', 'kentang'), 'veg', t('brown outside and pale yellow inside', 'cokelat di luar dan kuning pucat di dalam'), t('French fries are made from potatoes!', 'Kentang goreng dibuat dari kentang!')),
  food('cucumber', '🥒', ['cucumber', 'cucumbers', 'timun', 'mentimun'], t('cucumber', 'mentimun'), 'veg', t('green', 'hijau'), t('Cucumbers are crunchy and full of water!', 'Mentimun renyah dan penuh air!')),
  food('spinach', '🥬', ['spinach', 'bayam'], t('spinach', 'bayam'), 'veg', t('green', 'hijau'), t('Spinach leaves help make your body strong!', 'Daun bayam membantu tubuhmu jadi kuat!')),
  food('pumpkin', '🎃', ['pumpkin', 'pumpkins', 'labu'], t('pumpkin', 'labu'), 'veg', t('orange', 'oranye'), t('Pumpkins can grow bigger than you!', 'Labu bisa tumbuh lebih besar dari kamu!')),
];

const thing = (id: string, emoji: string, names: string[], name: Text, subj: string, color: Text, fact: Text): Entity => ({
  id, kind: 'thing', emoji, names, name, subj, color, fact,
});

export const THINGS: Entity[] = [
  thing('sky', '🌤️', ['sky', 'langit'], t('the sky', 'langit'), 'The sky', t('blue on a sunny day', 'biru saat cerah'), t('Sunlight is made of all colors, and the air bounces the blue light around the most. That is why the sky looks blue!', 'Sinar matahari berisi semua warna, dan udara paling banyak memantulkan cahaya biru. Karena itu langit terlihat biru!')),
  thing('grass', '🌱', ['grass', 'rumput'], t('grass', 'rumput'), 'Grass', t('green', 'hijau'), t('Grass is green because of chlorophyll, which helps it make food from sunlight!', 'Rumput hijau karena klorofil, yang membantunya membuat makanan dari sinar matahari!')),
  thing('leaf', '🍃', ['leaf', 'leaves', 'daun'], t('leaf', 'daun'), 'A leaf', t('green (and in autumn it can turn yellow, orange or red)', 'hijau (dan di musim gugur bisa jadi kuning, oranye, atau merah)'), t('Leaves catch sunlight to make food for the plant!', 'Daun menangkap sinar matahari untuk membuat makanan bagi tanaman!')),
  thing('milk', '🥛', ['milk', 'susu'], t('milk', 'susu'), 'Milk', t('white', 'putih'), t('Milk has calcium to make your bones and teeth strong!', 'Susu mengandung kalsium untuk tulang dan gigi yang kuat!')),
  thing('chocolate', '🍫', ['chocolate', 'cokelat', 'coklat'], t('chocolate', 'cokelat'), 'Chocolate', t('brown', 'cokelat'), t('Chocolate is made from cacao beans that grow on trees!', 'Cokelat dibuat dari biji kakao yang tumbuh di pohon!')),
  thing('sea', '🌊', ['sea', 'ocean', 'laut', 'samudra', 'samudera'], t('the sea', 'laut'), 'The sea', t('blue', 'biru'), t('Oceans cover most of our planet, and sea water is salty!', 'Lautan menutupi sebagian besar planet kita, dan air laut rasanya asin!')),
];

const veh = (id: string, emoji: string, names: string[], name: Text, where: Text, fact: Text, wheels?: number): Entity => ({
  id, kind: 'vehicle', emoji, names, name, where, fact, wheels,
});

export const VEHICLES: Entity[] = [
  veh('car', '🚗', ['car', 'cars', 'mobil'], t('car', 'mobil'), t('on roads', 'di jalan raya'), t('Always wear your seat belt in a car!', 'Selalu pakai sabuk pengaman di mobil!'), 4),
  veh('bus', '🚌', ['bus', 'buses', 'bis'], t('bus', 'bus'), t('on roads', 'di jalan raya'), t('A bus can carry lots of people at once. Big buses can have 6 wheels or more!', 'Bus bisa membawa banyak orang sekaligus. Bus besar bisa punya 6 roda atau lebih!'), 4),
  veh('bicycle', '🚲', ['bicycle', 'bicycles', 'bike', 'bikes', 'sepeda'], t('bicycle', 'sepeda'), t('on roads and paths', 'di jalan dan jalur sepeda'), t('You make a bicycle go with your own legs, and always wear a helmet!', 'Sepeda bergerak dengan tenaga kakimu, dan selalu pakai helm!'), 2),
  veh('motorcycle', '🏍️', ['motorcycle', 'motorcycles', 'motorbike', 'sepeda motor', 'motor'], t('motorcycle', 'sepeda motor'), t('on roads', 'di jalan raya'), t('Riders must always wear a helmet!', 'Pengendara harus selalu memakai helm!'), 2),
  veh('becak', '🛺', ['becak', 'tricycle', 'tricycles'], t('tricycle', 'becak'), t('on roads', 'di jalan'), t('A becak is a pedal tricycle taxi from Indonesia!', 'Becak adalah kendaraan roda tiga yang dikayuh, khas Indonesia!'), 3),
  veh('truck', '🚚', ['truck', 'trucks', 'lorry', 'truk'], t('truck', 'truk'), t('on roads', 'di jalan raya'), t('Trucks carry heavy things. Giant trucks can have 18 wheels!', 'Truk membawa barang berat. Truk raksasa bisa punya 18 roda!'), 6),
  veh('train', '🚆', ['train', 'trains', 'kereta', 'kereta api'], t('train', 'kereta'), t('on rails (train tracks)', 'di atas rel'), t('A train has lots of metal wheels that roll on the tracks!', 'Kereta punya banyak roda besi yang berjalan di atas rel!')),
  veh('plane', '✈️', ['plane', 'planes', 'airplane', 'aeroplane', 'pesawat', 'pesawat terbang'], t('plane', 'pesawat'), t('in the sky', 'di langit'), t('Planes fly with big wings, and fold their wheels away while flying!', 'Pesawat terbang dengan sayap besar, dan melipat rodanya saat terbang!')),
  veh('helicopter', '🚁', ['helicopter', 'helicopters', 'helikopter'], t('helicopter', 'helikopter'), t('in the sky', 'di langit'), t('A helicopter can fly straight up and even stay still in the air!', 'Helikopter bisa terbang lurus ke atas dan diam di udara!')),
  veh('boat', '⛵', ['boat', 'boats', 'ship', 'ships', 'perahu', 'kapal'], t('boat', 'perahu'), t('on water', 'di air'), t('Boats float on water. Big ones are called ships!', 'Perahu mengapung di air. Yang besar disebut kapal!'), 0),
  veh('submarine', '🤿', ['submarine', 'submarines', 'kapal selam'], t('submarine', 'kapal selam'), t('under the water', 'di bawah air'), t('A submarine can dive deep under the sea!', 'Kapal selam bisa menyelam jauh ke dalam laut!'), 0),
  veh('rocket', '🚀', ['rocket', 'rockets', 'roket'], t('rocket', 'roket'), t('to outer space', 'ke luar angkasa'), t('Rockets blast fire downward to zoom up into space!', 'Roket menyemburkan api ke bawah untuk meluncur ke luar angkasa!'), 0),
  veh('firetruck', '🚒', ['fire truck', 'fire engine', 'firetruck', 'pemadam kebakaran', 'mobil pemadam'], t('fire truck', 'mobil pemadam kebakaran'), t('on roads, to put out fires', 'di jalan, untuk memadamkan api'), t('Fire trucks carry water, hoses and tall ladders!', 'Mobil pemadam membawa air, selang, dan tangga tinggi!'), 6),
  veh('ambulance', '🚑', ['ambulance', 'ambulances', 'ambulans'], t('ambulance', 'ambulans'), t('on roads, to take sick people to hospital', 'di jalan, membawa orang sakit ke rumah sakit'), t('When you hear its siren, cars move aside to let it pass!', 'Saat sirenenya berbunyi, mobil lain menepi memberi jalan!'), 4),
];

const body = (id: string, emoji: string, names: string[], name: Text, fact: Text, count?: Text): Entity => ({
  id, kind: 'body', emoji, names, name, fact, count,
});

export const BODY: Entity[] = [
  body('eyes', '👀', ['eye', 'eyes', 'mata'], t('eyes', 'mata'), t('We SEE with our eyes. Blinking keeps them clean and wet!', 'Kita MELIHAT dengan mata. Berkedip menjaga mata tetap bersih dan basah!'), t('You have 2 eyes! 👀', 'Kamu punya 2 mata! 👀')),
  body('ears', '👂', ['ear', 'ears', 'telinga', 'kuping'], t('ears', 'telinga'), t('We HEAR with our ears. They also help us keep our balance!', 'Kita MENDENGAR dengan telinga. Telinga juga membantu kita menjaga keseimbangan!'), t('You have 2 ears! 👂', 'Kamu punya 2 telinga! 👂')),
  body('nose', '👃', ['nose', 'hidung'], t('nose', 'hidung'), t('We SMELL with our nose, and we breathe through it too!', 'Kita MENCIUM bau dengan hidung, dan bernapas lewat hidung juga!'), t('You have 1 nose with 2 holes called nostrils! 👃', 'Kamu punya 1 hidung dengan 2 lubang hidung! 👃')),
  body('tongue', '👅', ['tongue', 'lidah'], t('tongue', 'lidah'), t('We TASTE with our tongue: sweet, sour, salty and bitter!', 'Kita MENGECAP rasa dengan lidah: manis, asam, asin, dan pahit!')),
  body('skin', '🖐️', ['skin', 'kulit'], t('skin', 'kulit'), t('We TOUCH and FEEL with our skin: hot, cold, soft and rough!', 'Kita MERABA dengan kulit: panas, dingin, lembut, dan kasar!')),
  body('fingers', '🖐️', ['finger', 'fingers', 'jari', 'jari tangan', 'jemari'], t('fingers', 'jari'), t('Your fingers help you hold, draw, and answer in Mewing Academy!', 'Jarimu membantu memegang, menggambar, dan menjawab di Mewing Academy!'), t('You have 10 fingers: 5 on each hand! 🖐️🖐️', 'Kamu punya 10 jari tangan: 5 di setiap tangan! 🖐️🖐️')),
  body('toes', '🦶', ['toe', 'toes', 'jari kaki'], t('toes', 'jari kaki'), t('Your toes help you balance when you walk and run!', 'Jari kakimu membantu menjaga keseimbangan saat berjalan dan berlari!'), t('You have 10 toes: 5 on each foot! 🦶🦶', 'Kamu punya 10 jari kaki: 5 di setiap kaki! 🦶🦶')),
  body('hands', '🙌', ['hand', 'hands', 'tangan'], t('hands', 'tangan'), t('Hands can wave, clap, hold and help!', 'Tangan bisa melambai, bertepuk, memegang, dan menolong!'), t('You have 2 hands with 5 fingers each! 🙌', 'Kamu punya 2 tangan, masing-masing 5 jari! 🙌')),
  body('feet', '🦶', ['foot', 'feet', 'kaki'], t('feet', 'kaki'), t('Your feet carry you everywhere you walk, run and jump!', 'Kakimu membawamu berjalan, berlari, dan melompat!'), t('You have 2 feet (and 2 legs)! 🦶', 'Kamu punya 2 kaki! 🦶')),
  body('teeth', '🦷', ['tooth', 'teeth', 'gigi'], t('teeth', 'gigi'), t('Brush your teeth 2 times a day to keep them strong!', 'Sikat gigi 2 kali sehari supaya tetap kuat!'), t('Kids have 20 baby teeth. Grown-ups have 32 teeth! 🦷', 'Anak-anak punya 20 gigi susu. Orang dewasa punya 32 gigi! 🦷')),
  body('heart', '❤️', ['heart', 'jantung'], t('heart', 'jantung'), t('Your heart pumps blood all around your body, all day and night!', 'Jantungmu memompa darah ke seluruh tubuh, siang dan malam!'), t('You have 1 heart, about the size of your fist! ❤️', 'Kamu punya 1 jantung, kira-kira sebesar kepalan tanganmu! ❤️')),
  body('brain', '🧠', ['brain', 'otak'], t('brain', 'otak'), t('Your brain helps you think, learn, remember and dream!', 'Otakmu membantumu berpikir, belajar, mengingat, dan bermimpi!')),
  body('lungs', '🫁', ['lung', 'lungs', 'paru', 'paru paru'], t('lungs', 'paru-paru'), t('Your lungs fill with air every time you breathe in!', 'Paru-parumu terisi udara setiap kali kamu menarik napas!'), t('You have 2 lungs! 🫁', 'Kamu punya 2 paru-paru! 🫁')),
  body('bones', '🦴', ['bone', 'bones', 'tulang', 'kerangka', 'skeleton'], t('bones', 'tulang'), t('Bones hold your body up, like the frame of a house!', 'Tulang menopang tubuhmu, seperti rangka rumah!'), t('A grown-up has 206 bones. Babies are born with even more, and some join together as they grow! 🦴', 'Orang dewasa punya 206 tulang. Bayi lahir dengan lebih banyak, lalu sebagian menyatu saat tumbuh! 🦴')),
];

const w = (id: string, emoji: string, names: string[], name: Text, fact: Text): Entity => ({ id, kind: 'weather', emoji, names, name, fact });

export const WEATHER: Entity[] = [
  w('rain', '🌧️', ['rain', 'raining', 'rainy', 'hujan'], t('rain', 'hujan'), t('Rain is water falling from clouds. Clouds are made of tiny water drops that join and get heavy!', 'Hujan adalah air yang jatuh dari awan. Awan berisi tetes air kecil yang bergabung dan jadi berat!')),
  { ...w('rainbow', '🌈', ['rainbow', 'rainbows', 'pelangi'], t('rainbow', 'pelangi'), t('Rainbows show up when the Sun shines while it is still raining. Stand with the Sun behind you to spot one!', 'Pelangi muncul saat Matahari bersinar ketika masih hujan. Berdirilah membelakangi Matahari untuk melihatnya!')), color: t('red, orange, yellow, green, blue, indigo and violet: 7 colors', 'merah, jingga, kuning, hijau, biru, nila, dan ungu: 7 warna') },
  w('snow', '❄️', ['snow', 'snowing', 'snowflake', 'snowflakes', 'salju'], t('snow', 'salju'), t('Snow is frozen water from very cold clouds. Every snowflake has 6 sides!', 'Salju adalah air beku dari awan yang sangat dingin. Setiap kepingan salju punya 6 sisi!')),
  w('thunder', '⛈️', ['thunder', 'guntur', 'geledek', 'gemuruh'], t('thunder', 'guntur'), t('Thunder is the loud BOOM made by lightning heating the air very fast!', 'Guntur adalah suara DUAR dari petir yang memanaskan udara dengan sangat cepat!')),
  w('lightning', '⚡', ['lightning', 'petir', 'kilat'], t('lightning', 'petir'), t('Lightning is a giant spark of electricity in a storm. Stay indoors when you see it!', 'Petir adalah percikan listrik raksasa saat badai. Tetap di dalam rumah saat ada petir!')),
  w('cloud', '☁️', ['cloud', 'clouds', 'cloudy', 'awan', 'mendung'], t('cloud', 'awan'), t('Clouds are made of millions of tiny water drops floating in the sky!', 'Awan terbuat dari jutaan tetes air kecil yang melayang di langit!')),
  w('wind', '🌬️', ['wind', 'windy', 'angin'], t('wind', 'angin'), t('Wind is moving air. You cannot see it, but you can feel it and see leaves dance!', 'Angin adalah udara yang bergerak. Tidak terlihat, tapi bisa dirasakan dan membuat daun menari!')),
  w('storm', '🌪️', ['storm', 'storms', 'badai'], t('storm', 'badai'), t('A storm brings strong wind, heavy rain and sometimes lightning. Stay safe inside!', 'Badai membawa angin kencang, hujan lebat, dan kadang petir. Tetap aman di dalam!')),
];

export const ENTITIES: Entity[] = [...ANIMALS, ...SPACE, ...SHAPES, ...FOODS, ...THINGS, ...VEHICLES, ...BODY, ...WEATHER];

/** "how many / which" facts: every keyword group must appear in the question. */
export interface Rule {
  all: string[][];
  reply: Text;
  lesson: Exclude<TopicId, 'memory'>;
}

const COUNT = ['many', 'much', 'number', 'berapa', 'jumlah', 'banyak'];
const PLANETS = ['planet', 'planets'];
const BIGGEST = ['biggest', 'largest', 'big', 'terbesar', 'paling besar'];

export const RULES: Rule[] = [
  { all: [PLANETS, COUNT], lesson: 'space', reply: t('There are 8 planets: Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus and Neptune! 🪐', 'Ada 8 planet: Merkurius, Venus, Bumi, Mars, Yupiter, Saturnus, Uranus, dan Neptunus! 🪐') },
  { all: [PLANETS, BIGGEST], lesson: 'space', reply: t('Jupiter is the biggest planet! More than 1,000 Earths could fit inside it. 🟠', 'Yupiter adalah planet terbesar! Lebih dari 1.000 Bumi bisa masuk ke dalamnya. 🟠') },
  { all: [PLANETS, ['smallest', 'tiniest', 'terkecil', 'paling kecil']], lesson: 'space', reply: t('Mercury is the smallest planet. 🪨', 'Merkurius adalah planet terkecil. 🪨') },
  { all: [PLANETS, ['hottest', 'terpanas', 'paling panas']], lesson: 'space', reply: t('Venus is the hottest planet, because its thick clouds trap the heat! 🌕', 'Venus adalah planet terpanas, karena awannya yang tebal menyimpan panas! 🌕') },
  { all: [PLANETS, ['closest', 'nearest', 'terdekat', 'paling dekat']], lesson: 'space', reply: t('Mercury is the closest planet to the Sun. ☀️', 'Merkurius adalah planet terdekat dari Matahari. ☀️') },
  { all: [PLANETS, ['farthest', 'furthest', 'terjauh', 'paling jauh']], lesson: 'space', reply: t('Neptune is the farthest planet from the Sun. 🔵', 'Neptunus adalah planet terjauh dari Matahari. 🔵') },
  { all: [PLANETS, ['ring', 'rings', 'cincin']], lesson: 'space', reply: t('Saturn has the biggest, brightest rings! Jupiter, Uranus and Neptune have thin rings too. 🪐', 'Saturnus punya cincin paling besar dan terang! Yupiter, Uranus, dan Neptunus juga punya cincin tipis. 🪐') },
  { all: [PLANETS, ['red', 'merah']], lesson: 'space', reply: t('Mars is the Red Planet! 🔴', 'Mars adalah Planet Merah! 🔴') },
  { all: [['day', 'days', 'hari'], ['week', 'seminggu', 'minggu', 'pekan'], COUNT], lesson: 'time', reply: t('A week has 7 days! 📅', 'Satu minggu ada 7 hari! 📅') },
  { all: [['day', 'days', 'hari'], ['week', 'seminggu', 'minggu', 'pekan']], lesson: 'time', reply: t('The 7 days of the week: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday and Sunday! 📅', 'Tujuh hari dalam seminggu: Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, dan Minggu! 📅') },
  { all: [['month', 'months', 'bulan'], ['year', 'tahun', 'setahun'], COUNT], lesson: 'time', reply: t('A year has 12 months! 🗓️', 'Satu tahun ada 12 bulan! 🗓️') },
  { all: [['month', 'months', 'bulan'], ['year', 'tahun', 'setahun']], lesson: 'time', reply: t('The 12 months: January, February, March, April, May, June, July, August, September, October, November and December! 🗓️', '12 bulan: Januari, Februari, Maret, April, Mei, Juni, Juli, Agustus, September, Oktober, November, dan Desember! 🗓️') },
  { all: [['day', 'days', 'hari'], ['year', 'tahun', 'setahun'], COUNT], lesson: 'time', reply: t('A year has 365 days (366 in a leap year)! 🎉', 'Satu tahun ada 365 hari (366 di tahun kabisat)! 🎉') },
  { all: [['hour', 'hours', 'jam'], ['day', 'hari', 'sehari'], COUNT], lesson: 'time', reply: t('A day has 24 hours! ⏰', 'Satu hari ada 24 jam! ⏰') },
  { all: [['minute', 'minutes', 'menit'], ['hour', 'jam', 'sejam'], COUNT], lesson: 'time', reply: t('An hour has 60 minutes! ⏰', 'Satu jam ada 60 menit! ⏰') },
  { all: [['second', 'seconds', 'detik'], ['minute', 'menit', 'semenit'], COUNT], lesson: 'time', reply: t('A minute has 60 seconds! ⏱️', 'Satu menit ada 60 detik! ⏱️') },
  { all: [['letter', 'letters', 'huruf'], ['alphabet', 'alfabet', 'abjad'], COUNT], lesson: 'letters', reply: t('The alphabet has 26 letters, from A to Z! 🔤', 'Alfabet punya 26 huruf, dari A sampai Z! 🔤') },
  { all: [['vowel', 'vowels', 'vokal']], lesson: 'letters', reply: t('The vowels are A, E, I, O and U! 🔤', 'Huruf vokal adalah A, I, U, E, dan O! 🔤') },
  { all: [['rainbow', 'pelangi'], ['color', 'colors', 'colour', 'colours', 'warna'], COUNT], lesson: 'colors', reply: t('A rainbow has 7 colors: red, orange, yellow, green, blue, indigo and violet! 🌈', 'Pelangi punya 7 warna: merah, jingga, kuning, hijau, biru, nila, dan ungu! 🌈') },
  { all: [['primary', 'dasar', 'primer'], ['color', 'colors', 'colour', 'colours', 'warna']], lesson: 'colors', reply: t('The 3 primary colors are red, yellow and blue. Mix them to make all the others! 🎨', 'Tiga warna dasar adalah merah, kuning, dan biru. Campurkan untuk membuat warna lain! 🎨') },
  { all: [['insect', 'insects', 'bug', 'bugs', 'serangga'], ['leg', 'legs', 'kaki']], lesson: 'animals', reply: t('Insects have 6 legs! Spiders have 8, so they are not insects. 🐜', 'Serangga punya 6 kaki! Laba-laba punya 8, jadi bukan serangga. 🐜') },
  { all: [['sense', 'senses', 'indra', 'indera', 'pancaindra', 'pancaindera']], lesson: 'body', reply: t('We have 5 senses: seeing 👀, hearing 👂, smelling 👃, tasting 👅 and touching 🖐️!', 'Kita punya 5 indra: penglihatan 👀, pendengaran 👂, penciuman 👃, pengecap 👅, dan peraba 🖐️!') },
  { all: [['season', 'seasons', 'musim']], lesson: 'weather', reply: t('Some places have 4 seasons: spring, summer, autumn and winter. Indonesia has 2: the rainy season and the dry season! 🌦️', 'Beberapa tempat punya 4 musim: semi, panas, gugur, dan dingin. Indonesia punya 2: musim hujan dan musim kemarau! 🌦️') },
  { all: [['animal', 'animals', 'hewan', 'binatang'], BIGGEST], lesson: 'animals', reply: t('The blue whale is the biggest animal ever! On land, the elephant is the biggest. 🐳🐘', 'Paus biru adalah hewan terbesar! Di darat, gajah yang terbesar. 🐳🐘') },
  { all: [['animal', 'animals', 'hewan', 'binatang'], ['tallest', 'tertinggi', 'paling tinggi']], lesson: 'animals', reply: t('The giraffe is the tallest animal! 🦒', 'Jerapah adalah hewan paling tinggi! 🦒') },
  { all: [['animal', 'animals', 'hewan', 'binatang'], ['fastest', 'tercepat', 'paling cepat']], lesson: 'animals', reply: t('The cheetah is the fastest animal on land, as fast as a car on the highway! 🐆', 'Cheetah adalah hewan darat tercepat, secepat mobil di jalan tol! 🐆') },
];

/** Opposite pairs; the first listed partner wins for words with two opposites. */
export const OPPOSITES: [string, string][] = [
  ['big', 'small'], ['large', 'small'], ['hot', 'cold'], ['up', 'down'], ['happy', 'sad'], ['fast', 'slow'],
  ['day', 'night'], ['open', 'closed'], ['full', 'empty'], ['tall', 'short'], ['long', 'short'], ['wet', 'dry'],
  ['light', 'dark'], ['old', 'new'], ['in', 'out'], ['loud', 'quiet'], ['hard', 'soft'], ['clean', 'dirty'],
  ['heavy', 'light'], ['left', 'right'], ['top', 'bottom'], ['push', 'pull'], ['front', 'back'], ['high', 'low'],
  ['thick', 'thin'], ['near', 'far'], ['inside', 'outside'], ['awake', 'asleep'], ['laugh', 'cry'], ['win', 'lose'],
  ['early', 'late'], ['first', 'last'], ['on', 'off'], ['good', 'bad'], ['yes', 'no'], ['come', 'go'], ['stop', 'go'],
  ['young', 'old'], ['sweet', 'sour'], ['rich', 'poor'], ['give', 'take'], ['many', 'few'],
  ['besar', 'kecil'], ['panas', 'dingin'], ['atas', 'bawah'], ['senang', 'sedih'], ['gembira', 'sedih'], ['cepat', 'lambat'],
  ['siang', 'malam'], ['buka', 'tutup'], ['penuh', 'kosong'], ['tinggi', 'pendek'], ['panjang', 'pendek'], ['basah', 'kering'],
  ['terang', 'gelap'], ['tua', 'muda'], ['lama', 'baru'], ['masuk', 'keluar'], ['keras', 'lembut'], ['bersih', 'kotor'],
  ['berat', 'ringan'], ['kiri', 'kanan'], ['dorong', 'tarik'], ['depan', 'belakang'], ['tebal', 'tipis'], ['dekat', 'jauh'],
  ['dalam', 'luar'], ['bangun', 'tidur'], ['tertawa', 'menangis'], ['menang', 'kalah'], ['pertama', 'terakhir'],
  ['naik', 'turun'], ['manis', 'pahit'], ['baik', 'jahat'], ['banyak', 'sedikit'], ['datang', 'pergi'], ['pagi', 'malam'],
];

export const DAYS: Text[] = [
  t('Monday', 'Senin'), t('Tuesday', 'Selasa'), t('Wednesday', 'Rabu'), t('Thursday', 'Kamis'),
  t('Friday', 'Jumat'), t('Saturday', 'Sabtu'), t('Sunday', 'Minggu'),
];

export const MONTHS: Text[] = [
  t('January', 'Januari'), t('February', 'Februari'), t('March', 'Maret'), t('April', 'April'),
  t('May', 'Mei'), t('June', 'Juni'), t('July', 'Juli'), t('August', 'Agustus'),
  t('September', 'September'), t('October', 'Oktober'), t('November', 'November'), t('December', 'Desember'),
];

export type ColorWord = 'red' | 'blue' | 'yellow' | 'white' | 'black' | 'green' | 'orange' | 'purple';

export const COLOR_WORDS: Record<string, ColorWord> = {
  red: 'red', merah: 'red', blue: 'blue', biru: 'blue', yellow: 'yellow', kuning: 'yellow',
  white: 'white', putih: 'white', black: 'black', hitam: 'black', green: 'green', hijau: 'green',
  orange: 'orange', oranye: 'orange', jingga: 'orange', purple: 'purple', ungu: 'purple',
};

export const COLOR_NAMES: Record<ColorWord | 'pink' | 'gray' | 'lightblue' | 'brown', Text> = {
  red: t('red', 'merah'), blue: t('blue', 'biru'), yellow: t('yellow', 'kuning'), white: t('white', 'putih'),
  black: t('black', 'hitam'), green: t('green', 'hijau'), orange: t('orange', 'oranye'), purple: t('purple', 'ungu'),
  pink: t('pink', 'merah muda'), gray: t('gray', 'abu-abu'), lightblue: t('light blue', 'biru muda'), brown: t('brown', 'cokelat'),
};

/** Paint mixing results, keyed by the two colors sorted alphabetically. */
export const MIXES: Record<string, keyof typeof COLOR_NAMES> = {
  'red+yellow': 'orange',
  'blue+red': 'purple',
  'blue+yellow': 'green',
  'red+white': 'pink',
  'black+white': 'gray',
  'blue+white': 'lightblue',
  'green+red': 'brown',
  'blue+orange': 'brown',
  'purple+yellow': 'brown',
};

/** "What do we use to see?" -> eyes. */
export const SENSE_VERBS: Record<string, string> = {
  see: 'eyes', look: 'eyes', watch: 'eyes', melihat: 'eyes', lihat: 'eyes',
  hear: 'ears', listen: 'ears', mendengar: 'ears', dengar: 'ears',
  smell: 'nose', sniff: 'nose', mencium: 'nose', cium: 'nose', bau: 'nose',
  taste: 'tongue', mengecap: 'tongue', merasakan: 'tongue', kecap: 'tongue',
  touch: 'skin', meraba: 'skin', raba: 'skin', menyentuh: 'skin', sentuh: 'skin',
};
