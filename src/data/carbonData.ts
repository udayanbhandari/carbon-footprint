/**
 * src/data/carbonData.ts
 * All static data for the Carbon Footprint Awareness Platform.
 * Activity categories, emission factors, quiz questions, climate timeline,
 * reduction tips, wizard steps, and language list.
 *
 * All constants are UPPER_SNAKE_CASE and defined at module level
 * (never inside components) per EFFICIENCY blueprint.
 */

import type {
  ActivityCategoryData,
  EmissionFactor,
  QuizQuestion,
  QuizResultConfig,
  TimelineEvent,
  ReductionTip,
  WizardStep,
  Language,
} from '../types';

// ─── Languages ────────────────────────────────────────────────────────────────

export const LANGUAGES: Language[] = [
  { code: 'en', label: 'English',    nativeLabel: 'English',    dir: 'ltr' },
  { code: 'es', label: 'Spanish',    nativeLabel: 'Español',    dir: 'ltr' },
  { code: 'fr', label: 'French',     nativeLabel: 'Français',   dir: 'ltr' },
  { code: 'de', label: 'German',     nativeLabel: 'Deutsch',    dir: 'ltr' },
  { code: 'hi', label: 'Hindi',      nativeLabel: 'हिन्दी',        dir: 'ltr' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português',  dir: 'ltr' },
  { code: 'zh', label: 'Chinese',    nativeLabel: '中文',         dir: 'ltr' },
  { code: 'ar', label: 'Arabic',     nativeLabel: 'العربية',      dir: 'rtl' },
  { code: 'ja', label: 'Japanese',   nativeLabel: '日本語',        dir: 'ltr' },
  { code: 'ko', label: 'Korean',     nativeLabel: '한국어',        dir: 'ltr' },
];

// ─── Navigation Items ─────────────────────────────────────────────────────────

export const NAV = [
  {
    to: '/chat',
    icon: '💬',
    label: 'Ask the AI',
    aria: 'Open carbon footprint AI assistant',
  },
  {
    to: '/tracker',
    icon: '📊',
    label: 'My Footprint',
    aria: 'View and track my carbon footprint',
  },
  {
    to: '/timeline',
    icon: '📅',
    label: 'Timeline',
    aria: 'Explore climate milestones timeline',
  },
  {
    to: '/quiz',
    icon: '🧪',
    label: 'Quiz',
    aria: 'Test my climate knowledge with a quiz',
  },
  {
    to: '/next-step',
    icon: '🎯',
    label: 'Next Steps',
    aria: 'Get my personalised carbon reduction plan',
  },
] as const;

// ─── Chat Suggestion Prompts ──────────────────────────────────────────────────

export const CHAT_SUGGESTIONS: string[] = [
  'What is a carbon footprint?',
  'How much CO₂ does flying produce?',
  'Is an electric car really greener?',
  'How can I reduce my food footprint?',
  'What is net zero and why does it matter?',
  'How does my footprint compare to average?',
  'What are carbon offsets?',
  'Which diet has the lowest emissions?',
];

// ─── Emission Factors (kg CO₂e per unit) ─────────────────────────────────────
// Sources: IPCC AR6, Our World in Data, UK DESNZ (2023), EPA (2023)

export const EMISSION_FACTORS: Record<string, EmissionFactor> = {
  // Transport — per km
  car_petrol:    { activityId: 'car_petrol',    kgCO2ePerUnit: 0.192, unit: 'km', source: 'UK DESNZ 2023', year: 2023 },
  car_diesel:    { activityId: 'car_diesel',    kgCO2ePerUnit: 0.171, unit: 'km', source: 'UK DESNZ 2023', year: 2023 },
  car_electric:  { activityId: 'car_electric',  kgCO2ePerUnit: 0.053, unit: 'km', source: 'UK DESNZ 2023', year: 2023 },
  motorcycle:    { activityId: 'motorcycle',    kgCO2ePerUnit: 0.114, unit: 'km', source: 'UK DESNZ 2023', year: 2023 },
  bus:           { activityId: 'bus',           kgCO2ePerUnit: 0.089, unit: 'km', source: 'UK DESNZ 2023', year: 2023 },
  train:         { activityId: 'train',         kgCO2ePerUnit: 0.041, unit: 'km', source: 'UK DESNZ 2023', year: 2023 },
  flight_short:  { activityId: 'flight_short',  kgCO2ePerUnit: 0.255, unit: 'km', source: 'ICAO 2023',     year: 2023 },
  flight_long:   { activityId: 'flight_long',   kgCO2ePerUnit: 0.195, unit: 'km', source: 'ICAO 2023',     year: 2023 },
  cycling:       { activityId: 'cycling',       kgCO2ePerUnit: 0.000, unit: 'km', source: 'N/A',           year: 2023 },
  walking:       { activityId: 'walking',       kgCO2ePerUnit: 0.000, unit: 'km', source: 'N/A',           year: 2023 },

  // Food — per kg of food consumed
  beef:          { activityId: 'beef',          kgCO2ePerUnit: 60.0,  unit: 'kg', source: 'Poore & Nemecek 2018', year: 2018 },
  lamb:          { activityId: 'lamb',          kgCO2ePerUnit: 24.0,  unit: 'kg', source: 'Poore & Nemecek 2018', year: 2018 },
  pork:          { activityId: 'pork',          kgCO2ePerUnit: 7.6,   unit: 'kg', source: 'Poore & Nemecek 2018', year: 2018 },
  chicken:       { activityId: 'chicken',       kgCO2ePerUnit: 6.9,   unit: 'kg', source: 'Poore & Nemecek 2018', year: 2018 },
  fish_farmed:   { activityId: 'fish_farmed',   kgCO2ePerUnit: 13.6,  unit: 'kg', source: 'Poore & Nemecek 2018', year: 2018 },
  eggs:          { activityId: 'eggs',          kgCO2ePerUnit: 4.8,   unit: 'kg', source: 'Poore & Nemecek 2018', year: 2018 },
  dairy_milk:    { activityId: 'dairy_milk',    kgCO2ePerUnit: 3.2,   unit: 'litre', source: 'Poore & Nemecek 2018', year: 2018 },
  cheese:        { activityId: 'cheese',        kgCO2ePerUnit: 21.0,  unit: 'kg', source: 'Poore & Nemecek 2018', year: 2018 },
  tofu:          { activityId: 'tofu',          kgCO2ePerUnit: 3.0,   unit: 'kg', source: 'Poore & Nemecek 2018', year: 2018 },
  lentils:       { activityId: 'lentils',       kgCO2ePerUnit: 0.9,   unit: 'kg', source: 'Poore & Nemecek 2018', year: 2018 },
  vegetables:    { activityId: 'vegetables',    kgCO2ePerUnit: 2.0,   unit: 'kg', source: 'Poore & Nemecek 2018', year: 2018 },
  rice:          { activityId: 'rice',          kgCO2ePerUnit: 4.0,   unit: 'kg', source: 'Poore & Nemecek 2018', year: 2018 },
  coffee:        { activityId: 'coffee',        kgCO2ePerUnit: 17.0,  unit: 'kg', source: 'Poore & Nemecek 2018', year: 2018 },
  food_waste:    { activityId: 'food_waste',    kgCO2ePerUnit: 2.5,   unit: 'kg', source: 'WRAP 2022',            year: 2022 },

  // Energy — electricity per kWh, gas per m³
  electricity_grid: { activityId: 'electricity_grid', kgCO2ePerUnit: 0.233, unit: 'kWh', source: 'UK DESNZ 2023', year: 2023 },
  electricity_solar: { activityId: 'electricity_solar', kgCO2ePerUnit: 0.041, unit: 'kWh', source: 'IPCC 2021', year: 2021 },
  natural_gas:   { activityId: 'natural_gas',   kgCO2ePerUnit: 2.04,  unit: 'm3',  source: 'UK DESNZ 2023', year: 2023 },
  heating_oil:   { activityId: 'heating_oil',   kgCO2ePerUnit: 2.52,  unit: 'litre', source: 'UK DESNZ 2023', year: 2023 },
  coal_heating:  { activityId: 'coal_heating',  kgCO2ePerUnit: 2.88,  unit: 'kg',  source: 'UK DESNZ 2023', year: 2023 },
  heat_pump:     { activityId: 'heat_pump',     kgCO2ePerUnit: 0.054, unit: 'kWh', source: 'Carbon Trust 2022', year: 2022 },

  // Shopping — per item / per £
  new_smartphone: { activityId: 'new_smartphone', kgCO2ePerUnit: 70.0,  unit: 'item', source: 'Apple LCA 2023', year: 2023 },
  new_laptop:     { activityId: 'new_laptop',     kgCO2ePerUnit: 330.0, unit: 'item', source: 'Dell LCA 2022',  year: 2022 },
  new_tshirt:     { activityId: 'new_tshirt',     kgCO2ePerUnit: 5.5,   unit: 'item', source: 'WRAP 2022',      year: 2022 },
  new_jeans:      { activityId: 'new_jeans',      kgCO2ePerUnit: 33.4,  unit: 'item', source: 'WRAP 2022',      year: 2022 },
  online_shopping: { activityId: 'online_shopping', kgCO2ePerUnit: 0.5,  unit: 'parcel', source: 'MIT 2019',  year: 2019 },
  streaming_hour: { activityId: 'streaming_hour', kgCO2ePerUnit: 0.036, unit: 'hour', source: 'IEA 2022',      year: 2022 },
};

// ─── Activity Categories with Activities ──────────────────────────────────────

export const ACTIVITY_CATEGORIES: ActivityCategoryData[] = [
  {
    id: 'transport',
    label: 'Transport',
    icon: '🚗',
    description: 'How you get around day-to-day',
    color: 'blue',
    activities: [
      {
        id: 'car_petrol',
        category: 'transport',
        label: 'Petrol car',
        description: 'Distance driven in a petrol/gasoline car per year',
        unit: 'km/year',
        icon: '🚗',
        defaultValue: 12000,
        emissionFactor: EMISSION_FACTORS.car_petrol.kgCO2ePerUnit,
      },
      {
        id: 'car_diesel',
        category: 'transport',
        label: 'Diesel car',
        description: 'Distance driven in a diesel car per year',
        unit: 'km/year',
        icon: '🚙',
        defaultValue: 12000,
        emissionFactor: EMISSION_FACTORS.car_diesel.kgCO2ePerUnit,
      },
      {
        id: 'car_electric',
        category: 'transport',
        label: 'Electric car',
        description: 'Distance driven in an electric vehicle per year',
        unit: 'km/year',
        icon: '⚡',
        defaultValue: 12000,
        emissionFactor: EMISSION_FACTORS.car_electric.kgCO2ePerUnit,
      },
      {
        id: 'motorcycle',
        category: 'transport',
        label: 'Motorcycle',
        description: 'Distance travelled by motorcycle per year',
        unit: 'km/year',
        icon: '🏍️',
        defaultValue: 3000,
        emissionFactor: EMISSION_FACTORS.motorcycle.kgCO2ePerUnit,
      },
      {
        id: 'bus',
        category: 'transport',
        label: 'Bus',
        description: 'Distance travelled by bus per year',
        unit: 'km/year',
        icon: '🚌',
        defaultValue: 2000,
        emissionFactor: EMISSION_FACTORS.bus.kgCO2ePerUnit,
      },
      {
        id: 'train',
        category: 'transport',
        label: 'Train / Metro',
        description: 'Distance travelled by train or metro per year',
        unit: 'km/year',
        icon: '🚆',
        defaultValue: 3000,
        emissionFactor: EMISSION_FACTORS.train.kgCO2ePerUnit,
      },
      {
        id: 'flight_short',
        category: 'transport',
        label: 'Short-haul flights',
        description: 'Flights under 3 hours (return counted as 2)',
        unit: 'flights/year',
        icon: '✈️',
        defaultValue: 2,
        emissionFactor: 255, // ~1000km avg short-haul × 0.255 per km
      },
      {
        id: 'flight_long',
        category: 'transport',
        label: 'Long-haul flights',
        description: 'Flights over 6 hours (return counted as 2)',
        unit: 'flights/year',
        icon: '🛫',
        defaultValue: 1,
        emissionFactor: 1950, // ~10,000km avg long-haul × 0.195 per km
      },
    ],
  },
  {
    id: 'food',
    label: 'Food & Diet',
    icon: '🍽️',
    description: 'What you eat and how much you waste',
    color: 'orange',
    activities: [
      {
        id: 'beef',
        category: 'food',
        label: 'Beef',
        description: 'Beef consumed per week (steaks, mince, burgers)',
        unit: 'kg/week',
        icon: '🥩',
        defaultValue: 0.5,
        emissionFactor: EMISSION_FACTORS.beef.kgCO2ePerUnit,
      },
      {
        id: 'lamb',
        category: 'food',
        label: 'Lamb',
        description: 'Lamb consumed per week',
        unit: 'kg/week',
        icon: '🍖',
        defaultValue: 0.2,
        emissionFactor: EMISSION_FACTORS.lamb.kgCO2ePerUnit,
      },
      {
        id: 'pork',
        category: 'food',
        label: 'Pork',
        description: 'Pork consumed per week (bacon, ham, sausages)',
        unit: 'kg/week',
        icon: '🥓',
        defaultValue: 0.3,
        emissionFactor: EMISSION_FACTORS.pork.kgCO2ePerUnit,
      },
      {
        id: 'chicken',
        category: 'food',
        label: 'Poultry',
        description: 'Chicken or turkey consumed per week',
        unit: 'kg/week',
        icon: '🍗',
        defaultValue: 0.5,
        emissionFactor: EMISSION_FACTORS.chicken.kgCO2ePerUnit,
      },
      {
        id: 'dairy_milk',
        category: 'food',
        label: 'Dairy milk',
        description: 'Cow\'s milk consumed or used per week',
        unit: 'litres/week',
        icon: '🥛',
        defaultValue: 2,
        emissionFactor: EMISSION_FACTORS.dairy_milk.kgCO2ePerUnit,
      },
      {
        id: 'cheese',
        category: 'food',
        label: 'Cheese',
        description: 'Cheese consumed per week',
        unit: 'kg/week',
        icon: '🧀',
        defaultValue: 0.2,
        emissionFactor: EMISSION_FACTORS.cheese.kgCO2ePerUnit,
      },
      {
        id: 'food_waste',
        category: 'food',
        label: 'Food waste',
        description: 'Food thrown away uneaten per week',
        unit: 'kg/week',
        icon: '🗑️',
        defaultValue: 1.0,
        emissionFactor: EMISSION_FACTORS.food_waste.kgCO2ePerUnit,
      },
    ],
  },
  {
    id: 'energy',
    label: 'Home Energy',
    icon: '⚡',
    description: 'Electricity, heating, and cooling your home',
    color: 'yellow',
    activities: [
      {
        id: 'electricity_grid',
        category: 'energy',
        label: 'Electricity (grid)',
        description: 'Annual electricity consumption from the grid',
        unit: 'kWh/year',
        icon: '💡',
        defaultValue: 3500,
        emissionFactor: EMISSION_FACTORS.electricity_grid.kgCO2ePerUnit,
      },
      {
        id: 'electricity_solar',
        category: 'energy',
        label: 'Solar electricity',
        description: 'Annual electricity from rooftop solar panels',
        unit: 'kWh/year',
        icon: '☀️',
        defaultValue: 0,
        emissionFactor: EMISSION_FACTORS.electricity_solar.kgCO2ePerUnit,
      },
      {
        id: 'natural_gas',
        category: 'energy',
        label: 'Natural gas (heating)',
        description: 'Annual natural gas consumption for heating and cooking',
        unit: 'm³/year',
        icon: '🔥',
        defaultValue: 1200,
        emissionFactor: EMISSION_FACTORS.natural_gas.kgCO2ePerUnit,
      },
      {
        id: 'heating_oil',
        category: 'energy',
        label: 'Heating oil',
        description: 'Annual heating oil consumption',
        unit: 'litres/year',
        icon: '🛢️',
        defaultValue: 0,
        emissionFactor: EMISSION_FACTORS.heating_oil.kgCO2ePerUnit,
      },
    ],
  },
  {
    id: 'shopping',
    label: 'Shopping & Lifestyle',
    icon: '🛍️',
    description: 'Purchases, digital usage, and consumer goods',
    color: 'purple',
    activities: [
      {
        id: 'new_smartphone',
        category: 'shopping',
        label: 'New smartphone',
        description: 'New smartphones purchased per year',
        unit: 'items/year',
        icon: '📱',
        defaultValue: 0.33, // ~1 every 3 years
        emissionFactor: EMISSION_FACTORS.new_smartphone.kgCO2ePerUnit,
      },
      {
        id: 'new_laptop',
        category: 'shopping',
        label: 'New laptop / computer',
        description: 'New laptops or desktop computers purchased per year',
        unit: 'items/year',
        icon: '💻',
        defaultValue: 0.2, // ~1 every 5 years
        emissionFactor: EMISSION_FACTORS.new_laptop.kgCO2ePerUnit,
      },
      {
        id: 'new_tshirt',
        category: 'shopping',
        label: 'New clothing (t-shirts)',
        description: 'New clothing items purchased per year (t-shirt equivalent)',
        unit: 'items/year',
        icon: '👕',
        defaultValue: 20,
        emissionFactor: EMISSION_FACTORS.new_tshirt.kgCO2ePerUnit,
      },
      {
        id: 'new_jeans',
        category: 'shopping',
        label: 'New jeans / trousers',
        description: 'New jeans or heavy trousers purchased per year',
        unit: 'items/year',
        icon: '👖',
        defaultValue: 3,
        emissionFactor: EMISSION_FACTORS.new_jeans.kgCO2ePerUnit,
      },
      {
        id: 'online_shopping',
        category: 'shopping',
        label: 'Online deliveries',
        description: 'Online shopping parcels received per week',
        unit: 'parcels/week',
        icon: '📦',
        defaultValue: 2,
        emissionFactor: EMISSION_FACTORS.online_shopping.kgCO2ePerUnit,
      },
      {
        id: 'streaming_hour',
        category: 'shopping',
        label: 'Video streaming',
        description: 'Hours of video streaming (Netflix, YouTube, etc.) per day',
        unit: 'hours/day',
        icon: '📺',
        defaultValue: 3,
        emissionFactor: EMISSION_FACTORS.streaming_hour.kgCO2ePerUnit,
      },
    ],
  },
];

// ─── Reference Averages (kg CO₂e per year) ───────────────────────────────────

export const CARBON_AVERAGES = {
  /** Global average per person (World Resources Institute 2023) */
  global: 4900,
  /** UK average per person (DESNZ 2023) */
  uk: 5500,
  /** USA average per person (EPA 2022) */
  usa: 14700,
  /** EU average per person (EEA 2022) */
  eu: 7800,
  /** India average per person (CEA 2022) */
  india: 1800,
  /** China average per person (NBS 2022) */
  china: 7400,
  /** 1.5°C compatible per-person budget by 2030 (Climate Action Tracker) */
  paris_target_2030: 2500,
  /** Net zero compatible per-person budget by 2050 */
  net_zero_2050: 700,
} as const;

// ─── Quiz Questions ───────────────────────────────────────────────────────────

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which food has the highest carbon footprint per kilogram?',
    options: ['Chicken', 'Beef', 'Pork', 'Tofu'],
    correctIndex: 1,
    explanation:
      'Beef produces around 60 kg CO₂e per kg — roughly 9× more than pork and 87× more than tofu. ' +
      'This is because cattle produce methane during digestion and require large amounts of land and feed.',
    difficulty: 'easy',
    category: 'food',
    funFact: 'If everyone stopped eating beef, global food emissions could drop by up to 14%.',
  },
  {
    id: 'q2',
    question: 'A single return long-haul flight (e.g. London → New York) emits roughly how much CO₂e per passenger?',
    options: ['200 kg', '800 kg', '1.7 tonnes', '5 tonnes'],
    correctIndex: 2,
    explanation:
      'A return transatlantic flight emits approximately 1.6–1.9 tonnes CO₂e per passenger, ' +
      'including radiative forcing effects at altitude. This exceeds the entire annual carbon budget ' +
      'compatible with 1.5°C warming for many people in low-income countries.',
    difficulty: 'medium',
    category: 'transport',
    funFact: 'The aviation industry accounts for about 2.5% of global CO₂ emissions, but 3.5–4% of effective warming when altitude effects are included.',
  },
  {
    id: 'q3',
    question: 'What is the global average carbon footprint per person per year?',
    options: ['~1 tonne', '~5 tonnes', '~10 tonnes', '~20 tonnes'],
    correctIndex: 1,
    explanation:
      'The global average is approximately 4–5 tonnes CO₂e per person per year. ' +
      'However, this varies enormously — from under 1 tonne in some low-income countries ' +
      'to over 15 tonnes in high-income nations like the USA.',
    difficulty: 'medium',
    category: 'general',
    funFact: 'To limit warming to 1.5°C, the average person needs to reach around 2 tonnes CO₂e per year by 2030.',
  },
  {
    id: 'q4',
    question: 'Which home heating system has the lowest carbon footprint?',
    options: ['Gas boiler', 'Oil boiler', 'Electric heat pump', 'Coal fire'],
    correctIndex: 2,
    explanation:
      'Air-source and ground-source heat pumps are 3–5× more efficient than gas boilers. ' +
      'They emit roughly 54 g CO₂e per kWh of heat delivered (on the UK grid), compared to ' +
      '~200 g for a gas boiler. As grids get cleaner, heat pumps improve further.',
    difficulty: 'easy',
    category: 'energy',
  },
  {
    id: 'q5',
    question: 'How much of global greenhouse gas emissions come from food systems?',
    options: ['Around 5%', 'Around 15%', 'Around 26%', 'Around 40%'],
    correctIndex: 2,
    explanation:
      'Food systems account for around 26% of global greenhouse gas emissions, according to ' +
      'Poore & Nemecek (2018). This includes farming, land use change, processing, transport, ' +
      'retail, cooking, and food waste.',
    difficulty: 'hard',
    category: 'food',
    funFact: 'Half of all habitable land on Earth is used for agriculture.',
  },
  {
    id: 'q6',
    question: 'An electric vehicle (EV) charged on average UK grid electricity emits how much CO₂e per km compared to a petrol car?',
    options: ['About the same', '~3× less', '~4× less', 'Zero — it\'s electric'],
    correctIndex: 2,
    explanation:
      'An average petrol car emits ~192 g CO₂e/km. An EV on the UK grid emits ~53 g CO₂e/km — ' +
      'about 4× less. EVs are truly zero-emission only when charged from 100% renewable electricity.',
    difficulty: 'medium',
    category: 'transport',
    funFact: 'Manufacturing an EV produces ~50% more emissions than a petrol car, but this "carbon debt" is repaid within 2–4 years of driving.',
  },
  {
    id: 'q7',
    question: 'Which of these actions saves the most CO₂e per year for the average person?',
    options: [
      'Switching to LED bulbs',
      'Recycling all household waste',
      'Going car-free',
      'Taking shorter showers',
    ],
    correctIndex: 2,
    explanation:
      'Going car-free saves approximately 2 tonnes CO₂e per year — by far the largest single lifestyle ' +
      'change most people can make. LED bulbs save ~60 kg, recycling ~210 kg, and shorter showers ~25 kg per year.',
    difficulty: 'medium',
    category: 'transport',
    funFact: 'A 2017 study in Environmental Research Letters found that having one fewer child saves ~58 tonnes CO₂e per year — but this is a deeply personal decision.',
  },
  {
    id: 'q8',
    question: 'What does "net zero" mean?',
    options: [
      'Producing zero carbon emissions',
      'Offsetting all emissions with tree planting',
      'Balancing emissions produced with emissions removed from the atmosphere',
      'Using 100% renewable energy',
    ],
    correctIndex: 2,
    explanation:
      'Net zero means balancing the amount of greenhouse gases emitted with the amount removed from the atmosphere. ' +
      'This can be achieved through reducing emissions AND carbon capture/removal. ' +
      'It is NOT the same as zero emissions — some hard-to-abate sectors may still emit.',
    difficulty: 'easy',
    category: 'general',
  },
  {
    id: 'q9',
    question: 'Which sector is the largest source of global greenhouse gas emissions?',
    options: ['Transport', 'Agriculture', 'Buildings', 'Energy (electricity & heat)'],
    correctIndex: 3,
    explanation:
      'Energy production for electricity and heat accounts for ~34% of global GHG emissions — ' +
      'the single largest sector. Transport accounts for ~16%, agriculture ~19%, and buildings ~6%. ' +
      'Transitioning to clean electricity is therefore critical.',
    difficulty: 'hard',
    category: 'general',
    funFact: 'Solar and wind electricity now generate more than 12% of global electricity and are the fastest-growing energy sources in history.',
  },
  {
    id: 'q10',
    question: 'How many trees would you need to plant to offset 1 tonne of CO₂?',
    options: ['About 5', 'About 40–50', 'About 100', 'About 1,000'],
    correctIndex: 1,
    explanation:
      'A young tree absorbs roughly 21 kg CO₂ per year. To offset 1 tonne (1,000 kg) over 10 years, ' +
      'you\'d need approximately 48 trees — and they must grow for decades. This is why carbon offsetting ' +
      'through forestry is not a substitute for cutting emissions at source.',
    difficulty: 'hard',
    category: 'general',
    funFact: 'Scientists estimate restoring forests on an area the size of the USA could absorb 25% of current CO₂ emissions — but this would take 50–100 years.',
  },
];

// ─── Quiz Result Configurations ───────────────────────────────────────────────

export const QUIZ_RESULT_CONFIG: QuizResultConfig[] = [
  {
    minScore: 9,
    maxScore: 10,
    label: 'Climate Champion! 🏆',
    description: 'Outstanding! You have an expert-level understanding of carbon emissions and climate science. Share your knowledge to inspire others.',
    icon: '🏆',
    color: 'green',
  },
  {
    minScore: 7,
    maxScore: 8,
    label: 'Eco Expert 🌿',
    description: 'Impressive! You know your carbon science well. A few areas to explore further — check the timeline for more context.',
    icon: '🌿',
    color: 'emerald',
  },
  {
    minScore: 5,
    maxScore: 6,
    label: 'Sustainability Learner 🌱',
    description: 'Good effort! You have a solid foundation. Explore the tracker and AI chat to deepen your understanding.',
    icon: '🌱',
    color: 'teal',
  },
  {
    minScore: 3,
    maxScore: 4,
    label: 'Carbon Curious 🔍',
    description: 'A great start! Carbon science has many surprising facts. Try the AI assistant to explore the topics where you guessed.',
    icon: '🔍',
    color: 'amber',
  },
  {
    minScore: 0,
    maxScore: 2,
    label: 'Just Getting Started 🌎',
    description: 'Everyone starts somewhere! The most important step is caring. Use the chat and tracker to begin your sustainability journey.',
    icon: '🌎',
    color: 'orange',
  },
];

// ─── Climate Timeline Events ──────────────────────────────────────────────────

export const CLIMATE_TIMELINE: TimelineEvent[] = [
  {
    id: 'tl1',
    year: 1856,
    title: 'Eunice Newton Foote discovers the greenhouse effect',
    description: 'American scientist Eunice Newton Foote first demonstrates that CO₂ traps heat, laying the groundwork for climate science.',
    status: 'done',
    type: 'scientific',
    icon: '🔬',
  },
  {
    id: 'tl2',
    year: 1896,
    title: 'Arrhenius quantifies the CO₂–temperature link',
    description: 'Swedish chemist Svante Arrhenius calculates that doubling atmospheric CO₂ would raise global temperature by 5–6°C — remarkably close to modern estimates.',
    status: 'done',
    type: 'scientific',
    icon: '📊',
  },
  {
    id: 'tl3',
    year: 1958,
    title: 'Keeling Curve begins',
    description: 'Charles David Keeling begins continuous measurements of atmospheric CO₂ at Mauna Loa Observatory, Hawaii. The resulting dataset becomes the gold standard of climate science.',
    status: 'done',
    type: 'scientific',
    icon: '📈',
  },
  {
    id: 'tl4',
    year: 1972,
    title: 'UN Stockholm Conference on the Human Environment',
    description: 'The first major international environmental conference, establishing the UN Environment Programme (UNEP) and placing the environment on the global political agenda.',
    status: 'done',
    type: 'political',
    icon: '🌍',
  },
  {
    id: 'tl5',
    year: 1988,
    title: 'IPCC founded',
    description: 'The Intergovernmental Panel on Climate Change (IPCC) is established by the UN to provide policymakers with regular scientific assessments of climate change.',
    status: 'done',
    type: 'political',
    icon: '🏛️',
  },
  {
    id: 'tl6',
    year: 1992,
    title: 'UN Framework Convention on Climate Change (UNFCCC)',
    description: 'At the Rio Earth Summit, countries agree to the UNFCCC — the first international treaty explicitly addressing climate change. 197 parties have now ratified it.',
    status: 'done',
    type: 'political',
    icon: '✍️',
  },
  {
    id: 'tl7',
    year: 1997,
    title: 'Kyoto Protocol adopted',
    description: 'The first international agreement with binding emission reduction targets for developed countries. The USA never ratified it; Canada later withdrew.',
    status: 'done',
    type: 'political',
    icon: '📜',
  },
  {
    id: 'tl8',
    year: 2005,
    title: 'Kyoto Protocol enters into force',
    description: 'After Russia ratifies in 2004, the Kyoto Protocol becomes legally binding. It set the template for future carbon markets and national reporting.',
    status: 'done',
    type: 'political',
    icon: '⚖️',
  },
  {
    id: 'tl9',
    year: 2007,
    title: 'IPCC Fourth Assessment Report & Nobel Peace Prize',
    description: 'The IPCC AR4 concludes warming is "unequivocal" and very likely caused by humans. The IPCC shares the Nobel Peace Prize with Al Gore.',
    status: 'done',
    type: 'scientific',
    icon: '🏅',
  },
  {
    id: 'tl10',
    year: 2010,
    title: 'Cancún Agreements',
    description: 'Countries formally recognise the 2°C warming limit as a global goal and establish the Green Climate Fund to support developing nations.',
    status: 'done',
    type: 'political',
    icon: '🌡️',
  },
  {
    id: 'tl11',
    year: 2013,
    title: 'Atmospheric CO₂ passes 400 ppm',
    description: 'For the first time in at least 3 million years, atmospheric CO₂ concentration exceeds 400 parts per million — a significant psychological and scientific milestone.',
    status: 'done',
    type: 'milestone',
    icon: '⚠️',
  },
  {
    id: 'tl12',
    year: 2015,
    title: 'Paris Agreement signed',
    description: 'A landmark accord: 196 parties commit to keeping global warming well below 2°C, pursuing efforts to limit it to 1.5°C, and achieving net zero by the second half of the century.',
    status: 'done',
    type: 'political',
    icon: '🤝',
  },
  {
    id: 'tl13',
    year: 2018,
    title: 'IPCC Special Report on 1.5°C',
    description: 'The IPCC SR1.5 report warns that limiting warming to 1.5°C requires unprecedented, rapid changes in all aspects of society by 2030 — and would prevent significant additional harm versus 2°C.',
    status: 'done',
    type: 'scientific',
    icon: '🚨',
  },
  {
    id: 'tl14',
    year: 2019,
    title: 'Global climate strikes & record wildfires',
    description: 'Greta Thunberg\'s Fridays for Future movement sparks global school strikes. Australian megafires burn 18 million hectares, killing an estimated 3 billion animals.',
    status: 'done',
    type: 'disaster',
    icon: '🔥',
  },
  {
    id: 'tl15',
    year: 2021,
    title: 'COP26 Glasgow Climate Pact',
    description: 'Countries agree to "phase down" coal and accelerate the end of fossil fuel subsidies. Over 140 nations commit to net zero targets, though ambition gaps remain large.',
    status: 'done',
    type: 'political',
    icon: '🌿',
  },
  {
    id: 'tl16',
    year: 2023,
    title: 'Hottest year on record — 1.5°C breached for first time',
    description: '2023 is confirmed as the hottest year in recorded history. For the first time, the annual global average temperature exceeded 1.5°C above pre-industrial levels.',
    status: 'done',
    type: 'milestone',
    icon: '🌡️',
  },
  {
    id: 'tl17',
    year: 2025,
    title: 'Global solar capacity passes 3 terawatts',
    description: 'Solar power generation surpasses 3 TW of installed capacity globally — more than all coal and gas power plants combined, marking a historic energy transition milestone.',
    status: 'active',
    type: 'milestone',
    icon: '☀️',
  },
  {
    id: 'tl18',
    year: 2030,
    title: 'Global emissions must halve (Paris Agreement target)',
    description: 'To stay on a 1.5°C pathway, global greenhouse gas emissions need to be cut by approximately 43% from 2019 levels by 2030. Current pledges fall significantly short.',
    details: 'The emissions gap between current national pledges and the 1.5°C pathway remains around 20–24 Gt CO₂e per year. Urgent policy acceleration is needed across all sectors.',
    status: 'upcoming',
    type: 'target',
    icon: '🎯',
  },
  {
    id: 'tl19',
    year: 2035,
    title: 'EU carbon border adjustment mechanism fully operational',
    description: 'The EU\'s Carbon Border Adjustment Mechanism (CBAM) fully applies to carbon-intensive imports, incentivising global trading partners to adopt carbon pricing.',
    status: 'upcoming',
    type: 'political',
    icon: '🇪🇺',
  },
  {
    id: 'tl20',
    year: 2050,
    title: 'Net zero target — 140+ countries',
    description: 'The target year for net zero greenhouse gas emissions for over 140 countries, including the UK, EU, USA, Japan, and Canada. Requires transformative change across all economic sectors.',
    details: 'Net zero by 2050 requires: clean electricity, electric vehicles, heat pumps, green hydrogen, carbon capture, sustainable agriculture, and forests. Every decade of delay increases the required pace of change.',
    status: 'upcoming',
    type: 'target',
    icon: '🌍',
  },
];

// ─── Reduction Tips ───────────────────────────────────────────────────────────

export const REDUCTION_TIPS: ReductionTip[] = [
  // Transport
  {
    id: 'tip_flight_free',
    title: 'Take one fewer long-haul flight per year',
    description: 'Avoiding a single return long-haul flight is one of the highest-impact things you can do. Consider train or video call alternatives.',
    category: 'transport',
    impact: 'high',
    estimatedSavingKg: 1900,
    savesMoney: true,
    icon: '✈️',
  },
  {
    id: 'tip_ev',
    title: 'Switch to an electric vehicle',
    description: 'An EV charged on the average grid emits ~4× less CO₂ than a petrol car. On renewable electricity, savings exceed 95%.',
    category: 'transport',
    impact: 'high',
    estimatedSavingKg: 1650,
    savesMoney: false,
    icon: '⚡',
  },
  {
    id: 'tip_car_free',
    title: 'Go car-free or car-light',
    description: 'Walking, cycling, and using public transport instead of a car saves up to 2 tonnes CO₂e per year.',
    category: 'transport',
    impact: 'high',
    estimatedSavingKg: 2000,
    savesMoney: true,
    icon: '🚲',
  },
  {
    id: 'tip_train_not_plane',
    title: 'Take the train instead of flying (European trips)',
    description: 'A train journey from London to Paris emits ~95% less CO₂ than flying and takes just over 2 hours.',
    category: 'transport',
    impact: 'high',
    estimatedSavingKg: 120,
    savesMoney: false,
    icon: '🚆',
  },
  // Food
  {
    id: 'tip_reduce_beef',
    title: 'Eat beef once a week instead of daily',
    description: 'Cutting beef consumption from daily to once a week saves approximately 600 kg CO₂e per year.',
    category: 'food',
    impact: 'high',
    estimatedSavingKg: 600,
    savesMoney: true,
    icon: '🥩',
  },
  {
    id: 'tip_plant_based',
    title: 'Try a plant-based diet',
    description: 'A vegan diet has the lowest carbon footprint of any diet — roughly 50% lower than a high-meat diet.',
    category: 'food',
    impact: 'high',
    estimatedSavingKg: 800,
    savesMoney: true,
    icon: '🥦',
  },
  {
    id: 'tip_reduce_dairy',
    title: 'Switch to plant-based milk',
    description: 'Oat, soy, or almond milk emit 60–80% less CO₂e than cow\'s milk. Oat milk has the lowest land use.',
    category: 'food',
    impact: 'medium',
    estimatedSavingKg: 150,
    savesMoney: false,
    icon: '🥛',
  },
  {
    id: 'tip_reduce_waste',
    title: 'Halve your food waste',
    description: 'One-third of all food produced globally is wasted. Meal planning and proper storage can cut waste — and costs — significantly.',
    category: 'food',
    impact: 'medium',
    estimatedSavingKg: 130,
    savesMoney: true,
    icon: '🗑️',
  },
  {
    id: 'tip_seasonal_local',
    title: 'Buy seasonal and local produce',
    description: 'Seasonal produce requires no heated greenhouses. Local sourcing cuts transport emissions. Both cut food miles dramatically.',
    category: 'food',
    impact: 'low',
    estimatedSavingKg: 80,
    savesMoney: true,
    icon: '🥕',
  },
  // Energy
  {
    id: 'tip_green_energy',
    title: 'Switch to a renewable energy tariff',
    description: 'Choosing a 100% renewable electricity tariff reduces your home electricity emissions to near zero.',
    category: 'energy',
    impact: 'high',
    estimatedSavingKg: 820,
    savesMoney: false,
    icon: '♻️',
  },
  {
    id: 'tip_heat_pump',
    title: 'Install a heat pump',
    description: 'Replacing a gas boiler with an air-source heat pump can reduce heating emissions by 70% on the average grid.',
    category: 'energy',
    impact: 'high',
    estimatedSavingKg: 1200,
    savesMoney: false,
    icon: '🌡️',
  },
  {
    id: 'tip_insulation',
    title: 'Insulate your home',
    description: 'Good insulation (loft, walls, double glazing) reduces heating demand by 20–40%, cutting both bills and emissions.',
    category: 'energy',
    impact: 'high',
    estimatedSavingKg: 500,
    savesMoney: true,
    icon: '🏠',
  },
  {
    id: 'tip_led_bulbs',
    title: 'Switch all bulbs to LEDs',
    description: 'LEDs use 75–90% less energy than incandescent bulbs and last 15–25 times longer.',
    category: 'energy',
    impact: 'low',
    estimatedSavingKg: 60,
    savesMoney: true,
    icon: '💡',
  },
  {
    id: 'tip_thermostat',
    title: 'Turn the thermostat down by 1°C',
    description: 'Reducing home heating temperature by just 1°C can cut heating energy use by around 8%.',
    category: 'energy',
    impact: 'low',
    estimatedSavingKg: 120,
    savesMoney: true,
    icon: '🌡️',
  },
  // Shopping
  {
    id: 'tip_buy_less',
    title: 'Buy less — use what you have',
    description: 'The most sustainable product is the one that already exists. Extending the life of clothes and electronics by 1 year cuts their carbon footprint by ~30%.',
    category: 'shopping',
    impact: 'medium',
    estimatedSavingKg: 300,
    savesMoney: true,
    icon: '🛍️',
  },
  {
    id: 'tip_second_hand',
    title: 'Buy second-hand clothing',
    description: 'Second-hand clothes have effectively zero manufacturing emissions. A £10 charity shop purchase vs a new £10 item saves ~5 kg CO₂e.',
    category: 'shopping',
    impact: 'medium',
    estimatedSavingKg: 100,
    savesMoney: true,
    icon: '♻️',
  },
  {
    id: 'tip_repair',
    title: 'Repair rather than replace electronics',
    description: 'Manufacturing a new smartphone emits ~70 kg CO₂e. Getting your screen fixed instead saves most of that.',
    category: 'shopping',
    impact: 'medium',
    estimatedSavingKg: 70,
    savesMoney: true,
    icon: '🔧',
  },
];

// ─── Next Steps Wizard ────────────────────────────────────────────────────────

export const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'step_lifestyle',
    question: 'Which part of your lifestyle do you think has the biggest carbon impact?',
    label: 'Lifestyle',
    options: [
      {
        id: 'opt_travel',
        label: 'How I travel',
        description: 'Flights, car use, and daily commuting',
        icon: '🚗',
        tipIds: ['tip_flight_free', 'tip_ev', 'tip_car_free', 'tip_train_not_plane'],
        chatPrompts: [
          'How can I reduce my travel carbon footprint?',
          'Is an electric car worth it for the environment?',
          'What\'s the carbon footprint of my commute?',
        ],
      },
      {
        id: 'opt_food',
        label: 'What I eat',
        description: 'Diet, food choices, and food waste',
        icon: '🍽️',
        tipIds: ['tip_reduce_beef', 'tip_plant_based', 'tip_reduce_dairy', 'tip_reduce_waste'],
        chatPrompts: [
          'Which diet change will reduce my footprint the most?',
          'How much CO₂ does beef produce?',
          'What are the best low-carbon foods?',
        ],
      },
      {
        id: 'opt_home',
        label: 'My home energy',
        description: 'Electricity, heating, and insulation',
        icon: '🏠',
        tipIds: ['tip_green_energy', 'tip_heat_pump', 'tip_insulation', 'tip_led_bulbs'],
        chatPrompts: [
          'How can I cut my home energy emissions?',
          'Should I get solar panels or a heat pump?',
          'What\'s the cheapest way to make my home greener?',
        ],
      },
      {
        id: 'opt_shopping',
        label: 'What I buy',
        description: 'Consumer goods, fashion, and electronics',
        icon: '🛍️',
        tipIds: ['tip_buy_less', 'tip_second_hand', 'tip_repair'],
        chatPrompts: [
          'How does fast fashion affect the environment?',
          'What is the carbon footprint of a new smartphone?',
          'How can I shop more sustainably?',
        ],
      },
    ],
  },
  {
    id: 'step_priority',
    question: 'What\'s most important to you when making changes?',
    label: 'Priority',
    options: [
      {
        id: 'opt_impact',
        label: 'Maximum impact',
        description: 'I want the biggest CO₂ savings possible',
        icon: '💪',
        tipIds: ['tip_flight_free', 'tip_car_free', 'tip_plant_based', 'tip_heat_pump'],
        chatPrompts: [
          'What single change saves the most carbon?',
          'What are the highest-impact climate actions?',
        ],
      },
      {
        id: 'opt_money',
        label: 'Saves money too',
        description: 'I\'d prefer changes that also cut my costs',
        icon: '💰',
        tipIds: ['tip_car_free', 'tip_reduce_beef', 'tip_reduce_waste', 'tip_led_bulbs', 'tip_buy_less'],
        chatPrompts: [
          'Which green changes save me money?',
          'How much could I save by cutting my carbon footprint?',
        ],
      },
      {
        id: 'opt_easy',
        label: 'Easy wins first',
        description: 'I want simple changes I can start today',
        icon: '✅',
        tipIds: ['tip_led_bulbs', 'tip_thermostat', 'tip_reduce_waste', 'tip_seasonal_local'],
        chatPrompts: [
          'What\'s the easiest way to start reducing my footprint?',
          'What can I do today to reduce my carbon footprint?',
        ],
      },
      {
        id: 'opt_inspire',
        label: 'Inspire others',
        description: 'I want to set an example for family and community',
        icon: '🌟',
        tipIds: ['tip_plant_based', 'tip_second_hand', 'tip_green_energy', 'tip_flight_free'],
        chatPrompts: [
          'How can I encourage others to reduce their carbon footprint?',
          'What visible changes signal sustainability to others?',
        ],
      },
    ],
  },
  {
    id: 'step_commitment',
    question: 'How much change are you ready to make?',
    label: 'Commitment',
    options: [
      {
        id: 'opt_small',
        label: 'Small steps',
        description: 'I\'ll try 1–2 low-effort changes this month',
        icon: '🌱',
        tipIds: ['tip_led_bulbs', 'tip_thermostat', 'tip_reduce_waste', 'tip_seasonal_local'],
        chatPrompts: [
          'Give me 3 easy things to do this week for the planet',
          'What\'s a good first step to reducing my footprint?',
        ],
      },
      {
        id: 'opt_moderate',
        label: 'Meaningful changes',
        description: 'I\'m ready for 3–5 significant lifestyle changes',
        icon: '🌿',
        tipIds: ['tip_reduce_beef', 'tip_green_energy', 'tip_second_hand', 'tip_reduce_dairy', 'tip_insulation'],
        chatPrompts: [
          'Create me a 3-month sustainability plan',
          'How do I cut my footprint by 30% this year?',
        ],
      },
      {
        id: 'opt_major',
        label: 'Transformative action',
        description: 'I\'m committed to a major lifestyle overhaul',
        icon: '🏆',
        tipIds: ['tip_flight_free', 'tip_ev', 'tip_car_free', 'tip_plant_based', 'tip_heat_pump', 'tip_green_energy'],
        chatPrompts: [
          'How do I reach a 2-tonne carbon footprint?',
          'What does a net zero lifestyle look like?',
          'How can I become carbon neutral?',
        ],
      },
      {
        id: 'opt_learn',
        label: 'Still exploring',
        description: 'I\'m learning and not ready to commit yet',
        icon: '🔍',
        tipIds: ['tip_reduce_waste', 'tip_seasonal_local', 'tip_buy_less'],
        chatPrompts: [
          'Explain carbon footprints in simple terms',
          'Why should I care about my carbon footprint?',
          'What are the biggest sources of carbon emissions?',
        ],
      },
    ],
  },
];
