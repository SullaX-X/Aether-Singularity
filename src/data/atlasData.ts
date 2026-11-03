export type GlossaryCategory = 'all' | 'etymology' | 'mechanics' | 'galaxies' | 'relativity';

export interface GlossaryTerm {
  id: string;
  title: string;
  originalGreekOrLatin?: string;
  category: Exclude<GlossaryCategory, 'all'>;
  categoryLabel: string;
  etymology?: string;
  historicalSense?: string;
  definition: string;
  formulaOrMetric?: string;
  chapterLink: string;
  chapterIndex?: number;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    id: 'astronomy',
    title: 'Астрономия',
    category: 'etymology',
    categoryLabel: 'Этимология',
    etymology: 'От греческих слов «астрон» (звезда) + «номос» (закон).',
    definition:
      'Буквально — «Закон звёзд». Наука о строении, движении и развитии небесных тел и всей Вселенной, основанная на точных наблюдениях и физике.',
    chapterLink: '#hero',
  },
  {
    id: 'planet',
    title: 'Планета',
    category: 'etymology',
    categoryLabel: 'Этимология',
    etymology: 'От древнегреческого «планетес» — «блуждающий», «странник».',
    historicalSense:
      'Древние греки называли так семь светил, которые перемещались на фоне неподвижных созвездий: Луна, Меркурий, Венера, Солнце, Марс, Юпитер и Сатурн.',
    definition:
      'В современной науке (с 2006 года): небесное тело, которое вращается вокруг Солнца, приняло круглую форму под собственной тяжестью и расчистило свою орбиту от других тел.',
    chapterLink: '#chapter-2',
  },
  {
    id: 'galaxy',
    title: 'Галактика и Млечный Путь',
    category: 'etymology',
    categoryLabel: 'Этимология',
    etymology: 'От греческого «гала» — молоко («молочный круг»).',
    definition:
      'Огромная система из сотен миллиардов звёзд, газа и тёмной материи. Светящаяся полоса Млечного Пути на ночном небе — это диск нашей собственной галактики, на который мы смотрим изнутри.',
    chapterLink: '#chapter-3',
  },
  {
    id: 'geocentrism',
    title: 'Геоцентрическая система мира',
    category: 'mechanics',
    categoryLabel: 'Орбиты и планеты',
    definition:
      'Древняя модель Вселенной (Аристотель, Птолемей), в которой неподвижная Земля находится в самом центре, а Солнце, Луна и планеты вращаются вокруг неё.',
    chapterLink: '#chapter-1',
  },
  {
    id: 'heliocentrism',
    title: 'Гелиоцентрическая система мира',
    category: 'mechanics',
    categoryLabel: 'Орбиты и планеты',
    definition:
      'Устройство Солнечной системы (Коперник, Кеплер, Галилей), в котором в центре расположено Солнце, а Земля и остальные планеты обращаются вокруг него.',
    chapterLink: '#chapter-1',
  },
  {
    id: 'geo-heliocentrism',
    title: 'Система мира Тихо Браге',
    category: 'mechanics',
    categoryLabel: 'Орбиты и планеты',
    definition:
      'Компромиссная модель 1588 года: Земля неподвижна в центре, вокруг неё летают Луна и Солнце, а все остальные планеты кружатся вокруг летящего Солнца.',
    chapterLink: '#chapter-1',
  },
  {
    id: 'deferent',
    title: 'Деферент',
    category: 'mechanics',
    categoryLabel: 'Орбиты и планеты',
    etymology: 'От латинского deferens — «несущий».',
    definition:
      'В модели Птолемея — большой основной круг вокруг Земли, по которому движется центр малого вспомогательного колеса (эпицикла).',
    chapterLink: '#chapter-1',
  },
  {
    id: 'epicycle',
    title: 'Эпицикл',
    category: 'mechanics',
    categoryLabel: 'Орбиты и планеты',
    etymology: 'От греческого «надкружие» (круг на круге).',
    definition:
      'Малое вспомогательное колесо в модели Птолемея. Планета крутится по эпициклу, а сам эпицикл катится по большому кругу (деференту). Придумано для объяснения петель Марса.',
    chapterLink: '#chapter-1',
  },
  {
    id: 'equant',
    title: 'Эквант',
    category: 'mechanics',
    categoryLabel: 'Орбиты и планеты',
    definition:
      'Особая смещённая точка внутри орбиты в системе Птолемея, из которой неравномерное движение планеты казалось бы равномерным.',
    chapterLink: '#chapter-1',
  },
  {
    id: 'retrograde',
    title: 'Попятное (ретроградное) движение',
    category: 'mechanics',
    categoryLabel: 'Орбиты и планеты',
    definition:
      'Видимое с Земли временное движение планеты назад по небу (петля). Возникает как оптический обман зрения в тот момент, когда Земля по внутренней орбите обгоняет более далёкую планету.',
    chapterLink: '#chapter-1',
  },
  {
    id: 'hydrostatic',
    title: 'Гидростатическое равновесие',
    category: 'mechanics',
    categoryLabel: 'Орбиты и планеты',
    definition:
      'Состояние, когда собственная сила тяжести небесного тела настолько велика, что сжимает каменную или ледяную породу со всех сторон в ровный шар.',
    chapterLink: '#chapter-2',
  },
  {
    id: 'cleared-neighborhood',
    title: 'Расчистка орбиты',
    category: 'mechanics',
    categoryLabel: 'Орбиты и планеты',
    definition:
      'Способность массивной планеты со временем притянуть к себе или выбросить прочь все мелкие камни и льдины со своей орбитальной дорожки. Главное правило, которое не прошёл Плутон.',
    chapterLink: '#chapter-2',
  },
  {
    id: 'dwarf-planet',
    title: 'Карликовая планета',
    category: 'mechanics',
    categoryLabel: 'Орбиты и планеты',
    definition:
      'Круглое небесное тело, которое вращается вокруг Солнца, но не смогло расчистить свою орбиту от соседей. К ним относятся Плутон, Эрида, Церера, Хаумеа и Макемаке.',
    chapterLink: '#chapter-2',
  },
  {
    id: 'kuiper-belt',
    title: 'Пояс Койпера',
    category: 'mechanics',
    categoryLabel: 'Орбиты и планеты',
    definition:
      'Огромное кольцо из тысяч ледяных глыб и карликовых планет на холодной окраине Солнечной системы сразу за орбитой Нептуна.',
    chapterLink: '#chapter-2',
  },
  {
    id: 'black-hole',
    title: 'Чёрная дыра',
    category: 'relativity',
    categoryLabel: 'Чёрные дыры',
    definition:
      'Область космоса с настолько гигантским притяжением, что вырваться из неё не может даже свет.',
    chapterLink: '#chapter-4',
  },
  {
    id: 'schwarzschild-radius',
    title: 'Радиус Шварцшильда (гравитационный радиус)',
    category: 'relativity',
    categoryLabel: 'Чёрные дыры',
    definition:
      'Размер, до которого нужно сжать тело, чтобы оно превратилось в чёрную дыру. Для Земли это шарик диаметром 9 миллиметров, а для Солнца — 3 километра.',
    chapterLink: '#chapter-4',
  },
  {
    id: 'event-horizon',
    title: 'Горизонт событий',
    category: 'relativity',
    categoryLabel: 'Чёрные дыры',
    definition:
      'Рубеж невозврата вокруг чёрной дыры. Всё, что пересекает эту границу, навсегда исчезает для внешнего наблюдателя.',
    chapterLink: '#chapter-4',
  },
  {
    id: 'accretion-disk',
    title: 'Аккреционный диск',
    category: 'relativity',
    categoryLabel: 'Чёрные дыры',
    definition:
      'Раскалённый вихрь из газа и плазмы, который крутится вокруг чёрной дыры с огромной скоростью и ярко светится из-за трения.',
    chapterLink: '#chapter-4',
  },
  {
    id: 'gravitational-lensing',
    title: 'Гравитационное линзирование',
    category: 'relativity',
    categoryLabel: 'Чёрные дыры',
    definition:
      'Искривление лучей света вблизи массивных тел. Из-за него мы видим заднюю часть диска чёрной дыры одновременно сверху и снизу.',
    chapterLink: '#chapter-4',
    chapterIndex: 4,
  },
  {
    id: 'singularity',
    title: 'Гравитационная сингулярность',
    category: 'relativity',
    categoryLabel: 'Чёрные дыры',
    definition:
      'Центральная точка внутри чёрной дыры, где вещество сжато до бесконечной плотности, а привычные законы физики перестают действовать.',
    chapterLink: '#chapter-4',
    chapterIndex: 4,
  },
  {
    id: 'aether',
    title: 'Квинтэссенция (Эфир)',
    category: 'etymology',
    categoryLabel: 'Этимология и античность',
    etymology: 'От древнегреческого αἰθήρ (айтхер) — «верхний чистый воздух», «пылающий».',
    historicalSense:
      'Аристотель считал эфир пятым элементом (квинтэссенцией), из которого сотканы небесные сферы и звёзды, в отличие от четырёх земных стихий.',
    definition:
      'Историческая концепция тончайшей субстанции, заполняющей всё надлунное пространство. В античности эфир объяснял вечное и неизменное круговое движение планет.',
    chapterLink: '#hero',
    chapterIndex: 0,
  },
  {
    id: 'armillary',
    title: 'Армиллярная сфера',
    category: 'mechanics',
    categoryLabel: 'Орбиты и астрометрия',
    etymology: 'От латинского armilla — «браслет», «кольцо».',
    historicalSense:
      'Использовалась Эратосфеном, Гиппархом и Птолемеем с III века до н.э., а позже доведена до совершенства Тихо Браге в обсерватории Ураниборг.',
    definition:
      'Главный прибор древней астрономии: скелетная модель небесной сферы из градуированных латунных колец (экватор, эклиптика, меридиан, кольца склонений), позволяющая определять координаты звёзд и планет.',
    chapterLink: '#hero',
    chapterIndex: 0,
  },
  {
    id: 'kepler-laws',
    title: 'Законы движения планет Кеплера',
    category: 'mechanics',
    categoryLabel: 'Орбиты и планеты',
    etymology: 'Сформулированы Иоганном Кеплером в 1609 («Новая астрономия») и 1619 («Гармония мира») годах.',
    definition:
      'Три эмпирических закона движения: 1) Планеты обращаются по эллипсам с Солнцем в одном из фокусов; 2) Радиус-вектор планеты за равные промежутки времени заметает равные площади; 3) Квадраты периодов обращения соотносятся как кубы больших полуосей орбит.',
    formulaOrMetric: 'T² / a³ = const = 4π² / G(M + m)',
    chapterLink: '#chapter-1',
    chapterIndex: 1,
  },
  {
    id: 'dark-matter',
    title: 'Тёмная материя и гало галактики',
    category: 'galaxies',
    categoryLabel: 'Галактики и звёзды',
    etymology: 'Термин введён Фрицем Цвикки (1933) и подтверждён измерениями Веры Рубин (1970).',
    definition:
      'Невидимая форма материи, не взаимодействующая со светом, но создающая гравитацию. В Млечном Пути она образует гигантское сферическое гало радиусом до 100 кпк, сохраняя плоскую кривую вращения звёзд на периферии.',
    formulaOrMetric: 'v(r) ≈ const ≈ 220 км/с (вместо кеплеровского спада v ∝ 1/√r)',
    chapterLink: '#chapter-3',
    chapterIndex: 3,
  },
  {
    id: 'density-wave',
    title: 'Волны плотности Лина — Шу',
    category: 'galaxies',
    categoryLabel: 'Галактики и звёзды',
    etymology: 'Теория сформулирована Ч. Линем и Ф. Шу в 1964 году.',
    definition:
      'Спиральные рукава галактик — это не застывшие материальные скопления звёзд, а квазистационарные волны сжатия межзвёздного газа. При прохождении волны газ сжимается, порождая бурные вспышки звездообразования.',
    chapterLink: '#chapter-3',
    chapterIndex: 3,
  },
  {
    id: 'ergosphere',
    title: 'Эргосфера чёрной дыры Керра',
    category: 'relativity',
    categoryLabel: 'Чёрные дыры',
    etymology: 'От греческого érgon — «работа» + «сфера». Область, из которой можно извлекать энергию вращения.',
    definition:
      'Область пространства вне горизонта событий вращающейся чёрной дыры, ограниченная статическим пределом. В эргосфере эффект Лензе — Тирринга закручивает само пространство-время так быстро, что ни один объект не может покоиться относительно удалённого наблюдателя.',
    formulaOrMetric: 'r_stat(θ) = M + √(M² - a² cos²θ)',
    chapterLink: '#chapter-4',
    chapterIndex: 4,
  },
];

export interface CelestialBodyCandidate {
  id: 'earth' | 'ganymede' | 'ceres' | 'pluto' | 'asteroid';
  name: string;
  subtitle: string;
  diameterKm: string;
  orbitZone: string;
  massRatioLabel: string;
  criteria: {
    orbitsSun: boolean;
    hydrostaticEquilibrium: boolean;
    clearedNeighborhood: boolean;
  };
  criteriaNotes: {
    orbitsSun: string;
    hydrostaticEquilibrium: string;
    clearedNeighborhood: string;
  };
  verdictTitle: string;
  verdictClass: 'planet' | 'dwarf' | 'satellite' | 'asteroid';
  verdictSummary: string;
  accentColor: string;
  hasPlutoDrama?: boolean;
}

export const IAU_CANDIDATES: CelestialBodyCandidate[] = [
  {
    id: 'pluto',
    name: 'Плутон',
    subtitle: 'Крупнейший объект в Поясе Койпера',
    diameterKm: 'Диаметр: 2 376 км',
    orbitZone: 'Окраина Солнечной системы',
    massRatioLabel: 'Всего 7% массы на своей орбите',
    criteria: {
      orbitsSun: true,
      hydrostaticEquilibrium: true,
      clearedNeighborhood: false,
    },
    criteriaNotes: {
      orbitsSun: 'Вращается вокруг Солнца (один оборот за 248 лет).',
      hydrostaticEquilibrium: 'Достаточно массивный, чтобы сжаться в ровный ледяной шар.',
      clearedNeighborhood:
        'Провал! Плутон весит лишь 7% от массы всех ледяных тел на его дорожке в Поясе Койпера.',
    },
    verdictTitle: 'Разжалован в Карликовые планеты',
    verdictClass: 'dwarf',
    verdictSummary:
      '76 лет считался девятой планетой, но не прошёл третье правило: он делит свою орбиту с тысячами других ледяных тел.',
    accentColor: '#FF5400',
    hasPlutoDrama: true,
  },
  {
    id: 'earth',
    name: 'Земля',
    subtitle: 'Третья планета от Солнца',
    diameterKm: 'Диаметр: 12 742 км',
    orbitZone: 'Внутренняя Солнечная система',
    massRatioLabel: 'В 1,7 млн раз тяжелее соседей',
    criteria: {
      orbitsSun: true,
      hydrostaticEquilibrium: true,
      clearedNeighborhood: true,
    },
    criteriaNotes: {
      orbitsSun: 'Обращается напрямую вокруг Солнца за 365 дней.',
      hydrostaticEquilibrium: 'Сила тяжести сжала породу в форму шара.',
      clearedNeighborhood:
        'Масса Земли в 1,7 миллиона раз больше всей пыли и камней на её орбите.',
    },
    verdictTitle: 'Настоящая планета',
    verdictClass: 'planet',
    verdictSummary:
      'Проходит все три правила без единого замечания. Полный гравитационный хозяин своей орбиты.',
    accentColor: '#4CC9F0',
  },
  {
    id: 'ganymede',
    name: 'Ганимед',
    subtitle: 'Спутник Юпитера (крупнее Меркурия!)',
    diameterKm: 'Диаметр: 5 268 км',
    orbitZone: 'Система Юпитера',
    massRatioLabel: 'Вращается вокруг Юпитера',
    criteria: {
      orbitsSun: false,
      hydrostaticEquilibrium: true,
      clearedNeighborhood: false,
    },
    criteriaNotes: {
      orbitsSun:
        'Провал! Вращается вокруг планеты Юпитер, а не напрямую вокруг Солнца.',
      hydrostaticEquilibrium: 'Огромный ровный ледяной шар (даже больше планеты Меркурий!).',
      clearedNeighborhood: 'Подчиняется притяжению гиганта Юпитера.',
    },
    verdictTitle: 'Спутник планеты',
    verdictClass: 'satellite',
    verdictSummary:
      'Хотя Ганимед крупнее планеты Меркурий, он кружится вокруг Юпитера, поэтому считается спутником.',
    accentColor: '#D4A373',
  },
  {
    id: 'ceres',
    name: 'Церера',
    subtitle: 'Главный пояс астероидов',
    diameterKm: 'Диаметр: 939 км',
    orbitZone: 'Между Марсом и Юпитером',
    massRatioLabel: 'Делит пояс с астероидами',
    criteria: {
      orbitsSun: true,
      hydrostaticEquilibrium: true,
      clearedNeighborhood: false,
    },
    criteriaNotes: {
      orbitsSun: 'Вращается вокруг Солнца между Марсом и Юпитером.',
      hydrostaticEquilibrium: 'Сил тяжести хватило, чтобы округлить тело в шар.',
      clearedNeighborhood:
        'Провал! Делит свою орбиту с миллионами каменных осколков пояса астероидов.',
    },
    verdictTitle: 'Карликовая планета',
    verdictClass: 'dwarf',
    verdictSummary:
      'Единственный круглый объект в поясе астероидов. В 2006 году получила тот же статус, что и Плутон.',
    accentColor: '#E9D8A6',
  },
  {
    id: 'asteroid',
    name: 'Мелкий астероид',
    subtitle: 'Каменные глыбы космоса',
    diameterKm: 'Размер: от 1 до 300 км',
    orbitZone: 'Пояс астероидов',
    massRatioLabel: 'Бесформенный камень',
    criteria: {
      orbitsSun: true,
      hydrostaticEquilibrium: false,
      clearedNeighborhood: false,
    },
    criteriaNotes: {
      orbitsSun: 'Вращается вокруг Солнца.',
      hydrostaticEquilibrium:
        'Провал! Притяжение слишком слабое, поэтому астероид остался бесформенным булыжником.',
      clearedNeighborhood: 'Не способен расчистить свою орбиту.',
    },
    verdictTitle: 'Малое тело (Астероид)',
    verdictClass: 'asteroid',
    verdictSummary:
      'Не проходит даже второе правило: у небольших камней не хватает гравитации, чтобы сжаться в шар.',
    accentColor: '#A0A0A0',
  },
];
