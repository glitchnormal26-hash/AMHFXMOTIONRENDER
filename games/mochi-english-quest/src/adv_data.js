/* ---------- Petualangan 2.0: tiap chapter jadi 8 stage (4 stage baru sebelum boss) ---------- */
const ADV_EXTRA=[
  // Chapter 1 · Desa Padang Hijau
  [{m:'catch',t:['animals'],foe:'slime',pre:[['kai','Lendir-lendir menjatuhkan kata dari langit! Geser keranjangmu dan tangkap hanya kata HEWAN!','cheer']]},
   {m:'match',t:['animals','food'],foe:'slime',pre:[['slime','Blub! Kata-kataku tertukar pasangannya. Cocokkan lagi kalau bisa!','smirk']]},
   {m:'talk',sc:'greet',foe:'slime',pre:[['kai','Ada anak desa baru. Ayo ngobrol pakai bahasa Inggris. Pilih jawaban yang paling sopan!','happy']]},
   {m:'pic',t:['fruits','food'],foe:'slime',pre:[['slime','Blub! Ini lendir paling licin. Tebak buah dan makanan ini dulu!','smirk']]}],
  // Chapter 2 · Hutan Buah
  [{m:'catch',t:['fruits'],foe:'boo',pre:[['sari','Buah-buahan berjatuhan! Tangkap yang benar saja dan jangan sampai kena kata keliru.','happy']]},
   {m:'listen',t:['fruits','food'],foe:'boo',pre:[['boo','Buuu! Dengarkan bisikanku... kalau kamu berani.','smirk']]},
   {m:'talk',sc:'fruitshop',foe:'boo',pre:[['sari','Ada kios buah di tengah hutan. Ayo belanja pakai bahasa Inggris!','happy']]},
   {m:'spell',t:['fruits','food'],foe:'boo',pre:[['boo','Huruf-huruf ini kubuat melayang. Susun kembali, ya!','smirk']]}],
  // Chapter 3 · Sekolah Awan
  [{m:'talk',sc:'class',foe:'inky',pre:[['luna','Bel sekolah berbunyi. Jawab guru dengan sopan, ya!','happy']]},
   {m:'catch',t:['school'],foe:'inky',pre:[['inky','Tintaku menetes ke mana-mana! Tangkap kata tentang SEKOLAH saja.','smirk']]},
   {m:'power',t:[],foe:'inky',pre:[['luna','Kata-kata ini tertukar artinya. Cari sinonim dan antonimnya!','think']]},
   {m:'spell',t:['school','body'],foe:'inky',pre:[['inky','Tintaku mengacak huruf. Susun lagi kalau bisa!','smirk']]}],
  // Chapter 4 · Gunung Api
  [{m:'catch',t:['nature','weather'],foe:'dragonet',pre:[['bima','Batu dan abu berjatuhan! Tangkap kata ALAM dan CUACA, hindari yang lain.','happy']]},
   {m:'order',t:[],foe:'dragonet',pre:[['dragonet','Roarr kecil! Aku meniup kalimatmu sampai berantakan.','smirk']]},
   {m:'talk',sc:'weather',foe:'dragonet',pre:[['bima','Kita berkemah di kaki gunung. Ngobrol soal cuaca, yuk!','happy']]},
   {m:'read',t:[],foe:'dragonet',pre:[['bima','Ada catatan lama di dinding gua. Bacalah dengan teliti.','think']]}],
  // Chapter 5 · Laut Harta
  [{m:'catch',t:['transport'],foe:'crab',pre:[['pip','Bip! Kendaraan-kendaraan laut terlempar ke udara. Tangkap kata KENDARAAN!','cheer']]},
   {m:'listen',t:['transport','places'],foe:'crab',pre:[['crab','Jepit jepit! Dengar baik-baik, jangan salah gambar!','smirk']]},
   {m:'talk',sc:'direction',foe:'crab',pre:[['pip','Pip tersesat di pelabuhan. Tanyakan arah pakai bahasa Inggris. Bip!','think']]},
   {m:'grammar',t:[],foe:'crab',pre:[['crab','Kalimat-kalimatku bolong-bolong. Lengkapi dengan benar!','smirk']]}],
  // Chapter 6 · Istana Bulan
  [{m:'catch',t:['jobs','places'],foe:'shade',pre:[['foxy','Bayangan menjatuhkan kata-kata dari menara! Tangkap kata PROFESI atau TEMPAT.','cheer']]},
   {m:'talk',sc:'party',foe:'shade',pre:[['foxy','Ada pesta di istana. Ayo bergaul pakai bahasa Inggris!','happy']]},
   {m:'order',t:[],foe:'shade',pre:[['shade','Kalimat-kalimat ini kuhapus separuh. Susun lagi!','smirk']]},
   {m:'exam',t:[],foe:'shade',pre:[['foxy','Ujian terakhir sebelum Ratu Blank. Tarik napas dalam-dalam!','cheer']]}]
];
ADV_EXTRA.forEach((ex,ci)=>{
  const ch=CHAPTERS[ci];
  if(ch&&ch.stages.length===4)ch.stages.splice(3,0,...ex);
});
const ADV_LAST=ci=>CHAPTERS[ci].stages.length-1;

/* simpanan lama: boss dulu stage ke-4 (indeks 3), sekarang indeks 7 */
function advMigrate(S){
  const a=S.adv;if(!a||a.v>=2)return;
  CHAPTERS.forEach((ch,ci)=>{
    const old=a.stars[ci+'-3'];
    const last=ch.stages.length-1;
    if(last!==7)return;
    if(old){
      a.stars[ci+'-'+last]=Math.max(a.stars[ci+'-'+last]||0,old);
      for(let si=3;si<last;si++)a.stars[ci+'-'+si]=Math.max(a.stars[ci+'-'+si]||0,1);
    }
    delete a.stars[ci+'-3'];
    if(old)a.stars[ci+'-3']=1;
    if(a.seen['s'+ci+'-3']){a.seen['s'+ci+'-'+last]=1;delete a.seen['s'+ci+'-3'];}
  });
  a.v=2;
}

/* ---------- Skenario obrolan (mode Percakapan) ---------- */
const SCEN=[
 {q:'greet',n:'Berkenalan',who:'kai',turns:[
  {q:'Hello! What is your name?',id:'Halo! Siapa namamu?',o:['My name is $NAME.','I am fine, thank you.','I am nine years old.'],w:'Pertanyaan nama dijawab dengan My name is ...'},
  {q:'Nice to meet you! How are you today?',id:'Senang bertemu denganmu! Apa kabar hari ini?',o:['I am fine, thank you.','My name is Kai.','It is a cat.'],w:'How are you? dijawab I am fine, thank you.'},
  {q:'How old are you?',id:'Berapa umurmu?',o:['I am nine years old.','I am in the kitchen.','I like pizza.'],w:'How old are you? dijawab I am ... years old.'},
  {q:'Where do you live?',id:'Kamu tinggal di mana?',o:['I live in Green Meadow Village.','I am ten years old.','It is Monday.'],w:'Where menanyakan tempat. Jawab dengan I live in ...'},
  {q:'Goodbye! See you tomorrow!',id:'Sampai jumpa! Sampai besok!',o:['Goodbye! See you!','Good morning!','Nice to meet you!'],w:'Untuk berpisah, katakan Goodbye atau See you.'}]},
 {q:'fruitshop',n:'Di Kios Buah',who:'sari',turns:[
  {q:'Good morning! What would you like?',id:'Selamat pagi! Kamu mau apa?',o:['I would like some apples, please.','I am a student.','It is a big tree.'],w:'Saat membeli, katakan I would like ..., please.'},
  {q:'Here you are. Do you want a banana too?',id:'Ini untukmu. Mau pisang juga?',o:['Yes, please.','Goodbye.','It is red.'],w:'Do you want ...? dijawab Yes, please atau No, thank you.'},
  {q:'How many oranges do you want?',id:'Kamu mau berapa jeruk?',o:['Three oranges, please.','They are yellow.','Yes, I am.'],w:'How many menanyakan jumlah. Jawab dengan angka.'},
  {q:'That is five dollars.',id:'Itu lima dolar.',o:['Here you are. Thank you!','My name is Sari.','Where is the market?'],w:'Saat membayar, katakan Here you are. Thank you!'},
  {q:'Have a nice day!',id:'Semoga harimu menyenangkan!',o:['You too! Goodbye!','I am fine.','It is delicious.'],w:'Have a nice day dibalas You too!'}]},
 {q:'class',n:'Di Kelas',who:'luna',turns:[
  {q:'Good morning, class! Please sit down.',id:'Selamat pagi, anak-anak! Silakan duduk.',o:['Good morning, teacher!','Good night, teacher!','Goodbye, teacher!'],w:'Pagi hari kita bilang Good morning.'},
  {q:'Open your book, please.',id:'Tolong buka bukumu.',o:['Okay, teacher.','No, thank you.','You are welcome.'],w:'Perintah guru dijawab dengan Okay atau Yes, teacher.'},
  {q:'Do you have a pencil?',id:'Apakah kamu punya pensil?',o:['Yes, I do. Here it is.','Yes, it is.','No, I am not.'],w:'Do you have ...? dijawab Yes, I do atau No, I do not.'},
  {q:'What is your favorite subject?',id:'Apa pelajaran favoritmu?',o:['My favorite subject is English.','My favorite color is blue.','I have a ruler.'],w:'Subject berarti mata pelajaran.'},
  {q:'It is time to go home. See you tomorrow!',id:'Waktunya pulang. Sampai besok!',o:['See you tomorrow, teacher!','Good morning, teacher!','Open the door, please.'],w:'Untuk berpisah, katakan See you tomorrow.'}]},
 {q:'weather',n:'Cuaca & Berkemah',who:'bima',turns:[
  {q:'It is raining outside. What should we bring?',id:'Di luar hujan. Apa yang sebaiknya kita bawa?',o:['We should bring an umbrella.','We should bring a fan.','We should bring ice cream.'],w:'Umbrella dipakai saat hujan.'},
  {q:'How is the weather today?',id:'Bagaimana cuaca hari ini?',o:['It is sunny and warm.','It is Tuesday.','I am happy today.'],w:'How is the weather? dijawab It is ...'},
  {q:'What do you wear when it is cold?',id:'Apa yang kamu pakai saat dingin?',o:['I wear a jacket.','I wear a swimsuit.','I wear sunglasses at night.'],w:'Saat dingin kita memakai jaket (jacket).'},
  {q:'Can we go camping this weekend?',id:'Bolehkah kita berkemah akhir pekan ini?',o:['Yes, let us go camping!','It is a tent.','Because it is blue.'],w:'Can we ...? dijawab Yes, let us ... atau Sorry, we cannot.'},
  {q:'Look at the sky! What do you see?',id:'Lihat langit! Apa yang kamu lihat?',o:['I see dark clouds.','I see a red fish.','I see my shoes.'],w:'What do you see? dijawab I see ...'}]},
 {q:'direction',n:'Menanyakan Arah',who:'pip',turns:[
  {q:'Excuse me, where is the library?',id:'Permisi, di mana perpustakaan?',o:['It is next to the school.','It is nine o\'clock.','Yes, it is a big book.'],w:'Where menanyakan tempat. Next to berarti di sebelah.'},
  {q:'How can I get to the park?',id:'Bagaimana cara ke taman?',o:['Turn left at the corner.','I am a good driver.','The park is a book.'],w:'Turn left artinya belok kiri.'},
  {q:'Is it far from here?',id:'Apakah jauh dari sini?',o:['No, it is near.','Because I like it.','It is Monday.'],w:'Near berarti dekat, far berarti jauh.'},
  {q:'Should I go by bus or by boat?',id:'Sebaiknya naik bus atau perahu?',o:['Go by bus. It is faster.','Go to sleep.','I go to school.'],w:'By bus artinya naik bus.'},
  {q:'Thank you so much for your help!',id:'Terima kasih banyak atas bantuanmu!',o:['You are welcome!','I am sorry.','Excuse me.'],w:'Thank you dibalas You are welcome.'}]},
 {q:'party',n:'Pesta Ulang Tahun',who:'foxy',turns:[
  {q:'Happy birthday! How old are you today?',id:'Selamat ulang tahun! Berapa umurmu hari ini?',o:['I am ten years old today!','I am in the garden.','It is a cake.'],w:'How old are you? dijawab I am ... years old.'},
  {q:'Would you like some cake?',id:'Mau kue?',o:['Yes, please. It looks delicious!','Yes, I am happy.','You are welcome.'],w:'Would you like ...? dijawab Yes, please atau No, thank you.'},
  {q:'What do you want to drink?',id:'Kamu mau minum apa?',o:['Orange juice, please.','It is on the table.','I want to dance.'],w:'What do you want to drink? dijawab dengan nama minuman.'},
  {q:'Let us play a game! Do you like games?',id:'Ayo main game! Kamu suka game?',o:['Yes, I love games!','They are on the table.','I am eating lunch.'],w:'Do you like ...? dijawab Yes, I do atau No, I do not.'},
  {q:'The party is over. Thank you for coming!',id:'Pestanya sudah selesai. Terima kasih sudah datang!',o:['Thank you for inviting me!','Happy birthday to me!','Good morning!'],w:'Thank you for inviting me artinya terima kasih sudah mengundangku.'}]},
 {q:'restaurant',n:'Di Restoran',who:'kai',turns:[
  {q:'Welcome! Table for how many?',id:'Selamat datang! Meja untuk berapa orang?',o:['Table for two, please.','I am a waiter.','It is delicious.'],w:'Table for two artinya meja untuk dua orang.'},
  {q:'What would you like to eat?',id:'Kamu mau makan apa?',o:['I would like fried rice, please.','I am very hungry in the morning.','It is a spoon.'],w:'I would like ... dipakai untuk memesan.'},
  {q:'Would you like something to drink?',id:'Mau minum sesuatu?',o:['Yes, a glass of water, please.','Yes, I am a glass.','No, it is a table.'],w:'A glass of water artinya segelas air.'},
  {q:'How is your food?',id:'Bagaimana makananmu?',o:['It is delicious!','It is Friday.','I am at school.'],w:'Delicious artinya enak.'},
  {q:'Here is your bill.',id:'Ini tagihanmu.',o:['Thank you. Here is the money.','Good morning.','I am sleepy.'],w:'Bill artinya tagihan.'}]},
 {q:'family',n:'Tentang Keluarga',who:'luna',turns:[
  {q:'Who is she?',id:'Siapa dia?',o:['She is my mother.','He is my father.','It is my cat.'],w:'She dipakai untuk perempuan, he untuk laki-laki.'},
  {q:'Do you have any brothers or sisters?',id:'Apakah kamu punya kakak atau adik?',o:['I have one sister.','I am a sister.','Yes, it is.'],w:'I have ... artinya aku punya ...'},
  {q:'What does your father do?',id:'Apa pekerjaan ayahmu?',o:['He is a doctor.','He is in the kitchen.','He is nine years old.'],w:'What does he do? menanyakan pekerjaan.'},
  {q:'Where does your grandmother live?',id:'Di mana nenekmu tinggal?',o:['She lives in Bandung.','She is my grandmother.','I live in a house.'],w:'Where does she live? dijawab She lives in ...'},
  {q:'Do you like your family?',id:'Apakah kamu menyayangi keluargamu?',o:['Yes, I love my family very much.','Yes, she is my mother.','No, it is a family.'],w:'I love my family artinya aku sayang keluargaku.'}]}
];
