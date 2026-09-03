import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light';
export type Language = 'en' | 'hi' | 'or';

interface ThemeState {
  theme: ThemeMode;
  language: Language;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    systemName: 'LIMITS',
    systemSubtitle: 'Vertical GIS Cadastral System',
    home: 'Home',
    dashboard: 'Dashboard',
    databaseExplorer: 'Database Explorer',
    map3d: '3D GIS Map',
    verticalExplorer: 'Vertical Explorer',
    generateUlpin: 'Generate ULPIN',
    propertyRegistry: 'Property Registry',
    registryHistory: 'Registry History',
    validation: 'Spatial Validation',
    changeDetection: 'Change Detection',
    flaggedProperties: 'Flagged Properties',
    datasetManager: 'Dataset Manager',
    aiProcessing: 'AI Processing',
    authorityDashboard: 'Authority Analytics',
    lidarViewer: 'LiDAR Viewer',
    arVrMode: 'AR / VR Mode',
    settings: 'Settings',
    searchPlaceholder: 'Search ULPIN, Owner, Building, Parcel...',
    welcomeTitle: 'Vertical Property Spatial Intelligence',
    welcomeDesc: 'Welcome to LIMITS Bhubaneswar Ward 12 Digital Twin. Seamlessly manage 3D ULPIN registrations, LiDAR surveys, and autonomous AI spatial validation.',
    openMap: 'Open 3D Map',
    totalUlpins: 'Total 3D ULPINs',
    verifiedClean: 'Verified & Clean',
    flaggedEncroachments: 'Flagged Violations',
    digitalTwinCoverage: 'Digital Twin Coverage',
    quickNav: 'Quick Navigation Launchpad',
    cadastralFeed: 'Cadastral Activity Feed',
    signOut: 'Sign Out',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    cityStatus: 'Bhubaneswar Smart City • Active',
    activeTitle: 'Bhubaneswar Ward 12 Digital Twin',
    systemActive: 'SYSTEM ACTIVE',
    addNewRegister: '+ Add New Register',
    generate3DUlpin: 'Generate 3D ULPIN',

    // Generate ULPIN Page
    cadastralEncodingStandard: 'Cadastral Encoding Standard',
    ulpinGenerationConsole: '3D ULPIN Generation Console',
    ulpinGenDesc: 'Generate structured 18-digit unique vertical property identifiers mapped to volumetric spatial spaces.',
    geoCadastral2D: 'Geographic Cadastral Foundation (2D)',
    verticalSpatial3D: 'Vertical Spatial Space (3D Extensions)',
    ownershipSpecs: 'Ownership & Specifications',
    stateCode: 'State Code',
    cityDistrict: 'City / District',
    wardCode: 'Ward Code',
    parcelNumber: 'Parcel Number',
    buildingId: 'Building ID',
    floorLevel: 'Floor Level',
    unitSpace: 'Unit Space',
    primaryOwnerName: 'Primary Owner Full Name',
    carpetArea: 'Carpet Area (m²)',
    synthesizeRegisterBtn: 'Synthesize & Register 3D ULPIN',
    digitalTitleCert: 'DIGITAL 3D TITLE CERTIFICATE',
    synthesizedUlpin: 'SYNTHESIZED 3D ULPIN',
    owner: 'Owner',
    propertyClass: 'Property Class',
    volumetricArea: 'Volumetric Area',
    spatialTolerance: 'Spatial Tolerance',
    copyUlpinCode: 'Copy 3D ULPIN Code',
    viewOnMap: 'View on 3D GIS Map',
    openExplorer: 'Vertical Explorer',
    viewCertificate: 'Official Certificate',
    copiedSuccess: 'Copied to Clipboard!',
    slidingStep1: '1. 2D Parcel',
    slidingStep2: '2. 3D Unit',
    slidingStep3: '3. Owner & Deed',
  },
  hi: {
    systemName: 'LIMITS',
    systemSubtitle: 'वर्टिकल जीआईएस कैडस्ट्रल सिस्टम',
    home: 'होम',
    dashboard: 'डैशबोर्ड',
    databaseExplorer: 'डेटाबेस एक्सप्लोरर',
    map3d: '3D जीआईएस मैप',
    verticalExplorer: 'वर्टिकल एक्सप्लोरर',
    generateUlpin: 'ULPIN जेनरेट करें',
    propertyRegistry: 'प्रॉपर्टी रजिस्ट्री',
    registryHistory: 'रजिस्ट्री इतिहास',
    validation: 'स्थानिक सत्यापन',
    changeDetection: 'परिवर्तन पहचान',
    flaggedProperties: 'चिह्नित संपत्तियां',
    datasetManager: 'डेटासेट प्रबंधक',
    aiProcessing: 'एआई प्रोसेसिंग',
    authorityDashboard: 'प्राधिकरण एनालिटिक्स',
    lidarViewer: 'LiDAR व्यूअर',
    arVrMode: 'एआर / वीआर मोड',
    settings: 'सेटिंग्स',
    searchPlaceholder: 'ULPIN, मालिक, भवन, पार्सल खोजें...',
    welcomeTitle: 'वर्टिकल प्रॉपर्टी स्थानिक बुद्धिमत्ता',
    welcomeDesc: 'LIMITS भुवनेश्वर वार्ड 12 डिजिटल ट्विन में आपका स्वागत है। 3D ULPIN पंजीकरण, LiDAR सर्वेक्षण और एआई सत्यापन प्रबंधित करें।',
    openMap: '3D मैप खोलें',
    totalUlpins: 'कुल 3D ULPINs',
    verifiedClean: 'सत्यापित एवं स्वच्छ',
    flaggedEncroachments: 'चिह्नित उल्लंघन',
    digitalTwinCoverage: 'डिजिटल ट्विन कवरेज',
    quickNav: 'त्वरित नेविगेशन लॉन्चपैड',
    cadastralFeed: 'कैडस्ट्रल गतिविधि फ़ीड',
    signOut: 'लॉग आउट',
    lightMode: 'लाइट मोड',
    darkMode: 'डार्क मोड',
    cityStatus: 'भुवनेश्वर स्मार्ट सिटी • सक्रिय',
    activeTitle: 'भुवनेश्वर वार्ड 12 डिजिटल ट्विन',
    systemActive: 'सिस्टम सक्रिय',
    addNewRegister: '+ नया रजिस्टर जोड़ें',
    generate3DUlpin: '3D ULPIN जेनरेट करें',

    // Generate ULPIN Page
    cadastralEncodingStandard: 'कैडस्ट्रल एन्कोडिंग मानक',
    ulpinGenerationConsole: '3D ULPIN निर्माण कंसोल',
    ulpinGenDesc: 'वॉल्यूमेट्रिक स्थानिक स्थानों पर 18-अंकीय विशिष्ट वर्टिकल संपत्ति पहचानकर्ता उत्पन्न करें।',
    geoCadastral2D: 'भौगोलिक कैडस्ट्रल आधार (2D)',
    verticalSpatial3D: 'वर्टिकल स्थानिक क्षेत्र (3D विस्तार)',
    ownershipSpecs: 'स्वामित्व एवं संपत्ति विवरण',
    stateCode: 'राज्य कोड',
    cityDistrict: 'शहर / जिला',
    wardCode: 'वार्ड कोड',
    parcelNumber: 'पार्सल संख्या',
    buildingId: 'भवन संख्या (ID)',
    floorLevel: 'मंजिल स्तर',
    unitSpace: 'इकाई / फ्लैट संख्या',
    primaryOwnerName: 'प्राथमिक मालिक का पूरा नाम',
    carpetArea: 'कारपेट क्षेत्र (वर्ग मीटर)',
    synthesizeRegisterBtn: '3D ULPIN संश्लेषित एवं पंजीकृत करें',
    digitalTitleCert: 'डिजिटल 3D स्वामित्व प्रमाणपत्र',
    synthesizedUlpin: 'संश्लेषित 3D ULPIN',
    owner: 'मालिक',
    propertyClass: 'संपत्ति वर्ग',
    volumetricArea: 'वॉल्यूमेट्रिक क्षेत्रफल',
    spatialTolerance: 'स्थानिक सटीकता',
    copyUlpinCode: '3D ULPIN कोड कॉपी करें',
    viewOnMap: '3D जीआईएस मैप पर देखें',
    openExplorer: 'वर्टिकल एक्सप्लोरर',
    viewCertificate: 'आधिकारिक प्रमाणपत्र',
    copiedSuccess: 'क्लिपबोर्ड पर कॉपी हो गया!',
    slidingStep1: '1. 2D पार्सल',
    slidingStep2: '2. 3D यूनिट',
    slidingStep3: '3. स्वामित्व एवं विलेख',
  },
  or: {
    systemName: 'LIMITS',
    systemSubtitle: 'ଭର୍ଟିକାଲ୍ GIS କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ ସିଷ୍ଟମ୍',
    home: 'ମୂଳପୃଷ୍ଠା',
    dashboard: 'ଡ୍ୟାସବୋର୍ଡ',
    databaseExplorer: 'ଡାଟାବେସ୍ ଏକ୍ସପ୍ଲୋରର୍',
    map3d: '3D GIS ମ୍ୟାପ୍',
    verticalExplorer: 'ଭର୍ଟିକାଲ୍ ଏକ୍ସପ୍ଲୋରର୍',
    generateUlpin: 'ULPIN ପ୍ରସ୍ତୁତ କରନ୍ତୁ',
    propertyRegistry: 'ସମ୍ପତ୍ତି ପଞ୍ଜିକରଣ',
    registryHistory: 'ପଞ୍ଜିକରଣ ଇତିହାସ',
    validation: 'ସ୍ଥାନିକ ପ୍ରମାଣୀକରଣ',
    changeDetection: 'ପରିବର୍ତ୍ତନ ଚିହ୍ନଟ',
    flaggedProperties: 'ଚିହ୍ନିତ ସମ୍ପତ୍ତି',
    datasetManager: 'ଡାଟାସେଟ୍ ପରିଚାଳକ',
    aiProcessing: 'AI ପ୍ରକ୍ରିୟାକରଣ',
    authorityDashboard: 'କର୍ତ୍ତୃପକ୍ଷ ବିଶ୍ଳେଷଣ',
    lidarViewer: 'LiDAR ଭିଉଅର୍',
    arVrMode: 'AR / VR ମୋଡ୍',
    settings: 'ସେଟିଙ୍ଗ୍ସ',
    searchPlaceholder: 'ULPIN, ମାଲିକ, କୋଠା, ପାର୍ସଲ୍ ସନ୍ଧାନ କରନ୍ତୁ...',
    welcomeTitle: 'ଭର୍ଟିକାଲ୍ ପ୍ରପର୍ଟି ସ୍ଥାନିକ ଗୁଇନ୍ଦା ସୂଚନା',
    welcomeDesc: 'LIMITS ଭୁବନେଶ୍ୱର ୱାର୍ଡ 12 ଡିଜିଟାଲ୍ ଟ୍ୱିନ୍‌କୁ ସ୍ୱାଗତ। 3D ULPIN ପଞ୍ଜିକରଣ, LiDAR ସର୍ବେକ୍ଷଣ ଏବଂ ସ୍ୱୟଂଚାଳିତ AI ପ୍ରମାଣୀକରଣ।',
    openMap: '3D ମ୍ୟାପ୍ ଖୋଲନ୍ତୁ',
    totalUlpins: 'ମୋଟ 3D ULPINs',
    verifiedClean: 'ପ୍ରମାଣିତ ଓ ନିର୍ଭୁଲ',
    flaggedEncroachments: 'ଚିହ୍ନିତ ନିୟମ ଉଲ୍ଲଂଘନ',
    digitalTwinCoverage: 'ଡିଜିଟାଲ୍ ଟ୍ୱିନ୍ କଭରେଜ୍',
    quickNav: 'ଦ୍ରୁତ ନେଭିଗେସନ୍',
    cadastralFeed: 'କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ କାର୍ଯ୍ୟକଳାପ ଫିଡ୍',
    signOut: 'ସାଇନ୍ ଆଉଟ୍',
    lightMode: 'ଲାଇଟ୍ ମୋଡ୍',
    darkMode: 'ଡାର୍କ ମୋଡ୍',
    cityStatus: 'ଭୁବନେଶ୍ୱର ସ୍ମାର୍ଟ ସିଟି • ସକ୍ରିୟ',
    activeTitle: 'ଭୁବନେଶ୍ୱର ୱାର୍ଡ 12 ଡିଜିଟାଲ୍ ଟ୍ୱିନ୍',
    systemActive: 'ସିଷ୍ଟମ୍ ସକ୍ରିୟ',
    addNewRegister: '+ ନୂଆ ରେଜିଷ୍ଟର ଯୋଡ଼ନ୍ତୁ',
    generate3DUlpin: '3D ULPIN ପ୍ରସ୍ତୁତ କରନ୍ତୁ',

    // Generate ULPIN Page
    cadastralEncodingStandard: 'କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ ଏନକୋଡିଂ ମାନକ',
    ulpinGenerationConsole: '3D ULPIN ଉତ୍ପାଦନ କନସୋଲ୍',
    ulpinGenDesc: 'ଭଲ୍ୟୁମେଟ୍ରିକ୍ ସ୍ଥାନିକ ସ୍ଥାନ ସହିତ 18-ଅଙ୍କିଆ ସ୍ୱତନ୍ତ୍ର ଭର୍ଟିକାଲ୍ ସମ୍ପତ୍ତି ପରିଚୟ ସୃଷ୍ଟି କରନ୍ତୁ।',
    geoCadastral2D: 'ଭୌଗୋଳିକ କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ ମୂଳଭିତ୍ତି (2D)',
    verticalSpatial3D: 'ଭର୍ଟିକାଲ୍ ସ୍ଥାନିକ କ୍ଷେତ୍ର (3D ବିସ୍ତାର)',
    ownershipSpecs: 'ମାଲିକାନା ଏବଂ ସମ୍ପତ୍ତି ବିବରଣୀ',
    stateCode: 'ରାଜ୍ୟ କୋଡ୍',
    cityDistrict: 'ସହର / ଜିଲ୍ଲା',
    wardCode: 'ୱାର୍ଡ କୋଡ୍',
    parcelNumber: 'ପାର୍ସଲ୍ ସଂଖ୍ୟା',
    buildingId: 'କୋଠା ID',
    floorLevel: 'ମହଲା ସ୍ତର',
    unitSpace: 'ୟୁନିଟ୍ / ଫ୍ଲାଟ୍ ସଂଖ୍ୟା',
    primaryOwnerName: 'ମୁଖ୍ୟ ମାଲିକଙ୍କ ପୂରା ନାମ',
    carpetArea: 'କାର୍ପେଟ୍ କ୍ଷେତ୍ର (ବର୍ଗ ମିଟର)',
    synthesizeRegisterBtn: '3D ULPIN ପ୍ରସ୍ତୁତ ଓ ପଞ୍ଜିକୃତ କରନ୍ତୁ',
    digitalTitleCert: 'ଡିଜିଟାଲ୍ 3D ମାଲିକାନା ପ୍ରମାଣପତ୍ର',
    synthesizedUlpin: 'ପ୍ରସ୍ତୁତ 3D ULPIN',
    owner: 'ମାଲିକ',
    propertyClass: 'ସମ୍ପତ୍ତି ଶ୍ରେଣୀ',
    volumetricArea: 'ଭଲ୍ୟୁମେଟ୍ରିକ୍ କ୍ଷେତ୍ରଫଳ',
    spatialTolerance: 'ସ୍ଥାନିକ ସଠିକତା',
    copyUlpinCode: '3D ULPIN କୋଡ୍ କପି କରନ୍ତୁ',
    viewOnMap: '3D GIS ମ୍ୟାପ୍‌ରେ ଦେଖନ୍ତୁ',
    openExplorer: 'ଭର୍ଟିକାଲ୍ ଏକ୍ସପ୍ଲୋରର୍',
    viewCertificate: 'ଅଫିସିଆଲ୍ ପ୍ରମାଣପତ୍ର',
    copiedSuccess: 'କ୍ଲିପବୋର୍ଡରେ କପି ହୋଇଗଲା!',
    slidingStep1: '1. 2D ପାର୍ସଲ୍',
    slidingStep2: '2. 3D ୟୁନିଟ୍',
    slidingStep3: '3. ମାଲିକାନା ଓ ଦଲିଲ୍',
  }
};

const initialTheme: ThemeMode = (localStorage.getItem('limits_theme') as ThemeMode) || 'dark';
const initialLang: Language = (localStorage.getItem('limits_lang') as Language) || 'en';

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: initialTheme,
  language: initialLang,
  toggleTheme: () => {
    const nextTheme: ThemeMode = get().theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('limits_theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
    set({ theme: nextTheme });
  },
  setTheme: (theme: ThemeMode) => {
    localStorage.setItem('limits_theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
    set({ theme });
  },
  setLanguage: (lang: Language) => {
    localStorage.setItem('limits_lang', lang);
    set({ language: lang });
  },
  t: (key: string) => {
    const lang = get().language;
    return TRANSLATIONS[lang]?.[key] || TRANSLATIONS['en']?.[key] || key;
  }
}));
