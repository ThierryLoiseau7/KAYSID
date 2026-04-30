export interface CommunePlace {
  name: string;
  description: string;
  type: "plaj" | "mòn" | "patrimwan" | "restoran" | "mache" | "natirèl";
}

export interface CommuneOfficial {
  name: string;
  title: string;
  period: string;
  party?: string;
}

export interface CommuneData {
  slug: string;
  name: string;
  department: string;
  population: string;
  superficie: string;
  altitude: string;
  coordinates: { lat: number; lng: number };
  coverImage: string;
  tagline: string;

  history: string[];
  economy: string[];

  currentMayor: CommuneOfficial;
  formerMayors: CommuneOfficial[];
  currentDeputy: CommuneOfficial;
  formerDeputies: CommuneOfficial[];
  senator?: CommuneOfficial;

  places: CommunePlace[];
  festivals: string[];
  gastronomy: string[];
  facts: string[];
}

export const COMMUNES_DATA: Record<string, CommuneData> = {
  okay: {
    slug: "okay",
    name: "Okay (Les Cayes)",
    department: "Sud",
    population: "~135 000",
    superficie: "193 km²",
    altitude: "18 m",
    coordinates: { lat: 18.194, lng: -73.749 },
    coverImage: "https://images.unsplash.com/photo-1518684079-3c830dcef090?w=1200&q=80",
    tagline: "Kapital Sid Ayiti — Pòt Lanmè Karayib",

    history: [
      "Okay (Les Cayes) se kapital depatman Sid la. Li te fonde nan 1726 pa Fransè yo kòm yon pò komèsyal enpòtan nan peryòd kolonyal la.",
      "Pandan revolisyon ayisyen an, Okay te jwe yon wòl santral. Se nan zòn sa a ke Aleksann Pétion te òganize rezistans li kont Dessalines avan yo te fè lapè.",
      "Apre endepandans 1804, Okay te vin youn nan premye vil ki te genyen yon lekòl, yon lopital, ak yon tribinal. Li te toujou konsidere kòm yon sant kiltirèl ak ekonomik enpòtan.",
      "An 2021, tranbleman tè 7.2 ki te frape depatman Sid la te koze anpil destriksyon nan Okay ak zòn vwazinen yo. Efò rekonstriksyon toujou ap kontinye jodi a.",
    ],

    economy: [
      "Pò Okay se pi gwo pò nan Sid Ayiti — li sipòte eksportasyon mango, kafe, kakao ak pwason.",
      "Agrikilti se pilye ekonomi a: mango fransik, cacao Grand Cru, ak chadèk nan zòn Tiburon.",
      "Touris ap grandi: plaj Gelée, Île à Vache, ak Aquin atire touris lokal ak entènasyonal.",
      "Sektè edikasyon an solid ak plizyè inivèsite prive ak yon inivèsite leta (UEH).",
    ],

    currentMayor: {
      name: "Darius Duvalier Chery",
      title: "Majistra Okay",
      period: "2023 – jodi a",
      party: "Independan",
    },
    formerMayors: [
      { name: "Jean Gabriel Fortuné", title: "Majistra", period: "2016 – 2020" },
      { name: "Gilles Patrick Bélizaire", title: "Majistra", period: "2011 – 2016" },
      { name: "Jean Renol Elié", title: "Majistra", period: "2006 – 2011" },
    ],
    currentDeputy: {
      name: "Cholzer Chancy",
      title: "Depite Okay",
      period: "2016 – 2020",
    },
    formerDeputies: [
      { name: "Fritz Gérald Bourjolly", title: "Depite", period: "2011 – 2016" },
      { name: "Bélizaire Printemps", title: "Depite", period: "2006 – 2011" },
      { name: "Jean-Yves Denis", title: "Depite", period: "2000 – 2006" },
    ],
    senator: {
      name: "Patrice Dumont",
      title: "Senatè Sid",
      period: "2016 – 2022",
    },

    places: [
      {
        name: "Plaj Gelée",
        description: "Pi bèl plaj Okay — sab blan, dlo kalm, kote pou naje ak repoze. Anpil resto ak bar sou plaj la.",
        type: "plaj",
      },
      {
        name: "Île à Vache",
        description: "Zile paradi 15 minit an bato depi Okay. Plaj izole, korif, ak nati pwòp. Touris entènasyonal renmen li anpil.",
        type: "plaj",
      },
      {
        name: "Mache Okay",
        description: "Gran mache santral vil la — pwodui fre, atizana, manje kwit. Leve granmaten pou wè pi bon aktivite.",
        type: "mache",
      },
      {
        name: "Cathédrale Notre-Dame des Cayes",
        description: "Katedràl istorik ki date depi 18yèm syèk la. Achitekti kolonyal fransèz ki toujou kanpe malgre tranbleman tè yo.",
        type: "patrimwan",
      },
      {
        name: "Pòt Okay",
        description: "Gwo pò komèsyal kote bato kago ak pasaje antre. Kote pou wè aktivite ekonomik Sid la.",
        type: "patrimwan",
      },
      {
        name: "Rivyè Glase",
        description: "Katye tradisyonèl Okay ak bon manje lokal ak atmosfè otantik vil la.",
        type: "restoran",
      },
    ],

    festivals: [
      "Kanaval Okay — fevriye (youn nan pi bèl kanaval pwovens Ayiti)",
      "Fèt Okay — jiyè (selebrasyon fondatè vil la)",
      "Festival Gastronomi Sid — oktòb",
      "Rara — nan Semèn Sen",
    ],

    gastronomy: [
      "Griot Okay — kochon fri ak bannann peze, espesyalite rejyon an",
      "Bouyon bèf ak legim lokal",
      "Pwason gri ak diri djondjon (riz nwa)",
      "Kafe Sid — youn nan pi bon kafe Ayiti",
      "Chadèk konfite ak siwo kann fre",
    ],

    facts: [
      "Okay se youn nan 3 gran vil Ayiti (apre Pòtoprens ak Gonayiv)",
      "Vòl dirèk depi Miami ak New York disponib nan aewopò Okay (IATA: CYA)",
      "Mango Fransik Okay se pi bon eksportasyon ayisyen an — li al nan USA, Kanada, Ewòp",
      "Temperature mwayen: 27°C — fre nan swaré gras ak briz lanmè",
      "Okay gen pi gwo pwodiksyon chadèk Karayib la",
    ],
  },

  jakmel: {
    slug: "jakmel",
    name: "Jakmèl",
    department: "Sud-Est",
    population: "~137 000",
    superficie: "783 km²",
    altitude: "13 m",
    coordinates: { lat: 18.234, lng: -72.534 },
    coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    tagline: "Kapital Kiltirèl Ayiti — Vil Atizana ak Kanaval",

    history: [
      "Jakmèl se youn nan pi ansyen vil Ayiti, fonde nan 1698. Non li soti nan mo tawino 'Yaquimel' ki vle di 'Rivyè ki chante'.",
      "Nan 18yèm syèk la, Jakmèl te pi gwo pò ekspòtasyon kafe nan Karayib la. Ri yo ki fèt ak wòch koraj (cobblestone) toujou la jodi a — eritaj peryòd kolonyal la.",
      "An 1779, Simón Bolívar te pase Jakmèl pou resevwa èd pou goumen pou liberasyon Venezyela. Ayisyen yo te ba li bato, zam, ak sòlda — yon moman istorik pou tout Amerik.",
      "Jakmèl se bèso atizana ayisyen an. Papye maché, penti sou fè, maskara kanaval — zèv atizanla Jakmèl la konn tounen nan tout Amerik ak Ewòp.",
    ],

    economy: [
      "Touris se prensipal sous revni: plaj Cyvadier, Raymond-les-Bains, Ti Mouillage atire touris entènasyonal.",
      "Atizana — papye maché, maskara, penti sou vè — eksporte nan plizyè peyi.",
      "Kafe montay Jakmèl se yon kafe boutik ki vendu nan Ewòp ak Nò Amerik.",
      "Festival fim entènasyonal (FICJ) pote vizitè ak envèstisman chak ane.",
    ],

    currentMayor: {
      name: "Gérald Duclermeil",
      title: "Majistra Jakmèl",
      period: "2023 – jodi a",
    },
    formerMayors: [
      { name: "Edo Zenny", title: "Majistra", period: "2016 – 2022" },
      { name: "Maxi Beauvoir", title: "Majistra", period: "2011 – 2016" },
      { name: "Joseph Eudès", title: "Majistra", period: "2006 – 2011" },
    ],
    currentDeputy: {
      name: "Prophète Délice",
      title: "Depite Jakmèl",
      period: "2016 – 2020",
    },
    formerDeputies: [
      { name: "Jean Wilner Morin", title: "Depite", period: "2011 – 2016" },
      { name: "Paul Denis", title: "Depite / Minis Jistis", period: "2006 – 2011" },
    ],

    places: [
      {
        name: "Plaj Cyvadier",
        description: "Plaj sekrè Jakmèl — yon ti anse izole ak dlo ble kristal. Aksè sèlman pa bato oswa yon mach 20 minit. Pwòp, trankil, paradi.",
        type: "plaj",
      },
      {
        name: "Raymond-les-Bains",
        description: "Plaj popilè 10 minit depi sant vil la. Gwo palmye, bèl adrès, bon resto fwi lanmè.",
        type: "plaj",
      },
      {
        name: "Ri Istorik Jakmèl",
        description: "Ri wòch koraj (cobblestone) kolonyal — batiman 18yèm syèk, boutik atizana, galri penti. UNESCO Heritage site.",
        type: "patrimwan",
      },
      {
        name: "Cascade Bassin Bleu",
        description: "3 bassin natirèl ble-vèt nan mòn 45 minit depi Jakmèl. Naje anba kaskad — youn nan pi bèl eksperyans Ayiti.",
        type: "natirèl",
      },
      {
        name: "Mache Atizana Jakmèl",
        description: "Papye maché, maskara kanaval, penti sou fè, bijou fèt men. Achte dirèk nan artizanla yo.",
        type: "mache",
      },
      {
        name: "Moulin sou Mer",
        description: "Rezo otèl istorik ak mize sou bò lanmè. Wòch koraj, jardin tropikal, restaurant gastronomik.",
        type: "restoran",
      },
    ],

    festivals: [
      "Kanaval Jakmèl — fevriye (pi kreatif Ayiti — maskara papye maché)",
      "Festival Entènasyonal Film Jakmèl (FICJ) — avril",
      "Festival Tanbou Jakmèl — out",
      "Fèt Jakmèl — oktòb",
    ],

    gastronomy: [
      "Langouste gri ak bè ak citron — espesyalite bò lanmè",
      "Akra (fritay marengwen) ak pikliz",
      "Kola Lacaye — bwason tradisyonèl Jakmèl ki fèt depi 1887",
      "Dous makòs (papita ak kokoye)",
      "Kafe montay Jakmèl — grand cru ayisyen",
    ],

    facts: [
      "Jakmèl se sèl vil Ayiti ki gen ri wòch koraj kolonyal ki pwoteje kòm patrimwan",
      "Simón Bolívar te pase Jakmèl an 1815 — il gen yon mòn pote non li",
      "Kanaval Jakmèl pi vye ke Kanaval Nòv Òlean — li kòmanse nan 1700s",
      "Papye maché Jakmèl eksporte nan plis pase 40 peyi",
      "Temperature mwayen: 26°C — fre gras ak briz mòn",
    ],
  },

  "port-salut": {
    slug: "port-salut",
    name: "Port-Salut",
    department: "Sud",
    population: "~65 000",
    superficie: "260 km²",
    altitude: "5 m",
    coordinates: { lat: 18.096, lng: -73.920 },
    coverImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80",
    tagline: "Paradi Plaj Sid Ayiti — Dlo Ble, Sab Blan",

    history: [
      "Port-Salut se yon komin nan depatman Sid la, 40 km lwès Okay. Non li vle di 'Pòt Sali' — yon refleksyon sou bote natirèl ak trankilite li.",
      "Abitan tawino yo te premye rete bò rivyè yo ki tonbe nan lanmè a. Fransè yo te vin enstale pandan 17yèm syèk la pou ekstraksyon bwa ak kiltivasyon kann.",
      "Port-Salut te toujou yon vil peche ak agrikilti. Jodi a, touris an bò lanmè vin pi enpòtan ke agrikilti.",
      "Depi ane 2000 yo, Port-Salut vin youn nan destinasyon touristik pi popilè Ayiti gras ak plaj li ki konsidere kòm pi bèl nan peyi a.",
    ],

    economy: [
      "Touris bò lanmè — otèl, guesthouses, resto plaj — se prensipal ekonomi.",
      "Peche tradisyonèl toujou aktif — pwason fre vann Okay ak Pòtoprens.",
      "Agrikilti: bannann, plantèn, kokoye, bred lokal.",
      "Diaspora k ap envesti nan pwopriyete vakans pou lwaye.",
    ],

    currentMayor: {
      name: "Maxon Étienne",
      title: "Majistra Port-Salut",
      period: "2022 – jodi a",
    },
    formerMayors: [
      { name: "Ronel Brédy", title: "Majistra", period: "2016 – 2021" },
      { name: "Gilles Renaud", title: "Majistra", period: "2011 – 2016" },
    ],
    currentDeputy: {
      name: "Évens Emmanuel",
      title: "Depite Arrondissement Aquin",
      period: "2016 – 2020",
    },
    formerDeputies: [
      { name: "Wilbert Siméon", title: "Depite", period: "2011 – 2016" },
      { name: "Rony Timothée", title: "Depite", period: "2006 – 2011" },
    ],

    places: [
      {
        name: "Plaj Sant Vil Port-Salut",
        description: "Pi ikonik plaj Ayiti — 5 km sab blan fin, dlo ble transparan, palmye bò lanmè. Pa gen bagay parèy.",
        type: "plaj",
      },
      {
        name: "Plaj Ti Mouillage",
        description: "Yon plaj pi kalm ak pi sekrè, pèfè pou fanmi. Dlo cho, pa gen vag, dlo pwòp.",
        type: "plaj",
      },
      {
        name: "Grotte Marie-Jeanne",
        description: "Pi gwo grot Karayib la — 10 km galri anba tè ak stalaktit, stalagmit ak rivyè anba tè. 45 minit depi Port-Salut.",
        type: "natirèl",
      },
      {
        name: "Cascade Saut Mathurine",
        description: "Pi gwo kaskad Ayiti — 20m wo. Pisin natirèl anba a, dlo fre, bèl peyizaj vèt. 30 minit nan mòn.",
        type: "natirèl",
      },
      {
        name: "Resto Bò Lanmè",
        description: "Yon seri resto sou plaj la ki sèvi pwason gri, langouste, ak fwi lanmè fre chak jou.",
        type: "restoran",
      },
    ],

    festivals: [
      "Fèt Port-Salut — out (fèt tradisyonèl peche)",
      "Festival Touristik Sid — desanm",
      "Rara bò lanmè — Semèn Sen",
    ],

    gastronomy: [
      "Pwason gri ak bannann boyi — manje endijèn ki pa ka jwenn lòt kote",
      "Langouste fre gri oswa nan sòs kreyòl",
      "Sos pwa wouj ak diri blan ak crab",
      "Kokoye fre dirèk sou pye palmye a",
      "Diri djondjon ak pwason nan zantray lanmè",
    ],

    facts: [
      "Plaj Port-Salut konsidere kòm #1 plaj Ayiti pa tout gid touristik",
      "Dlo lanmè Port-Salut gen vis ibilite 25m — pèfè pou plonjon",
      "Grotte Marie-Jeanne pi gwo nan tout Karayib la",
      "Yon vil 2-3 è depi Pòtoprens — wout bitimen tou nèf",
      "Temperature lanmè: 27-29°C tout ane",
    ],
  },

  jeremi: {
    slug: "jeremi",
    name: "Jeremi",
    department: "Grand'Anse",
    population: "~173 000",
    superficie: "1 285 km²",
    altitude: "28 m",
    coordinates: { lat: 18.650, lng: -74.117 },
    coverImage: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
    tagline: "Vil Powèt — Kapital Gran Anz ak Kilti Ayisyen",

    history: [
      "Jeremi, kapital depatman Grand'Anse, se youn nan pi ansyen vil Ayiti. Li te fonde pa Fransè yo nan 1756 kòm sant administratif pou zòn lwès Sid la.",
      "Jeremi pote non 'Vil Powèt' paske li bay nesans nan anpil gwo ekrivèn ak entèlèktiyèl ayisyen: Emile Roumer, Etzer Vilaire, Georges Sylvain, ak anpil lòt.",
      "Pandan peryòd Duvalier a, Jeremi te sibi yon masak kont fanmi milat yo an 1964 (Vespers of Jérémie). Evènman tristis sa a make istwa vil la enpòtamanman.",
      "Ouragan Matthew 2016 te koze gwo dega nan Jeremi ak tout Gran Anz. Rekonstriksyon te difisil men vil la rete rezistan.",
    ],

    economy: [
      "Kafe Gran Anz — youn nan pi bon kafe boutik Ayiti, eksporte nan Ewòp.",
      "Cacao — Jeremi nan mitan zòn ki pwodui pi bon kakao Ayiti.",
      "Peche artizanal ak agrikilti sibsistans.",
      "Diaspora ap envesti nan pwopriyete ak ti biznis.",
    ],

    currentMayor: {
      name: "Francky Donatien",
      title: "Majistra Jeremi",
      period: "2022 – jodi a",
    },
    formerMayors: [
      { name: "Willer Thélusma", title: "Majistra", period: "2016 – 2021" },
      { name: "Wilbert Joseph", title: "Majistra", period: "2011 – 2016" },
      { name: "Darius Jean-Charles", title: "Majistra", period: "2006 – 2011" },
    ],
    currentDeputy: {
      name: "Joseph Alindor",
      title: "Depite Jeremi",
      period: "2016 – 2020",
    },
    formerDeputies: [
      { name: "Levaillant Louis-Jeune", title: "Depite / Minis", period: "2011 – 2016" },
      { name: "Arnel Bélizaire", title: "Depite", period: "2006 – 2011" },
      { name: "Rony Timothée", title: "Depite", period: "2000 – 2006" },
    ],
    senator: {
      name: "Dieudonne Luma Étienne",
      title: "Senatè Grand'Anse",
      period: "2016 – 2022",
    },

    places: [
      {
        name: "Plaj Nan Sab",
        description: "Bèl plaj bò vil la — sab fin, palmye, dlo cho. Pèfè pou naje ak repoze. Otèl ak resto bò lanmè.",
        type: "plaj",
      },
      {
        name: "Mòn Powèt",
        description: "Wotè ki domine vil la — wè tout Jeremi ak Golfe La Gonave. Kote pou meditasyon ak foto.",
        type: "mòn",
      },
      {
        name: "Cathédrale Saint-Louis",
        description: "Katedràl istorik 18yèm syèk la — achitekti kolonyal ki pèdi nan ouragan men rebati. Kè kiltirèl vil la.",
        type: "patrimwan",
      },
      {
        name: "Plas Repiblik Jeremi",
        description: "Plas santral vil la — estatì, jaden, kote moun rasanble. Bèl pou mache swaré.",
        type: "patrimwan",
      },
      {
        name: "Plaj Abrikò",
        description: "30 minit depi Jeremi — plaj izole ak bèl koray anba dlo. Peche krab ak langouste lokal.",
        type: "plaj",
      },
      {
        name: "Mache Jeremi",
        description: "Gran mache tradisyonèl — kakao, kafe, epis lokal, fwi. Melanje koulè ak odè nan kè vil la.",
        type: "mache",
      },
    ],

    festivals: [
      "Fèt Sen Lwi — out 25 (fèt patwon vil la)",
      "Festival Powezi Jeremi — fevriye",
      "Kanaval Gran Anz — fevriye",
      "Fèt Dantan (patrimonyal) — novanm",
    ],

    gastronomy: [
      "Soup joumou — fèt dimanche maten nan tout kay Jeremi",
      "Kafe boutik Gran Anz — sèvi fre nan ti kafe tradisyonèl",
      "Crab ak riz djondjon — espesyalite bò lanmè",
      "Chocolat natal (tablèt kakao) — fèt men depi kakao lokal",
      "Bannann peze ak griot kabrit — manje peyi otantik",
    ],

    facts: [
      "Jeremi se 'Vil Powèt' — li bay pi plis pwofesè ak ekrivèn pase nenpòt lòt vil Ayiti",
      "Aewopò Jeremi (IATA: JEE) gen vòl dirèk depi Pòtoprens chak jou",
      "Gran Anz gen pi gwo pwodiksyon kakao Ayiti — eksporte tankou 'fine chocolate'",
      "Jeremi se 4yèm pi gwo vil Ayiti pa popilasyon nan Gran Anz la",
      "Temperature mwayen: 26°C — fre gras ak briz lanmè ak mòn",
    ],
  },
};

export function getCommuneBySlug(slug: string): CommuneData | null {
  return COMMUNES_DATA[slug.toLowerCase()] ?? null;
}

export const COMMUNE_SLUGS = Object.keys(COMMUNES_DATA);
