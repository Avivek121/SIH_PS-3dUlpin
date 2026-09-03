import { create } from 'zustand';

export type ThemeMode = 'dark' | 'light';
export type Language = 'en' | 'hi' | 'or';

interface ThemeState {
  theme: ThemeMode;
  language: Language;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
}

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Header
    systemName: 'LIMITS',
    systemSubtitle: 'Vertical GIS Cadastral System',
    smartCity: 'Bhubaneswar Smart City',
    signOut: 'Sign Out',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    cityStatus: 'Bhubaneswar Smart City • Active',
    activeTitle: 'Bhubaneswar Ward 12 Digital Twin',
    systemActive: 'SYSTEM ACTIVE',
    addNewRegister: '+ Add New Register',
    generate3DUlpin: 'Generate 3D ULPIN',
    swaggerDocs: '⚡ Swagger API (21 Endpoints)',
    postgresConnected: 'DB: POSTGRESQL (179 ULPINs)',

    // Navigation Links
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

    // Dashboard Page
    welcomeTitle: 'Vertical Property Spatial Intelligence',
    welcomeDesc: 'Welcome to LIMITS Bhubaneswar Ward 12 Digital Twin. Seamlessly manage 3D ULPIN registrations, LiDAR surveys, and autonomous AI spatial validation.',
    openMap: 'Open 3D Map',
    totalUlpins: 'Total 3D ULPINs',
    verifiedClean: 'Verified & Clean',
    flaggedEncroachments: 'Flagged Violations',
    digitalTwinCoverage: 'Digital Twin Coverage',
    quickNav: 'Quick Navigation Launchpad',
    cadastralFeed: 'Cadastral Activity Feed',

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

    // Property Registry Page
    propertyRegistryTitle: '3D Property Registry',
    propertyRegistryDesc: 'Master repository of all 18-digit volumetric 3D ULPIN entries and cadastral title records.',
    officialCadastralLedger: 'Official Cadastral Ledger • LIMITS',
    allTab: 'All',
    registeredTab: 'Registered',
    flaggedTab: 'Flagged',
    pendingTab: 'Pending',
    searchRegistryPlaceholder: 'Search by ULPIN, Owner, or Building...',
    thUlpin: '3D ULPIN Identifier',
    thOwner: 'Owner Name',
    thBuildingUnit: 'Building & Unit',
    thType: 'Property Type',
    thArea: 'Area (m²)',
    thStatus: 'Status',
    thActions: 'Actions',
    registerNewPropertyModal: 'Register New Property',
    registerNewPropertyDesc: 'Add property record to LIMITS 3D Cadastral Ledger',
    confirmSaveRegister: 'Confirm & Save Register',
    cancelBtn: 'Cancel',

    // Database Page
    databaseExplorerTitle: 'PostgreSQL 3D Database Explorer',
    databaseConnected: 'CONNECTED',
    refreshBtn: 'Refresh',
    selectDatabaseTable: 'Select Database Table',
    liveTableRecords: 'Live Table Records',
    searchRecordsPlaceholder: 'Search live database records...',
    totalRecordsCount: 'Total Records in PostgreSQL',

    // 3D Map Page
    mapGlobeTitle: 'Bhubaneswar Smart City 3D Cadastral Map',
    mapGlobeDesc: 'Interactive volumetric parcel, floor-level spatial intelligence & LiDAR overlay.',
    orbit3DMode: '3D Perspective',
    top2DMode: 'Top 2D View',
    lidarMode: 'LiDAR Cloud',
    resetCamera: 'Reset View',
    zoomInBtn: 'Zoom In',
    zoomOutBtn: 'Zoom Out',
    buildingInspector: 'Spatial Unit Inspector',
    floorSelector: 'Floor Level',
    unitSelector: 'Unit / Flat',
    viewDeedCert: 'View 3D Title Deed Certificate',
    locate3DUnit: 'Isolate & Highlight Unit',

    // Vertical Explorer Page
    verticalExplorerTitle: '3D Vertical Building Unit Explorer',
    verticalExplorerDesc: 'Exploded volumetric floor stack with unit-level ownership and spatial sanction matching.',
    explodeViewBtn: 'Explode Floors',
    collapseViewBtn: 'Collapse Floors',
    rotateBtn: 'Auto-Rotate',
    unitsOnFloor: 'Units on Floor',
    unitDetails: 'Unit Specifications',
    elevationHeight: 'Elevation Height',

    // Spatial Validation Page
    spatialValidationTitle: 'Autonomous AI Spatial Validation',
    spatialValidationDesc: 'Real-time volumetric conformance checking between approved architectural sanctions and as-built LiDAR point clouds.',
    sanctionedVsAsBuilt: 'Sanctioned vs As-Built 3D Volume',
    toleranceVerified: 'Tolerance Verified (±15mm)',
    violationDetected: 'Height Exceedance Detected',
    revalidateAll: 'Run AI Spatial Validation',

    // Change Detection Page
    changeDetectionTitle: 'AI Multi-Temporal Change Detection',
    changeDetectionDesc: 'Temporal satellite and drone comparison detecting unauthorized vertical floor additions and encroachments.',
    temporalTimeline: 'Survey Timeline Comparison',
    encroachmentDetected: 'Encroachment Flagged',
    baselineSurvey: 'Baseline 2024 Survey',
    currentSurvey: 'Latest 2026 Survey',

    // Flagged Properties Page
    flaggedPropertiesTitle: 'Flagged Encroachments & Violations',
    flaggedPropertiesDesc: 'Municipal notice ledger for properties with spatial height or boundary violations.',
    issueNoticeBtn: 'Issue Municipal Notice',
    resolveViolationBtn: 'Resolve & Clear Flag',

    // Datasets Page
    datasetManagerTitle: 'Drone & LiDAR Survey Dataset Manager',
    datasetManagerDesc: 'Ingest and process Agisoft Metashape point clouds, photogrammetry meshes, and Ground Control Points.',
    ingestNewDataset: '+ Ingest New Survey Dataset',
    uploadPointcloud: 'Upload LAS / LAZ Point Cloud',

    // AI Processing Page
    aiProcessingTitle: 'Automated 3D Cadastral AI Pipeline',
    aiProcessingDesc: 'Convolutional neural networks for automated floor extraction, unit segmentation, and roof classification.',
    runPipelineBtn: 'Trigger AI Pipeline',
    pipelineStatus: 'Model Weights: ULPIN-Net v3 (Active)',

    // Authority Analytics Page
    authorityTitle: 'Municipal Authority Analytics & Tax Valuation',
    authorityDesc: 'Volumetric property tax calculation, Ward 12 spatial density, and compliance index.',
    taxValuationTotal: 'Total Projected Municipal Tax',
    complianceIndex: 'Spatial Compliance Index',

    // LiDAR Viewer Page
    lidarViewerTitle: 'High-Density 3D LiDAR Point Cloud Viewer',
    lidarViewerDesc: '148 Million points colorized by elevation, intensity, and classification.',
    pointBudget: 'Point Budget',
    colorScheme: 'Color Scheme',

    // Settings Page
    settingsTitle: 'LIMITS System Settings & Configuration',
    settingsDesc: 'Configure GIS datum, spatial projection (EPSG:32645), theme appearance, and language.',
    languagePreference: 'Language Preference',
    themePreference: 'Theme Mode'
  },
  hi: {
    // Brand & Header
    systemName: 'LIMITS',
    systemSubtitle: 'वर्टिकल जीआईएस कैडस्ट्रल सिस्टम',
    smartCity: 'भुवनेश्वर स्मार्ट सिटी',
    signOut: 'लॉग आउट',
    lightMode: 'लाइट मोड',
    darkMode: 'डार्क मोड',
    cityStatus: 'भुवनेश्वर स्मार्ट सिटी • सक्रिय',
    activeTitle: 'भुवनेश्वर वार्ड 12 डिजिटल ट्विन',
    systemActive: 'सिस्टम सक्रिय',
    addNewRegister: '+ नया रजिस्टर जोड़ें',
    generate3DUlpin: '3D ULPIN जेनरेट करें',
    swaggerDocs: '⚡ स्वैगर एपीआई (21 एंडपॉइंट्स)',
    postgresConnected: 'डेटाबेस: पोस्टग्रेस (179 ULPINs)',

    // Navigation Links
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

    // Dashboard Page
    welcomeTitle: 'वर्टिकल प्रॉपर्टी स्थानिक बुद्धिमत्ता',
    welcomeDesc: 'LIMITS भुवनेश्वर वार्ड 12 डिजिटल ट्विन में आपका स्वागत है। 3D ULPIN पंजीकरण, LiDAR सर्वेक्षण और एआई सत्यापन प्रबंधित करें।',
    openMap: '3D मैप खोलें',
    totalUlpins: 'कुल 3D ULPINs',
    verifiedClean: 'सत्यापित एवं स्वच्छ',
    flaggedEncroachments: 'चिह्नित उल्लंघन',
    digitalTwinCoverage: 'डिजिटल ट्विन कवरेज',
    quickNav: 'त्वरित नेविगेशन लॉन्चपैड',
    cadastralFeed: 'कैडस्ट्रल गतिविधि फ़ीड',

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

    // Property Registry Page
    propertyRegistryTitle: '3D प्रॉपर्टी रजिस्ट्री',
    propertyRegistryDesc: 'सभी 18-अंकीय वॉल्यूमेट्रिक 3D ULPIN प्रविष्टियों और कैडस्ट्रल स्वामित्व अभिलेखों का मास्टर रिपॉजिटरी।',
    officialCadastralLedger: 'आधिकारिक कैडस्ट्रल लेज़र • LIMITS',
    allTab: 'सभी',
    registeredTab: 'पंजीकृत',
    flaggedTab: 'चिह्नित',
    pendingTab: 'लंबित',
    searchRegistryPlaceholder: 'ULPIN, मालिक, या भवन द्वारा खोजें...',
    thUlpin: '3D ULPIN पहचानकर्ता',
    thOwner: 'मालिक का नाम',
    thBuildingUnit: 'भवन एवं इकाई',
    thType: 'संपत्ति प्रकार',
    thArea: 'क्षेत्रफल (वर्ग मी)',
    thStatus: 'स्थिति',
    thActions: 'कार्रवाई',
    registerNewPropertyModal: 'नयी संपत्ति पंजीकृत करें',
    registerNewPropertyDesc: 'LIMITS 3D कैडस्ट्रल लेज़र में संपत्ति रिकॉर्ड जोड़ें',
    confirmSaveRegister: 'पुष्टि करें एवं सुरक्षित करें',
    cancelBtn: 'रद्द करें',

    // Database Page
    databaseExplorerTitle: 'पोस्टग्रेएसक्यूएल 3D डेटाबेस एक्सप्लोरर',
    databaseConnected: 'सफलतापूर्वक कनेक्टेड',
    refreshBtn: 'रीफ्रेश करें',
    selectDatabaseTable: 'डेटाबेस तालिका चुनें',
    liveTableRecords: 'लाइव तालिका रिकॉर्ड्स',
    searchRecordsPlaceholder: 'लाइव डेटाबेस रिकॉर्ड खोजें...',
    totalRecordsCount: 'पोस्टग्रेस में कुल रिकॉर्ड्स',

    // 3D Map Page
    mapGlobeTitle: 'भुवनेश्वर स्मार्ट सिटी 3D कैडस्ट्रल मानचित्र',
    mapGlobeDesc: 'इंटरैक्टिव वॉल्यूमेट्रिक पार्सल, बहुमंजिला स्थानिक बुद्धिमत्ता एवं LiDAR ओवरले।',
    orbit3DMode: '3D परिप्रेक्ष्य',
    top2DMode: 'शीर्ष 2D दृश्य',
    lidarMode: 'LiDAR पॉइंट क्लाउड',
    resetCamera: 'कैमरा रीसेट',
    zoomInBtn: 'ज़ूम इन',
    zoomOutBtn: 'ज़ूम आउट',
    buildingInspector: 'स्थानिक इकाई निरीक्षक',
    floorSelector: 'मंजिल स्तर',
    unitSelector: 'इकाई / फ्लैट',
    viewDeedCert: '3D स्वामित्व प्रमाणपत्र देखें',
    locate3DUnit: 'इकाई को हाइलाइट करें',

    // Vertical Explorer Page
    verticalExplorerTitle: '3D वर्टिकल भवन इकाई एक्सप्लोरर',
    verticalExplorerDesc: 'मंजिल-वार exploded 3D स्टैक, इकाई स्वामित्व और स्थानिक अनुपालन विश्लेषण।',
    explodeViewBtn: 'मंजिलें अलग करें (Explode)',
    collapseViewBtn: 'मंजिलें समेटें (Collapse)',
    rotateBtn: 'ऑटो-रोटेट',
    unitsOnFloor: 'इस मंजिल की इकाइयाँ',
    unitDetails: 'इकाई विनिर्देश',
    elevationHeight: 'ऊंचाई (Elevation)',

    // Spatial Validation Page
    spatialValidationTitle: 'स्वायत्त एआई स्थानिक सत्यापन',
    spatialValidationDesc: 'स्वीकृत मानचित्रों और LiDAR सर्वेक्षणों के बीच वास्तविक समय में वॉल्यूमेट्रिक अनुपालन जांच।',
    sanctionedVsAsBuilt: 'स्वीकृत बनाम निर्मित 3D आयतन',
    toleranceVerified: 'सटीकता सत्यापित (±15mm)',
    violationDetected: 'स्वीकृत ऊंचाई से अधिक निर्माण',
    revalidateAll: 'एआई स्थानिक सत्यापन चलाएं',

    // Change Detection Page
    changeDetectionTitle: 'एआई बहु-कालिक परिवर्तन पहचान',
    changeDetectionDesc: 'उपग्रह एवं ड्रोन सर्वेक्षणों की समयबद्ध तुलना जो अवैध निर्माण और अतिक्रमण पकड़ती है।',
    temporalTimeline: 'सर्वेक्षण समय-रेखा तुलना',
    encroachmentDetected: 'अतिक्रमण चिह्नित',
    baselineSurvey: 'आधारभूत 2024 सर्वेक्षण',
    currentSurvey: 'नवीनतम 2026 सर्वेक्षण',

    // Flagged Properties Page
    flaggedPropertiesTitle: 'चिह्नित अतिक्रमण एवं उल्लंघन',
    flaggedPropertiesDesc: 'ऊंचाई या सीमा उल्लंघन वाली संपत्तियों के लिए नगर निगम नोटिस लेज़र।',
    issueNoticeBtn: 'नगर निगम नोटिस जारी करें',
    resolveViolationBtn: 'उल्लंघन समाप्त करें',

    // Datasets Page
    datasetManagerTitle: 'ड्रोन एवं LiDAR सर्वेक्षण डेटासेट प्रबंधक',
    datasetManagerDesc: 'Agisoft Metashape पॉइंट क्लाउड, फोटोग्रामेट्री मेश और जीसीपी संरेखण प्रबंधित करें।',
    ingestNewDataset: '+ नया सर्वेक्षण डेटासेट जोड़ें',
    uploadPointcloud: 'LAS / LAZ फ़ाइल अपलोड करें',

    // AI Processing Page
    aiProcessingTitle: 'स्वचालित 3D कैडस्ट्रल एआई पाइपलाइन',
    aiProcessingDesc: 'मंजिल निष्कर्षण, इकाई विभाजन और छत वर्गीकरण के लिए उन्नत न्यूरल नेटवर्क।',
    runPipelineBtn: 'एआई पाइपलाइन प्रारंभ करें',
    pipelineStatus: 'मॉडल: ULPIN-Net v3 (सक्रिय)',

    // Authority Analytics Page
    authorityTitle: 'नगर निगम प्राधिकरण एनालिटिक्स एवं कर मूल्यांकन',
    authorityDesc: 'वॉल्यूमेट्रिक संपत्ति कर गणना, वार्ड 12 स्थानिक घनत्व और अनुपालन सूचकांक।',
    taxValuationTotal: 'कुल अनुमानित संपत्ति कर',
    complianceIndex: 'स्थानिक अनुपालन सूचकांक',

    // LiDAR Viewer Page
    lidarViewerTitle: 'उच्च घनत्व 3D LiDAR पॉइंट क्लाउड व्यूअर',
    lidarViewerDesc: '14.8 करोड़ पॉइंट्स - ऊंचाई और तीव्रता द्वारा वर्गीकृत।',
    pointBudget: 'पॉइंट बजट',
    colorScheme: 'रंग योजना',

    // Settings Page
    settingsTitle: 'LIMITS सिस्टम सेटिंग्स एवं कॉन्फ़िगरेशन',
    settingsDesc: 'जीआईएस डेटम, स्थानिक प्रक्षेपण (EPSG:32645), थीम और भाषा वरीयताएँ कॉन्फ़िगर करें।',
    languagePreference: 'भाषा चयन',
    themePreference: 'थीम मोड'
  },
  or: {
    // Brand & Header
    systemName: 'LIMITS',
    systemSubtitle: 'ଭର୍ଟିକାଲ୍ GIS କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ ସିଷ୍ଟମ୍',
    smartCity: 'ଭୁବନେଶ୍ୱର ସ୍ମାର୍ଟ ସିଟି',
    signOut: 'ସାଇନ୍ ଆଉଟ୍',
    lightMode: 'ଲାଇଟ୍ ମୋଡ୍',
    darkMode: 'ଡାର୍କ ମୋଡ୍',
    cityStatus: 'ଭୁବନେଶ୍ୱର ସ୍ମାର୍ଟ ସିଟି • ସକ୍ରିୟ',
    activeTitle: 'ଭୁବନେଶ୍ୱର ୱାର୍ଡ 12 ଡିଜିଟାଲ୍ ଟ୍ୱିନ୍',
    systemActive: 'ସିଷ୍ଟମ୍ ସକ୍ରିୟ',
    addNewRegister: '+ ନୂଆ ରେଜିଷ୍ଟର ଯୋଡ଼ନ୍ତୁ',
    generate3DUlpin: '3D ULPIN ପ୍ରସ୍ତୁତ କରନ୍ତୁ',
    swaggerDocs: '⚡ ସ୍ୱାଗର୍ API (21 ଏଣ୍ଡପଏଣ୍ଟ)',
    postgresConnected: 'ଡାଟାବେସ୍: ପୋଷ୍ଟଗ୍ରେସ୍ (179 ULPINs)',

    // Navigation Links
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

    // Dashboard Page
    welcomeTitle: 'ଭର୍ଟିକାଲ୍ ପ୍ରପର୍ଟି ସ୍ଥାନିକ ଗୁଇନ୍ଦା ସୂଚନା',
    welcomeDesc: 'LIMITS ଭୁବନେଶ୍ୱର ୱାର୍ଡ 12 ଡିଜିଟାଲ୍ ଟ୍ୱିନ୍‌କୁ ସ୍ୱାଗତ। 3D ULPIN ପଞ୍ଜିକରଣ, LiDAR ସର୍ବେକ୍ଷଣ ଏବଂ ସ୍ୱୟଂଚାଳିତ AI ପ୍ରମାଣୀକରଣ।',
    openMap: '3D ମ୍ୟାପ୍ ଖୋଲନ୍ତୁ',
    totalUlpins: 'ମୋଟ 3D ULPINs',
    verifiedClean: 'ପ୍ରମାଣିତ ଓ ନିର୍ଭୁଲ',
    flaggedEncroachments: 'ଚିହ୍ନିତ ନିୟମ ଉଲ୍ଲଂଘନ',
    digitalTwinCoverage: 'ଡିଜିଟାଲ୍ ଟ୍ୱିନ୍ କଭରେଜ୍',
    quickNav: 'ଦ୍ରୁତ ନେଭିଗେସନ୍',
    cadastralFeed: 'କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ କାର୍ଯ୍ୟକଳାପ ଫିଡ୍',

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

    // Property Registry Page
    propertyRegistryTitle: '3D ସମ୍ପତ୍ତି ପଞ୍ଜିକରଣ',
    propertyRegistryDesc: 'ସମସ୍ତ 18-ଅଙ୍କିଆ ଭଲ୍ୟୁମେଟ୍ରିକ୍ 3D ULPIN ଏବଂ କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ ମାଲିକାନା ରେକର୍ଡର ମାଷ୍ଟର ରେପୋଜିଟୋରୀ।',
    officialCadastralLedger: 'ଅଫିସିଆଲ୍ କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ ଲେଜର • LIMITS',
    allTab: 'ସମସ୍ତ',
    registeredTab: 'ପଞ୍ଜିକୃତ',
    flaggedTab: 'ଚିହ୍ନିତ',
    pendingTab: 'ବିଚାରାଧୀନ',
    searchRegistryPlaceholder: 'ULPIN, ମାଲିକ କିମ୍ବା କୋଠା ନାମରେ ସନ୍ଧାନ କରନ୍ତୁ...',
    thUlpin: '3D ULPIN ପରିଚୟ',
    thOwner: 'ମାଲିକଙ୍କ ନାମ',
    thBuildingUnit: 'କୋଠା ଓ ୟୁନିଟ୍',
    thType: 'ସମ୍ପତ୍ତି ପ୍ରକାର',
    thArea: 'କ୍ଷେତ୍ରଫଳ (ବର୍ଗ ମି)',
    thStatus: 'ସ୍ଥିତି',
    thActions: 'କାର୍ଯ୍ୟ',
    registerNewPropertyModal: 'ନୂଆ ସମ୍ପତ୍ତି ପଞ୍ଜିକରଣ କରନ୍ତୁ',
    registerNewPropertyDesc: 'LIMITS 3D କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ ଲେଜରରେ ସମ୍ପତ୍ତି ରେକର୍ଡ ଯୋଡନ୍ତୁ',
    confirmSaveRegister: 'ନିଶ୍ଚିତ କରନ୍ତୁ ଓ ସାଇତନ୍ତୁ',
    cancelBtn: 'ବାତିଲ୍ କରନ୍ତୁ',

    // Database Page
    databaseExplorerTitle: 'ପୋଷ୍ଟଗ୍ରେସକ୍ୟୁଏଲ୍ 3D ଡାଟାବେସ୍ ଏକ୍ସପ୍ଲୋରର୍',
    databaseConnected: 'ସଫଳତାର ସହ ସଂଯୁକ୍ତ',
    refreshBtn: 'ରିଫ୍ରେସ୍ କରନ୍ତୁ',
    selectDatabaseTable: 'ଡାଟାବେସ୍ ଟେବୁଲ୍ ଚୟନ କରନ୍ତୁ',
    liveTableRecords: 'ଲାଇଭ୍ ଟେବୁଲ୍ ରେକର୍ଡ',
    searchRecordsPlaceholder: 'ଲାଇଭ୍ ଡାଟାବେସ୍ ରେକର୍ଡ ଖୋଜନ୍ତୁ...',
    totalRecordsCount: 'ପୋଷ୍ଟଗ୍ରେସ୍ ମୋଟ ରେକର୍ଡ',

    // 3D Map Page
    mapGlobeTitle: 'ଭୁବନେଶ୍ୱର ସ୍ମାର୍ଟ ସିଟି 3D କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ ମ୍ୟାପ୍',
    mapGlobeDesc: 'ଭଲ୍ୟୁମେଟ୍ରିକ୍ ପାର୍ସଲ୍, ମହଲା ସ୍ତରୀୟ ସ୍ଥାନିକ ସୂଚନା ଓ LiDAR ଓଭରଲେ।',
    orbit3DMode: '3D ଦୃଶ୍ୟ',
    top2DMode: 'ଉପର 2D ଦୃଶ୍ୟ',
    lidarMode: 'LiDAR ପଏଣ୍ଟ କ୍ଲାଉଡ୍',
    resetCamera: 'କ୍ୟାମେରା ରିସେଟ୍',
    zoomInBtn: 'ଜୁମ୍ ଇନ୍',
    zoomOutBtn: 'ଜୁମ୍ ଆଉଟ୍',
    buildingInspector: 'ସ୍ଥାନିକ ୟୁନିଟ୍ ନିରୀକ୍ଷକ',
    floorSelector: 'ମହଲା ସ୍ତର',
    unitSelector: 'ୟୁନିଟ୍ / ଫ୍ଲାଟ୍',
    viewDeedCert: '3D ମାଲିକାନା ଦଲିଲ୍ ଦେଖନ୍ତୁ',
    locate3DUnit: 'ୟୁନିଟ୍ ଚିହ୍ନଟ କରନ୍ତୁ',

    // Vertical Explorer Page
    verticalExplorerTitle: '3D ଭର୍ଟିକାଲ୍ କୋଠା ୟୁନିଟ୍ ଏକ୍ସପ୍ଲୋରର୍',
    verticalExplorerDesc: 'ମହଲା ଭଙ୍ଗା 3D ଷ୍ଟାକ୍, ୟୁନିଟ୍ ମାଲିକାନା ଏବଂ ସ୍ଥାନିକ ନିୟମ ଯାଞ୍ଚ।',
    explodeViewBtn: 'ମହଲା ଅଲଗା କରନ୍ତୁ (Explode)',
    collapseViewBtn: 'ମହଲା ଯୋଡ଼ନ୍ତୁ (Collapse)',
    rotateBtn: 'ଅଟୋ-ଘୁରାନ୍ତୁ',
    unitsOnFloor: 'ଏହି ମହଲାରେ ଥିବା ୟୁନିଟ୍',
    unitDetails: 'ୟୁନିଟ୍ ନିର୍ଦ୍ଦିଷ୍ଟକରଣ',
    elevationHeight: 'ଉଚ୍ଚତା (Elevation)',

    // Spatial Validation Page
    spatialValidationTitle: 'ସ୍ୱୟଂଚାଳିତ AI ସ୍ଥାନିକ ପ୍ରମାଣୀକରଣ',
    spatialValidationDesc: 'ଅନୁମୋଦିତ ନକ୍ସା ଏବଂ ନିର୍ମିତ LiDAR ମଧ୍ୟରେ ବାସ୍ତବ ସମୟ ଭଲ୍ୟୁମେଟ୍ରିକ୍ ଯାଞ୍ଚ।',
    sanctionedVsAsBuilt: 'ଅନୁମୋଦିତ ବନାମ ନିର୍ମିତ 3D ଆୟତନ',
    toleranceVerified: 'ସଠିକତା ପ୍ରମାଣିତ (±15mm)',
    violationDetected: 'ଅନୁମୋଦିତ ଉଚ୍ଚତା ଠାରୁ ଅଧିକ ନିର୍ମାଣ',
    revalidateAll: 'AI ସ୍ଥାନିକ ପ୍ରମାଣୀକରଣ ଚଲାନ୍ତୁ',

    // Change Detection Page
    changeDetectionTitle: 'AI ବହୁ-ସମୟ ପରିବର୍ତ୍ତନ ଚିହ୍ନଟ',
    changeDetectionDesc: 'ଅନଧିକୃତ ନିର୍ମାଣ ଚିହ୍ନଟ ପାଇଁ ଉପଗ୍ରହ ଏବଂ ଡ୍ରୋନ୍ ସର୍ବେକ୍ଷଣର ତୁଳନା।',
    temporalTimeline: 'ସର୍ବେକ୍ଷଣ ସମୟ-ରେଖା ତୁଳନା',
    encroachmentDetected: 'ଅତିକ୍ରମଣ ଚିହ୍ନିତ',
    baselineSurvey: 'ମୂଳ 2024 ସର୍ବେକ୍ଷଣ',
    currentSurvey: 'ନୂତନ 2026 ସର୍ବେକ୍ଷଣ',

    // Flagged Properties Page
    flaggedPropertiesTitle: 'ଚିହ୍ନିତ ନିୟମ ଉଲ୍ଲଂଘନ ଓ ଅତିକ୍ରମଣ',
    flaggedPropertiesDesc: 'ଉଚ୍ଚତା ବା ସୀମା ନିୟମ ଉଲ୍ଲଂଘନକାରୀ ସମ୍ପତ୍ତି ପାଇଁ ପୌର ନୋଟିସ୍ ରେଜିଷ୍ଟର।',
    issueNoticeBtn: 'ପୌର ନୋଟିସ୍ ଜାରି କରନ୍ତୁ',
    resolveViolationBtn: 'ଉଲ୍ଲଂଘନ ସମାପ୍ତ କରନ୍ତୁ',

    // Datasets Page
    datasetManagerTitle: 'ଡ୍ରୋନ୍ ଏବଂ LiDAR ସର୍ବେକ୍ଷଣ ଡାଟାସେଟ୍ ପରିଚାଳକ',
    datasetManagerDesc: 'Agisoft Metashape ପଏଣ୍ଟ କ୍ଲାଉଡ୍ ଏବଂ ଜିସିପି ସଂଯୋଜନା ପରିଚାଳନା କରନ୍ତୁ।',
    ingestNewDataset: '+ ନୂଆ ସର୍ବେକ୍ଷଣ ଡାଟାସେଟ୍ ଯୋଡ଼ନ୍ତୁ',
    uploadPointcloud: 'LAS / LAZ ଫାଇଲ୍ ଅପଲୋଡ୍ କରନ୍ତୁ',

    // AI Processing Page
    aiProcessingTitle: 'ସ୍ୱୟଂଚାଳିତ 3D କ୍ୟାଡାଷ୍ଟ୍ରାଲ୍ AI ପାଇପଲାଇନ୍',
    aiProcessingDesc: 'ମହଲା ପୃଥକୀକରଣ ଏବଂ ୟୁନିଟ୍ ବିଭାଜନ ପାଇଁ ଉନ୍ନତ ନ୍ୟୁରାଲ୍ ନେଟୱାର୍କ।',
    runPipelineBtn: 'AI ପାଇପଲାଇନ୍ ଆରମ୍ଭ କରନ୍ତୁ',
    pipelineStatus: 'ମଡେଲ୍: ULPIN-Net v3 (ସକ୍ରିୟ)',

    // Authority Analytics Page
    authorityTitle: 'ପୌର କର୍ତ୍ତୃପକ୍ଷ ବିଶ୍ଳେଷଣ ଏବଂ ଟିକସ ମୂଲ୍ୟାଙ୍କନ',
    authorityDesc: 'ଭଲ୍ୟୁମେଟ୍ରିକ୍ ସମ୍ପତ୍ତି ଟିକସ ଗଣନା, ୱାର୍ଡ 12 ସ୍ଥାନିକ ସାନ୍ଦ୍ରତା ଏବଂ ନିୟମ ପାଳନ ସୂଚକାଙ୍କ।',
    taxValuationTotal: 'ମୋଟ ଆକଳିତ ପୌର ଟିକସ',
    complianceIndex: 'ସ୍ଥାନିକ ନିୟମ ପାଳନ ସୂଚକାଙ୍କ',

    // LiDAR Viewer Page
    lidarViewerTitle: 'ଉଚ୍ଚ ସାନ୍ଦ୍ରତା 3D LiDAR ପଏଣ୍ଟ କ୍ଲାଉଡ୍ ଭିଉଅର୍',
    lidarViewerDesc: '14.8 କୋଟି ପଏଣ୍ଟସ୍ - ଉଚ୍ଚତା ଏବଂ ତୀବ୍ରତା ଦ୍ୱାରା ଶ୍ରେଣୀଭୁକ୍ତ।',
    pointBudget: 'ପଏଣ୍ଟ ବଜେଟ୍',
    colorScheme: 'ରଙ୍ଗ ଯୋଜନା',

    // Settings Page
    settingsTitle: 'LIMITS ସିଷ୍ଟମ୍ ସେଟିଙ୍ଗ୍ସ ଓ ବିନ୍ୟାସ',
    settingsDesc: 'GIS ଡାଟମ୍, ସ୍ଥାନିକ ପ୍ରକ୍ଷେପଣ (EPSG:32645), ଥିମ୍ ଏବଂ ଭାଷା ପସନ୍ଦ ବିନ୍ୟାସ କରନ୍ତୁ।',
    languagePreference: 'ଭାଷା ପସନ୍ଦ',
    themePreference: 'ଥିମ୍ ମୋଡ୍'
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
  t: (key: string, fallback?: string) => {
    const lang = get().language;
    // Direct key lookup
    if (TRANSLATIONS[lang]?.[key]) {
      return TRANSLATIONS[lang][key];
    }
    // Check if key is an English string in the 'en' translation table, find its key
    if (lang !== 'en') {
      const enEntries = Object.entries(TRANSLATIONS['en']);
      const match = enEntries.find(([_, enVal]) => enVal.toLowerCase() === key.toLowerCase());
      if (match && TRANSLATIONS[lang]?.[match[0]]) {
        return TRANSLATIONS[lang][match[0]];
      }
    }
    return fallback || TRANSLATIONS['en']?.[key] || key;
  }
}));
