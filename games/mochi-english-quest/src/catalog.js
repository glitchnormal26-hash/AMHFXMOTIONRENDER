/* ============================================================
   KATALOG 2.0 — 5 kelas kelangkaan, kategori baru (Aura, Dinding,
   Lantai) dan ratusan variasi gaya. Dijalankan setelah katalog dasar.
   ============================================================ */
const GATE={4:4,5:7};                           // level minimal untuk membeli kelas Legendaris / Mitos
const RARCLS={1:'Umum',2:'Langka',3:'Epik',4:'Legendaris',5:'Mitos'};
function addCat(arr,list){list.forEach(it=>{arr.push(it);CATALOG.push(it);});}

/* ---------- Rambut ---------- */
const cH=(id,style,n,hair,d,rib,r,price)=>({id,c:'hair',style,n,hair,d,rib,r,price,gate:GATE[r]});
addCat(HAIRS,[
 cH('hr12','bob','Bob Cokelat','#a8683c','#7a4522','#ff7bac',1,120),
 cH('hr13','long','Panjang Malam','#3a2f4f','#1f1830','#ff5a6e',1,130),
 cH('hr14','short','Pendek Madu','#f0b15a','#c4852e','#5cc8ff',1,110),
 cH('hr15','braid','Kepang Stroberi','#ff7a8a','#d94b62','#ffd24d',1,140),
 cH('hr16','bob','Bob Laut','#4fb6ff','#2a82cf','#ffd24d',2,230),
 cH('hr17','spiky','Spiky Api','#ff7a3c','#d9511c','#ffd24d',2,250),
 cH('hr18','pony','Ponytail Mint','#5be3b5','#1fa57c','#ff7bac',2,240),
 cH('hr19','wave','Gelombang Lavender','#c9b0ff','#8a6ee0','#ffd24d',2,260),
 cH('hr20','buns','Cepol Persik','#ffc09a','#e08a5e','#8b6cf0',2,250),
 cH('hr21','long','Salju Sakura','#ffe8f4','#e8a0c4','#ff5a8a',3,420),
 cH('hr22','curly','Keriting Karamel','#d9944a','#a8651f','#ff7bac',3,430),
 cH('hr23','mush','Jamur Es','#bfe9ff','#6ab4e0','#ff7bac',3,440),
 cH('hr24','long','Galaksi','#5a3fa0','#2e1c6e','#5cc8ff',4,900),
 cH('hr25','spiky','Matahari Emas','#ffd24d','#d9a000','#ff5a6e',4,950),
 cH('hr26','long','Bulan Perak','#e8f0ff','#9fb4e0','#ffd24d',5,1700),
 cH('hr27','wave','Mawar Permata','#ff4f9a','#b82468','#ffe27a',5,1800)
]);

/* ---------- Kostum ---------- */
const cCO=(id,n,r,price,p)=>({id,c:'costume',n,r,price,p,gate:GATE[r]});
addCat(COSTUMES,[
 cCO('cos_pj','Piyama Bintang',1,150,{outfit:'#8b6cf0',pattern:'stars',accent:'#ffd24d',collar:false}),
 cCO('cos_dots','Kaos Polkadot',1,140,{outfit:'#ff9ec7',pattern:'dots',accent:'#ffffff'}),
 cCO('cos_red','Kaos Garis Merah',1,150,{outfit:'#ffffff',pattern:'stripes',stripe:'#ff5a6e',accent:'#2f8fd8'}),
 cCO('cos_over','Overall Biru',1,170,{outfit:'#fff6d6',pattern:'overalls',acc2:'#2f8fd8',accent:'#ffd24d'}),
 cCO('cos_scout','Seragam Pramuka',2,260,{outfit:'#c98b5a',pattern:'tie',skirtC:'#6b3f22',accent:'#ff5a6e',hat:'cap',hatC:'#c98b5a'}),
 cCO('cos_pirate','Bajak Laut Cilik',2,300,{outfit:'#3b3550',pattern:'stripes',stripe:'#ff5a6e',hat:'pirate',accent:'#ffd24d'}),
 cCO('cos_wizard','Penyihir Cilik',2,310,{outfit:'#2f6fd8',cape:'#1f3f8f',hat:'wizard',hatC:'#2f6fd8',accent:'#ffd24d'}),
 cCO('cos_bear','Hoodie Beruang',2,280,{outfit:'#e8bd8f',hood:'#c98b5a',hoodEars:true,accent:'#ffffff'}),
 cCO('cos_kebaya','Kebaya Nusantara',2,330,{outfit:'#d94b82',skirtC:'#8b3a2a',pattern:'dots',hat:'flower',hatC:'#ffd24d',accent:'#ffd24d'}),
 cCO('cos_hero','Pahlawan Super',3,520,{outfit:'#2f8fd8',cape:'#ff5a6e',mask:'#ff5a6e',accent:'#ffd24d',pattern:'belt'}),
 cCO('cos_prince','Pangeran Biru',3,540,{outfit:'#2f6fd8',cape:'#ffd24d',hat:'crown',accent:'#ffd24d'}),
 cCO('cos_flora','Gaun Peri Bunga',3,560,{outfit:'#ffd0e6',skirtC:'#a8f0d8',hat:'flower',hatC:'#ff7bac',wings:'#ffd0e6',accent:'#ff7bac'}),
 cCO('cos_knight','Ksatria Bintang',4,1000,{outfit:'#cfd8e8',cape:'#5a3fa0',capeStar:true,pattern:'belt',accent:'#ffd24d',boots:'#8fb3d9'}),
 cCO('cos_snowq','Ratu Salju',4,1050,{outfit:'#eaf8ff',skirtC:'#bfe9ff',hat:'tiara',halo:true,accent:'#5cc8ff'}),
 cCO('cos_emperor','Kaisar Naga Emas',5,1900,{outfit:'#ffd24d',cape:'#b62a52',hat:'crown',horns:'#fff6d6',tail:'#ffb45e',accent:'#ff5a6e'}),
 cCO('cos_cosmos','Penguasa Galaksi',5,2000,{outfit:'#2e1c6e',pattern:'stars',cape:'#5a3fa0',capeStar:true,halo:true,accent:'#ffd24d'})
]);

/* ---------- Fashion ---------- */
const cFA=(id,n,r,price,p)=>({id,c:'fashion',n,r,price,p,gate:GATE[r]});
addCat(FASHIONS,[
 cFA('fas_bscarf','Syal Biru Laut',1,120,{scarf:'#5cc8ff'}),
 cFA('fas_bpack','Ransel Beruang',1,160,{pack:'#e8bd8f'}),
 cFA('fas_rboots','Bot Hujan Kuning',1,140,{boots:'#ffd24d'}),
 cFA('fas_mboots','Bot Mint',1,140,{boots:'#5be3b5'}),
 cFA('fas_wstar','Syal Putih Bintang',2,200,{scarf:'#ffffff',scarfStar:true}),
 cFA('fas_cpack','Ransel Kucing',2,210,{pack:'#ffb3c8',packEars:true}),
 cFA('fas_rcape','Jubah Merah',2,240,{cape:'#ff5a6e'}),
 cFA('fas_bhood','Hoodie Beruang',3,380,{hood:'#c98b5a',hoodEars:true}),
 cFA('fas_gcape','Jubah Galaksi',4,800,{cape:'#2e1c6e',capeStar:true}),
 cFA('fas_kboots','Bot Kilau',4,720,{boots:'#ff9ec7',bootStripe:true,scarf:'#ffd24d'}),
 cFA('fas_mteor','Jubah Bintang Jatuh',5,1500,{cape:'#ffd24d',capeStar:true,scarf:'#ff7bac',scarfStar:true}),
 cFA('fas_royal','Set Kerajaan',5,1600,{cape:'#b62a52',boots:'#ffd24d',bootStripe:true,scarf:'#ffffff',scarfStar:true})
]);

/* ---------- Aksesori ---------- */
const cAC=(id,n,r,price,p)=>({id,c:'acc',n,r,price,p,gate:GATE[r]});
addCat(ACCS,[
 cAC('acc_chef','Topi Koki',1,120,{hat:'chef',hatC:'#ffffff'}),
 cAC('acc_band','Bando Pita Pink',1,110,{hat:'band',hatC:'#ff7bac'}),
 cAC('acc_rcap','Topi Baseball Merah',1,120,{hat:'cap',hatC:'#ff5a6e'}),
 cAC('acc_spink','Topi Jerami Pink',1,130,{hat:'straw',hatC:'#ffb3d1'}),
 cAC('acc_pirate','Topi Bajak Laut',2,240,{hat:'pirate',hatC:'#2b2b3a'}),
 cAC('acc_gog','Kacamata Goggles',2,220,{hat:'goggles',hatC:'#8a5a36'}),
 cAC('acc_bear','Telinga Beruang',2,200,{hat:'ears',hatC:'#c98b5a'}),
 cAC('acc_tiara','Tiara Mutiara',3,420,{hat:'tiara',hatC:'#ffe9a8'}),
 cAC('acc_wiz','Topi Penyihir Biru',3,440,{hat:'wizard',hatC:'#2f6fd8'}),
 cAC('acc_hhalo','Halo Bertanduk',3,460,{halo:true,horns:'#ffd9a8'}),
 cAC('acc_crown','Mahkota Emas',4,900,{hat:'crown',hatC:'#ffd24d'}),
 cAC('acc_star','Topi Penyihir Bintang',4,950,{hat:'witch',hatC:'#2e1c6e',halo:true}),
 cAC('acc_royal','Mahkota Cahaya',5,1700,{hat:'crown',hatC:'#ffd24d',halo:true,glasses:true,sun:true}),
 cAC('acc_myth','Tanduk Bulan',5,1800,{horns:'#e8f0ff',halo:true,hat:'tiara'})
]);

/* ---------- Sayap ---------- */
const cWG=(id,n,r,price,p)=>({id,c:'wing',n,r,price,p,gate:GATE[r]});
addCat(WINGS,[
 cWG('wg_blue','Sayap Kupu Biru',1,170,{wings:'#5cc8ff',wingKind:'butterfly'}),
 cWG('wg_white','Sayap Burung Putih',1,170,{wings:'#ffffff',wingKind:'bird'}),
 cWG('wg_green','Sayap Kupu Hijau',1,180,{wings:'#5be3b5',wingKind:'butterfly'}),
 cWG('wg_redbat','Sayap Kelelawar Merah',2,260,{wings:'#ff5a6e',wingKind:'bat'}),
 cWG('wg_gfeather','Sayap Bulu Emas',3,480,{wings:'#ffd24d',wingKind:'feather'}),
 cWG('wg_crystal','Sayap Kristal',3,500,{wings:'#9fd8ff',wingKind:'star'}),
 cWG('wg_bigrb','Sayap Pelangi Agung',4,950,{wings:'#ff9ec7',wingKind:'rainbow',wingsBig:true}),
 cWG('wg_pdragon','Sayap Naga Ungu',4,900,{wings:'#8b6cf0',wingKind:'bat',wingsBig:true}),
 cWG('wg_gangel','Sayap Malaikat Emas',5,1800,{wings:'#fff6a8',wingKind:'feather',wingsBig:true}),
 cWG('wg_galaxy','Sayap Galaksi',5,1900,{wings:'#5a3fa0',wingKind:'star',wingsBig:true})
]);
function isWingId2(id){return WINGS.some(w=>w.id===id);}

/* ---------- Pet ---------- */
const cPT=(id,n,art,r,price,c1,c2,fx,fxTxt)=>({id,c:'pet',n,art,r,price,c1,c2,fx,fxTxt,gate:GATE[r]});
addCat(PETS,[
 cPT('p_bcat','Kucing Malam','cat',2,380,'#4a4060','#2e2540','coin','Panen memberi +20% koin'),
 cPT('p_wdog','Anjing Salju','dog',2,400,'#ffffff','#bfe9ff','autowater','Rajin menyiram kebun otomatis'),
 cPT('p_gchick','Ayam Emas','chick',3,560,'#ffd24d','#ff9a3d','egg','Hasil kandang +1'),
 cPT('p_ifox','Rubah Es','fox',3,620,'#cfeaff','#5cc8ff','score','Poin latihan +15%'),
 cPT('p_gslime','Slime Pelangi','slime',4,980,'#ff9ec7',undefined,'autowater','Rajin menyiram kebun otomatis'),
 cPT('p_guni','Unicorn Galaksi','uni',4,1100,'#8b6cf0','#ffb3e6','luck','Hadiah misi lebih langka'),
 cPT('p_gdrag','Naga Emas','dragon',5,1900,'#ffd24d',undefined,'boss','Bonus koin boss +50%'),
 cPT('p_mowl','Hantu Bulan','owl',5,2000,'#5a3fa0','#2e1c6e','heart','Nyawa ekstra setiap stage')
]);

/* ---------- Furnitur ---------- */
const cFU=(id,n,slot,art,r,price,c1,c2,c3,art2)=>({id,c:'furn',n,slot,art,r,price,c1,c2,c3,art2,gate:GATE[r]});
addCat(FURN,[
 cFU('fu_n_bed1','Kasur Hijau Daun','bed','bed',1,240,'#e6ffe8','#a8f0b8','#4fb477'),
 cFU('fu_n_bed2','Kasur Bintang Malam','bed','bed',3,520,'#d8d0ff','#8b6cf0','#ffd24d','cat'),
 cFU('fu_n_bed3','Kasur Kerajaan','bed','bed',4,1000,'#ffe6a8','#b62a52','#ffd24d','donut'),
 cFU('fu_n_rug1','Karpet Biru Laut','rug','rug',1,140,'#bfe9ff','#5cc8ff','#ffffff'),
 cFU('fu_n_rug2','Karpet Cakar Biru','rug','rug',2,200,'#9fd8ff','#e8f6ff','#5cc8ff','paw'),
 cFU('fu_n_rug3','Karpet Emas Kerajaan','rug','rug',4,900,'#ffd24d','#b62a52','#fff6d6'),
 cFU('fu_n_sofa1','Sofa Mint','sofa','sofa',1,220,'#c9f7e8','#5be3b5','#4fb477'),
 cFU('fu_n_sofa2','Sofa Beludru Ungu','sofa','sofa',3,500,'#c9b0ff','#8b6cf0','#ffd24d'),
 cFU('fu_n_sofa3','Takhta Emas','sofa','sofa',5,1800,'#ffd24d','#b62a52','#fff6d6'),
 cFU('fu_n_tab1','Meja Pelangi','table','table',2,230,'#ffd0e6','#a8f0d8','#5cc8ff','cake'),
 cFU('fu_n_tab2','Meja Kristal','table','table',4,880,'#cfeaff','#9fd8ff','#5cc8ff','tea'),
 cFU('fu_n_pos1','Poster Planet','wall1','poster',2,200,'#2e1c6e','#ffd24d','#5cc8ff','star'),
 cFU('fu_n_pos2','Peta Harta Karun','wall1','poster',3,420,'#ffe6b8','#ff5a6e','#5be3b5','map'),
 cFU('fu_n_clock2','Jam Awan','wall2','clock',2,220,'#bfe9ff','#ffffff','#5cc8ff'),
 cFU('fu_n_aqua3','Akuarium Mutiara','wall2','aqua',4,980,'#cfeaff','#ff7bac','#ffd24d'),
 cFU('fu_n_shelf2','Rak Buku Emas','wall2','shelf',3,480,'#ffe6a8','#ff9ec7','#8b6cf0'),
 cFU('fu_n_lamp1','Lampu Bulan Sabit','lamp','lamp',3,420,'#8b6cf0','#ffe27a','#ffffff','star'),
 cFU('fu_n_lamp2','Lampu Pelangi','lamp','lamp',4,860,'#ff9ec7','#5be3b5','#ffd24d','cloud'),
 cFU('fu_n_lamp3','Lampu Kristal Mitos','lamp','lamp',5,1700,'#9fd8ff','#ffd24d','#ff7bac','mush'),
 cFU('fu_n_plt1','Kaktus Bunga','plant','plant',2,210,'#ffd0e6','#4fb477','#ff7bac','cactus'),
 cFU('fu_n_plt2','Pohon Sakura Emas','plant','plant',4,900,'#ffe27a','#ff9ec7','#8b6cf0','sakura'),
 cFU('fu_n_teddy2','Teddy Raksasa','small','teddy',2,240,'#ffd0b8','#ff7bac','#5cc8ff'),
 cFU('fu_n_pbed','Kasur Pet Awan','petbed','petbed',2,230,'#bfe9ff','#ffffff','#5cc8ff'),
 cFU('fu_n_house','Istana Kucing','petbed','petbed',4,900,'#ffd24d','#fff6d6','#b62a52','house'),
 cFU('fu_n_chest2','Peti Naga','special','chest',4,950,'#8b6cf0','#ffd24d','#ff5a6e'),
 cFU('fu_n_piano2','Piano Putih Emas','special','piano',5,1700,'#ffffff','#ffd24d','#ff9ec7'),
 cFU('fu_n_music2','Kotak Musik Bulan','special','musicbox',5,1600,'#c9b0ff','#ffd24d','#ffffff')
]);

/* furnitur kelas 4–5 berkilau */
function furSVG(it){
  const s=furSVG0(it);
  if(!it||!(it.r>=4))return s;
  const m=/viewBox="0 0 (\d+) (\d+)"/.exec(s);
  const w=m?+m[1]:200,h=m?+m[2]:140,col=it.r>=5?'#ff7bd8':'#ffd24d';
  const spk=(x,y,z,dl)=>`<path class="spk" style="animation-delay:${dl}s" transform="translate(${x} ${y}) scale(${z})" d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3Z" fill="${col}" stroke="#fff" stroke-width="2"/>`;
  return s.replace(/<\/svg>\s*$/,`<g aria-hidden="true">${spk(w*.12,h*.2,.9,0)}${spk(w*.86,h*.14,.7,.6)}${spk(w*.78,h*.62,.6,1.1)}</g></svg>`);
}

/* ---------- Aura ---------- */
const cAU=(id,n,r,price,aura,kind)=>({id,c:'aura',n,r,price,p:{aura:aura,auraKind:kind},gate:GATE[r]});
const AURAS=[
 cAU('au_glow','Kilau Lembut',1,160,'#ffe27a','glow'),
 cAU('au_bubble','Gelembung Ceria',1,170,'#8fe0ff','bubbles'),
 cAU('au_petal','Kelopak Sakura',2,280,'#ffb3d1','petals'),
 cAU('au_heart','Hujan Hati',2,300,'#ff7bac','hearts'),
 cAU('au_stars','Bintang Berputar',3,480,'#ffd24d','stars'),
 cAU('au_snow','Salju Ajaib',3,500,'#cfeaff','snow'),
 cAU('au_flame','Api Naga',4,950,'#ff7a3c','flame'),
 cAU('au_aurora','Aurora',4,1000,'#5be3b5','aurora'),
 cAU('au_galaxy','Galaksi',5,1800,'#8b6cf0','galaxy'),
 cAU('au_rainbow','Pelangi Mitos',5,1900,'#ff9ec7','rainbow')
];
AURAS.forEach(a=>CATALOG.push(a));
function auraSVG(c,uid){
  if(!c.aura)return '';
  const col=c.aura,k=c.auraKind||'glow',g='au'+uid;
  const grad=(col,o)=>`<defs><radialGradient id="${g}" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="${col}" stop-opacity="0"/><stop offset=".62" stop-color="${col}" stop-opacity="${o||.25}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></radialGradient></defs><circle cx="100" cy="124" r="104" fill="url(#${g})"/>`;
  const rnd=(n,f)=>{let o='';for(let i=0;i<n;i++){const a=i/n*6.283+.4,rr=62+((i*37)%28),x=100+Math.cos(a)*rr*1.1,y=124+Math.sin(a)*rr*.95;o+=f(x,y,i);}return o;};
  let o='';
  if(k==='glow')o=grad(col,.5);
  else if(k==='bubbles')o=grad(col,.18)+rnd(9,(x,y,i)=>`<circle class="aud" style="animation-delay:${(i*.3).toFixed(1)}s" cx="${x}" cy="${y}" r="${4+i%3*3}" fill="#fff" fill-opacity=".45" stroke="${col}" stroke-width="2.5"/>`);
  else if(k==='petals')o=grad(col,.14)+rnd(10,(x,y,i)=>`<ellipse class="aud" style="animation-delay:${(i*.25).toFixed(1)}s" cx="${x}" cy="${y}" rx="7" ry="4" transform="rotate(${i*40} ${x} ${y})" fill="${col}" stroke="#d94b82" stroke-width="1.5"/>`);
  else if(k==='hearts')o=grad(col,.14)+rnd(8,(x,y,i)=>`<path class="aud" style="animation-delay:${(i*.3).toFixed(1)}s" transform="translate(${x} ${y}) scale(${.7+i%3*.2})" d="M0 6 C-12 -4 -6 -14 0 -7 C6 -14 12 -4 0 6Z" fill="${col}" stroke="#b82468" stroke-width="2"/>`);
  else if(k==='stars')o=grad(col,.2)+rnd(8,(x,y,i)=>`<path class="aud" style="animation-delay:${(i*.3).toFixed(1)}s" transform="translate(${x} ${y}) scale(${.8+i%3*.25})" d="M0 -10 L3 -3 L10 0 L3 3 L0 10 L-3 3 L-10 0 L-3 -3Z" fill="${col}" stroke="#fff" stroke-width="2"/>`);
  else if(k==='snow')o=grad('#bfe9ff',.2)+rnd(12,(x,y,i)=>`<circle class="aud" style="animation-delay:${(i*.2).toFixed(1)}s" cx="${x}" cy="${y}" r="${2.5+i%3*1.6}" fill="#fff" stroke="#8fc8ee" stroke-width="1.5"/>`);
  else if(k==='flame')o=grad(col,.28)+rnd(9,(x,y,i)=>`<path class="aud" style="animation-delay:${(i*.2).toFixed(1)}s" transform="translate(${x} ${y+8}) scale(${.9+i%3*.3})" d="M0 -16 C8 -6 10 2 4 8 C0 10 -4 10 -6 6 C-10 0 -4 -8 0 -16Z" fill="${i%2?'#ffd24d':col}" stroke="#d9511c" stroke-width="2"/>`);
  else if(k==='aurora')o=`<ellipse cx="100" cy="116" rx="98" ry="74" fill="${col}" opacity=".16"/><ellipse cx="86" cy="108" rx="78" ry="56" fill="#5cc8ff" opacity=".16"/><ellipse cx="116" cy="130" rx="74" ry="52" fill="#c9b0ff" opacity=".18"/>`+rnd(6,(x,y,i)=>`<circle class="aud" style="animation-delay:${(i*.35).toFixed(1)}s" cx="${x}" cy="${y}" r="3" fill="#fff"/>`);
  else if(k==='galaxy')o=`<ellipse cx="100" cy="122" rx="102" ry="80" fill="#2e1c6e" opacity=".42"/><ellipse cx="100" cy="122" rx="82" ry="62" fill="${col}" opacity=".3"/><ellipse cx="100" cy="122" rx="52" ry="38" fill="#ff7bd8" opacity=".16"/>`+rnd(14,(x,y,i)=>`<circle class="aud" style="animation-delay:${(i*.22).toFixed(1)}s" cx="${x}" cy="${y}" r="${1.4+i%3}" fill="#fff"/>`);
  else if(k==='rainbow')o=['#ff5a6e','#ffae5e','#ffe27a','#5be3b5','#5cc8ff','#8b6cf0'].map((cc,i)=>`<path d="M${12+i*7} 190 A${88-i*7} ${88-i*7} 0 0 1 ${188-i*7} 190" fill="none" stroke="${cc}" stroke-width="7" opacity=".7"/>`).join('')+`<ellipse cx="38" cy="196" rx="34" ry="16" fill="#fff" stroke="#bfe9ff" stroke-width="3"/><ellipse cx="164" cy="196" rx="34" ry="16" fill="#fff" stroke="#bfe9ff" stroke-width="3"/>`;
  return `<g class="aura" aria-hidden="true">${o}</g>`;
}

/* ---------- Dinding & Lantai kamar ---------- */
const WALL_OWN={id:'rw_own',c:'wall',n:'Dinding Pink',r:1,price:0,bg:'',band:''};
const FLOOR_OWN={id:'rf_own',c:'floor',n:'Lantai Kayu',r:1,price:0,bg:''};
const cDots=(c,a)=>`radial-gradient(circle at 50% 50%,${c} 0 3px,transparent 3.5px) 0 0/${a}px ${a}px`;
const cWL=(id,n,r,price,bg,band)=>({id,c:'wall',n,r,price,bg,band,gate:GATE[r]});
const WALLS=[
 cWL('rw_sky','Awan Biru',1,150,`linear-gradient(180deg,#cfeaff,#a9d8ff)`,'#5cc8ff'),
 cWL('rw_mint','Polkadot Mint',1,160,`${cDots('#fff',26)},linear-gradient(180deg,#c9f7e8,#9be8cf)`,'#4fb477'),
 cWL('rw_pic','Kotak Piknik',1,170,`repeating-linear-gradient(90deg,rgba(255,90,110,.25) 0 14px,transparent 14px 28px),repeating-linear-gradient(0deg,rgba(255,90,110,.25) 0 14px,transparent 14px 28px),#fff3f0`,'#ff7b8a'),
 cWL('rw_sun','Kuning Cerah',1,150,`repeating-linear-gradient(90deg,rgba(255,255,255,.4) 0 16px,transparent 16px 32px),linear-gradient(180deg,#fff0a8,#ffd96b)`,'#e0a000'),
 cWL('rw_pastel','Pelangi Pastel',2,300,`linear-gradient(180deg,#ffd0e6 0 25%,#ffe6b8 25% 50%,#c9f7e8 50% 75%,#cfeaff 75%)`,'#8b6cf0'),
 cWL('rw_forest','Hutan Hijau',2,320,`repeating-linear-gradient(90deg,rgba(0,80,40,.15) 0 10px,transparent 10px 40px),linear-gradient(180deg,#b8f0b0,#6fcf86)`,'#2e8f4f'),
 cWL('rw_sea','Bawah Laut',2,340,`${cDots('rgba(255,255,255,.6)',34)},linear-gradient(180deg,#7fe0ff,#2f9fe0)`,'#1f6fb0'),
 cWL('rw_night','Bintang Malam',3,520,`${cDots('#fff',30)},linear-gradient(180deg,#2e1c6e,#5a3fa0)`,'#ffd24d'),
 cWL('rw_candy','Permen Manis',3,540,`repeating-linear-gradient(45deg,#ff9ec7 0 14px,#fff 14px 28px)`,'#ff5a8a'),
 cWL('rw_galaxy','Galaksi Nebula',4,1000,`radial-gradient(circle at 25% 35%,rgba(255,123,216,.6),transparent 40%),radial-gradient(circle at 75% 55%,rgba(92,200,255,.55),transparent 45%),${cDots('#fff',28)},linear-gradient(180deg,#1a0f4a,#3a1f80)`,'#ff7bd8'),
 cWL('rw_palace','Istana Emas',5,1800,`repeating-linear-gradient(90deg,rgba(255,210,77,.55) 0 4px,transparent 4px 44px),linear-gradient(180deg,#fff0c2,#ffd24d)`,'#b62a52')
];
const cFL=(id,n,r,price,bg)=>({id,c:'floor',n,r,price,bg,gate:GATE[r]});
const FLOORS=[
 cFL('rf_dark','Papan Kayu Gelap',1,150,`repeating-linear-gradient(90deg,rgba(0,0,0,.22) 0 2px,transparent 2px 34px),linear-gradient(180deg,#c98b5a,#9a6238)`),
 cFL('rf_tile','Keramik Kotak',1,170,`repeating-conic-gradient(#fff 0 25%,#d9eefb 0 50%) 0 0/46px 46px`),
 cFL('rf_grass','Rumput Taman',2,300,`repeating-linear-gradient(90deg,rgba(0,80,40,.15) 0 3px,transparent 3px 20px),linear-gradient(180deg,#9be88c,#5bbf6a)`),
 cFL('rf_red','Karpet Merah',2,320,`repeating-linear-gradient(90deg,rgba(255,255,255,.18) 0 3px,transparent 3px 28px),linear-gradient(180deg,#ff6b7f,#c93a55)`),
 cFL('rf_sand','Pasir Pantai',2,300,`${cDots('rgba(160,110,50,.35)',18)},linear-gradient(180deg,#ffeab8,#f0cf8a)`),
 cFL('rf_sky','Awan Langit',3,520,`radial-gradient(ellipse at 20% 40%,#fff 0 18%,transparent 19%),radial-gradient(ellipse at 70% 60%,#fff 0 20%,transparent 21%),linear-gradient(180deg,#bfe9ff,#7fc8ff)`),
 cFL('rf_marble','Marmer Emas',4,950,`repeating-linear-gradient(135deg,rgba(255,210,77,.4) 0 3px,transparent 3px 60px),linear-gradient(180deg,#fff8e8,#f0e0c0)`),
 cFL('rf_stars','Lantai Bintang',5,1700,`${cDots('#ffd24d',26)},linear-gradient(180deg,#3a1f80,#1a0f4a)`)
];
WALLS.forEach(x=>CATALOG.push(x));FLOORS.forEach(x=>CATALOG.push(x));

/* tema kamar */
function applyRoomTheme(){
  const rm=$('room');if(!rm)return;
  const wl=itemById(S.look.wall||''),fl=itemById(S.look.floor||'');
  const rw=rm.querySelector('.rwall'),rf=rm.querySelector('.rfloor'),rb=rm.querySelector('.rband');
  if(rw)rw.style.background=wl&&wl.bg?wl.bg:'';
  if(rb)rb.style.background=wl&&wl.band?wl.band:'';
  if(rf)rf.style.background=fl&&fl.bg?fl.bg:'';
}
function rarityHTML(it){return `<span class="wrar r${it.r||1}">${RARSTAR[it.r||1]}</span>`;}
