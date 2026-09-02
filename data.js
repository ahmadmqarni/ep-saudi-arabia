/* ======================= DATA ======================= */
const REGIONS = {
  central:  {name:'Central Region'},
  eastern:  {name:'Eastern Region'},
  northern: {name:'Northern Region'},
  western:  {name:'Western Region'},
  southern: {name:'Southern Region'},
};

const CITIES = {
  tabuk:   {name:'Tabuk',               region:'northern', x:91,  y:340},
  jouf:    {name:'Al-Jouf',             region:'northern', x:250, y:281},
  hail:    {name:'Hail',                region:'northern', x:330, y:391},
  madinah: {name:'Madinah',             region:'western',  x:211, y:517},
  jeddah:  {name:'Jeddah',              region:'western',  x:240, y:657},
  makkah:  {name:'Makkah',              region:'western',  x:304, y:660},
  riyadh:  {name:'Riyadh',              region:'central',  x:532, y:517},
  kharj:   {name:'Al-Kharj',            region:'central',  x:565, y:559},
  dammam:  {name:'Dammam / Al-Khobar',  region:'eastern',  x:680, y:441, mapLabel:'Dammam'},
  abha:    {name:'Abha',                region:'southern', x:346, y:760},
  najran:  {name:'Najran',              region:'southern', x:460, y:780},
};

const CENTERS = {
  'kfmc-riyadh':        {name:'KFMC',          city:'riyadh'},
  'pmah-riyadh':        {name:'PMAH',          city:'riyadh'},
  'pscc-riyadh':        {name:'PSCC',          city:'riyadh'},
  'ksmc-riyadh':        {name:'KSMC',          city:'riyadh'},
  'ngha-riyadh':        {name:'NGHA – KACC', city:'riyadh'},
  'kfshrc-riyadh':      {name:'KFSHRC',        city:'riyadh'},
  'kkuh-riyadh':        {name:'KKUH',          city:'riyadh'},
  'alhabib-riyadh':     {name:'Al Habib',      city:'riyadh'},
  'sgh-riyadh':         {name:'SGH',           city:'riyadh'},
  'ksh-hail':           {name:'KSH',           city:'hail'},
  'iabfu-dammam':       {name:'IABFU',         city:'dammam'},
  'almoussa-dammam':    {name:'Al Moussa',     city:'dammam'},
  'johnshopkins-dammam':{name:'Johns Hopkins', city:'dammam'},
  'dallah-dammam':      {name:'Dallah',        city:'dammam'},
  'ngha-jeddah':        {name:'NGHA',          city:'jeddah'},
  'kfafh-jeddah':       {name:'KFAFH',         city:'jeddah'},
  'alhabib-jeddah':     {name:'Al Habib',      city:'jeddah'},
  'kauh-jeddah':        {name:'KAUH',          city:'jeddah'},
  'kfgh-jeddah':        {name:'KFGH',          city:'jeddah'},
  'faqeeh-jeddah':      {name:'Faqeeh',        city:'jeddah'},
  'sgh-makkah':         {name:'SGH',           city:'makkah'},
  'mcc-madinah':        {name:'MCC',           city:'madinah'},
  'pfkcc-abha':         {name:'PFKCC',         city:'abha'},
  'pscckkh-najran':     {name:'PSCC / KKH',    city:'najran'},
};

const PEOPLE = [
  {name:'Mohammad AlShehri', center:'kfmc-riyadh', photo:'Mohammed Alshehri KFMC Riyadh.jpg', university:'University of Calgary', linkedin:'https://www.linkedin.com/in/mohammed-alshehri-56339739/', phone:'0504737778'},
  {name:'Mossab AlJuaid', center:'kfmc-riyadh', photo:'Mossab AlJuaid KFMC Riyadh.jpg', university:'Tufts Medical Center', linkedin:'https://www.linkedin.com/in/mossab-aljuaid-mbbs-facc-524ba4b1/', phone:'0551111976'},
  {name:'Khader Herzallah', center:'kfmc-riyadh', photo:'Khader Herzallah KFMC Riyadh.jpg', university:'Tufts Medical Center', linkedin:'https://www.linkedin.com/in/khader-herzallah-6623892ab/', phone:'0539988893'},
  {name:'Alaa AlDossari', center:'kfmc-riyadh', photo:'Alaa AlDossari KFMC Riyadh.jpg', university:null, linkedin:'https://www.linkedin.com/in/alaa-aldossari-3b2247177/', phone:null},
  {name:'Waleed AlKhanayyah', center:'pmah-riyadh', photo:null, university:null, linkedin:null, phone:'0548028210'},
  {name:'Omar Mamoun', center:'pmah-riyadh', photo:'Omar Mamoun PMAH Riyadh.jpg', university:null, linkedin:'https://www.linkedin.com/in/omer-mamoun-513a76150/', phone:'0556291429'},
  {name:'Yahya Alhubaishi', center:'pscc-riyadh', photo:'Yahya AlHubaishi PSCC Riyadh.jpg', university:null, linkedin:'https://www.linkedin.com/in/yahya-alhebaishi-785b8922/', phone:null},
  {name:'Ahmad Alfaqeeh', center:'pscc-riyadh', photo:'Ahmad Alfaqeeh PSCC Riyadh.jpg', university:null, linkedin:null, phone:null},
  {name:'Khalid Daghriri', center:'pscc-riyadh', photo:'Khalid Daghriri PSCC Riyadh.jpg', university:null, linkedin:null, phone:null},
  {name:'Mohammad Abonab', center:'pscc-riyadh', photo:null, university:null, linkedin:null, phone:'0566106686'},
  {name:'Hussein Hado', center:'ksmc-riyadh', photo:'Hussein Hado KSMC Riyadh.png', university:'Peter Munk CC Tornto', linkedin:'https://www.linkedin.com/in/hussien-hado-8860ba6a/', phone:null},
  {name:'Abdullah Sharaf', center:'ksmc-riyadh', photo:'Abdullah Sharaf KSMC Riyadh.jpg', university:null, linkedin:'https://www.linkedin.com/in/dr-abdullah-al-sharaf-md-6230b515b/', phone:null},
  {name:'Haitham Alanazi', center:'ngha-riyadh', photo:'Haitham Alanazi NGHA Riyadh.jpg', university:null, linkedin:null, phone:null},
  {name:'Ahmad Alsalem', center:'ngha-riyadh', photo:'Ahmad Alsalem NGHA Riyadh.jpg', university:'University of Pennsylvania', linkedin:'https://www.linkedin.com/in/ahmed-bander-alsalem-852577274/', phone:null},
  {name:'Abdulmohsen Almusaad', center:'ngha-riyadh', photo:'Abdulmohsen Almusaad NGHA Riyadh.png', university:null, linkedin:null, phone:null},
  {name:'Feras Assiri', center:'ngha-riyadh', photo:'Feras Assiri NGHA Riyadh.jpg', university:'University of Utah', linkedin:null, phone:null},
  {name:'Mazen Alrashid', center:'ngha-riyadh', photo:null, university:'McMaster University', linkedin:null, phone:null},
  {name:'Bandar Alghamdi', center:'kfshrc-riyadh', photo:'Bandar Alghamdi KFSHRC Riyadh.jpg', university:'University of British Columbia', linkedin:'https://www.linkedin.com/in/bandar-al-ghamdi-md-facc-fesc-fhrs-ccds-18628449/', phone:null},
  {name:'Mohammad Najmeddin', center:'kfshrc-riyadh', photo:null, university:'Université de Bordeaux', linkedin:'https://www.linkedin.com/in/najmeddine-echahidi-a56a6145/', phone:null},
  {name:'Wael Qarawi', center:'kkuh-riyadh', photo:'Wael Qarawi KKUH Riyadh.jpg', university:'University of Ottawa', linkedin:'https://www.linkedin.com/in/wael-alqarawi-b21480239/', phone:null},
  {name:'Tareq Alhaqbani', center:'kkuh-riyadh', photo:'Tareq Alhaqbani KKUH Riyadh.jpg', university:'Univeristy of Calgary', linkedin:'https://www.linkedin.com/in/tariq-alhogbani-a4a19b1b3/', phone:'0505245494'},
  {name:'Lamia Shangeiti', center:'kkuh-riyadh', photo:null, university:'University of Toronto', linkedin:'https://www.linkedin.com/in/lamia-alshengeiti-91300468/', phone:null},
  {name:'Ayman Alkhadhraa', center:'alhabib-riyadh', photo:'Ayman Alkhadhraa ALHABIB Riyadh.jpg', university:'Cleveland Clinic', linkedin:'https://www.linkedin.com/in/ayman-alkhadra-845068123/', phone:null},
  {name:'Faisal Alsamadi', center:'alhabib-riyadh', photo:'Faisal Alsamadi ALHABIB Riyadh.jpg', university:null, linkedin:null, phone:null},
  {name:'Ghaith Almidani', center:'sgh-riyadh', photo:'Ghaith Almidani SGH Riyadh.jpg', university:'University of Ottawa', linkedin:'https://www.linkedin.com/in/ghaithalmidani/', phone:null},
  {name:'Ibraheem Alshagdali', center:'ksh-hail', photo:'Ibraheem Alshagdali KSH Hail.jpg', university:'University of Arkansas', linkedin:'https://www.linkedin.com/in/ibrahim-alshaghdali-md-96836a103/', phone:null},
  {name:'Wafaa Aldawood', center:'iabfu-dammam', photo:'Wafaa Aldawood IABFU Dammam_Khobar.jpg', university:'University of Ottawa', linkedin:'https://www.linkedin.com/in/wafa-aldawood-451030116/', phone:null},
  {name:'Nasser Alhammad', center:'almoussa-dammam', photo:'Nasser Alhammad ALMOUSSA Dammam_Khobar.jpg', university:'Queen\'s University', linkedin:'https://www.linkedin.com/in/nasser-alhammad-5551297a/', phone:null},
  {name:'Saad Alhasaniah', center:'johnshopkins-dammam', photo:'Saad Alhasaniah JOHNS HOPKINS Dammam_Khobar.jpg', university:'University of Toronto', linkedin:'https://www.linkedin.com/in/saad-alhasaniah-914554b7/', phone:null},
  {name:'Mousa Alharbi', center:'dallah-dammam', photo:'Mousa Alharbi DALLAH Dammam_Khobar.jpg', university:'Dalhousie University', linkedin:'https://www.linkedin.com/in/mousa-alharbi-aa100721/', phone:null},
  {name:'Fahad Almehmadi', center:'ngha-jeddah', photo:'Fahad Almehamadi NGHA Jeddah.jpg', university:'Western University', linkedin:'https://www.linkedin.com/in/fahad-almehmadi-md-mph-frcpc-fhrs-a6b923a0/', phone:null},
  {name:'Atif Alqubbany', center:'ngha-jeddah', photo:'Atif Alqubbany NGHA Jeddah.jpg', university:'University of Toronto', linkedin:'https://www.linkedin.com/in/atif-alqubbany-94108192/', phone:null},
  {name:'Amin Zagzoog', center:'ngha-jeddah', photo:'Amin Zagzoog NGHA Jeddah.jpg', university:'University of Ottawa', linkedin:'https://www.linkedin.com/in/amin-zagzoog-md-fhrs-52a328160/', phone:null},
  {name:'Fayez Bokhari', center:'kfafh-jeddah', photo:'Fayez Bokhari KFAFH Jeddah.jpg', university:null, linkedin:'https://www.linkedin.com/in/fayez-bokhari-605334111/', phone:null},
  {name:'Ahmad Mokhtar', center:'alhabib-jeddah', photo:'Ahmad Mokhtar ALHABIB Jeddah.jpg', university:'Western University', linkedin:'https://www.linkedin.com/in/ahmed-mokhtar-md-frcpc-facc-drcpsc-6a811a95/', phone:null},
  {name:'Anas Alzahrani', center:'kauh-jeddah', photo:'Anas Alzahrani Jeddah.jpg', university:'University of Ottawa', linkedin:'https://www.linkedin.com/in/anas-alzahrani-mbbs-frcpc-drcpsc-a0802243/', phone:null},
  {name:'Alaa Meer', center:'kauh-jeddah', photo:null, university:null, linkedin:'https://www.linkedin.com/in/alaa-meer-408a0676/', phone:null},
  {name:'Baraa Mandoorah', center:'kfgh-jeddah', photo:null, university:'Université de Montpellier', linkedin:'https://www.linkedin.com/in/bara-mandoorah-a1907331/', phone:null},
  {name:'Rania Alhaj', center:'kfgh-jeddah', photo:'Rania Alhaj KFGH.jpg', university:null, linkedin:'https://www.linkedin.com/in/rania-alhaj-484837358/', phone:null},
  {name:'Naeem Alshoaibi', center:'faqeeh-jeddah', photo:'Naeem Alshoaibi FAQEEH Jeddah.jpg', university:'McMaster University', linkedin:'https://www.linkedin.com/in/naeem-alshoaibi-37aaa2310/', phone:'0555631771'},
  {name:'Majid Abonab', center:'faqeeh-jeddah', photo:null, university:'McMaster University', linkedin:'https://www.linkedin.com/in/majid-abonab-672018277/', phone:'0500556498'},
  {name:'Mustafa Zaitouni', center:'sgh-makkah', photo:'Mustafa Zaitouni SGH Jeddah.png', university:'Santé Québec Montreal', linkedin:'https://www.linkedin.com/in/mustafa-zaitouni-8428542b7/', phone:null},
  {name:'Mohammad Ghazni', center:'mcc-madinah', photo:'Mohammad Ghazni MCC Jeddah.jpg', university:'St. Michael\'s Toronto', linkedin:'https://www.linkedin.com/in/dr-m-salman-ghazni-146455129/', phone:null},
  {name:'Abdullah Alshehri', center:'pfkcc-abha', photo:null, university:'University of Ottawa', linkedin:'https://www.linkedin.com/in/abdullah-alshehri-md-drcpsc-b624081a2/', phone:null},
  {name:'Abdulelah Alshehri', center:'pfkcc-abha', photo:'Abdulelah Alshehri PFKCC Abha.jpg', university:null, linkedin:null, phone:null},
  {name:'Saad Alqahtani', center:'pfkcc-abha', photo:null, university:null, linkedin:'https://www.linkedin.com/in/saad-alqahtani-3a08401a5/', phone:null},
  {name:'Nasser AlSolaia', center:'pscckkh-najran', photo:'Nasser AlSolaia PSCC_KKH.jpg', university:'University of Ottawa', linkedin:'https://www.linkedin.com/in/dr-nasser-al-solaia-457896390/', phone:'0551266629'},
  {name:'Abdulhakim Noman', center:'pscckkh-najran', photo:'Abdulhakim Noman PSCC_KKH.jpg', university:'National Heart Institute Malaysia', linkedin:'https://www.linkedin.com/in/dr-abdulhakim-noman-md-phd-fhrs-fscai-b7258b37/', phone:null},
  {name:'Ahmad Aljefri', center:'kfshrc-riyadh', photo:'Ahmad Aljefri KFSHRC Riyadh.jpg', university:null, linkedin:null, phone:null},
];

/* Photo files live in ./images — this maps each source filename to its relative URL */
const PHOTOS = {
  'Abdulelah Alshehri PFKCC Abha.jpg': 'images/' + encodeURIComponent('Abdulelah Alshehri PFKCC Abha.jpg'),
  'Abdulhakim Noman PSCC_KKH.jpg': 'images/' + encodeURIComponent('Abdulhakim Noman PSCC_KKH.jpg'),
  'Abdullah Sharaf KSMC Riyadh.jpg': 'images/' + encodeURIComponent('Abdullah Sharaf KSMC Riyadh.jpg'),
  'Abdulmohsen Almusaad NGHA Riyadh.png': 'images/' + encodeURIComponent('Abdulmohsen Almusaad NGHA Riyadh.png'),
  'Ahmad Alfaqeeh PSCC Riyadh.jpg': 'images/' + encodeURIComponent('Ahmad Alfaqeeh PSCC Riyadh.jpg'),
  'Ahmad Aljefri KFSHRC Riyadh.jpg': 'images/' + encodeURIComponent('Ahmad Aljefri KFSHRC Riyadh.jpg'),
  'Ahmad Alsalem NGHA Riyadh.jpg': 'images/' + encodeURIComponent('Ahmad Alsalem NGHA Riyadh.jpg'),
  'Ahmad Mokhtar ALHABIB Jeddah.jpg': 'images/' + encodeURIComponent('Ahmad Mokhtar ALHABIB Jeddah.jpg'),
  'Alaa AlDossari KFMC Riyadh.jpg': 'images/' + encodeURIComponent('Alaa AlDossari KFMC Riyadh.jpg'),
  'Amin Zagzoog NGHA Jeddah.jpg': 'images/' + encodeURIComponent('Amin Zagzoog NGHA Jeddah.jpg'),
  'Anas Alzahrani Jeddah.jpg': 'images/' + encodeURIComponent('Anas Alzahrani Jeddah.jpg'),
  'Atif Alqubbany NGHA Jeddah.jpg': 'images/' + encodeURIComponent('Atif Alqubbany NGHA Jeddah.jpg'),
  'Ayman Alkhadhraa ALHABIB Riyadh.jpg': 'images/' + encodeURIComponent('Ayman Alkhadhraa ALHABIB Riyadh.jpg'),
  'Bandar Alghamdi KFSHRC Riyadh.jpg': 'images/' + encodeURIComponent('Bandar Alghamdi KFSHRC Riyadh.jpg'),
  'Fahad Almehamadi NGHA Jeddah.jpg': 'images/' + encodeURIComponent('Fahad Almehamadi NGHA Jeddah.jpg'),
  'Faisal Alsamadi ALHABIB Riyadh.jpg': 'images/' + encodeURIComponent('Faisal Alsamadi ALHABIB Riyadh.jpg'),
  'Fayez Bokhari KFAFH Jeddah.jpg': 'images/' + encodeURIComponent('Fayez Bokhari KFAFH Jeddah.jpg'),
  'Feras Assiri NGHA Riyadh.jpg': 'images/' + encodeURIComponent('Feras Assiri NGHA Riyadh.jpg'),
  'Ghaith Almidani SGH Riyadh.jpg': 'images/' + encodeURIComponent('Ghaith Almidani SGH Riyadh.jpg'),
  'Haitham Alanazi NGHA Riyadh.jpg': 'images/' + encodeURIComponent('Haitham Alanazi NGHA Riyadh.jpg'),
  'Hussein Hado KSMC Riyadh.png': 'images/' + encodeURIComponent('Hussein Hado KSMC Riyadh.png'),
  'Ibraheem Alshagdali KSH Hail.jpg': 'images/' + encodeURIComponent('Ibraheem Alshagdali KSH Hail.jpg'),
  'Khader Herzallah KFMC Riyadh.jpg': 'images/' + encodeURIComponent('Khader Herzallah KFMC Riyadh.jpg'),
  'Khalid Daghriri PSCC Riyadh.jpg': 'images/' + encodeURIComponent('Khalid Daghriri PSCC Riyadh.jpg'),
  'Mohammad Ghazni MCC Jeddah.jpg': 'images/' + encodeURIComponent('Mohammad Ghazni MCC Jeddah.jpg'),
  'Mohammed Alshehri KFMC Riyadh.jpg': 'images/' + encodeURIComponent('Mohammed Alshehri KFMC Riyadh.jpg'),
  'Mossab AlJuaid KFMC Riyadh.jpg': 'images/' + encodeURIComponent('Mossab AlJuaid KFMC Riyadh.jpg'),
  'Mousa Alharbi DALLAH Dammam_Khobar.jpg': 'images/' + encodeURIComponent('Mousa Alharbi DALLAH Dammam_Khobar.jpg'),
  'Mustafa Zaitouni SGH Jeddah.png': 'images/' + encodeURIComponent('Mustafa Zaitouni SGH Jeddah.png'),
  'Naeem Alshoaibi FAQEEH Jeddah.jpg': 'images/' + encodeURIComponent('Naeem Alshoaibi FAQEEH Jeddah.jpg'),
  'Nasser AlSolaia PSCC_KKH.jpg': 'images/' + encodeURIComponent('Nasser AlSolaia PSCC_KKH.jpg'),
  'Nasser Alhammad ALMOUSSA Dammam_Khobar.jpg': 'images/' + encodeURIComponent('Nasser Alhammad ALMOUSSA Dammam_Khobar.jpg'),
  'Omar Mamoun PMAH Riyadh.jpg': 'images/' + encodeURIComponent('Omar Mamoun PMAH Riyadh.jpg'),
  'Rania Alhaj KFGH.jpg': 'images/' + encodeURIComponent('Rania Alhaj KFGH.jpg'),
  'Saad Alhasaniah JOHNS HOPKINS Dammam_Khobar.jpg': 'images/' + encodeURIComponent('Saad Alhasaniah JOHNS HOPKINS Dammam_Khobar.jpg'),
  'Tareq Alhaqbani KKUH Riyadh.jpg': 'images/' + encodeURIComponent('Tareq Alhaqbani KKUH Riyadh.jpg'),
  'Wael Qarawi KKUH Riyadh.jpg': 'images/' + encodeURIComponent('Wael Qarawi KKUH Riyadh.jpg'),
  'Wafaa Aldawood IABFU Dammam_Khobar.jpg': 'images/' + encodeURIComponent('Wafaa Aldawood IABFU Dammam_Khobar.jpg'),
  'Yahya AlHubaishi PSCC Riyadh.jpg': 'images/' + encodeURIComponent('Yahya AlHubaishi PSCC Riyadh.jpg'),
};

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

/* Country a training institution is in, matched by keyword — used for the
   flag shown next to "university" on a person card, and for the training
   overview chart. Add a keyword here if a new institution shows up. */
const TRAINING_COUNTRIES = [
  {country:'Canada',   flag:'🇨🇦', keywords:['calgary','toronto','tornto','ottawa','british columbia','mcmaster',"queen's",'queens','dalhousie','western university','montreal','québec','quebec','st. michael']},
  {country:'United States', flag:'🇺🇸', keywords:['tufts','pennsylvania','utah','cleveland','arkansas']},
  {country:'France',  flag:'🇫🇷', keywords:['bordeaux','montpellier']},
  {country:'Malaysia', flag:'🇲🇾', keywords:['malaysia']},
];

function countryForUniversity(uni){
  if(!uni) return null;
  const lower = uni.toLowerCase();
  for(const entry of TRAINING_COUNTRIES){
    if(entry.keywords.some(k=>lower.includes(k))) return entry;
  }
  return null;
}

/* ======================= BUILD DERIVED INDEXES ======================= */
Object.keys(CENTERS).forEach(id=>CENTERS[id].people=[]);
Object.keys(CITIES).forEach(id=>CITIES[id].centers=[]);
PEOPLE.forEach(p=>{ CENTERS[p.center].people.push(p); });
Object.keys(CENTERS).forEach(id=>{
  const c = CENTERS[id];
  CITIES[c.city].centers.push(id);
});
