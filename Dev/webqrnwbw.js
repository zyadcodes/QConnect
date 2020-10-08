var surah_ayahs,
  surah_name_arabic,
  surah_name_transliteration,
  surah_name_translation,
  current_arabic_word_type,
  current_arabic_data,
  current_word_translation,
  current_word_translation_data,
  current_reciter,
  current_word_type,
  word_arabic,
  word_transliteration,
  word_translation,
  normal_display_mode_disabled,
  dark_theme_disabled,
  offline_mode,
  current_playing_ayah,
  play_ayah_button_choice,
  ayah_audio_url,
  auto_scroll,
  play_button_surah,
  play_button_ayah,
  starting_ayah,
  surah_json_data,
  current_word_timestamp,
  current_word_timestamp_data,
  current_ayah_translation,
  current_ayah_translation_data,
  total_ayahs_on_screen,
  first_ayah_on_screen_number,
  last_ayah_on_screen_number,
  first_ayah_on_screen,
  auto_play_number,
  current_page,
  message_from_api,
  tajweed_mode,
  ios_version,
  duas_timestamp_mishary,
  duas_timestamp_husary,
  duas_timestamp_rifai,
  duas_timestamp_basit_mujawwad,
  duas_timestamp_basit_murattal,
  ayah_translation_direction,
  json_version = 21,
  changelog_popup_version = "2.8",
  continue_reading_button =
    "<div class='col-12 surah-nav-margin'><div class='col-12 text-center'><button class='btn btn-sm btn-gold continue-reading-btn'>Continue Reading</button></div></div>",
  continue_reading_button_showing = !1,
  hash_of_two_parts = !1,
  audio_url_english = "https://english-ayah.audios.quranwbw.com/",
  audio_url_words = "https://words.audios.quranwbw.com/",
  audio = $("#player")[0],
  surah_audio = $("#surah-player")[0],
  is_audio_playing = !1,
  is_surah_audio_paused = !0,
  has_surah_audio_been_started = !1,
  playing_which_audio = "none",
  site_tagline =
    "Word By Word Translation And Transliteration In English, Urdu, Hindi, Indonesian, Bangla, Turkish, German, Russian and Ingush",
  website_version = changelog_popup_version,
  current_playback_speed = 3,
  is_user_online = !0,
  checked_user_connection = !1,
  color_coded_tajweed_enabled = !1,
  mushaf_mode_enabled = !1,
  surah_names_transliteration = [
    "",
    "Al Faatiha",
    "Al Baqara",
    "Aal i Imraan",
    "An Nisaa",
    "Al Maaida",
    "Al An'aam",
    "Al A'raaf",
    "Al Anfaal",
    "At Tawba",
    "Yunus",
    "Hud",
    "Yusuf",
    "Ar Ra'd",
    "Ibrahim",
    "Al Hijr",
    "An Nahl",
    "Al Israa",
    "Al Kahf",
    "Maryam",
    "Taa Haa",
    "Al Anbiyaa",
    "Al Hajj",
    "Al Muminoon",
    "An Noor",
    "Al Furqaan",
    "Ash Shu'araa",
    "An Naml",
    "Al Qasas",
    "Al Ankaboot",
    "Ar Room",
    "Luqman",
    "As Sajda",
    "Al Ahzaab",
    "Saba",
    "Faatir",
    "Yaseen",
    "As Saaffaat",
    "Saad",
    "Az Zumar",
    "Al Ghaafir",
    "Fussilat",
    "Ash Shura",
    "Az Zukhruf",
    "Ad Dukhaan",
    "Al Jaathiya",
    "Al Ahqaf",
    "Muhammad",
    "Al Fath",
    "Al Hujuraat",
    "Qaaf",
    "Adh Dhaariyat",
    "At Tur",
    "An Najm",
    "Al Qamar",
    "Ar Rahmaan",
    "Al Waaqia",
    "Al Hadid",
    "Al Mujaadila",
    "Al Hashr",
    "Al Mumtahana",
    "As Saff",
    "Al Jumu'a",
    "Al Munaafiqoon",
    "At Taghaabun",
    "At Talaaq",
    "At Tahrim",
    "Al Mulk",
    "Al Qalam",
    "Al Haaqqa",
    "Al Ma'aarij",
    "Nooh",
    "Al Jinn",
    "Al Muzzammil",
    "Al Muddaththir",
    "Al Qiyaama",
    "Al Insaan",
    "Al Mursalaat",
    "An Naba",
    "An Naazi'aat",
    "Abasa",
    "At Takwir",
    "Al Infitaar",
    "Al Mutaffifin",
    "Al Inshiqaaq",
    "Al Burooj",
    "At Taariq",
    "Al A'laa",
    "Al Ghaashiya",
    "Al Fajr",
    "Al Balad",
    "Ash Shams",
    "Al Lail",
    "Ad Dhuhaa",
    "Ash Sharh",
    "At Tin",
    "Al Alaq",
    "Al Qadr",
    "Al Bayyina",
    "Az Zalzala",
    "Al Aadiyaat",
    "Al Qaari'a",
    "At Takaathur",
    "Al Asr",
    "Al Humaza",
    "Al Fil",
    "Quraish",
    "Al Maa'un",
    "Al Kawthar",
    "Al Kaafiroon",
    "An Nasr",
    "Al Masad",
    "Al Ikhlaas",
    "Al Falaq",
    "An Naas",
  ],
  surah_names_translation = [
    "",
    "The Opening",
    "The Cow",
    "The Family of Imraan",
    "The Women",
    "The Table",
    "The Cattle",
    "The Heights",
    "The Spoils of War",
    "The Repentance",
    "Jonas",
    "Hud",
    "Joseph",
    "The Thunder",
    "Abraham",
    "The Rock",
    "The Bee",
    "The Night Journey",
    "The Cave",
    "Mary",
    "Taa-Haa",
    "The Prophets",
    "The Pilgrimage",
    "The Believers",
    "The Light",
    "The Criterion",
    "The Poets",
    "The Ant",
    "The Stories",
    "The Spider",
    "The Romans",
    "Luqman",
    "The Prostration",
    "The Clans",
    "Sheba",
    "The Originator",
    "Yaseen",
    "Those drawn up in Ranks",
    "The letter Saad",
    "The Groups",
    "The Forgiver",
    "Explained in detail",
    "Consultation",
    "Ornaments of gold",
    "The Smoke",
    "Crouching",
    "The Dunes",
    "Muhammad",
    "The Victory",
    "The Inner Apartments",
    "The letter Qaaf",
    "The Winnowing Winds",
    "The Mount",
    "The Star",
    "The Moon",
    "The Beneficent",
    "The Inevitable",
    "The Iron",
    "The Pleading Woman",
    "The Exile",
    "She Who Is Examined",
    "The Ranks",
    "Friday",
    "The Hypocrites",
    "Mutual Disillusion",
    "Divorce",
    "The Prohibition",
    "The Sovereignty",
    "The Pen",
    "The Reality",
    "The Ascending Stairways",
    "Noah",
    "The Jinn",
    "The Enshrouded One",
    "The Cloaked One",
    "The Resurrection",
    "Man",
    "The Emissaries",
    "The Announcement",
    "Those who drag forth",
    "He frowned",
    "The Overthrowing",
    "The Cleaving",
    "Defrauding",
    "The Splitting Open",
    "The Constellations",
    "The Morning Star",
    "The Most High",
    "The Overwhelming",
    "The Dawn",
    "The City",
    "The Sun",
    "The Night",
    "The Morning Hours",
    "The Consolation",
    "The Fig",
    "The Clot",
    "The Power, Fate",
    "The Evidence",
    "The Earthquake",
    "The Chargers",
    "The Calamity",
    "Competition",
    "The Declining Day",
    "The Traducer",
    "The Elephant",
    "Quraysh",
    "Almsgiving",
    "Abundance",
    "The Disbelievers",
    "Divine Support",
    "The Palm Fibre",
    "Sincerity",
    "The Dawn",
    "Mankind",
  ],
  surah_names_arabic = [
    "",
    "الفاتحة",
    "البقرة",
    "آل عمران",
    "النساء",
    "المائدة",
    "الأنعام",
    "الأعراف",
    "الأنفال",
    "التوبة",
    "يونس",
    "هود",
    "يوسف",
    "الرعد",
    "ابراهيم",
    "الحجر",
    "النحل",
    "الإسراء",
    "الكهف",
    "مريم",
    "طه",
    "الأنبياء",
    "الحج",
    "المؤمنون",
    "النور",
    "الفرقان",
    "الشعراء",
    "النمل",
    "القصص",
    "العنكبوت",
    "الروم",
    "لقمان",
    "السجدة",
    "الأحزاب",
    "سبإ",
    "فاطر",
    "يس",
    "الصافات",
    "ص",
    "الزمر",
    "غافر",
    "فصلت",
    "الشورى",
    "الزخرف",
    "الدخان",
    "الجاثية",
    "الأحقاف",
    "محمد",
    "الفتح",
    "الحجرات",
    "ق",
    "الذاريات",
    "الطور",
    "النجم",
    "القمر",
    "الرحمن",
    "الواقعة",
    "الحديد",
    "المجادلة",
    "الحشر",
    "الممتحنة",
    "الصف",
    "الجمعة",
    "المنافقون",
    "التغابن",
    "الطلاق",
    "التحريم",
    "الملك",
    "القلم",
    "الحاقة",
    "المعارج",
    "نوح",
    "الجن",
    "المزمل",
    "المدثر",
    "القيامة",
    "الانسان",
    "المرسلات",
    "النبإ",
    "النازعات",
    "عبس",
    "التكوير",
    "الإنفطار",
    "المطففين",
    "الإنشقاق",
    "البروج",
    "الطارق",
    "الأعلى",
    "الغاشية",
    "الفجر",
    "البلد",
    "الشمس",
    "الليل",
    "الضحى",
    "الشرح",
    "التين",
    "العلق",
    "القدر",
    "البينة",
    "الزلزلة",
    "العاديات",
    "القارعة",
    "التكاثر",
    "العصر",
    "الهمزة",
    "الفيل",
    "قريش",
    "الماعون",
    "الكوثر",
    "الكافرون",
    "النصر",
    "المسد",
    "الإخلاص",
    "الفلق",
    "الناس",
  ],
  surah_total_ayahs = [
    "",
    "7",
    "286",
    "200",
    "176",
    "120",
    "165",
    "206",
    "75",
    "129",
    "109",
    "123",
    "111",
    "43",
    "52",
    "99",
    "128",
    "111",
    "110",
    "98",
    "135",
    "112",
    "78",
    "118",
    "64",
    "77",
    "227",
    "93",
    "88",
    "69",
    "60",
    "34",
    "30",
    "73",
    "54",
    "45",
    "83",
    "182",
    "88",
    "75",
    "85",
    "54",
    "53",
    "89",
    "59",
    "37",
    "35",
    "38",
    "29",
    "18",
    "45",
    "60",
    "49",
    "62",
    "55",
    "78",
    "96",
    "29",
    "22",
    "24",
    "13",
    "14",
    "11",
    "11",
    "18",
    "12",
    "12",
    "30",
    "52",
    "52",
    "44",
    "28",
    "28",
    "20",
    "56",
    "40",
    "31",
    "50",
    "40",
    "46",
    "42",
    "29",
    "19",
    "36",
    "25",
    "22",
    "17",
    "19",
    "26",
    "30",
    "20",
    "15",
    "21",
    "11",
    "8",
    "8",
    "19",
    "5",
    "8",
    "8",
    "11",
    "11",
    "8",
    "3",
    "9",
    "5",
    "4",
    "7",
    "3",
    "6",
    "3",
    "5",
    "4",
    "5",
    "6",
  ];
(sajda_surahs = [7, 13, 16, 17, 19, 22, 22, 25, 27, 32, 38, 41, 53, 84, 96]),
  (sajda_ayahs = [
    206,
    15,
    50,
    109,
    58,
    18,
    77,
    60,
    26,
    15,
    24,
    38,
    62,
    21,
    19,
  ]),
  (ayah_translations = [
    [""],
    [
      "English",
      "Sahih International",
      "en.sahih",
      "ltr",
      "https://english-ayah.audios.quranwbw.com/",
    ],
    ["English", "Hilali & Khan", "en.hilali", "ltr", null],
    ["English", "Abul Alaa Maududi", "en.maududi", "ltr", null],
    ["English", "Pickthall", "en.pickthall", "ltr", null],
    ["English", "Yusuf Ali", "en.yusufali", "ltr", null],
    ["English", "Clear Quran", "en.itani", "ltr", null],
    ["English", "Tafsir Jalalayn", "tf.jalalayn", "ltr", null],
    [
      "Urdu",
      "Ahmed Ali",
      "ur.ahmedali",
      "rtl",
      "https://urdu-ayah.audios.quranwbw.com/",
    ],
    ["Urdu", "Abul Alaa Maududi", "ur.maududi", "rtl", null],
    ["Urdu", "Muhammad Junagarhi", "ur.junagarhi", "rtl", null],
    ["Urdu", "Ahmad Raza Khan", "ur.ahmedraza", "rtl", null],
    ["Hindi", "Suhel Farooq & Saifur Rahman", "hi.hindi", "ltr", null],
    ["Indonesian", "Bahasa Indonesia", "id.bahasa", "ltr", null],
    ["Bengali", "Zohurul Hoque", "bn.hoque", "ltr", null],
    ["Bengali", "Muhiuddin Khan", "bn.muhiuddin", "ltr", null],
    ["Turkish", "Diyanet Isleri", "tr.diyanet", "ltr", null],
    ["Turkish", "Elmalili Hamdi Yazir", "tr.yazir", "ltr", null],
    ["Russian", "Elmir Kuliev", "ru.kuliev", "ltr", null],
    ["Russian", "Ministry of Awqaf, Egypt", "ru.muntahab", "ltr", null],
    ["German", "Bubenheim & Elyas", "de.bubenheim", "ltr", null],
  ]),
  (total_ayah_translations = ayah_translations.length - 1),
  (word_translations = [
    [""],
    ["English", "english"],
    ["Urdu", "urdu"],
    ["Hindi", "hindi"],
    ["Indonesian", "indonesian"],
    ["Bangla", "bangla"],
    ["Turkish", "turkish"],
    ["German", "german"],
    ["Russian", "russian"],
    ["Ingush", "ingush"],
  ]),
  (total_word_translations = word_translations.length - 1),
  (font_preview_texts = [
    [""],
    ["Allah", "the Eternal the Absolute"],
    ["اللہ", "بےنیاز ہے"],
    ["अल्लाह", "बेनियाज़ है"],
    ["Allah", "tempat bergantung"],
    ["আল্লাহ", "অমুখাপেক্ষী"],
    ["Allah", "der Überlegene"],
    ["Allah", "Samed'dir"],
    ["Аллах –", "Тот, в Котором все нуждаются"],
    ["Аллахl", "даим Шийга хьашт долаш вар ва)"],
  ]),
  (pause_marks = [
    ["Compulsory Stop", "&#x6d8;"],
    ["Stop Not Permissible", "&#x6d9;"],
    ["Continuation Preferred", "&#x6d6;"],
    ["Pause Preferred", "&#x6d7;"],
    ["Permissible To Stop", "&#x6da;", "ۚ"],
    ["Stop Points Interchangeable", "&#x6db;"],
  ]),
  (reciters = [
    [""],
    [
      "Abdul Basit (Mujawwad)",
      "https://verses.quran.com/AbdulBaset/Mujawwad/mp3/",
      "basit_mujawwad",
    ],
    [
      "Abdul Basit (Murattal)",
      "https://verses.quran.com/AbdulBaset/Murattal/mp3/",
      "basit_murattal",
    ],
    [
      "Abdul-Rahman Al-Sudais",
      "https://mirrors.quranicaudio.com/everyayah/Abdurrahmaan_As-Sudais_192kbps/",
    ],
    [
      "Abu Bakr Ash-Shaatree",
      "https://mirrors.quranicaudio.com/everyayah/Abu_Bakr_Ash-Shaatree_128kbps/",
    ],
    [
      "Dr. Farhat Hashmi (Urdu/Hindi WBW)",
      "https://urdu-ayah-wbw.audios.quranwbw.com/",
    ],
    ["Hani Ar-Rifai", "https://arabic-ayah-4.audios.quranwbw.com/", "rifai"],
    [
      "Maher Al-Muaiqly",
      "https://mirrors.quranicaudio.com/everyayah/Maher_AlMuaiqly_64kbps/",
    ],
    [
      "Mahmoud Khalil Al-Husary",
      "https://arabic-ayah-3.audios.quranwbw.com/",
      "husary",
    ],
    [
      "Mishary Rashid Alafasy",
      "https://arabic-ayah-1.audios.quranwbw.com/",
      "mishary",
    ],
    [
      "Mohamed El-Minshawi (Mujawwad)",
      "https://mirrors.quranicaudio.com/everyayah/Minshawy_Mujawwad_192kbps/",
    ],
    [
      "Muhammad Ayyub",
      "https://mirrors.quranicaudio.com/everyayah/Muhammad_Ayyoub_128kbps/",
    ],
    ["Saood Ash-Shuraym", "https://arabic-ayah-6.audios.quranwbw.com/"],
    [
      "Yasser Ad-Dossari",
      "https://mirrors.quranicaudio.com/everyayah/Yasser_Ad-Dussary_128kbps/",
    ],
  ]),
  (total_reciters = reciters.length - 1),
  (playback_speeds = ["", 0.5, 0.75, 1, 1.5, 1.75, 2]),
  (total_playback_speeds = playback_speeds.length - 1),
  (play_ayah_button_choices = [
    [""],
    [1, "Show Playing Options"],
    [2, "Play That Ayah", "Play This Ayah"],
    [3, "Play From That Ayah", "Play From Here"],
    [4, "Play Ayah On Repeat", "Play On Repeat"],
  ]),
  (total_play_ayah_button_choices = play_ayah_button_choices.length - 1),
  (sw_offline_msgs = [
    "The website is offline viewable for you.",
    "Click here to download the website (English only) for offline viewing (around 15 MB)",
    "The data is being downloaded in background. You may continue using the website.",
    "The data has been downloaded. The website is now offline viewable for you.",
    "The data has been deleted. Click here to download the data again.",
    "Switch to Safari to download the website for offline viewing.",
    "Please upgrade your browser/operating system to download the website for offline viewing.",
  ]),
  (sw_already_downloaded = sw_offline_msgs[0]),
  (sw_click_to_download = sw_offline_msgs[1]),
  (sw_data_being_downloaded = sw_offline_msgs[2]),
  (sw_data_downloaded = sw_offline_msgs[3]),
  (sw_data_deleted = sw_offline_msgs[4]),
  (sw_switch_to_safari = sw_offline_msgs[5]),
  (sw_upgrade = sw_offline_msgs[6]),
  (duas_surahs = [
    [],
    [2, 127],
    [2, 128],
    [2, 201],
    [2, 250],
    [2, 286],
    [3, 8],
    [3, 9],
    [3, 16],
    [3, 53],
    [3, 147],
    [3, 191],
    [3, 192],
    [3, 193],
    [3, 194],
    [5, 83],
    [5, 114],
    [7, 23],
    [7, 47],
    [7, 89],
    [7, 126],
    [10, 85],
    [10, 86],
    [14, 38],
    [14, 40],
    [14, 41],
    [18, 10],
    [20, 45],
    [21, 87],
    [23, 109],
    [23, 118],
    [25, 65],
    [25, 66],
    [25, 74],
    [28, 24],
    [40, 7],
    [40, 8],
    [40, 9],
    [59, 10],
    [60, 4],
    [60, 5],
    [66, 8],
  ]);
var total_duas = duas_surahs.length - 1,
  ayah_numbers_uthmani = [
    "",
    "C00",
    "C01",
    "C02",
    "C03",
    "C04",
    "C05",
    "C06",
    "C07",
    "C08",
    "C09",
    "C0A",
    "C0B",
    "C0C",
    "C0D",
    "C0E",
    "C0F",
    "C10",
    "C11",
    "C12",
    "C13",
    "C14",
    "C15",
    "C16",
    "C17",
    "C18",
    "C19",
    "C1A",
    "C1B",
    "C1C",
    "C1D",
    "C1E",
    "C1F",
    "C20",
    "C21",
    "C22",
    "C23",
    "C24",
    "C25",
    "C26",
    "C27",
    "C28",
    "C29",
    "C2A",
    "C2B",
    "C2C",
    "C2D",
    "C2E",
    "C2F",
    "C30",
    "C31",
    "C32",
    "C33",
    "C34",
    "C35",
    "C36",
    "C37",
    "C38",
    "C39",
    "C3A",
    "C3B",
    "C3C",
    "C3D",
    "C3E",
    "C3F",
    "C40",
    "C41",
    "C42",
    "C43",
    "C44",
    "C45",
    "C46",
    "C47",
    "C48",
    "C49",
    "C4A",
    "C4B",
    "C4C",
    "C4D",
    "C4E",
    "C4F",
    "C50",
    "C51",
    "C52",
    "C53",
    "C54",
    "C55",
    "C56",
    "C57",
    "C58",
    "C59",
    "C5A",
    "C5B",
    "C5C",
    "C5D",
    "C5E",
    "C5F",
    "C60",
    "C61",
    "C62",
    "C63",
    "C64",
    "C65",
    "C66",
    "C67",
    "C68",
    "C69",
    "C6A",
    "C6B",
    "C6C",
    "C6D",
    "C6E",
    "C6F",
    "C70",
    "C71",
    "C72",
    "C73",
    "C74",
    "C75",
    "C76",
    "C77",
    "C78",
    "C79",
    "C7A",
    "C7B",
    "C7C",
    "C7D",
    "C7E",
    "C7F",
    "C80",
    "C81",
    "C82",
    "C83",
    "C84",
    "C85",
    "C86",
    "C87",
    "C88",
    "C89",
    "C8A",
    "C8B",
    "C8C",
    "C8D",
    "C8E",
    "C8F",
    "C90",
    "C91",
    "C92",
    "C93",
    "C94",
    "C95",
    "C96",
    "C97",
    "C98",
    "C99",
    "C9A",
    "C9B",
    "C9C",
    "C9D",
    "C9E",
    "C9F",
    "CA0",
    "CA1",
    "CA2",
    "CA3",
    "CA4",
    "CA5",
    "CA6",
    "CA7",
    "CA8",
    "CA9",
    "CAA",
    "CAB",
    "CAC",
    "CAD",
    "CAE",
    "CAF",
    "CB0",
    "CB1",
    "CB2",
    "CB3",
    "CB4",
    "CB5",
    "CB6",
    "CB7",
    "CB8",
    "CB9",
    "CBA",
    "CBB",
    "CBC",
    "CBD",
    "CBE",
    "CBF",
    "CC0",
    "CC1",
    "CC2",
    "CC3",
    "CC4",
    "CC5",
    "CC6",
    "CC7",
    "CC8",
    "CC9",
    "CCA",
    "CCB",
    "CCC",
    "CCD",
    "CCE",
    "CCF",
    "CD0",
    "CD1",
    "CD2",
    "CD3",
    "CD4",
    "CD5",
    "CD6",
    "CD7",
    "CD8",
    "CD9",
    "CDA",
    "CDB",
    "CDC",
    "CDD",
    "CDE",
    "CDF",
    "CE0",
    "CE1",
    "CE2",
    "CE3",
    "CE4",
    "CE5",
    "CE6",
    "CE7",
    "CE8",
    "CE9",
    "CEA",
    "CEB",
    "CEC",
    "CED",
    "CEE",
    "CEF",
    "CF0",
    "CF1",
    "CF2",
    "CF3",
    "CF4",
    "CF5",
    "CF6",
    "CF7",
    "CF8",
    "CF9",
    "CFA",
    "CFB",
    "CFC",
    "CFD",
    "CFE",
    "CFF",
    "D00",
    "D01",
    "D02",
    "D03",
    "D04",
    "D05",
    "D06",
    "D07",
    "D08",
    "D09",
    "D0A",
    "D0B",
    "D0C",
    "D0D",
    "D0E",
    "D0F",
    "D10",
    "D11",
    "D12",
    "D13",
    "D14",
    "D15",
    "D16",
    "D17",
    "D18",
    "D19",
    "D1A",
    "D1B",
    "D1C",
    "D1D",
  ],
  ayah_numbers_indopak = [
    "",
    "۱",
    "۲",
    "۳",
    "۴",
    "۵",
    "۶",
    "۷",
    "۸",
    "۹",
    "۱۰",
    "۱۱",
    "۱۲",
    "۱۳",
    "۱۴",
    "۱۵",
    "۱۶",
    "۱۷",
    "۱۸",
    "۱۹",
    "۲۰",
    "۲۱",
    "۲۲",
    "۲۳",
    "۲۴",
    "۲۵",
    "۲۶",
    "۲۷",
    "۲۸",
    "۲۹",
    "۳۰",
    "۳۱",
    "۳۲",
    "۳۳",
    "۳۴",
    "۳۵",
    "۳۶",
    "۳۷",
    "۳۸",
    "۳۹",
    "۴۰",
    "۴۱",
    "۴۲",
    "۴۳",
    "۴۴",
    "۴۵",
    "۴۶",
    "۴۷",
    "۴۸",
    "۴۹",
    "۵۰",
    "۵۱",
    "۵۲",
    "۵۳",
    "۵۴",
    "۵۵",
    "۵۶",
    "۵۷",
    "۵۸",
    "۵۹",
    "۶۰",
    "۶۱",
    "۶۲",
    "۶۳",
    "۶۴",
    "۶۵",
    "۶۶",
    "۶۷",
    "۶۸",
    "۶۹",
    "۷۰",
    "۷۱",
    "۷۲",
    "۷۳",
    "۷۴",
    "۷۵",
    "۷۶",
    "۷۷",
    "۷۸",
    "۷۹",
    "۸۰",
    "۸۱",
    "۸۲",
    "۸۳",
    "۸۴",
    "۸۵",
    "۸۶",
    "۸۷",
    "۸۸",
    "۸۹",
    "۹۰",
    "۹۱",
    "۹۲",
    "۹۳",
    "۹۴",
    "۹۵",
    "۹۶",
    "۹۷",
    "۹۸",
    "۹۹",
    "۱۰۰",
    "۱۰۱",
    "۱۰۲",
    "۱۰۳",
    "۱۰۴",
    "۱۰۵",
    "۱۰۶",
    "۱۰۷",
    "۱۰۸",
    "۱۰۹",
    "۱۱۰",
    "۱۱۱",
    "۱۱۲",
    "۱۱۳",
    "۱۱۴",
    "۱۱۵",
    "۱۱۶",
    "۱۱۷",
    "۱۱۸",
    "۱۱۹",
    "۱۲۰",
    "۱۲۱",
    "۱۲۲",
    "۱۲۳",
    "۱۲۴",
    "۱۲۵",
    "۱۲۶",
    "۱۲۷",
    "۱۲۸",
    "۱۲۹",
    "۱۳۰",
    "۱۳۱",
    "۱۳۲",
    "۱۳۳",
    "۱۳۴",
    "۱۳۵",
    "۱۳۶",
    "۱۳۷",
    "۱۳۸",
    "۱۳۹",
    "۱۴۰",
    "۱۴۱",
    "۱۴۲",
    "۱۴۳",
    "۱۴۴",
    "۱۴۵",
    "۱۴۶",
    "۱۴۷",
    "۱۴۸",
    "۱۴۹",
    "۱۵۰",
    "۱۵۱",
    "۱۵۲",
    "۱۵۳",
    "۱۵۴",
    "۱۵۵",
    "۱۵۶",
    "۱۵۷",
    "۱۵۸",
    "۱۵۹",
    "۱۶۰",
    "۱۶۱",
    "۱۶۲",
    "۱۶۳",
    "۱۶۴",
    "۱۶۵",
    "۱۶۶",
    "۱۶۷",
    "۱۶۸",
    "۱۶۹",
    "۱۷۰",
    "۱۷۱",
    "۱۷۲",
    "۱۷۳",
    "۱۷۴",
    "۱۷۵",
    "۱۷۶",
    "۱۷۷",
    "۱۷۸",
    "۱۷۹",
    "۱۸۰",
    "۱۸۱",
    "۱۸۲",
    "۱۸۳",
    "۱۸۴",
    "۱۸۵",
    "۱۸۶",
    "۱۸۷",
    "۱۸۸",
    "۱۸۹",
    "۱۹۰",
    "۱۹۱",
    "۱۹۲",
    "۱۹۳",
    "۱۹۴",
    "۱۹۵",
    "۱۹۶",
    "۱۹۷",
    "۱۹۸",
    "۱۹۹",
    "۲۰۰",
    "۲۰۱",
    "۲۰۲",
    "۲۰۳",
    "۲۰۴",
    "۲۰۵",
    "۲۰۶",
    "۲۰۷",
    "۲۰۸",
    "۲۰۹",
    "۲۱۰",
    "۲۱۱",
    "۲۱۲",
    "۲۱۳",
    "۲۱۴",
    "۲۱۵",
    "۲۱۶",
    "۲۱۷",
    "۲۱۸",
    "۲۱۹",
    "۲۲۰",
    "۲۲۱",
    "۲۲۲",
    "۲۲۳",
    "۲۲۴",
    "۲۲۵",
    "۲۲۶",
    "۲۲۷",
    "۲۲۸",
    "۲۲۹",
    "۲۳۰",
    "۲۳۱",
    "۲۳۲",
    "۲۳۳",
    "۲۳۴",
    "۲۳۵",
    "۲۳۶",
    "۲۳۷",
    "۲۳۸",
    "۲۳۹",
    "۲۴۰",
    "۲۴۱",
    "۲۴۲",
    "۲۴۳",
    "۲۴۴",
    "۲۴۵",
    "۲۴۶",
    "۲۴۷",
    "۲۴۸",
    "۲۴۹",
    "۲۵۰",
    "۲۵۱",
    "۲۵۲",
    "۲۵۳",
    "۲۵۴",
    "۲۵۵",
    "۲۵۶",
    "۲۵۷",
    "۲۵۸",
    "۲۵۹",
    "۲۶۰",
    "۲۶۱",
    "۲۶۲",
    "۲۶۳",
    "۲۶۴",
    "۲۶۵",
    "۲۶۶",
    "۲۶۷",
    "۲۶۸",
    "۲۶۹",
    "۲۷۰",
    "۲۷۱",
    "۲۷۲",
    "۲۷۳",
    "۲۷۴",
    "۲۷۵",
    "۲۷۶",
    "۲۷۷",
    "۲۷۸",
    "۲۷۹",
    "۲۸۰",
    "۲۸۱",
    "۲۸۲",
    "۲۸۳",
    "۲۸۴",
    "۲۸۵",
    "۲۸۶",
  ],
  page_numbers = [
    "",
    "1:1",
    "2:1",
    "2:6",
    "2:17",
    "2:25",
    "2:30",
    "2:38",
    "2:49",
    "2:58",
    "2:62",
    "2:70",
    "2:77",
    "2:84",
    "2:89",
    "2:94",
    "2:102",
    "2:106",
    "2:113",
    "2:120",
    "2:127",
    "2:135",
    "2:142",
    "2:146",
    "2:154",
    "2:164",
    "2:170",
    "2:177",
    "2:182",
    "2:187",
    "2:191",
    "2:197",
    "2:203",
    "2:211",
    "2:216",
    "2:220",
    "2:225",
    "2:231",
    "2:234",
    "2:238",
    "2:246",
    "2:249",
    "2:253",
    "2:257",
    "2:260",
    "2:265",
    "2:270",
    "2:275",
    "2:282",
    "2:283",
    "3:1",
    "3:10",
    "3:16",
    "3:23",
    "3:30",
    "3:38",
    "3:46",
    "3:53",
    "3:62",
    "3:71",
    "3:78",
    "3:84",
    "3:92",
    "3:101",
    "3:109",
    "3:116",
    "3:122",
    "3:133",
    "3:141",
    "3:149",
    "3:154",
    "3:158",
    "3:166",
    "3:174",
    "3:181",
    "3:187",
    "3:195",
    "4:1",
    "4:7",
    "4:12",
    "4:15",
    "4:20",
    "4:24",
    "4:27",
    "4:34",
    "4:38",
    "4:45",
    "4:52",
    "4:60",
    "4:66",
    "4:75",
    "4:80",
    "4:87",
    "4:92",
    "4:95",
    "4:102",
    "4:106",
    "4:114",
    "4:122",
    "4:128",
    "4:135",
    "4:141",
    "4:148",
    "4:155",
    "4:163",
    "4:171",
    "4:176",
    "5:3",
    "5:6",
    "5:10",
    "5:14",
    "5:18",
    "5:24",
    "5:32",
    "5:37",
    "5:42",
    "5:46",
    "5:51",
    "5:58",
    "5:65",
    "5:71",
    "5:77",
    "5:83",
    "5:90",
    "5:96",
    "5:104",
    "5:109",
    "5:114",
    "6:1",
    "6:9",
    "6:19",
    "6:28",
    "6:36",
    "6:45",
    "6:53",
    "6:60",
    "6:69",
    "6:74",
    "6:82",
    "6:91",
    "6:95",
    "6:102",
    "6:111",
    "6:119",
    "6:125",
    "6:132",
    "6:138",
    "6:143",
    "6:147",
    "6:152",
    "6:158",
    "7:1",
    "7:12",
    "7:23",
    "7:31",
    "7:38",
    "7:44",
    "7:52",
    "7:58",
    "7:68",
    "7:74",
    "7:82",
    "7:88",
    "7:96",
    "7:105",
    "7:121",
    "7:131",
    "7:138",
    "7:144",
    "7:150",
    "7:156",
    "7:160",
    "7:164",
    "7:171",
    "7:179",
    "7:188",
    "7:196",
    "8:1",
    "8:9",
    "8:17",
    "8:26",
    "8:34",
    "8:41",
    "8:46",
    "8:53",
    "8:62",
    "8:70",
    "9:1",
    "9:7",
    "9:14",
    "9:21",
    "9:27",
    "9:32",
    "9:37",
    "9:41",
    "9:48",
    "9:55",
    "9:62",
    "9:69",
    "9:73",
    "9:80",
    "9:87",
    "9:94",
    "9:100",
    "9:107",
    "9:112",
    "9:118",
    "9:123",
    "10:1",
    "10:7",
    "10:15",
    "10:21",
    "10:26",
    "10:34",
    "10:43",
    "10:54",
    "10:62",
    "10:71",
    "10:79",
    "10:89",
    "10:98",
    "10:107",
    "11:6",
    "11:13",
    "11:20",
    "11:29",
    "11:38",
    "11:46",
    "11:54",
    "11:63",
    "11:72",
    "11:82",
    "11:89",
    "11:98",
    "11:109",
    "11:118",
    "12:5",
    "12:15",
    "12:23",
    "12:31",
    "12:38",
    "12:44",
    "12:53",
    "12:64",
    "12:70",
    "12:79",
    "12:87",
    "12:96",
    "12:104",
    "13:1",
    "13:6",
    "13:14",
    "13:19",
    "13:29",
    "13:35",
    "13:43",
    "14:6",
    "14:11",
    "14:19",
    "14:25",
    "14:34",
    "14:43",
    "15:1",
    "15:16",
    "15:32",
    "15:52",
    "15:71",
    "15:91",
    "16:7",
    "16:15",
    "16:27",
    "16:35",
    "16:43",
    "16:55",
    "16:65",
    "16:73",
    "16:80",
    "16:88",
    "16:94",
    "16:103",
    "16:111",
    "16:119",
    "17:1",
    "17:8",
    "17:18",
    "17:28",
    "17:39",
    "17:50",
    "17:59",
    "17:67",
    "17:76",
    "17:87",
    "17:97",
    "17:105",
    "18:5",
    "18:16",
    "18:21",
    "18:28",
    "18:35",
    "18:46",
    "18:54",
    "18:62",
    "18:75",
    "18:84",
    "18:98",
    "19:1",
    "19:12",
    "19:26",
    "19:39",
    "19:52",
    "19:65",
    "19:77",
    "19:96",
    "20:13",
    "20:38",
    "20:52",
    "20:65",
    "20:77",
    "20:88",
    "20:99",
    "20:114",
    "20:126",
    "21:1",
    "21:11",
    "21:25",
    "21:36",
    "21:45",
    "21:58",
    "21:73",
    "21:82",
    "21:91",
    "21:102",
    "22:1",
    "22:6",
    "22:16",
    "22:24",
    "22:31",
    "22:39",
    "22:47",
    "22:56",
    "22:65",
    "22:73",
    "23:1",
    "23:18",
    "23:28",
    "23:43",
    "23:60",
    "23:75",
    "23:90",
    "23:105",
    "24:1",
    "24:11",
    "24:21",
    "24:28",
    "24:32",
    "24:37",
    "24:44",
    "24:54",
    "24:59",
    "24:62",
    "25:3",
    "25:12",
    "25:21",
    "25:33",
    "25:44",
    "25:56",
    "25:68",
    "26:1",
    "26:20",
    "26:40",
    "26:61",
    "26:84",
    "26:112",
    "26:137",
    "26:160",
    "26:184",
    "26:207",
    "27:1",
    "27:14",
    "27:23",
    "27:36",
    "27:45",
    "27:56",
    "27:64",
    "27:77",
    "27:89",
    "28:6",
    "28:14",
    "28:22",
    "28:29",
    "28:36",
    "28:44",
    "28:51",
    "28:60",
    "28:71",
    "28:78",
    "28:85",
    "29:7",
    "29:15",
    "29:24",
    "29:31",
    "29:39",
    "29:46",
    "29:53",
    "29:64",
    "30:6",
    "30:16",
    "30:25",
    "30:33",
    "30:42",
    "30:51",
    "31:1",
    "31:12",
    "31:20",
    "31:29",
    "32:1",
    "32:12",
    "32:21",
    "33:1",
    "33:7",
    "33:16",
    "33:23",
    "33:31",
    "33:36",
    "33:44",
    "33:51",
    "33:55",
    "33:63",
    "34:1",
    "34:8",
    "34:15",
    "34:23",
    "34:32",
    "34:40",
    "34:49",
    "35:4",
    "35:12",
    "35:19",
    "35:31",
    "35:39",
    "35:45",
    "36:13",
    "36:28",
    "36:41",
    "36:55",
    "36:71",
    "37:1",
    "37:25",
    "37:52",
    "37:77",
    "37:103",
    "37:127",
    "37:154",
    "38:1",
    "38:17",
    "38:27",
    "38:43",
    "38:62",
    "38:84",
    "39:6",
    "39:11",
    "39:22",
    "39:32",
    "39:41",
    "39:48",
    "39:57",
    "39:68",
    "39:75",
    "40:8",
    "40:17",
    "40:26",
    "40:34",
    "40:41",
    "40:50",
    "40:59",
    "40:67",
    "40:78",
    "41:2",
    "41:12",
    "41:21",
    "41:30",
    "41:39",
    "41:47",
    "42:2",
    "42:11",
    "42:16",
    "42:23",
    "42:32",
    "42:45",
    "42:52",
    "43:11",
    "43:23",
    "43:34",
    "43:48",
    "43:61",
    "43:74",
    "44:2",
    "44:19",
    "44:40",
    "45:2",
    "45:14",
    "45:23",
    "45:33",
    "46:6",
    "46:15",
    "46:21",
    "46:29",
    "47:1",
    "47:12",
    "47:20",
    "47:30",
    "48:1",
    "48:10",
    "48:16",
    "48:24",
    "48:29",
    "49:5",
    "49:12",
    "50:1",
    "50:16",
    "50:36",
    "51:7",
    "51:31",
    "51:52",
    "52:15",
    "52:32",
    "53:1",
    "53:27",
    "53:45",
    "54:7",
    "54:28",
    "54:50",
    "55:17",
    "55:41",
    "55:68",
    "56:17",
    "56:51",
    "56:77",
    "57:4",
    "57:12",
    "57:19",
    "57:25",
    "58:1",
    "58:7",
    "58:12",
    "58:22",
    "59:4",
    "59:10",
    "59:17",
    "60:1",
    "60:6",
    "60:12",
    "61:6",
    "62:1",
    "62:9",
    "63:5",
    "64:1",
    "64:10",
    "65:1",
    "65:6",
    "66:1",
    "66:8",
    "67:1",
    "67:13",
    "67:27",
    "68:16",
    "68:43",
    "69:9",
    "69:35",
    "70:11",
    "70:40",
    "71:11",
    "72:1",
    "72:14",
    "73:1",
    "73:20",
    "74:18",
    "74:48",
    "75:20",
    "76:6",
    "76:26",
    "77:20",
    "78:1",
    "78:31",
    "79:16",
    "80:1",
    "81:1",
    "82:1",
    "83:7",
    "83:35",
    "85:1",
    "86:1",
    "87:16",
    "89:2",
    "89:24",
    "91:1",
    "92:15",
    "95:1",
    "97:1",
    "98:8",
    "100:10",
    "103:2",
    "106:1",
    "109:1",
    "112:1",
  ],
  juz_numbers = [
    "",
    "1:1",
    "2:142",
    "2:253",
    "3:93",
    "4:24",
    "4:148",
    "5:82",
    "6:111",
    "7:88",
    "8:41",
    "9:93",
    "11:6",
    "12:53",
    "15:1",
    "17:1",
    "18:75",
    "21:1",
    "23:1",
    "25:21",
    "27:56",
    "29:46",
    "33:31",
    "36:28",
    "39:32",
    "41:47",
    "46:1",
    "51:31",
    "58:1",
    "67:1",
    "78:1",
  ];
function update_surah_info(a) {
  (a = parseInt(a)),
    (surah_ayahs = surah_total_ayahs[a]),
    (surah_name_transliteration = surah_names_transliteration[a]),
    (surah_name_translation = surah_names_translation[a]),
    (surah_name_arabic = surah_names_arabic[a]);
  var t = surah_names_transliteration[a - 1],
    s = surah_names_transliteration[a + 1],
    e =
      "Learn Surah " +
      surah_name_transliteration +
      " (" +
      surah_name_arabic +
      ") Through " +
      site_tagline;
  (document.title =
    surah_name_transliteration +
    " (" +
    a +
    ") - " +
    surah_name_translation +
    " - " +
    site_tagline),
    $("meta[name=description]").attr("content", e),
    $("meta[name='og:title']").attr("content", e),
    $("meta[name='og:url']").attr("content", window.location.href),
    $(".navbar-brand-surahname").html(
      "<span class='nav-surahname-tr'>" +
        surah_name_transliteration +
        "</span> <span class='nav-surahname-ar'><span class='nav-slash'>/</span> " +
        surah_name_arabic +
        "</span> <span class='nav-surahname-en'><span class='nav-slash'>/</span> " +
        surah_name_translation +
        "</span>"
    ),
    $(".bismillah-div").css("display", "none"),
    1 == a || 9 == a
      ? $(".full-surah").css("margin-top", "60px")
      : ($(".full-surah").css("margin-top", "0px"),
        $(".bismillah-div").css("display", "block")),
    $(".bottom-nav-surahname").text(
      surah_name_transliteration +
        " / " +
        surah_name_arabic +
        " / " +
        surah_name_translation
    ),
    $(".bottom-nav__item--prevsurah").css("visibility", "hidden"),
    1 == a
      ? $(".bottom-nav__item--prevsurah").css("visibility", "hidden")
      : $(".bottom-nav__item--prevsurah").css("visibility", "visible"),
    $(".bottom-nav__item--nextsurah").css("visibility", "hidden"),
    114 == a
      ? $(".bottom-nav__item--nextsurah").css("visibility", "hidden")
      : $(".bottom-nav__item--nextsurah").css("visibility", "visible");
  var n = a - 1,
    i = a + 1;
  $(".bottom-nav__item--prevsurah .bottom-nav-surah").text(" " + t),
    $(".bottom-nav__item--prevsurah .surah-nav-links").attr("href", n),
    $(".bottom-nav__item--nextsurah .bottom-nav-surah").text(s + " "),
    $(".bottom-nav__item--nextsurah .surah-nav-links").attr("href", i),
    $(".ayah-selector").empty();
  for (var r = 1; r <= surah_ayahs; r++)
    $(".ayah-selector").append(
      "<a class=dropdown-item data-l=" + r + ">" + r + "</a>"
    );
  $(".surah-list").empty();
  for (var o, l = 1; l <= 114; l++) {
    (o =
      l == a
        ? "<a class='dropdown-item dropdown-item-highlight' href='" +
          l +
          "'>" +
          l +
          ". " +
          surah_names_transliteration[l] +
          " (" +
          surah_names_arabic[l] +
          ")</a>"
        : "<a class='dropdown-item' href='" +
          l +
          "'>" +
          l +
          ". " +
          surah_names_transliteration[l] +
          " (" +
          surah_names_arabic[l] +
          ")</a>"),
      $(".surah-list").append(o);
  }
  (ayah_to_start_from = 1),
    (settings.last_read_surah = a),
    (settings.last_read_ayah = 1),
    localStorage.setItem("settings", JSON.stringify(settings));
}
function update_settings() {
  for (var a = 1; a <= total_word_translations; a++) {
    var t =
      "<option value='" + a + "'>" + word_translations[a][0] + "</option>";
    $("#select-word-translation").append(t);
  }
  null == settings.current_word_translation &&
    (settings.current_word_translation = 1),
    (current_word_translation = settings.current_word_translation),
    $("#select-word-translation").val(current_word_translation),
    1 == current_word_translation
      ? ($(".ns-tr-u").css("display", "none"),
        $(".ns-tr-e").css("display", "inline-block"))
      : 2 == current_word_translation &&
        ($(".ns-tr-e").css("display", "none"),
        $(".ns-tr-u").css("display", "inline-block"));
  for (a = 1; a <= total_ayah_translations; a++) {
    var s = "";
    null != ayah_translations[a][4] && (s = " - with audio");
    t =
      "<option value='" +
      a +
      "'>" +
      ayah_translations[a][0] +
      " (" +
      ayah_translations[a][1] +
      s +
      ")</option>";
    $("#select-ayah-translation").append(t);
  }
  if (
    (null == settings.current_ayah_translation &&
      (settings.current_ayah_translation = 1),
    (current_ayah_translation = settings.current_ayah_translation),
    $("#select-ayah-translation").val(current_ayah_translation),
    null == ayah_translations[current_ayah_translation][4]
      ? $(".play-ayah-translation-button").css("display", "none")
      : $(".play-ayah-translation-button").css("display", "inline-block"),
    null == settings.current_word_type)
  )
    try {
      "Uthmani" == site_settings.current_font
        ? (settings.current_word_type = 1)
        : "IndoPak" == site_settings.current_font &&
          (settings.current_word_type = 2);
    } catch (a) {
      settings.current_word_type = 1;
    }
  set_word_type((current_word_type = settings.current_word_type)),
    $("#select-word-type").val(current_word_type),
    null == settings.current_theme && (settings.current_theme = 1),
    (current_theme = settings.current_theme),
    $("#select-theme").val(current_theme),
    $(".theme-pic." + current_theme).addClass("theme-selected"),
    null == settings.current_display_mode &&
      (settings.current_display_mode = 1),
    (current_display_mode = settings.current_display_mode),
    $("#select-display-mode").val(current_display_mode),
    1 == current_display_mode
      ? (normal_display_mode_disabled = !0)
      : 2 == current_display_mode && (normal_display_mode_disabled = !1),
    1 == normal_display_mode_disabled
      ? $("#normalmode").prop("disabled", !0)
      : 0 == normal_display_mode_disabled &&
        $("head").append(
          '<link rel="stylesheet" href="../assets/css/normal.css?v=277" id="normalmode"/>'
        ),
    null == settings.tajweed_mode && (settings.tajweed_mode = 2),
    (tajweed_mode = settings.tajweed_mode),
    $("#select-tajweed").val(tajweed_mode);
  for (a = 1; a <= total_play_ayah_button_choices; a++) {
    t =
      "<option value='" +
      a +
      "'>" +
      play_ayah_button_choices[a][1] +
      "</option>";
    $("#select-playing-options").append(t);
  }
  null == settings.play_ayah_button_choice &&
    (settings.play_ayah_button_choice = 1),
    (play_ayah_button_choice = settings.play_ayah_button_choice),
    $("#select-playing-options").val(play_ayah_button_choice);
  for (a = 1; a <= total_reciters; a++) {
    t = "<option value='" + a + "'>" + reciters[a][0] + "</option>";
    $("#select-reciter").append(t);
  }
  null == settings.current_reciter && (settings.current_reciter = 8),
    (current_reciter = settings.current_reciter),
    $("#select-reciter").val(current_reciter),
    (ayah_audio_url = reciters[current_reciter][1]),
    null == settings.current_timestamp
      ? (update_current_timestamps(),
        (settings.current_timestamp = current_word_timestamp),
        localStorage.setItem("settings", JSON.stringify(settings)))
      : (current_word_timestamp = settings.current_timestamp);
  for (a = 1; a <= total_playback_speeds; a++) {
    t = "<option value='" + a + "'>x" + playback_speeds[a] + "</option>";
    $("#select-playback-speed").append(t);
  }
  null == settings.current_playback_speed &&
    (settings.current_playback_speed = 3),
    (current_playback_speed = settings.current_playback_speed),
    $("#select-playback-speed").val(current_playback_speed),
    (current_playback_speed = playback_speeds[current_playback_speed]),
    null == settings.auto_scroll && (settings.auto_scroll = 1),
    (auto_scroll = settings.auto_scroll),
    $("#select-auto-scroll").val(auto_scroll),
    localStorage.setItem("settings", JSON.stringify(settings));
}
function change_surah_new(a) {}
function play_ayah(n) {
  var a = (n = parseInt(n)) + 1,
    t = $(".single-ayah." + n);
  if ((current_playing_ayah = n) <= surah_ayahs) {
    function s() {
      for (
        var a = $(".single-ayah." + n + " .single-word").length, t = 0;
        t <= a;
        t++
      ) {
        var s = t - 1,
          e = n - 1;
        ("surah" == current_page
          ? $(".single-ayah." + n)
              .children()
              .eq(t)
              .attr("data-ts")
          : $(".single-ayah." + n)
              .children()
              .eq(t)
              .attr("data-ts-" + reciters[current_reciter][2])) <
          surah_audio.currentTime &&
          (0 < t &&
            $(".single-ayah." + n)
              .children()
              .eq(s)
              .children(".word-arabic")
              .removeClass("word-arabic-hover"),
          $(".single-ayah." + n)
            .children()
            .eq(t)
            .children(".word-arabic")
            .addClass("word-arabic-hover"),
          $(".single-ayah." + e)
            .children()
            .eq(t)
            .children(".word-arabic")
            .removeClass("word-arabic-hover"),
          0 < t && $(".ath-" + n + "-" + s).removeClass("ayah-tr-highlight"),
          $(".ath-" + n + "-" + t).addClass("ayah-tr-highlight"));
      }
    }
    $("#bottom-nav-surahayah").text("(loading...)"), t.addClass("ayah-hover");
    var e = n + 1,
      i = ("00" + surah_number).slice(-3) + "00".concat(n).slice(-3),
      r = ("00" + surah_number).slice(-3) + ("00" + e).slice(-3),
      o = $("#" + n + " .ayah-transliteration-text").html();
    surah_audio.pause(),
      (surah_audio.currentTime = 0),
      (surah_audio.src = ""),
      surah_audio.removeEventListener("timeupdate", s),
      (audio.currentTime = 0),
      audio.pause(),
      audio.removeEventListener("timeupdate", s);
    var l = ayah_audio_url + i + ".mp3";
    if (
      ((surah_audio.src = l),
      surah_audio.load(),
      (surah_audio.playbackRate = current_playback_speed),
      surah_audio.play(),
      $("#bottom-nav-surahayah").text("(Ayah " + n + ")"),
      n < surah_ayahs && new Audio(ayah_audio_url + r + ".mp3"),
      1 == auto_scroll)
    )
      try {
        $("html, body").animate({ scrollTop: t.offset().top - 115 }, 1e3);
      } catch (a) {}
    null != reciters[current_reciter][2] &&
      surah_audio.addEventListener("timeupdate", s),
      $("#surah-audio").trigger("click");
    surah_audio.onended =
      n == surah_ayahs
        ? function() {
            $("#" + n + " .ayah-transliteration-text").html(o),
              surah_audio.pause(),
              (surah_audio.currentTime = 0),
              (surah_audio.src = ""),
              surah_audio.removeEventListener("timeupdate", s),
              (has_surah_audio_been_started = is_audio_playing = !1),
              (playing_which_audio = "none"),
              t.removeClass("ayah-hover"),
              $(".word-arabic").removeClass("word-arabic-hover"),
              $(".play-pause-icon").removeClass("pause-icon"),
              $(".play-pause-icon").addClass("play-icon"),
              $("#bottom-nav-surahayah").css("display", "none"),
              add_play_pause_icon("play"),
              (auto_play_number = first_ayah_on_screen),
              $(".bottom-nav-surahplayer").click();
          }
        : function() {
            $("#" + n + " .ayah-transliteration-text").html(o),
              surah_audio.pause(),
              (surah_audio.currentTime = 0),
              surah_audio.removeEventListener("timeupdate", s),
              t.removeClass("ayah-hover"),
              $(".word-arabic").removeClass("word-arabic-hover"),
              play_ayah(a);
          };
  }
}
function load_ayahs(a, t) {
  if (0 == mushaf_mode_enabled) {
    var s = surah_ayahs;
    for (T = a; T <= t; T++) {
      var e,
        n = surah_number + ":" + T,
        i = "",
        r = "",
        o = "",
        l = !1,
        d = !1;
      -1 != page_numbers.indexOf(n) &&
        ((r += "PAGE " + (e = page_numbers.indexOf(n))), (l = !0)),
        -1 != juz_numbers.indexOf(n) &&
          ((o += "JUZ " + juz_numbers.indexOf(n)), (d = !0)),
        (1 != l && 1 != d) ||
          ((i += "<div id='page-" + e + "' class='page-block'>"),
          1 == l && 0 == d
            ? (i += r)
            : 0 == l && 1 == d
            ? (i += o)
            : 1 == l &&
              1 == d &&
              (i +=
                r +
                "<span style='opacity: 0.5;'>&nbsp;&nbsp;&bull;&nbsp;&nbsp;</span>" +
                o),
          (i += "</div>"));
      try {
        var h = current_arabic_data[T].split("//");
      } catch (a) {}
      var c = current_arabic_data[T].split("//").length,
        _ =
          '<div class="ayah-' +
          T +
          " ayah-single " +
          surah_number +
          '" id="' +
          T +
          '"> ' +
          i +
          ' <div class="row ayah-row"><div class="col-1 ayah-buttons"><span class="ayah-block-buttons ayah-number-button">Ayah ' +
          T +
          '</span> <span class="ayah-block-buttons play-ayah-button">Play Ayah</span><span class="ayah-block-buttons stop-recitation-button" style="display: none;">Stop Recitation</span> </div> <div class="col-10 single-ayah ' +
          T +
          '">',
        u = (single_ayah_words = ""),
        p = 0;
      for (x = 0; x <= c - 1; x++) {
        var y = "",
          g = (z = h[x].split("/"))[0],
          m = z[1],
          w = z[2],
          b = "&nbsp;",
          f = (m.split(""), g.split("")),
          v = x + 1,
          C = surah_number + "-" + T + "-" + v,
          k = [
            "ٚ",
            "ؔ",
            "ؕ",
            "ۥ",
            "ۚ",
            "۪",
            "۠",
            "ۙ",
            "ؗ",
            "۫",
            "ۘ",
            "ۗ",
            "۬",
            "ۙ",
            "۬",
            "ۦ",
            "۩",
          ];
        -1 === k.indexOf(f[f.length - 1]) ||
          (k.indexOf(f[f.length - 1]),
          (g = "<span class='indopak-word-margin'>" + g + "</span>")),
          (single_ayah_words +=
            "<span id=" +
            C +
            " class=single-word data-ts=" +
            y +
            "><span class='word-arabic'>  <span class='word-arabic-indopak' style='display: none; '>" +
            g +
            "</span> <span class='word-arabic-uthmani-hafs' style=''>" +
            m +
            "</span> </span><span class=word-transliteration>" +
            w +
            "</span><span class=word-translation>" +
            b +
            "</span></span>"),
          "-" != (E = h[x].split("/")[2]) &&
            ((u += "<span class='ath-" + T + "-" + p + "'> " + E + "</span> "),
            p++);
      }
      (ayah_numbers = "&#xF" + ayah_numbers_uthmani[T] + ";"),
        (single_ayah_words +=
          "<span data-tooltip='End of Ayah " +
          T +
          "' class='word-arabic uthmani-pause-mark end-ayah' style='display: none;'>" +
          ayah_numbers +
          "</span>"),
        (single_ayah_after =
          T == s
            ? '</div></div><div class="row translation-row"><div class="col-1"></div><div class="col-10 ayah-tr ayah-transliteration"><span class="ayah-tr-heading">TRANSLITERATION</span><br><span class="ayah-transliteration-text">' +
              u +
              '</span></div><div class="col-10 ayah-tr ayah-translation" style="display:none; border-bottom:none; padding-top: 10px;"><span class="ayah-tr-heading">TRANSLATION</span><br><span class="ayah-translation-text"></span></div></div></span>'
            : '</div></div><div class="row translation-row"><div class="col-1"></div><div class="col-10 ayah-tr ayah-transliteration"><span class="ayah-tr-heading">TRANSLITERATION</span><br><span class="ayah-transliteration-text">' +
              u +
              '</span></div><div class="col-10 ayah-tr ayah-translation" style="display:none; border-bottom:none; padding-top: 10px;"><span class="ayah-tr-heading">TRANSLATION</span><br><span class="ayah-translation-text"></span></div></div></div>');
      var A = _ + single_ayah_words + single_ayah_after;
      $(".ayahs-block").append(A);
    }
  } else if (1 == mushaf_mode_enabled) {
    var T,
      x,
      s = surah_ayahs;
    for (T = a; T <= t; T++) {
      try {
        h = current_arabic_data[T].w.split("//");
      } catch (a) {}
      var S,
        I,
        c = current_arabic_data[T].w.split("//").length,
        j = current_arabic_data[T].p,
        O = current_arabic_data[T].e,
        _ =
          '<div class="ayah-' +
          T +
          " ayah-single " +
          surah_number +
          '" id="' +
          T +
          '"><div class="row ayah-row"><div class="col-1 ayah-buttons"><span class="ayah-block-buttons ayah-number-button">Ayah ' +
          T +
          '</span> <span class="ayah-block-buttons play-ayah-button">Play Ayah</span><span class="ayah-block-buttons stop-recitation-button" style="display: none;">Stop Recitation</span> </div> <div class="col-10 single-ayah ' +
          T +
          '">',
        u = (single_ayah_words = "");
      for (
        --c,
          null != current_arabic_data[T].h &&
            ((S = current_arabic_data[T].h),
            (single_ayah_words +=
              "<span data-tooltip='Hizb' class=hizb-icon><span class='word-arabic p" +
              j +
              "' style='color: var(--gold);'>" +
              S +
              "</span><span class=word-transliteration>&nbsp;</span><span class=word-translation>&nbsp;</span></span>"),
            --c),
          x = 0;
        x <= c;
        x++
      ) {
        var z,
          y = "",
          N = (z = h[x].split("/"))[0],
          b = "&nbsp;";
        null == (w = z[1]) && alert(T);
        N.split("");
        var E,
          v = x + 1,
          C = surah_number + "-" + T + "-" + v;
        (single_ayah_words +=
          "<span id='" +
          C +
          "' class=single-word data-ts=" +
          y +
          "><span class='word-arabic p" +
          j +
          "  '>" +
          N +
          " </span><span class=word-transliteration>" +
          w +
          "</span><span class=word-translation>" +
          b +
          "</span></span>"),
          (u +=
            "<span class='ath a" +
            T +
            " t" +
            x +
            "'> " +
            (E = h[x].split("/")[1]) +
            "</span> ");
      }
      null != current_arabic_data[T].s &&
        ((I = current_arabic_data[T].s),
        (single_ayah_words +=
          "<span data-tooltip='Ayah of Sajda (Prostration)' class=hizb-icon><span class='word-arabic p" +
          j +
          "' style='color: var(--gold);'>" +
          I +
          "</span><span class=word-transliteration>&nbsp;</span><span class=word-translation>&nbsp;</span></span>")),
        (single_ayah_words +=
          "<span data-tooltip='End of Ayah " +
          T +
          "' class=single-word><span class='word-arabic p" +
          j +
          "' style='color: var(--gold);'>" +
          O +
          "</span><span class=word-transliteration>&nbsp;</span><span class=word-translation>&nbsp;</span></span>"),
        (single_ayah_after =
          T == s
            ? '</div></div><div class="row translation-row"><div class="col-1"></div><div class="col-10 ayah-tr ayah-transliteration"><span class="ayah-tr-heading">TRANSLITERATION</span><br><span class="ayah-transliteration-text">' +
              u +
              '</span></div><div class="col-10 ayah-tr ayah-translation" style="display:none; border-bottom:none; padding-top: 10px;"><span class="ayah-tr-heading">TRANSLATION</span><br><span class="ayah-translation-text"></span></div></div></span>'
            : '</div></div><div class="row translation-row"><div class="col-1"></div><div class="col-10 ayah-tr ayah-transliteration"><span class="ayah-tr-heading">TRANSLITERATION</span><br><span class="ayah-transliteration-text">' +
              u +
              '</span></div><div class="col-10 ayah-tr ayah-translation" style="display:none; border-bottom:none; padding-top: 10px;"><span class="ayah-tr-heading">TRANSLATION</span><br><span class="ayah-translation-text"></span></div></div></div>');
      A = _ + single_ayah_words + single_ayah_after;
      $(".ayahs-block").append(A);
    }
  }
  var D;
  $(".ayah-translation").css("direction", ayah_translation_direction),
    1 == hash_of_two_parts &&
      null != window.location.href.split("#")[2] &&
      ((D = window.location.href.split("#")[2]),
      $("html, body").animate({ scrollTop: $("#" + D).offset().top - 60 }, 1e3),
      (hash_of_two_parts = !1)),
    update_word_translations(current_word_translation, a, t),
    update_ayah_translations(current_ayah_translation, a, t),
    "surah" == current_page &&
      1 == is_audio_playing &&
      update_timestamps(current_word_timestamp),
    update_fonts();
}
function load_duas() {
  $.getJSON("assets/data/duas.json", function(a) {
    for (var t = 1; t <= total_duas; t++) {
      var s = duas_surahs[t][0],
        e = duas_surahs[t][1],
        n = surah_names_transliteration[s],
        i = a[t],
        r = i.info.split("//"),
        o = parseInt(r[0]),
        l = r[1],
        d = r[2],
        h = r[3],
        c = i.words,
        _ = i.translation;
      try {
        var u = c.split("//");
      } catch (a) {}
      var p = u.length - 1,
        y = _,
        g = (y.match(/"/g) || []).length;
      1 == g
        ? (y = y.replace('"', '"<span class="dua-highlight">'))
        : 2 == g &&
          (y = y.replace(
            /"([^"]+)"/g,
            '"<span class="dua-highlight">$1</span>"'
          )),
        60 == s &&
          4 == e &&
          (y = y.replace("Our Lord", '<span class="dua-highlight">Our Lord')),
        7 == s &&
          89 == e &&
          (y = y.replace(
            "Our Lord, decide",
            '<span class="dua-highlight">Our Lord, decide'
          )),
        (single_ayah_before =
          '<div class="ayah-' +
          e +
          " ayah-single " +
          s +
          '" id="' +
          e +
          '" data-ts-mishary=' +
          l +
          " data-ts-husary=" +
          d +
          " data-ts-rifai=" +
          h +
          ' data-ts-basit-mujawwad= data-ts-basit-murattal=><div class="row ayah-row"><div class="col-1 ayah-buttons"><a href="./' +
          s +
          "#" +
          e +
          '" class="ayah-block-buttons">' +
          n +
          ", Ayah " +
          e +
          '</a><span class="ayah-block-buttons play-ayah-button">Play Dua</span><span class="ayah-block-buttons stop-recitation-button" style="display: none;">Stop Recitation</span> </div> <div class="col-10 single-ayah ' +
          e +
          '">');
      for (var m = (single_ayah_words = ""), w = 0, b = 0; b <= p; b++) {
        var f,
          v = u[b].split("/"),
          C = v[0],
          k = v[1],
          A = v[2],
          T = o + b,
          x = u[b].split("/")[5];
        null == x && (x = ""),
          "-" != x &&
            ((m += "<span class='ath-" + e + "-" + w + "'> " + x + "</span> "),
            w++),
          (word_arabic_indopak = v[3]),
          (word_arabic_uthmani = v[4]),
          (word_transliteration = v[5]),
          (word_translation = v[6]),
          (f =
            null != word_arabic_indopak ? word_arabic_indopak.split("") : "");
        var S = [
          "ؕ",
          "ۥ",
          "ۚ",
          "۪",
          "۠",
          "ۙ",
          "ؗ",
          "۫",
          "ۘ",
          "ۗ",
          "۬",
          "ۙ",
          "۬",
          "ۦ",
          "۩",
        ];
        -1 === S.indexOf(f[f.length - 1]) ||
          (S.indexOf(f[f.length - 1]),
          (word_arabic_indopak =
            "<span class='indopak-word-margin'>" +
            word_arabic_indopak +
            "</span>")),
          null != word_arabic_indopak &&
            (single_ayah_words +=
              "<span class=single-word data-word-number=" +
              T +
              " data-ts-mishary=" +
              C +
              " data-ts-husary=" +
              k +
              " data-ts-rifai=" +
              A +
              "><span class=word-arabic> <span class='word-arabic-uthmani-hafs' style='display:none;'>" +
              word_arabic_uthmani +
              "</span> <span class='word-arabic-indopak' style='display:none;'>" +
              word_arabic_indopak +
              "</span> </span><span class=word-transliteration>" +
              word_transliteration +
              "</span><span class=word-translation>" +
              word_translation +
              "</span></span>");
      }
      single_ayah_after =
        t == total_duas
          ? '</div></div><div class="row translation-row"><div class="col-1"></div><div class="col-10 ayah-tr ayah-transliteration"><span class="ayah-tr-heading">TRANSLITERATION</span><br><span class="ayah-transliteration-text">' +
            m +
            '</span></div><div class="col-10 ayah-tr ayah-translation" style="border-bottom:none; padding-top: 10px;"><span class="ayah-tr-heading">ENGLISH - SAHIH INTERNATIONAL</span><br><span class="ayah-translation-text">' +
            y +
            "</span></div></div></span>"
          : '</div></div><div class="row translation-row"><div class="col-1"></div><div class="col-10 ayah-tr ayah-transliteration"><span class="ayah-tr-heading">TRANSLITERATION</span><br><span class="ayah-transliteration-text">' +
            m +
            '</span></div><div class="col-10 ayah-tr ayah-translation" style="border-bottom:none; padding-top: 10px;"><span class="ayah-tr-heading">ENGLISH - SAHIH INTERNATIONAL</span><br><span class="ayah-translation-text">' +
            y +
            "</span></div></div></div>";
      var I = single_ayah_before + single_ayah_words + single_ayah_after;
      $(".ayahs-block").append(I);
    }
    update_fonts();
  });
}
function check_key(a) {
  "84" == (a = a || window.event).keyCode
    ? toggle_theme_mode()
    : "70" == a.keyCode
    ? toggle_text("font_type")
    : "68" == a.keyCode
    ? toggle_display_mode()
    : "83" == a.keyCode && $("#SettingsModal").modal("show");
}
function add_play_pause_icon(a) {
  "play" == a
    ? ($(".play-pause-icon").removeClass("pause-icon"),
      $(".play-pause-icon").addClass("play-icon"))
    : "pause" == a &&
      ($(".play-pause-icon").removeClass("play-icon"),
      $(".play-pause-icon").addClass("pause-icon"));
}
function update_arabic_word_type(a) {
  var t, s;
  for (
    total_ayahs_on_screen = parseInt($(".ayahs-block .ayah-single").length),
      first_ayah_on_screen_number = parseInt(
        $(".ayahs-block")
          .children()
          .first()
          .attr("id")
      ),
      last_ayah_on_screen_number =
        first_ayah_on_screen_number + total_ayahs_on_screen - 1,
      "old" == a ? (s = 0) : "new" == a && (s = 1),
      t = first_ayah_on_screen_number;
    t <= last_ayah_on_screen_number;
    t++
  ) {
    try {
      var e = current_arabic_data[t].split("//");
    } catch (a) {}
    for (
      var n = current_arabic_data[t].split("//").length, i = 0;
      i <= n - 1;
      i++
    ) {
      var r = e[i].split("/"),
        o = r[s],
        l = r[2],
        d = i + 1;
      word_type = "-" == l ? "pause" : "word";
      var h = i + 1;
      n - 1 < h && (h = n - 1);
      var c = e[h].split("/"),
        _ = c[s],
        u = c[2];
      (next_word_type = "-" == u ? "pause" : "word"),
        "word" == word_type &&
          ("pause" == next_word_type &&
            (o =
              "<span class='word-pause' title='pause'>" + _ + "</span> " + o),
          $(
            ".ayahs-block #" +
              t +
              " .ayah-row .single-ayah .single-word:nth-child(" +
              d +
              ") .word-arabic"
          ).html(o));
    }
  }
}
function update_word_translations(a, t, s) {
  a = word_translations[current_word_translation][1];
  var n, i;
  function e(a) {
    for (
      n = first_ayah_on_screen_number;
      n <= last_ayah_on_screen_number;
      n++
    ) {
      try {
        var t = a[n].split("//");
      } catch (a) {}
      var s = a[n].split("//").length;
      for (i = 0; i <= s - 1; i++) {
        var e = t[i].split("/")[0];
        $(
          "#" +
            surah_number +
            "-" +
            n +
            "-" +
            (i + 1) +
            ".single-word .word-translation"
        ).text(e);
      }
    }
  }
  (total_ayahs_on_screen = parseInt($(".ayahs-block .ayah-single").length)),
    (last_ayah_on_screen_number =
      null != t && null != s
        ? ((first_ayah_on_screen_number = t), s)
        : (first_ayah_on_screen_number = parseInt(
            $(".ayahs-block")
              .children()
              .first()
              .attr("id")
          )) +
          total_ayahs_on_screen -
          1),
    null == word_translations[current_word_translation][2]
      ? $.getJSON(
          "assets/data/" +
            surah_number +
            "/word-translations/" +
            a +
            ".json?v=" +
            json_version,
          function(a) {
            e((current_word_translation_data = a)),
              (word_translations[
                current_word_translation
              ][2] = current_word_translation_data);
          }
        )
      : e(word_translations[current_word_translation][2]),
    $(".word-translation.w1").text(
      font_preview_texts[current_word_translation][0]
    ),
    $(".word-translation.w2").text(
      font_preview_texts[current_word_translation][1]
    ),
    2 == current_word_translation
      ? $(".word-translation").addClass("font-urdu")
      : $(".word-translation").removeClass("font-urdu"),
    3 == current_word_translation
      ? $(".hindi-wbw-message").css("display", "block")
      : $(".hindi-wbw-message").css("display", "none");
}
function update_ayah_translations(a, t, s) {
  a = ayah_translations[current_ayah_translation][2];
  var e,
    n = ayah_translations[current_ayah_translation][0],
    i = ayah_translations[current_ayah_translation][1];
  function r(a) {
    for (
      $(".ayah-translation .ayah-tr-heading").text(n + " - " + i),
        e = first_ayah_on_screen_number;
      e <= last_ayah_on_screen_number;
      e++
    ) {
      var t = a[e];
      $("#" + e + " .ayah-translation-text").text(t);
    }
  }
  (total_ayahs_on_screen = parseInt($(".ayahs-block .ayah-single").length)),
    (last_ayah_on_screen_number =
      null != t && null != s
        ? ((first_ayah_on_screen_number = t), s)
        : (first_ayah_on_screen_number = parseInt(
            $(".ayahs-block")
              .children()
              .first()
              .attr("id")
          )) +
          total_ayahs_on_screen -
          1),
    null == ayah_translations[current_ayah_translation][5]
      ? $.getJSON(
          "assets/data/" +
            surah_number +
            "/ayah-translations/" +
            a +
            ".json?v=" +
            json_version,
          function(a) {
            r((current_ayah_translation_data = a)),
              (ayah_translations[
                current_ayah_translation
              ][5] = current_ayah_translation_data);
          }
        )
      : r(ayah_translations[current_ayah_translation][5]),
    (ayah_translation_direction =
      ayah_translations[current_ayah_translation][3]),
    $(".ayah-translation").css("direction", ayah_translation_direction),
    $(".ayah-translation").css("display", "block"),
    8 == current_ayah_translation ||
    9 == current_ayah_translation ||
    10 == current_ayah_translation ||
    11 == current_ayah_translation
      ? ($(".ayah-translation-text").css("display", "block"),
        $(".ayah-translation-text").css("padding-top", "20px"),
        $(".ayah-translation-text").addClass("font-urdu"))
      : ($(".ayah-translation-text").css("padding-top", "0px"),
        $(".ayah-translation-text").removeClass("font-urdu"));
}
function update_timestamps(a) {
  var s, e;
  function t(a) {
    for (
      s = first_ayah_on_screen_number;
      s <= last_ayah_on_screen_number;
      s++
    ) {
      word_timestamp_data = a[s].split("/");
      var t = word_timestamp_data.length;
      for (e = 0; e <= t - 1; e++)
        $(".ayahs-block #" + s + " .ayah-row .single-ayah")
          .children()
          .eq(e)
          .attr("data-ts", word_timestamp_data[e]);
    }
  }
  (total_ayahs_on_screen = parseInt($(".ayahs-block .ayah-single").length)),
    (first_ayah_on_screen_number = parseInt(
      $(".ayahs-block")
        .children()
        .first()
        .attr("id")
    )),
    (last_ayah_on_screen_number =
      first_ayah_on_screen_number + total_ayahs_on_screen - 1),
    null == reciters[current_reciter][3]
      ? $.getJSON(
          "assets/data/" +
            surah_number +
            "/word-timestamps/" +
            a +
            ".json?v=" +
            json_version,
          function(a) {
            t((current_word_timestamp_data = a)),
              (reciters[current_reciter][3] = current_word_timestamp_data);
          }
        )
      : t(reciters[current_reciter][3]);
}
function update_fonts() {
  var a = settings.arabic_font_size,
    t = settings.translation_font_size,
    s = settings.transliteration_font_size,
    e = settings.ayah_translation_font_size,
    n = settings.ayah_transliteration_font_size,
    i = (settings.current_font, settings.word_translation_display),
    r = settings.word_transliteration_display,
    o = settings.ayah_translation_display,
    l = settings.ayah_transliteration_display;
  setTimeout(function() {
    $(".word-arabic").css("font-size", a);
    try {
      30 < a.split("px")[0]
        ? $(".indopak-word-margin").css("margin-left", "25px")
        : a.split("px")[0] < 30 &&
          $(".indopak-word-margin").css("margin-left", "15px");
    } catch (a) {}
    $(".word-translation").css("font-size", t),
      $(".word-transliteration").css("font-size", s),
      $(".ayah-translation-text").css("font-size", e),
      $(".ayah-transliteration-text").css("font-size", n),
      "shown" == i
        ? toggle_word_transliteration_translation("word_translation", "show")
        : "hidden" == i &&
          toggle_word_transliteration_translation("word_translation", "hide"),
      "shown" == r
        ? toggle_word_transliteration_translation(
            "word_transliteration",
            "show"
          )
        : "hidden" == r &&
          toggle_word_transliteration_translation(
            "word_transliteration",
            "hide"
          ),
      "shown" == l
        ? toggle_ayah_transliteration_translation(
            "ayah_transliteration",
            "show"
          )
        : "hidden" == l &&
          toggle_ayah_transliteration_translation(
            "ayah_transliteration",
            "hide"
          ),
      "shown" == o
        ? toggle_ayah_transliteration_translation("ayah_translation", "show")
        : "hidden" == o &&
          toggle_ayah_transliteration_translation("ayah_translation", "hide"),
      null != a &&
        $(".word-arabic-font-size").text("(" + a.replace("px", "") + ")"),
      null != t &&
        $(".word-translation-font-size").text("(" + t.replace("px", "") + ")"),
      null != s &&
        $(".word-transliteration-font-size").text(
          "(" + s.replace("px", "") + ")"
        ),
      null != e &&
        $(".ayah-translation-font-size").text("(" + e.replace("px", "") + ")"),
      null != n &&
        $(".ayah-transliteration-font-size").text(
          "(" + n.replace("px", "") + ")"
        ),
      set_word_type((current_word_type = settings.current_word_type)),
      $("#select-word-type").val(current_word_type);
  }, 0),
    localStorage.setItem("settings", JSON.stringify(settings));
}
function modify_font(a, t) {
  var s, e, n;
  "word_arabic" == a
    ? ((n = parseInt($(".word-arabic").css("font-size"), 10)),
      "increase" == t
        ? (112 <= n ? (s = "112px") : ((s = n + 4 + "px"), (e = n + 4)),
          $(".word-arabic").css("font-size", s),
          $(".word-arabic-font-size").text("(" + s.replace("px", "") + ")"),
          30 < e && $(".indopak-word-margin").css("margin-left", "25px"))
        : "decrease" == t &&
          (n <= 16 ? (s = "16px") : ((s = n - 4 + "px"), (e = n - 4)),
          $(".word-arabic").css("font-size", s),
          $(".word-arabic-font-size").text("(" + s.replace("px", "") + ")"),
          e < 30 && $(".indopak-word-margin").css("margin-left", "15px")),
      (settings.arabic_font_size = s))
    : "word_translation" == a
    ? ((n = parseInt($(".word-translation").css("font-size"), 10)),
      "increase" == t
        ? ((s = 70 <= n ? "70px" : n + 2 + "px"),
          $(".word-translation").css("font-size", s),
          $(".word-translation-font-size").text(
            "(" + s.replace("px", "") + ")"
          ))
        : "decrease" == t
        ? ((s = n <= 8 ? "8px" : n - 2 + "px"),
          $(".word-translation").css("font-size", s),
          $(".word-translation-font-size").text(
            "(" + s.replace("px", "") + ")"
          ))
        : "toggle" == t &&
          ("visible" == $(".word-translation").css("visibility")
            ? toggle_word_transliteration_translation(
                "word_translation",
                "hide"
              )
            : "hidden" == $(".word-translation").css("visibility") &&
              toggle_word_transliteration_translation(
                "word_translation",
                "show"
              )),
      (settings.translation_font_size = s))
    : "word_transliteration" == a
    ? ((n = parseInt($(".word-transliteration").css("font-size"), 10)),
      "increase" == t
        ? ((s = 70 <= n ? "70px" : n + 2 + "px"),
          $(".word-transliteration").css("font-size", s),
          $(".word-transliteration-font-size").text(
            "(" + s.replace("px", "") + ")"
          ))
        : "decrease" == t
        ? ((s = n <= 8 ? "8px" : n - 2 + "px"),
          $(".word-transliteration").css("font-size", s),
          $(".word-transliteration-font-size").text(
            "(" + s.replace("px", "") + ")"
          ))
        : "toggle" == t &&
          ("visible" == $(".word-transliteration").css("visibility")
            ? toggle_word_transliteration_translation(
                "word_transliteration",
                "hide"
              )
            : "hidden" == $(".word-transliteration").css("visibility") &&
              toggle_word_transliteration_translation(
                "word_transliteration",
                "show"
              )),
      (settings.transliteration_font_size = s))
    : "ayah_translation" == a
    ? ((n = parseInt($(".ayah-translation-text").css("font-size"), 10)),
      "increase" == t
        ? ((s = n + 2 + "px"),
          $(".ayah-translation-text").css("font-size", s),
          $(".ayah-translation-font-size").text(
            "(" + s.replace("px", "") + ")"
          ))
        : "decrease" == t
        ? ((s = n <= 15 ? "15px" : n - 2 + "px"),
          $(".ayah-translation-text").css("font-size", s),
          $(".ayah-translation-font-size").text(
            "(" + s.replace("px", "") + ")"
          ))
        : "toggle" == t &&
          ("visible" == $(".ayah-translation").css("visibility")
            ? toggle_ayah_transliteration_translation(
                "ayah_translation",
                "hide"
              )
            : "hidden" == $(".ayah-translation").css("visibility") &&
              toggle_ayah_transliteration_translation(
                "ayah_translation",
                "show"
              )),
      (settings.ayah_translation_font_size = s))
    : "ayah_transliteration" == a &&
      ((n = parseInt($(".ayah-transliteration-text").css("font-size"), 10)),
      "increase" == t
        ? ((s = n + 2 + "px"),
          $(".ayah-transliteration-text").css("font-size", s),
          $(".ayah-transliteration-font-size").text(
            "(" + s.replace("px", "") + ")"
          ))
        : "decrease" == t
        ? ((s = n <= 15 ? "15px" : n - 2 + "px"),
          $(".ayah-transliteration-text").css("font-size", s),
          $(".ayah-transliteration-font-size").text(
            "(" + s.replace("px", "") + ")"
          ))
        : "toggle" == t &&
          ("visible" == $(".ayah-transliteration").css("visibility")
            ? toggle_ayah_transliteration_translation(
                "ayah_transliteration",
                "hide"
              )
            : "hidden" == $(".ayah-transliteration").css("visibility") &&
              toggle_ayah_transliteration_translation(
                "ayah_transliteration",
                "show"
              )),
      (settings.ayah_transliteration_font_size = s)),
    localStorage.setItem("settings", JSON.stringify(settings));
}
function toggle_word_transliteration_translation(a, t) {
  var s, e;
  "word_transliteration" == a
    ? "show" == t
      ? ($(".word-transliteration").css("visibility", "visible"),
        $(".btn-word-transliteration-toggle").text("Hide"),
        $(".btn-word-transliteration-size").css("display", "inline-block"),
        $(".btn-word-translation-toggle").attr("disabled", !1),
        $(".btn-word-transliteration-size").attr("disabled", !1),
        (s = "shown"),
        (settings.word_transliteration_display = s))
      : "hide" == t &&
        ($(".word-transliteration").css("visibility", "hidden"),
        $(".btn-word-transliteration-toggle").text("Show"),
        $(".btn-word-transliteration-size").css("display", "none"),
        $(".btn-word-translation-toggle").attr("disabled", !0),
        $(".btn-word-transliteration-size").attr("disabled", !0),
        (s = "hidden"),
        (settings.word_transliteration_display = s))
    : "word_translation" == a &&
      ("show" == t
        ? ($(".word-translation").css("visibility", "visible"),
          $(".btn-word-translation-toggle").text("Hide"),
          $(".btn-word-translation-size").css("display", "inline-block"),
          $(".btn-word-transliteration-toggle").attr("disabled", !1),
          $(".btn-word-translation-size").attr("disabled", !1),
          (e = "shown"),
          (settings.word_translation_display = e))
        : "hide" == t &&
          ($(".word-translation").css("visibility", "hidden"),
          $(".btn-word-translation-toggle").text("Show"),
          $(".btn-word-translation-size").css("display", "none"),
          $(".btn-word-transliteration-toggle").attr("disabled", !0),
          $(".btn-word-translation-size").attr("disabled", !0),
          (e = "hidden"),
          (settings.word_translation_display = e))),
    localStorage.setItem("settings", JSON.stringify(settings));
}
function toggle_ayah_transliteration_translation(a, t) {
  var s, e;
  "ayah_transliteration" == a
    ? "show" == t
      ? ($(".ayah-transliteration").css("visibility", "visible"),
        $(".ayah-transliteration").css("display", "block"),
        $(".btn-ayah-transliteration-toggle").text("Hide"),
        $(".btn-ayah-transliteration-size").css("display", "inline-block"),
        $(".btn-ayah-transliteration-size").attr("disabled", !1),
        (s = "shown"),
        (settings.ayah_transliteration_display = s))
      : "hide" == t &&
        ($(".ayah-transliteration").css("visibility", "hidden"),
        $(".ayah-transliteration").css("display", "none"),
        $(".btn-ayah-transliteration-toggle").text("Show"),
        $(".btn-ayah-transliteration-size").css("display", "none"),
        $(".btn-ayah-transliteration-size").attr("disabled", !0),
        (s = "hidden"),
        (settings.ayah_transliteration_display = s))
    : "ayah_translation" == a &&
      ("show" == t
        ? ($(".ayah-translation").css("visibility", "visible"),
          $(".ayah-translation").css("display", "block"),
          $(".btn-ayah-translation-toggle").text("Hide"),
          $(".btn-ayah-translation-size").css("display", "inline-block"),
          $(".btn-ayah-translation-size").attr("disabled", !1),
          (e = "shown"),
          (settings.ayah_translation_display = e))
        : "hide" == t &&
          ($(".ayah-translation").css("visibility", "hidden"),
          $(".ayah-translation").css("display", "none"),
          $(".btn-ayah-translation-toggle").text("Show"),
          $(".btn-ayah-translation-size").css("display", "none"),
          $(".btn-ayah-translation-size").attr("disabled", !0),
          (e = "hidden"),
          (settings.ayah_translation_display = e))),
    localStorage.setItem("settings", JSON.stringify(settings));
}
function change_theme(a) {
  $("body").css("transition", "all 0.5s"),
    $(".surah-nav-links").css("transition", "none"),
    1 == a
      ? ($("#darktheme").prop("disabled", !0),
        $("#pearltheme").prop("disabled", !0),
        (settings.current_theme = 1))
      : 2 == a
      ? ($("#pearltheme").length
          ? $("#pearltheme").prop("disabled", !1)
          : $("head").append(
              '<link rel="stylesheet" href="./assets/css/pearl.css?v=277" id="pearltheme"/>'
            ),
        $("#darktheme").prop("disabled", !0),
        (settings.current_theme = 2))
      : 3 == a &&
        ($("#darktheme").length
          ? $("#darktheme").prop("disabled", !1)
          : $("head").append(
              '<link rel="stylesheet" href="./assets/css/dark.css?v=277" id="darktheme"/>'
            ),
        $("#pearltheme").prop("disabled", !0),
        (settings.current_theme = 3)),
    (current_theme = settings.current_theme),
    $("#select-theme").val(current_theme),
    adjust_width("#select-theme"),
    $(".theme-pic").removeClass("theme-selected"),
    $(".theme-pic." + current_theme).addClass("theme-selected"),
    localStorage.setItem("settings", JSON.stringify(settings));
}
function set_dua_current_time(a) {
  8 == current_reciter
    ? (a.currentTime = duas_timestamp_mishary)
    : 7 == current_reciter
    ? (a.currentTime = duas_timestamp_husary)
    : 5 == current_reciter && (a.currentTime = duas_timestamp_rifai);
}
function remove_highlights() {
  $(".a").removeClass("ayah-hover"),
    $(".ayah-translation").removeClass("ayah-tr-hover"),
    $(".single-ayah").removeClass("ayah-hover"),
    $(".word-arabic").removeClass("word-arabic-hover"),
    $(".ayah-translation").removeClass("ayah-translation-hover"),
    $(".ath").removeClass("ayah-tr-highlight");
}
function set_word_type(a) {
  var t;
  1 == a
    ? ($(".word-arabic-uthmani-hafs").css("display", "inline-block"),
      $(".uthmani-pause-mark").css("display", "inline-block"),
      $(".indopak-pause-mark").css("display", "none"),
      $(".word-arabic-indopak").css("display", "none"),
      $(".word-pause").css("display", "none"),
      $(".sajda-icon").css("display", "none"),
      $(".indopak-message").css("display", "none"))
    : 2 == a
    ? ($(".word-arabic-indopak").css("display", "inline-block"),
      $(".indopak-pause-mark").css("display", "inline-block"),
      $(".uthmani-pause-mark").css("display", "none"),
      null == (t = localStorage.getItem("indopak-font-url")) || null === t
        ? $(".word-arabic-indopak").addClass("font-naskh-nastaleeq")
        : ($("head").prepend(
            '<style type="text/css">@font-face {\n\tfont-family: "IndoPak-URL";\n\tsrc: local(\'☺\'), url(\'' +
              t +
              "') format('truetype');\n}\n\t.font-naskh-nastaleeq-URL {\n\tfont-family: IndoPak-URL !important;\n}\n</style>"
          ),
          $(".word-arabic-indopak").addClass("font-naskh-nastaleeq-URL")),
      $(".word-arabic-indopak").removeClass("font-uthmani-nastaleeq"),
      $(".word-arabic-uthmani-hafs").css("display", "none"),
      $(".word-pause").css("display", "none"),
      $(".sajda-icon").css("display", "none"),
      $(".indopak-message").css("display", "inline-block"))
    : 3 == a
    ? ($(".word-arabic-indopak").css("display", "inline-block"),
      $(".indopak-pause-mark").css("display", "inline-block"),
      $(".uthmani-pause-mark").css("display", "none"),
      $(".word-arabic-indopak").addClass("font-uthmani-nastaleeq"),
      $(".word-arabic-indopak").removeClass("font-naskh-nastaleeq"),
      $(".word-arabic-uthmani-hafs").css("display", "none"),
      $(".word-pause").css("display", "none"),
      $(".sajda-icon").css("display", "none"),
      $(".indopak-message").css("display", "inline-block"))
    : 4 == a &&
      $.getJSON(
        "assets/data/" +
          surah_number +
          "/word-translations/arabic-mushaf.json?v=" +
          json_version,
        function(a) {
          (current_arabic_data = a),
            (mushaf_mode_enabled = !0),
            $(".ayahs-block").html(""),
            load_ayahs(1, 10 <= surah_ayahs ? 10 : surah_ayahs);
        }
      ),
    (settings.current_word_type = a),
    (current_word_type = a),
    localStorage.setItem("settings", JSON.stringify(settings));
}
function disable_screen_sleep() {
  var a = $(window).scrollTop();
  $(window).scrollTop(a + 5),
    (a = $(window).scrollTop()),
    $(window).scrollTop(a - 4),
    console.log("running...");
}
function save_location(a) {
  for (var t = 1; t <= surah_ayahs; t++)
    if ($(".single-ayah." + t).isInViewport()) {
      (settings.last_read_surah = surah_number),
        (settings.last_read_ayah = t - 1),
        localStorage.setItem("settings", JSON.stringify(settings));
      break;
    }
}
function apply_offline_settings() {
  $(".offline-message-block").css("display", "none"),
    $(".recitation-settings .accordion, .translation-settings .accordion").css(
      "opacity",
      "0.3"
    ),
    $(".recitation-settings .accordion, .translation-settings .accordion").css(
      "cursor",
      "not-allowed"
    ),
    $(".recitation-settings .btn-link, .translation-settings .btn-link").attr(
      "data-toggle",
      ""
    ),
    $(
      "#select-ayah-translation, #select-word-translation, #select-playing-options, #select-reciter, #select-playback-speed, #select-auto-scroll"
    ).attr("disabled", "true"),
    (1 == current_word_translation && 1 == current_ayah_translation) ||
      ((settings.current_word_translation = 1),
      (current_word_translation = 1),
      $("#select-word-translation").val(current_word_translation),
      update_word_translations(current_word_translation),
      (settings.current_ayah_translation = 1),
      (current_ayah_translation = 1),
      $("#select-ayah-translation").val(current_ayah_translation),
      update_ayah_translations(current_ayah_translation),
      localStorage.setItem("settings", JSON.stringify(settings)));
}
function check_user_connection() {
  var a;
  "localhost" != window.location.host
    ? ((a = "enabled" != settings.offline_mode),
      $.ajax({
        type: "GET",
        url: "https://messages.quranwbw.com/message.json",
        dataType: "json",
        cache: a,
        success: function(a) {
          (is_user_online = !0), check_for_message_popup(a);
        },
        error: function() {
          (is_user_online = !1), apply_offline_settings();
        },
      }))
    : (is_user_online = !0);
}
function check_for_changelog_popup() {
  null == settings.current_display_mode ||
    (null != settings.changelog_popup_version &&
      settings.changelog_popup_version == changelog_popup_version) ||
    ((settings.changelog_popup_version = changelog_popup_version),
    $("#updateModal").modal("show"),
    localStorage.setItem("settings", JSON.stringify(settings)));
}
function check_for_message_popup(a) {
  var t, s, e, n, i;
  0 != a.v &&
    ((t = a.v),
    (s = a.t),
    (e = a.b),
    "l" == (n = a.a)
      ? (i = "left")
      : "c" == n
      ? (i = "center")
      : "r" == n && (i = "right"),
    null == settings.api_message_version
      ? ((settings.api_message_version = t),
        $(".message-modal-title").text(s),
        $(".message-modal-body").text(e),
        $(".message-modal-body").css("text-align", i),
        $("#messageModal").modal("show"),
        localStorage.setItem("settings", JSON.stringify(settings)))
      : settings.api_message_version != t &&
        ((settings.api_message_version = t),
        $(".message-modal-title").text(s),
        $(".message-modal-body").text(e),
        $("#messageModal").modal("show"),
        localStorage.setItem("settings", JSON.stringify(settings))));
}
function _createForOfIteratorHelper(a, t) {
  var s;
  if ("undefined" == typeof Symbol || null == a[Symbol.iterator]) {
    if (
      Array.isArray(a) ||
      (s = _unsupportedIterableToArray(a)) ||
      (t && a && "number" == typeof a.length)
    ) {
      s && (a = s);
      function e() {}
      var n = 0;
      return {
        s: e,
        n: function() {
          return n >= a.length ? { done: !0 } : { done: !1, value: a[n++] };
        },
        e: function(a) {
          throw a;
        },
        f: e,
      };
    }
    throw new TypeError(
      "Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."
    );
  }
  var i,
    r = !0,
    o = !1;
  return {
    s: function() {
      s = a[Symbol.iterator]();
    },
    n: function() {
      var a = s.next();
      return (r = a.done), a;
    },
    e: function(a) {
      (o = !0), (i = a);
    },
    f: function() {
      try {
        r || null == s.return || s.return();
      } finally {
        if (o) throw i;
      }
    },
  };
}
function _unsupportedIterableToArray(a, t) {
  if (a) {
    if ("string" == typeof a) return _arrayLikeToArray(a, t);
    var s = Object.prototype.toString.call(a).slice(8, -1);
    return (
      "Object" === s && a.constructor && (s = a.constructor.name),
      "Map" === s || "Set" === s
        ? Array.from(a)
        : "Arguments" === s ||
          /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(s)
        ? _arrayLikeToArray(a, t)
        : void 0
    );
  }
}
function _arrayLikeToArray(a, t) {
  (null == t || t > a.length) && (t = a.length);
  for (var s = 0, e = new Array(t); s < t; s++) e[s] = a[s];
  return e;
}
function check_service_worker() {
  if ("serviceWorker" in navigator)
    try {
      navigator.serviceWorker.getRegistrations().then(function(a) {
        var t = a.length;
        if (1 == t) {
          if ("sw.js" == a[0].active.scriptURL.split("/")[3]) {
            try {
              var s,
                e = _createForOfIteratorHelper(a);
              try {
                for (e.s(); !(s = e.n()).done; ) {
                  s.value.unregister();
                }
              } catch (a) {
                e.e(a);
              } finally {
                e.f();
              }
            } catch (a) {}
            caches.keys().then(function(a) {
              var t,
                s = _createForOfIteratorHelper(a);
              try {
                for (s.s(); !(t = s.n()).done; ) {
                  var e = t.value;
                  caches.delete(e);
                }
              } catch (a) {
                s.e(a);
              } finally {
                s.f();
              }
            }),
              $(".offline-msg").text(sw_data_being_downloaded),
              navigator.serviceWorker.register("./sw-offline.js"),
              navigator.serviceWorker.addEventListener("message", function(a) {
                "registered" == a.data &&
                  ((settings.offline_mode = "enabled"),
                  $(".offline-msg").text(sw_data_downloaded),
                  $(".offline-msg").off(),
                  localStorage.setItem("settings", JSON.stringify(settings)));
              });
          } else if ("enabled" == settings.offline_mode)
            $(".offline-msg").text(sw_already_downloaded),
              $(".offline-msg").off(),
              $(".redownload-offline-files").css("display", "inline-block"),
              (settings.offline_mode = "enabled"),
              localStorage.setItem("settings", JSON.stringify(settings)),
              (offline_mode = "enabled");
          else if ("disabled" == settings.offline_mode)
            $(".offline-msg").text(sw_click_to_download),
              (settings.offline_mode = "disabled"),
              localStorage.setItem("settings", JSON.stringify(settings)),
              (offline_mode = "disabled");
          else if (null == settings.offline_mode) {
            var n,
              i = _createForOfIteratorHelper(a);
            try {
              for (i.s(); !(n = i.n()).done; ) {
                n.value.unregister();
              }
            } catch (a) {
              i.e(a);
            } finally {
              i.f();
            }
            caches.keys().then(function(a) {
              var t,
                s = _createForOfIteratorHelper(a);
              try {
                for (s.s(); !(t = s.n()).done; ) {
                  var e = t.value;
                  caches.delete(e);
                }
              } catch (a) {
                s.e(a);
              } finally {
                s.f();
              }
            }),
              $(".offline-msg").text(sw_click_to_download),
              (settings.offline_mode = "disabled"),
              localStorage.setItem("settings", JSON.stringify(settings)),
              (offline_mode = "disabled");
          }
        } else 0 == t && (navigator.serviceWorker.register("./sw-online.js"), $(".offline-msg").text(sw_click_to_download), (settings.offline_mode = "disabled"), localStorage.setItem("settings", JSON.stringify(settings)), (offline_mode = "disabled"));
      });
    } catch (a) {
      null == settings.offline_mode
        ? (navigator.serviceWorker.register("./sw-online.js"),
          (offline_mode = "disabled"),
          (settings.offline_mode = "disabled"),
          localStorage.setItem("settings", JSON.stringify(settings)))
        : (offline_mode = settings.offline_mode),
        "enabled" == offline_mode
          ? ($(".offline-msg").text(sw_already_downloaded),
            $(".offline-msg").off(),
            $(".redownload-offline-files").css("display", "inline-block"))
          : "disabled" == offline_mode &&
            $(".offline-msg").text(sw_click_to_download);
    }
  else
    "surah" == current_page &&
      1 == (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) &&
      $(".offline-msg").text(sw_switch_to_safari);
}
function capitalize_first_letter(a) {
  return a.charAt(0).toUpperCase() + a.slice(1);
}
function update_current_timestamps() {
  (current_word_timestamp =
    null != reciters[current_reciter][2] ? reciters[current_reciter][2] : ""),
    (settings.current_timestamp = current_word_timestamp),
    localStorage.setItem("settings", JSON.stringify(settings));
}
function adjust_width(a) {
  var t = $(a)
      .find("option:selected")
      .text(),
    s = $("<select/>").append($("<option/>").text(t));
  $(a).after(s), $(a).width(s.width()), s.remove();
}
function adjust_selecter_width() {}
$(window).on("load", function(a) {
  if (
    (console.log(
      "%cQURANWBW.COM",
      "font-size:30px;font-family:arial;font-weight:bold;color:#b1901f;"
    ),
    "" == location.pathname.split("/").slice(-1)[0])
  ) {
    var t, s, e, n, i;
    null != settings.last_read_surah &&
      ((t = surah_names_transliteration[settings.last_read_surah]),
      (s = settings.last_read_surah),
      (e = settings.last_read_ayah),
      localStorage.setItem("settings", JSON.stringify(settings)),
      $(".last-read-block").css("display", "block"),
      $(".last-read-surah").text(t),
      0 == e || 1 == e
        ? ((e = 1),
          $(".last-read-ayah").text(e + " "),
          $(".last-read-link.link").attr("href", s))
        : ($(".last-read-ayah").text(e + " "),
          0 == (n = e - 2) && (n = 1),
          (i = e + 2) > surah_total_ayahs[s] && (i = surah_total_ayahs[s]),
          $(".last-read-link.link").attr(
            "href",
            s + "#" + n + "-" + i + "#" + e
          )));
    for (var r = 1; r <= 114; r++) {
      var o =
        " <a href='" +
        r +
        "'><div class='table-row'><div> <span class='index-surah-no'>" +
        r +
        "</span><div class='main'><span class='title'>" +
        surah_names_transliteration[r] +
        " <span class='index-surahname-ar'>" +
        surah_names_arabic[r] +
        "</span></span><span class='subtitle'>" +
        surah_names_translation[r] +
        " <span style='float: right;'>" +
        surah_total_ayahs[r] +
        " ayahs</span></span></div></div></div></a>";
      $(".trio").append(o);
    }
    for (var l = 1; l <= 604; l++) {
      var d = "<option value='" + l + "'>" + l + "</option>";
      $("#homepage-select-page").append(d);
    }
    adjust_width("#homepage-select-page");
    for (l = 1; l <= 30; l++) {
      d = "<option value='" + l + "'>" + l + "</option>";
      $("#homepage-select-juz").append(d);
    }
    adjust_width("#homepage-select-juz");
    var _,
      h = !1;
    $("#search").on("input", function() {
      $("#result").html(""), $("#state").val("");
      var d = $("#search").val(),
        h = new RegExp(d, "i"),
        c = 0;
      3 <= d.length &&
        ($("#result").css("display", "block"),
        $("#surahs-list").css("display", "none"),
        $("#total-search-results").css("display", "block"),
        $.each(_, function(a, t) {
          var s, e, n, i, r, o, l;
          -1 != t.t.search(h) &&
            ((s = t.a),
            (e = t.t),
            (r = (i = s.split("-"))[0]),
            (o = i[1]),
            (l = (l = d).replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*")),
            (n = new RegExp("(" + l + ")", "gi")),
            300 < e.length &&
              (e =
                $.trim(e)
                  .substring(0, 300)
                  .trim(this) + "..."),
            (e = (e = e.replace(n, "<highlight>$1</highlight>")).replace(
              /(<highlight>[^<>]*)((<[^>]+>)+)([^<>]*<\/highlight>)/,
              "$1</highlight>$2<highlight>$4"
            )),
            $("#result").append(
              '<a href="' +
                r +
                "#" +
                o +
                '"><li class="list-group-item link-class"><span class="surah-ayah"> Surah ' +
                surah_names_transliteration[r] +
                " (" +
                r +
                "), Ayah " +
                o +
                " </span><br>" +
                e +
                "</li></a>"
            ),
            c++);
        }),
        $(window).scrollTop($(".search-box").offset().top),
        $("#total-search-results").text("Found " + c + " results"));
    }),
      $("#search").focus(function() {
        $("html, body").animate({ scrollTop: $(this).offset().top - 70 }, 1e3),
          $(this).attr("placeholder", "e.g. Ibrahim or Maryam"),
          0 == h &&
            $.getJSON("assets/data/translation.json", function(a) {
              (_ = a), (h = !0);
            });
      }),
      $("#search").focusout(function() {
        $(this).attr("placeholder", "Search for something in translations...");
      }),
      $("#search").on("input", function() {
        $(this).val().length <= 3 &&
          ($("#surahs-list").css("display", "block"),
          $("#result").css("display", "none"),
          $("#total-search-results").css("display", "none"));
      }),
      $.ajaxSetup({ cache: !0 });
  } else if ("duas" == location.pathname.split("/").slice(-1)[0]) {
    (current_page = "duas"),
      $(".loader").css("display", "none"),
      $(".a-s-n-i").css("display", "none"),
      $(".translation-settings .accordion").css("opacity", "0.3"),
      $(".translation-settings .accordion").css("cursor", "not-allowed"),
      $(".translation-settings .btn-link").attr("data-toggle", ""),
      $("#select-ayah-translation, #select-word-translation").attr(
        "disabled",
        "true"
      ),
      $(".offline-message")
        .parent()
        .css("display", "none"),
      $(".full-surah").css("padding-bottom", "0px"),
      $(".navbar-brand-surahname").html(
        "<span class='nav-surahname-tr'>Duas From Quran</span>"
      ),
      $(".play-this-ayah-button").css("margin-bottom", "0px"),
      $(".play-from-here-button").css("display", "none"),
      $(".play-this-ayah-button").text("Play This Dua"),
      $(".surah-list").addClass("duas-selector"),
      $(".surahSelector").text("Go to Dua "),
      $(".surahSelector").append('<span class="chevron-down"></span>'),
      $(".surah-list").empty();
    for (var c = 1; c <= total_duas; c++) {
      var u = duas_surahs[c][0],
        p = duas_surahs[c][1],
        y =
          "<a class='dropdown-item' data-s='" +
          u +
          "' data-a='" +
          p +
          "'>" +
          (c + ". " + surah_names_transliteration[u] + ", Ayah " + p) +
          "</a>";
      $(".surah-list").append(y);
    }
    update_settings(),
      load_duas(),
      update_fonts(),
      (document.onkeydown = check_key),
      $(window).scroll(function() {
        0 == checked_user_connection &&
          ((checked_user_connection = !0), check_user_connection());
      });
  } else {
    var g;
    (current_page = "surah"),
      update_surah_info(surah_number),
      null == settings.current_ayah_translation &&
        (settings.current_ayah_translation = 1),
      (current_ayah_translation = settings.current_ayah_translation),
      (ayah_translation_direction =
        ayah_translations[settings.current_ayah_translation][2]),
      null == settings.current_word_translation &&
        (settings.current_word_translation = 1),
      (current_word_translation =
        word_translations[settings.current_word_translation][1]),
      (g = 1 == mushaf_mode_enabled ? "arabic-mushaf" : "arabic"),
      $.when(
        $.getJSON(
          "assets/data/" +
            surah_number +
            "/word-translations/" +
            g +
            ".json?v=" +
            json_version,
          function(a) {
            current_arabic_data = a;
          }
        ),
        $.getJSON(
          "assets/data/" +
            surah_number +
            "/word-translations/" +
            current_word_translation +
            ".json?v=" +
            json_version,
          function(a) {
            (current_word_translation_data = a),
              (word_translations[
                current_word_translation
              ][2] = current_word_translation_data);
          }
        ),
        $.getJSON(
          "assets/data/" +
            surah_number +
            "/ayah-translations/" +
            ayah_translations[current_ayah_translation][2] +
            ".json?v=" +
            json_version,
          function(a) {
            (current_ayah_translation_data = a),
              (ayah_translations[
                current_ayah_translation
              ][5] = current_ayah_translation_data);
          }
        )
      ).then(function() {
        var a, t, s, e;
        window.location.hash
          ? ((a = window.location.hash.substr(1)).includes("-")
              ? ((hash_of_two_parts = !0),
                (t = a.split("-")),
                (s = parseInt(t[0])),
                (e = parseInt(t[1])),
                s < 1
                  ? (s = 1)
                  : surah_ayahs < e
                  ? (e = surah_ayahs)
                  : e < s && (s = e),
                (document.title =
                  surah_name_transliteration +
                  " (" +
                  surah_number +
                  ":" +
                  s +
                  "-" +
                  e +
                  ") - " +
                  surah_name_arabic +
                  " - " +
                  site_tagline),
                load_ayahs(s, e),
                s < surah_ayahs &&
                  e < surah_ayahs &&
                  $(".full-surah").after(continue_reading_button))
              : ((a = parseInt(window.location.hash.substr(1))),
                $.isNumeric(a) || (a = 1),
                a < 1 && (a = 1),
                surah_ayahs < a && (a = surah_ayahs),
                (document.title =
                  surah_name_transliteration +
                  " (" +
                  surah_number +
                  ":" +
                  a +
                  ") - " +
                  surah_name_arabic +
                  " - " +
                  site_tagline),
                load_ayahs(a, a),
                a < surah_ayahs &&
                  $(".full-surah").after(continue_reading_button),
                $(".continue-reading-btn").click()),
            (continue_reading_button_showing = !0))
          : load_ayahs(1, 10 <= surah_ayahs ? 10 : surah_ayahs),
          $(window).scroll(function() {
            var a, t;
            $(".surah-nav-margin").is(":visible") &&
              $(".continue-reading-btn").click(),
              $(window).scrollTop() + $(window).height() >
                $(document).height() - 1e3 &&
                0 == continue_reading_button_showing &&
                10 <= surah_ayahs &&
                ((a =
                  parseInt($(".ayahs-block .ayah-single:last").attr("id")) + 1),
                surah_ayahs < (t = a + 10 - 1) && (t = surah_ayahs),
                $(".single-ayah." + surah_ayahs).length ||
                  (load_ayahs(a, t),
                  surah_ayahs < (t = (a = t + 1) + 10 - 1) &&
                    (t = surah_ayahs)));
          }),
          1 == continue_reading_button_showing &&
            $(".continue-reading-btn").on("click", function() {
              var a =
                  parseInt($(".ayahs-block .ayah-single:last").attr("id")) + 1,
                t = a + 10 - 1;
              $(".single-ayah." + surah_ayahs).length ||
                (surah_ayahs < t && (t = surah_ayahs),
                load_ayahs(a, t),
                $(".surah-nav-margin").css("display", "none"),
                (continue_reading_button_showing = !1));
            });
      }),
      $(".loader").css("display", "none"),
      $(".surahSelector").append('<span class="chevron-down"></span>'),
      $(".ayahSelector").append('<span class="chevron-down"></span>'),
      $(".bismillah-div").append("<div class='bismillah'></div>"),
      $(".bottom-nav__item--prevsurah .surah-nav-links").prepend(
        '<span class="chevron-left"></span>'
      ),
      $(".bottom-nav__item--nextsurah .surah-nav-links").append(
        '<span class="chevron-right"></span>'
      ),
      $(".bottom-nav-surahplayer").prepend(
        '<span class="play-pause-icon play-icon"></span>'
      ),
      check_for_changelog_popup(),
      update_settings(),
      (document.onkeydown = check_key),
      "enabled" == settings.offline_mode &&
        (check_user_connection(), (checked_user_connection = !0)),
      $(window).scroll(function() {
        clearTimeout($.data(this, "save_location")),
          $.data(
            this,
            "save_location",
            setTimeout(function() {
              save_location(surah_name_transliteration);
            }, 250)
          ),
          0 == checked_user_connection &&
            ((checked_user_connection = !0), check_user_connection());
      });
  }
  check_service_worker();
}),
  ($.fn.isInViewport = function() {
    try {
      var a = $(this).offset().top;
    } catch (a) {}
    var t = a + $(this).outerHeight(),
      s = $(window).scrollTop(),
      e = s + $(window).height();
    return s < t && a < e;
  }),
  (function(r) {
    r(document).ready(function() {
      r(".fixed-top");
      var t,
        s = r(".nav-lg-screen"),
        e = r(".nav-sm-screen"),
        n = r(".bottom-nav"),
        i = 0;
      r(function() {
        r(window).scroll(function() {
          var a = r(this).scrollTop();
          991 < r(window).width()
            ? i < a && a > s.outerHeight() && "down" != t
              ? (r(window).width() < 700 || r(window).height() < 600) &&
                (s.stop().fadeOut(), n.stop().fadeOut(), (t = "down"))
              : a < i && "up" != t
              ? (r(window).width() < 700 || r(window).height() < 600) &&
                (s.stop().fadeIn(), n.stop().fadeIn(), (t = "up"))
              : r(window).scrollTop() + r(window).height() ==
                  r(document).height() &&
                (r(window).width() < 700 || r(window).height() < 600) &&
                (s.stop().fadeIn(), n.stop().fadeIn(), (t = "up"))
            : r(window).width() < 992 &&
              (i < a && a > e.outerHeight() && "down" != t
                ? (r(window).width() < 700 || r(window).height() < 600) &&
                  (e.stop().fadeOut(), n.stop().fadeOut(), (t = "down"))
                : a < i && "up" != t
                ? (r(window).width() < 700 || r(window).height() < 600) &&
                  (e.stop().fadeIn(), n.stop().fadeIn(), (t = "up"))
                : r(window).scrollTop() + r(window).height() ==
                    r(document).height() &&
                  (r(window).width() < 700 || r(window).height() < 600) &&
                  (e.stop().fadeIn(), n.stop().fadeIn(), (t = "up"))),
            (i = a);
        });
      });
    });
  })(jQuery),
  $(".container").on("click", ".ayah-selector .dropdown-item", function() {
    var a,
      t,
      s,
      e = $(this).attr("data-l");
    $("#" + e).length
      ? $("html, body").animate(
          { scrollTop: $("#" + e).offset().top - 30 },
          1e3
        )
      : ($(".ayahs-block").empty(),
        $("html, body").animate(
          { scrollTop: +$(".bismillah").offset().top },
          1e3
        ),
        (a = parseInt(e)),
        surah_ayahs < (t = a + 5) && (t = surah_ayahs),
        load_ayahs(a, t),
        t == surah_ayahs &&
          ($(".surah-nav-margin").css("display", "none"),
          (continue_reading_button_showing = !1)),
        (s =
          document.location.protocol +
          "//" +
          document.location.hostname +
          document.location.pathname),
        window.history.pushState("", "", s + "#" + a));
  }),
  $(".container").on("click", ".ayah-number-button", function() {
    var a = $(this)
      .parent()
      .parent()
      .parent()
      .attr("id");
    $("html, body").animate(
      { scrollTop: $(".single-ayah." + a).offset().top - 110 },
      1e3
    );
  }),
  $(".container").on("click", ".duas-selector .dropdown-item", function() {
    var a = $(this).attr("data-s"),
      t = $(this).attr("data-a");
    console.log(a),
      console.log(t),
      $("html, body").animate(
        { scrollTop: $(".ayah-" + t + ".ayah-single." + a).offset().top - 30 },
        1e3
      );
  }),
  $(".play-this-ayah-button").on("click", function() {
    function a() {
      for (
        var a = $(".single-ayah." + n + " .single-word").length, t = 0;
        t <= a;
        t++
      ) {
        var s = t - 1,
          e = n - 1;
        ("surah" == current_page
          ? $(".single-ayah." + n)
              .children()
              .eq(t)
              .attr("data-ts")
          : $(".single-ayah." + n)
              .children()
              .eq(t)
              .attr("data-ts-" + reciters[current_reciter][2])) <
          audio.currentTime &&
          (0 < t &&
            $(".single-ayah." + n)
              .children()
              .eq(s)
              .children(".word-arabic")
              .removeClass("word-arabic-hover"),
          $(".single-ayah." + n)
            .children()
            .eq(t)
            .children(".word-arabic")
            .addClass("word-arabic-hover"),
          $(".single-ayah." + e)
            .children()
            .eq(t)
            .children(".word-arabic")
            .removeClass("word-arabic-hover"),
          0 < t && $(".ath-" + n + "-" + s).removeClass("ayah-tr-highlight"),
          $(".ath-" + n + "-" + t).addClass("ayah-tr-highlight"));
      }
    }
    var t, s, n, e, i, r, o, l;
    $("#audioModal").modal("hide"),
      1 == is_user_online
        ? ("surah" == playing_which_audio &&
            (surah_audio.pause(),
            (is_surah_audio_paused = !0),
            add_play_pause_icon("play")),
          (is_audio_playing = !0),
          (playing_which_audio = "ayah"),
          ((t = event || window.event).cancelBubble = !0),
          t.stopPropagation && t.stopPropagation(),
          remove_highlights(),
          $(".play-ayah-button").css("display", "inline-block"),
          $(".stop-recitation-button").css("display", "none"),
          (s = play_button_surah),
          (n = play_button_ayah),
          (e = $("#" + n + " .ayah-transliteration-text").html()),
          (i = parseInt(n) + 1),
          $(".single-ayah." + n).addClass("ayah-hover"),
          (r = ("00" + s).slice(-3) + ("00" + n).slice(-3)),
          ("00" + s).slice(-3),
          ("00" + i).slice(-3),
          (o = ayah_audio_url + r + ".mp3"),
          "duas" == current_page
            ? $("html, body").animate(
                {
                  scrollTop:
                    $(this)
                      .parent()
                      .parent()
                      .parent()
                      .offset().top - 110,
                },
                1e3
              )
            : "surah" == current_page &&
              $("html, body").animate(
                { scrollTop: $(".single-ayah." + n).offset().top - 110 },
                1e3
              ),
          audio.pause(),
          (audio.currentTime = 0),
          audio.removeEventListener("timeupdate", a),
          (audio.src = o),
          audio.load(),
          (audio.playbackRate = current_playback_speed),
          "duas" == current_page
            ? ((l = !1),
              $(function() {
                $("audio").bind("canplay", function() {
                  0 == l &&
                    (set_dua_current_time(audio), (l = !0), audio.play());
                });
              }))
            : "surah" == current_page && audio.play(),
          $("#" + n + " .play-ayah-button").css("display", "none"),
          $("#" + n + " .stop-recitation-button").css(
            "display",
            "inline-block"
          ),
          null != reciters[current_reciter][2] &&
            audio.addEventListener("timeupdate", a),
          (audio.onended = function() {
            (is_audio_playing = !1),
              (playing_which_audio = "none"),
              audio.pause(),
              (audio.currentTime = 0),
              remove_highlights(),
              $("#" + n + " .ayah-transliteration-text").html(e),
              audio.removeEventListener("timeupdate", a),
              $("#" + n + " .play-ayah-button").css("display", "inline-block"),
              $("#" + n + " .ayah-audio-listen-stop-button").css(
                "display",
                "inline-block"
              ),
              $("#" + n + " .play-on-repeat-button").css(
                "display",
                "inline-block"
              ),
              $("#" + n + " .stop-recitation-button").css("display", "none");
          }))
        : $("#offlineModal").modal("show");
  }),
  $(".play-from-here-button").on("click", function() {
    $("#audioModal").modal("hide"),
      1 == is_user_online
        ? (audio.pause(),
          (audio.currentTime = 0),
          surah_audio.pause(),
          (surah_audio.currentTime = 0),
          (surah_audio.src = ""),
          (has_surah_audio_been_started = is_audio_playing = !1),
          (playing_which_audio = "none"),
          remove_highlights(),
          $(".play-pause-icon").removeClass("pause-icon"),
          $(".play-pause-icon").addClass("play-icon"),
          add_play_pause_icon("play"),
          $(".play-ayah-button").css("display", "inline-block"),
          $(".stop-recitation-button").css("display", "none"),
          (auto_play_number = play_button_ayah),
          $(".bottom-nav-surahplayer").click())
        : $("#offlineModal").modal("show");
  }),
  $(".play-on-repeat-button").on("click", function() {
    function t() {
      for (
        var a = $(".single-ayah." + ayah_ayah + " .single-word").length, t = 0;
        t <= a;
        t++
      ) {
        var s = t - 1,
          e = ayah_ayah - 1;
        ("surah" == current_page
          ? $(".single-ayah." + ayah_ayah)
              .children()
              .eq(t)
              .attr("data-ts")
          : $(".single-ayah." + ayah_ayah)
              .children()
              .eq(t)
              .attr("data-ts-" + reciters[current_reciter][2])) <
          audio.currentTime &&
          (0 < t &&
            $(".single-ayah." + ayah_ayah)
              .children()
              .eq(s)
              .children(".word-arabic")
              .removeClass("word-arabic-hover"),
          $(".single-ayah." + ayah_ayah)
            .children()
            .eq(t)
            .children(".word-arabic")
            .addClass("word-arabic-hover"),
          $(".single-ayah." + e)
            .children()
            .eq(t)
            .children(".word-arabic")
            .removeClass("word-arabic-hover"),
          0 < t &&
            $(".ath-" + ayah_ayah + "-" + s).removeClass("ayah-tr-highlight"),
          $(".ath-" + ayah_ayah + "-" + t).addClass("ayah-tr-highlight"));
      }
    }
    var a, s, e, n, i;
    $("#audioModal").modal("hide"),
      1 == is_user_online
        ? ("surah" == playing_which_audio &&
            (surah_audio.pause(),
            (is_surah_audio_paused = !0),
            add_play_pause_icon("play")),
          (is_audio_playing = !0),
          (playing_which_audio = "ayah"),
          ((a = event || window.event).cancelBubble = !0),
          a.stopPropagation && a.stopPropagation(),
          remove_highlights(),
          $(".ayah-number-button").css("opacity", "1"),
          $(".stop-recitation-button").css("display", "none"),
          (ayah_surah = play_button_surah),
          (ayah_ayah = play_button_ayah),
          (s = $("#" + ayah_ayah + " .ayah-transliteration-text").html()),
          $(".single-ayah." + ayah_ayah).addClass("ayah-hover"),
          (e = ("00" + ayah_surah).slice(-3) + ("00" + ayah_ayah).slice(-3)),
          (n = ayah_audio_url + e + ".mp3"),
          $("html, body").animate(
            { scrollTop: $(".single-ayah." + ayah_ayah).offset().top - 110 },
            1e3
          ),
          audio.pause(),
          (audio.currentTime = 0),
          audio.removeEventListener("timeupdate", t),
          (audio.src = n),
          audio.load(),
          (audio.playbackRate = current_playback_speed),
          "duas" == current_page
            ? ((i = !1),
              $(function() {
                $("audio").bind("canplay", function() {
                  0 == i &&
                    (set_dua_current_time(audio), (i = !0), audio.play());
                });
              }))
            : "surah" == current_page && audio.play(),
          $("#" + ayah_ayah + " .play-ayah-button").css("display", "none"),
          $("#" + ayah_ayah + " .stop-recitation-button").css(
            "display",
            "inline-block"
          ),
          null != reciters[current_reciter][2] &&
            audio.addEventListener("timeupdate", t),
          (audio.onended = function() {
            var a;
            (is_audio_playing = !1),
              (playing_which_audio = "none"),
              audio.pause(),
              (audio.currentTime = 0),
              remove_highlights(),
              $("#" + ayah_ayah + " .ayah-transliteration-text").html(s),
              audio.removeEventListener("timeupdate", t),
              $("html, body").animate(
                {
                  scrollTop: $(".single-ayah." + ayah_ayah).offset().top - 110,
                },
                1e3
              ),
              "duas" == current_page
                ? ((a = !1),
                  $(function() {
                    $("audio").bind("canplay", function() {
                      0 == a &&
                        (set_dua_current_time(audio), (a = !0), audio.play());
                    });
                  }))
                : "surah" == current_page &&
                  (audio.play(),
                  $("#" + ayah_ayah + " .play-ayah-button").css(
                    "display",
                    "none"
                  ),
                  $("#" + ayah_ayah + " .stop-recitation-button").css(
                    "display",
                    "inline-block"
                  )),
              audio.play(),
              null != reciters[current_reciter][2] &&
                audio.addEventListener("timeupdate", t);
          }))
        : $("#offlineModal").modal("show");
  }),
  $(".container").on("click", ".single-word", function() {
    var a, t, s, e, n, i, r;
    1 == is_user_online
      ? ("surah" == playing_which_audio &&
          (surah_audio.pause(),
          (is_surah_audio_paused = !0),
          add_play_pause_icon("play")),
        (is_audio_playing = !0),
        (playing_which_audio = "word"),
        ((a = event || window.event).cancelBubble = !0),
        a.stopPropagation && a.stopPropagation(),
        remove_highlights(),
        (t = $(this)
          .parent()
          .parent()
          .parent()
          .attr("class")
          .split(" ")[2]),
        (s = $(this)
          .parent()
          .parent()
          .parent()
          .attr("id")),
        (n = $(this).attr("data-word-number")),
        "duas" == current_page
          ? (e = n)
          : "surah" == current_page && (e = parseInt($(this).index()) + 1),
        $(".single-ayah#" + s + " .a")
          .children()
          .eq(e)
          .children(".word-arabic")
          .addClass("word-arabic-hover"),
        (i =
          t +
          "/" +
          ("00" + t).slice(-3) +
          "_" +
          ("00" + s).slice(-3) +
          "_" +
          ("00" + e).slice(-3)),
        (r = audio_url_words + i + ".mp3"),
        audio.pause(),
        (audio.currentTime = 0),
        (audio.src = r),
        audio.load(),
        audio.play(),
        $(this)
          .children(".word-arabic")
          .addClass("word-arabic-hover"),
        (audio.onended = function() {
          (is_audio_playing = !1),
            (playing_which_audio = "none"),
            audio.pause(),
            (audio.currentTime = 0),
            remove_highlights();
        }))
      : $("#offlineModal").modal("show");
  }),
  $("body").on(
    "click",
    ".play-ayah-translation-button, .ayah-translation",
    function() {
      $("#audioModal").modal("hide");
      var a,
        t,
        s,
        e,
        n,
        i = $(this)[0].classList[2];
      1 == is_user_online
        ? null != ayah_translations[current_ayah_translation][4] &&
          ("surah" == playing_which_audio &&
            ($("#surah-player")[0].pause(),
            (is_surah_audio_paused = !0),
            add_play_pause_icon("play")),
          (is_audio_playing = !0),
          (playing_which_audio = "translation"),
          ((a = event || window.event).cancelBubble = !0),
          a.stopPropagation && a.stopPropagation(),
          remove_highlights(),
          "ayah-translation" == i
            ? ((t = $(this)
                .parent()
                .parent()
                .attr("class")
                .split(" ")[2]),
              (s = $(this)
                .parent()
                .parent()
                .attr("id")))
            : "play-ayah-translation-button" == i &&
              ((t = play_button_surah), (s = play_button_ayah)),
          $(".single-ayah#" + s + " .ayah-translation").addClass(
            "ayah-translation-hover"
          ),
          (e = ("00" + t).slice(-3) + ("00" + s).slice(-3)),
          ("00" + t).slice(-3),
          (n = ayah_translations[current_ayah_translation][4] + e + ".mp3"),
          audio.pause(),
          (audio.currentTime = 0),
          (audio.src = n),
          audio.load(),
          audio.play(),
          $("#" + s + " .ayah-translation").addClass("ayah-tr-hover"),
          $("html, body").animate(
            { scrollTop: $("#" + s + " .ayah-translation").offset().top - 110 },
            1e3
          ),
          (audio.onended = function() {
            (is_audio_playing = !1),
              (playing_which_audio = "none"),
              audio.pause(),
              (audio.currentTime = 0),
              remove_highlights();
          }))
        : $("#offlineModal").modal("show");
    }
  ),
  $(".container").on("click", ".bottom-nav-surahplayer", function() {
    if (1 == is_user_online)
      if (
        ("surah" == current_page &&
          null != reciters[current_reciter][2] &&
          update_timestamps(current_word_timestamp),
        $(".play-pause-icon").hasClass("play-icon"))
      ) {
        if (
          "ayah" == playing_which_audio ||
          "word" == playing_which_audio ||
          "translation" == playing_which_audio ||
          "none" == playing_which_audio
        ) {
          if (
            ((is_audio_playing = !0),
            (playing_which_audio = "surah"),
            audio.pause(),
            (audio.currentTime = 0),
            (first_ayah_on_screen = parseInt(
              $(".ayahs-block")
                .children(".ayah-single")
                .first()
                .attr("id")
            )),
            1 == has_surah_audio_been_started)
          ) {
            (surah_audio.playbackRate = current_playback_speed),
              surah_audio.play();
            try {
              $("html, body").animate(
                {
                  scrollTop:
                    $(".single-ayah." + current_playing_ayah).offset().top -
                    115,
                },
                1e3
              );
            } catch (a) {}
            $(".surah-nav-margin").is(":visible") &&
              $(".continue-reading-btn").click();
          } else
            0 == has_surah_audio_been_started &&
              (auto_play_number
                ? ((has_surah_audio_been_started = !0),
                  play_ayah(auto_play_number))
                : ((has_surah_audio_been_started = !0),
                  play_ayah(first_ayah_on_screen)),
              $(".surah-nav-margin").is(":visible") &&
                $(".continue-reading-btn").click());
          $("#bottom-nav-surahayah").css("display", "inline-block"),
            add_play_pause_icon("pause"),
            (is_surah_audio_paused = !1);
        } else if ("surah" == playing_which_audio) {
          (surah_audio.playbackRate = current_playback_speed),
            surah_audio.play();
          try {
            $("html, body").animate(
              {
                scrollTop:
                  $(".single-ayah." + current_playing_ayah).offset().top - 115,
              },
              1e3
            );
          } catch (a) {}
          add_play_pause_icon("pause"),
            $(".surah-nav-margin").is(":visible") &&
              $(".continue-reading-btn").click();
        }
      } else
        $(".play-pause-icon").hasClass("pause-icon") &&
          "surah" == playing_which_audio &&
          (surah_audio.pause(),
          add_play_pause_icon("play"),
          (is_surah_audio_paused = !0));
    else $("#offlineModal").modal("show");
  }),
  $("body").on("click", ".theme-pic", function() {
    change_theme(
      $(this)
        .attr("class")
        .split(" ")[1]
    );
  }),
  $(".offline-msg").on("click", function() {
    "serviceWorker" in navigator &&
      ("disabled" == settings.offline_mode &&
        ($(".offline-msg").text(sw_data_being_downloaded),
        navigator.serviceWorker.register("./sw-offline.js"),
        navigator.serviceWorker.addEventListener("message", function(a) {
          "registered" == a.data &&
            ((settings.offline_mode = "enabled"),
            $(".offline-msg").text(sw_data_downloaded),
            localStorage.setItem("settings", JSON.stringify(settings)),
            $(this).removeClass("offline-msg"));
        })),
      localStorage.setItem("settings", JSON.stringify(settings)));
  }),
  $(".redownload-offline-files").on("click", function() {
    "serviceWorker" in navigator &&
      ($("redownload-offline-files").off(),
      $(".offline-msg").css("display", "none"),
      $(".redownload-offline-files").text(sw_data_being_downloaded),
      navigator.serviceWorker.register("./sw-online.js"),
      navigator.serviceWorker.register("./sw-offline.js"),
      navigator.serviceWorker.addEventListener("message", function(a) {
        "registered" == a.data &&
          ((settings.offline_mode = "enabled"),
          $(".redownload-offline-files").text(sw_data_downloaded),
          localStorage.setItem("settings", JSON.stringify(settings)));
      }),
      localStorage.setItem("settings", JSON.stringify(settings)));
  }),
  $("body").on("click", "#reset-settings", function() {
    var a, t;
    $("#reset-settings").text("Please refresh the page"),
      (a =
        null != settings.changelog_popup_version
          ? settings.changelog_popup_version
          : ""),
      (t =
        null != settings.api_message_version
          ? settings.api_message_version
          : "");
    var s = {
      offline_mode:
        "disabled" == settings.offline_mode || null == settings.offline_mode
          ? "disabled"
          : "enabled",
      current_theme: 1,
      changelog_popup_version: a,
      api_message_version: t,
    };
    window.localStorage.clear(),
      localStorage.setItem("settings", JSON.stringify(s));
  }),
  $(".container").on("click", ".stop-recitation-button", function() {
    (is_audio_playing = !1),
      (playing_which_audio = "none"),
      audio.pause(),
      (audio.currentTime = 0),
      remove_highlights(),
      $(".play-ayah-button").css("display", "inline-block"),
      $(".ayah-audio-listen-stop-button").css("display", "inline-block"),
      $(".play-on-repeat-button").css("display", "inline-block"),
      $(".stop-recitation-button").css("display", "none");
  }),
  $("#audio").on("click", function() {
    (audio.playbackRate = current_playback_speed), audio.play();
  }),
  $("#surah-audio").on("click", function() {
    (surah_audio.playbackRate = current_playback_speed), surah_audio.play();
  }),
  $(".container").on("click", ".play-ayah-button", function(a) {
    a.stopPropagation(),
      1 == is_user_online
        ? ("surah" == current_page &&
            null != reciters[current_reciter][2] &&
            update_timestamps(current_word_timestamp),
          "duas" == current_page
            ? ((play_button_surah = $(this)
                .parent()
                .parent()
                .parent()
                .attr("class")
                .split(" ")[2]),
              (play_button_ayah = $(this)
                .parent()
                .parent()
                .parent()
                .attr("id")),
              (duas_timestamp_mishary = $(this)
                .parent()
                .parent()
                .parent()
                .attr("data-ts-mishary")),
              (duas_timestamp_husary = $(this)
                .parent()
                .parent()
                .parent()
                .attr("data-ts-husary")),
              (duas_timestamp_rifai = $(this)
                .parent()
                .parent()
                .parent()
                .attr("data-ts-rifai")),
              (duas_timestamp_basit_mujawwad = $(this)
                .parent()
                .parent()
                .parent()
                .attr("data-ts-basit-mujawwad")),
              (duas_timestamp_basit_murattal = $(this)
                .parent()
                .parent()
                .parent()
                .attr("data-ts-basit-murattal")),
              $(".ayah-audio-modal-title").text(
                surah_names_transliteration[play_button_surah] +
                  ", Ayah " +
                  play_button_ayah
              ),
              $("#audioModal").modal("show"))
            : "surah" == current_page &&
              ((play_button_surah = surah_number),
              (play_button_ayah = $(this)
                .parent()
                .parent()
                .parent()
                .attr("id")),
              $(".ayah-audio-modal-title").text(
                surah_name_transliteration + ", Ayah " + play_button_ayah
              ),
              1 == play_ayah_button_choice
                ? $("#audioModal").modal("show")
                : 2 == play_ayah_button_choice
                ? $(".play-this-ayah-button").click()
                : 3 == play_ayah_button_choice
                ? $(".play-from-here-button").click()
                : 4 == play_ayah_button_choice
                ? $(".play-on-repeat-button").click()
                : $("#audioModal").modal("show")))
        : $("#offlineModal").modal("show");
  }),
  $(".container").on("click", ".ayah-button--disapear", function() {}),
  $("body").on("click", "#apply-url-font", function() {
    var a = $("#indopak-font-url").val();
    "" == a
      ? localStorage.removeItem("indopak-font-url")
      : localStorage.setItem("indopak-font-url", a),
      location.reload();
  }),
  $(document).on("click", function() {}),
  $("#SettingsModal").on("shown.bs.modal", function() {
    $("meta[name=viewport]").attr(
      "content",
      "width=device-width, initial-scale=1, shrink-to-fit=no, user-scalable=no"
    );
    var a = $(".fonts-preview").height();
    $(".fonts-preview").css("max-height", a + "px"),
      $(".fonts-preview").css("min-height", a + "px"),
      991 < $(window).width() &&
        (adjust_width("#select-word-translation"),
        adjust_width("#select-ayah-translation"),
        adjust_width("#select-word-type"),
        adjust_width("#select-font"),
        adjust_width("#select-theme"),
        adjust_width("#select-display-mode"),
        adjust_width("#select-playing-options"),
        adjust_width("#select-reciter"),
        adjust_width("#select-playback-speed"),
        adjust_width("#select-auto-scroll")),
      $(".theme-preview").html(
        '<img class="theme-pic 1" src="assets/images/t1.png"><img class="theme-pic 2" src="assets/images/t2.png"><img class="theme-pic 3" src="assets/images/t3.png">'
      ),
      $(".theme-pic." + current_theme).addClass("theme-selected");
    var t = localStorage.getItem("indopak-font-url");
    null == t || null === t
      ? $("#indopak-font-url").attr("placeholder", "Using default font")
      : $("#indopak-font-url").val(t);
  }),
  $("#SettingsModal").on("hidden.bs.modal", function() {
    $("meta[name=viewport]").attr(
      "content",
      "width=device-width, initial-scale=1, shrink-to-fit=no"
    );
  }),
  $("body").on("click", ".search-icon", function(a) {
    "none" == $(".search-box").css("display")
      ? $(".search-box").css("display", "block")
      : $(".search-box").css("display", "none");
  }),
  $("#collapse2").on("shown.bs.collapse", function() {
    adjust_width("#select-word-translation"),
      adjust_width("#select-ayah-translation");
  }),
  $("#collapse3").on("shown.bs.collapse", function() {
    adjust_width("#select-word-type"),
      adjust_width("#select-font"),
      adjust_width("#select-theme"),
      adjust_width("#select-display-mode");
  }),
  $("#collapse4").on("shown.bs.collapse", function() {
    adjust_width("#select-playing-options"),
      adjust_width("#select-reciter"),
      adjust_width("#select-playback-speed"),
      adjust_width("#select-auto-scroll");
  }),
  991 < $(window).width() &&
    $(".dropdown").hover(
      function() {
        $(this)
          .find(".dropdown-menu")
          .stop(!0, !0)
          .delay(100)
          .fadeIn(100);
      },
      function() {
        $(this)
          .find(".dropdown-menu")
          .stop(!0, !0)
          .delay(100)
          .fadeOut(100);
      }
    ),
  $(document).on("change", "#homepage-select-page", function() {
    var a, t, s;
    (selected_option = parseInt($("#homepage-select-page").val())),
      0 < selected_option &&
        ((t = (a = page_numbers[selected_option]).split(":")[0]),
        (s = a.split(":")[1]),
        window.location.replace("./" + t + "#" + s));
  }),
  $(document).on("change", "#homepage-select-juz", function() {
    var a, t, s;
    (selected_option = parseInt($("#homepage-select-juz").val())),
      0 < selected_option &&
        ((t = (a = juz_numbers[selected_option]).split(":")[0]),
        (s = a.split(":")[1]),
        window.location.replace("./" + t + "#" + s));
  }),
  $(document).on("change", "#select-reciter", function() {
    var a = parseInt($("#select-reciter").val());
    (ayah_audio_url = reciters[a][1]),
      (current_reciter = a),
      adjust_width(this),
      "surah" == current_page &&
        (update_current_timestamps(),
        null != reciters[current_reciter][2] &&
          update_timestamps(current_word_timestamp)),
      (settings.current_timestamp = current_word_timestamp),
      (settings.current_reciter = current_reciter),
      localStorage.setItem("settings", JSON.stringify(settings));
  }),
  $(document).on("change", "#select-display-mode", function() {
    var a = parseInt($("#select-display-mode").val());
    adjust_width(this),
      2 == a
        ? ($("#normalmode").length
            ? $("#normalmode").prop("disabled", !1)
            : $("head").append(
                '<link rel="stylesheet" href="../assets/css/normal.css?v=277" id="normalmode"/>'
              ),
          $(".btn-word-transliteration-toggle").attr("disabled", !0),
          $(".btn-word-transliteration-size").attr("disabled", !0),
          $(".btn-word-translation-toggle").attr("disabled", !0),
          $(".btn-word-translation-size").attr("disabled", !0),
          (settings.word_transliteration_translation_btns = "disabled"),
          toggle_word_transliteration_translation(
            "word_transliteration",
            "hide"
          ),
          toggle_word_transliteration_translation("word_translation", "hide"))
        : 1 == a &&
          ($("#normalmode").prop("disabled", !0),
          $(".btn-word-transliteration-toggle").attr("disabled", !1),
          $(".btn-word-transliteration-size").attr("disabled", !1),
          $(".btn-word-translation-toggle").attr("disabled", !1),
          $(".btn-word-translation-size").attr("disabled", !1),
          (settings.word_transliteration_translation_btns = "enabled"),
          toggle_word_transliteration_translation(
            "word_transliteration",
            "show"
          ),
          toggle_word_transliteration_translation("word_translation", "show")),
      (settings.current_display_mode = a),
      (current_display_mode = a),
      localStorage.setItem("settings", JSON.stringify(settings));
  }),
  $(document).on("change", "#select-playing-options", function() {
    var a = parseInt($("#select-playing-options").val());
    adjust_width(this),
      (settings.play_ayah_button_choice = a),
      (play_ayah_button_choice = settings.play_ayah_button_choice),
      localStorage.setItem("settings", JSON.stringify(settings));
  }),
  $(document).on("change", "#select-playback-speed", function() {
    var a = parseInt($("#select-playback-speed").val());
    adjust_width(this),
      (current_playback_speed = playback_speeds[a]),
      (settings.current_playback_speed = a),
      localStorage.setItem("settings", JSON.stringify(settings));
  }),
  $(document).on("change", "#select-theme", function() {
    var a = parseInt($("#select-theme").val());
    adjust_width(this),
      change_theme(a),
      (current_theme = settings.current_theme),
      localStorage.setItem("settings", JSON.stringify(settings));
  }),
  $(document).on("change", "#select-word-type", function() {
    (current_word_type = parseInt($("#select-word-type").val())),
      adjust_width(this),
      set_word_type(current_word_type),
      (settings.current_word_type = current_word_type),
      localStorage.setItem("settings", JSON.stringify(settings));
  }),
  $(document).on("change", "#select-ayah-translation", function() {
    var a = parseInt($("#select-ayah-translation").val());
    adjust_width(this),
      (current_ayah_translation = a),
      (settings.current_ayah_translation = current_ayah_translation),
      update_ayah_translations(ayah_translations[current_ayah_translation][1]),
      null == ayah_translations[current_ayah_translation][4]
        ? $(".play-ayah-translation-button").css("display", "none")
        : $(".play-ayah-translation-button").css("display", "inline-block"),
      localStorage.setItem("settings", JSON.stringify(settings));
  }),
  $(document).on("change", "#select-word-translation", function() {
    var a = parseInt($("#select-word-translation").val());
    adjust_width(this),
      (current_word_translation = a),
      (settings.current_word_translation = current_word_translation),
      update_word_translations(word_translations[current_word_translation][1]),
      localStorage.setItem("settings", JSON.stringify(settings));
  }),
  $(document).on("change", "#select-auto-scroll", function() {
    (auto_scroll = parseInt($("#select-auto-scroll").val())),
      adjust_width(this),
      (settings.auto_scroll = auto_scroll),
      localStorage.setItem("settings", JSON.stringify(settings));
  }),
  $(document).on("change", "#select-tajweed", function() {
    (tajweed_mode = parseInt($("#select-tajweed").val())),
      adjust_width(this),
      1 == tajweed_mode
        ? $(".tajweed").removeClass("tajweed-disabled")
        : 2 == tajweed_mode && $(".tajweed").addClass("tajweed-disabled"),
      (settings.tajweed_mode = tajweed_mode),
      localStorage.setItem("settings", JSON.stringify(settings));
  }),
  $(".accordion .btn.btn-link").on("click", function() {});
