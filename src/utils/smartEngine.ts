/**
 * src/utils/smartEngine.ts
 * Carbon footprint engine with two tiers:
 *
 * Tier 1 — Synchronous keyword-matching (zero network, always available)
 *   Detects carbon-related intent and returns static responses.
 *   This ensures the app NEVER fails, even without an API key.
 *
 * Tier 2 — Google Gemini AI (async, uses VITE_GEMINI_API_KEY)
 *   Enriches responses with personalised insights using the user's
 *   footprint summary as context. Falls back to Tier 1 on any error.
 *
 * Security: API key via import.meta.env.VITE_GEMINI_API_KEY only.
 * No API keys are ever hardcoded (per SECURITY blueprint).
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { FootprintSummary } from '../types';
import { CARBON_AVERAGES, ACTIVITY_CATEGORIES } from '../data/carbonData';

// ─── Constants ────────────────────────────────────────────────────────────────

const GEMINI_MODEL = 'gemini-1.5-flash';

/**
 * System prompt injected into every Gemini request.
 * Constrains the model to the carbon/sustainability domain only.
 */
const SYSTEM_PROMPT = `You are CarbonSense, a friendly and knowledgeable carbon footprint assistant.
Your role is to help people understand, track, and reduce their personal carbon footprint.
Keep responses concise (3-5 sentences or a short bullet list), accurate, and encouraging.
Focus exclusively on carbon emissions, sustainability, climate science, and eco-friendly lifestyle changes.
Always cite approximate CO₂ figures where relevant. Use kg CO₂e or tonnes CO₂e as units.
If asked something unrelated to sustainability or carbon, gently redirect to the topic.
Avoid alarmist language — be hopeful, practical, and action-oriented.`;

// ─── Intent Detection (Tier 1) ────────────────────────────────────────────────

type CarbonIntent =
  | 'greeting'
  | 'footprint_general'
  | 'flight'
  | 'car_petrol'
  | 'car_electric'
  | 'transport_general'
  | 'food_beef'
  | 'food_diet'
  | 'food_waste'
  | 'energy_home'
  | 'energy_solar'
  | 'shopping_fashion'
  | 'shopping_general'
  | 'offset'
  | 'net_zero'
  | 'compare_average'
  | 'reduce_general'
  | 'thanks'
  | 'unknown';

const PATTERNS: Array<{ intent: CarbonIntent; keywords: string[] }> = [
  { intent: 'greeting',          keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'howdy'] },
  { intent: 'thanks',            keywords: ['thank', 'thanks', 'cheers', 'appreciate', 'helpful'] },
  { intent: 'flight',            keywords: ['flight', 'fly', 'flying', 'plane', 'airline', 'aviation', 'airport'] },
  { intent: 'car_electric',      keywords: ['electric car', 'ev ', 'electric vehicle', 'tesla', 'hybrid', 'bev'] },
  { intent: 'car_petrol',        keywords: ['petrol', 'gasoline', 'diesel', 'car ', 'driving', 'drive to work', 'commute'] },
  { intent: 'transport_general', keywords: ['train', 'bus ', 'cycling', 'bicycle', 'bike ', 'walk ', 'transport', 'travel'] },
  { intent: 'food_beef',         keywords: ['beef', 'steak', 'burger', 'meat', 'lamb', 'livestock'] },
  { intent: 'food_diet',         keywords: ['vegan', 'vegetarian', 'plant-based', 'diet', 'food ', 'eat ', 'dairy', 'cheese', 'chicken', 'fish'] },
  { intent: 'food_waste',        keywords: ['food waste', 'throw away', 'leftovers', 'bin food', 'meal plan'] },
  { intent: 'energy_solar',      keywords: ['solar panel', 'solar power', 'renewable energy', 'wind energy', 'green energy', 'clean energy'] },
  { intent: 'energy_home',       keywords: ['electricity', 'gas bill', 'heating', 'boiler', 'heat pump', 'insulation', 'home energy', 'kwh'] },
  { intent: 'shopping_fashion',  keywords: ['clothes', 'fashion', 'clothing', 'shirt', 'jeans', 'fast fashion', 'second hand', 'second-hand'] },
  { intent: 'shopping_general',  keywords: ['shopping', 'buy ', 'purchase', 'online order', 'amazon', 'delivery', 'package'] },
  { intent: 'offset',            keywords: ['offset', 'carbon credit', 'tree planting', 'carbon neutral', 'compensate'] },
  { intent: 'net_zero',          keywords: ['net zero', 'net-zero', 'zero carbon', 'carbon free', 'decarboni', 'paris agreement', '1.5'] },
  { intent: 'compare_average',   keywords: ['average', 'compare', 'typical', 'how do i compare', 'benchmark', 'am i worse', 'how much does the average'] },
  { intent: 'reduce_general',    keywords: ['reduce', 'lower', 'cut', 'save carbon', 'tip', 'advice', 'help me', 'what can i do', 'how to'] },
  { intent: 'footprint_general', keywords: ['footprint', 'co2', 'carbon', 'emission', 'greenhouse', 'climate change', 'global warming'] },
];

/** O(n) keyword scan — detects intent from user input */
function detectIntent(input: string): CarbonIntent {
  const lower = input.toLowerCase();
  for (const { intent, keywords } of PATTERNS) {
    if (keywords.some((kw) => lower.includes(kw))) return intent;
  }
  return 'unknown';
}

// ─── Static Responses (Tier 1 fallback) ──────────────────────────────────────

const STATIC_RESPONSES: Record<CarbonIntent, string> = {
  greeting:
    '🌱 Hi! I\'m CarbonSense, your carbon footprint assistant.\n\n' +
    'I can help you understand your environmental impact, compare your footprint to global averages, ' +
    'and find practical ways to reduce your emissions. What would you like to explore?',

  footprint_general:
    '🌍 A **carbon footprint** is the total greenhouse gas emissions caused by an individual, ' +
    'measured in **kg or tonnes of CO₂ equivalent (CO₂e)**.\n\n' +
    'The global average is ~4.9 tonnes per person per year. To stay within 1.5°C of warming, ' +
    'we need to reach ~2.5 tonnes by 2030.\n\n' +
    'The biggest contributors are usually: ✈️ **flights**, 🚗 **car travel**, 🥩 **diet**, and ⚡ **home energy**.',

  flight:
    '✈️ **Aviation is one of the highest-impact activities** you can do:\n\n' +
    '- Short-haul return flight (< 3 hrs): **~510 kg CO₂e**\n' +
    '- Long-haul return flight (e.g. London→NYC): **~1.7 tonnes CO₂e**\n\n' +
    'That\'s because aviation fuel burns at altitude, increasing its warming effect by ~2×.\n\n' +
    '💡 **Tip:** Taking the train instead of flying in Europe saves up to 95% of emissions.',

  car_electric:
    '⚡ **Electric vehicles (EVs) are significantly cleaner** than petrol cars, but not zero-emission:\n\n' +
    '- Petrol car: ~**192 g CO₂e/km**\n' +
    '- EV (UK average grid): ~**53 g CO₂e/km** — about 4× less\n' +
    '- EV (100% renewable): ~**0–15 g CO₂e/km**\n\n' +
    '🏭 Manufacturing an EV emits ~50% more than a petrol car upfront, but this "carbon debt" ' +
    'is repaid within 2–4 years of driving.',

  car_petrol:
    '🚗 **Petrol and diesel cars** are a major source of personal emissions:\n\n' +
    '- Petrol car: ~**192 g CO₂e/km** (average UK car)\n' +
    '- Diesel car: ~**171 g CO₂e/km**\n\n' +
    'Driving 12,000 km/year produces ~**2.3 tonnes CO₂e** — nearly half the 1.5°C-compatible budget.\n\n' +
    '💡 **Best alternatives:** cycling, train, bus, or switching to an EV charged on renewables.',

  transport_general:
    '🚆 **Lower-carbon transport options** (g CO₂e per km):\n\n' +
    '| Mode | Emissions |\n' +
    '|------|-----------|\n' +
    '| Walking / Cycling | 0 g |\n' +
    '| Train | ~41 g |\n' +
    '| Bus | ~89 g |\n' +
    '| EV (UK grid) | ~53 g |\n' +
    '| Petrol car | ~192 g |\n' +
    '| Short-haul flight | ~255 g |\n\n' +
    'Trains are typically **5× cleaner** than flying and **4× cleaner** than driving alone.',

  food_beef:
    '🥩 **Beef is the most carbon-intensive food** available:\n\n' +
    '- Beef: ~**60 kg CO₂e per kg** — mainly from cattle methane and land use\n' +
    '- Lamb: ~24 kg CO₂e/kg\n' +
    '- Chicken: ~7 kg CO₂e/kg\n' +
    '- Tofu: ~3 kg CO₂e/kg\n' +
    '- Lentils: ~0.9 kg CO₂e/kg\n\n' +
    '💡 Cutting beef from daily to once a week saves ~**600 kg CO₂e/year** and usually saves money.',

  food_diet:
    '🌱 **Your diet is one of the highest-impact choices** you make:\n\n' +
    '| Diet | Annual CO₂e |\n' +
    '|------|-------------|\n' +
    '| High meat | ~3,300 kg |\n' +
    '| Average omnivore | ~2,500 kg |\n' +
    '| Vegetarian | ~1,700 kg |\n' +
    '| Vegan | ~1,500 kg |\n\n' +
    'Switching from high-meat to plant-based saves ~**1.8 tonnes CO₂e/year**.',

  food_waste:
    '🗑️ **Food waste is a hidden climate problem:**\n\n' +
    'If food waste were a country, it would be the **world\'s third-largest emitter** of greenhouse gases.\n\n' +
    'Each kg of food wasted emits ~2.5 kg CO₂e (including production emissions).\n\n' +
    '💡 **Practical tips:** Meal planning, batch cooking, proper refrigeration, and using leftovers ' +
    'can easily halve household food waste — saving money and ~130 kg CO₂e/year.',

  energy_solar:
    '☀️ **Solar panels are one of the best home investments** for carbon reduction:\n\n' +
    '- Grid electricity: ~233 g CO₂e/kWh\n' +
    '- Solar electricity: ~41 g CO₂e/kWh (lifecycle including manufacture)\n\n' +
    'A typical 4kW roof system generates ~3,400 kWh/year, saving ~**650 kg CO₂e/year**.\n\n' +
    '🔌 **Even without solar**, switching to a **100% renewable tariff** achieves similar savings ' +
    'and costs little or no extra.',

  energy_home:
    '🏠 **Home energy is typically 15–25% of a personal carbon footprint:**\n\n' +
    '- Gas boiler heating: ~**2 kg CO₂e per m³** of gas\n' +
    '- Electric heat pump: ~**0.05 kg CO₂e/kWh** (4× more efficient than gas)\n' +
    '- Grid electricity: ~**233 g CO₂e/kWh** (UK average 2023)\n\n' +
    '💡 **Biggest wins:** loft insulation (saves ~500 kg CO₂e/yr), switching to renewable tariff ' +
    '(~820 kg CO₂e/yr), and turning heating down 1°C (~120 kg CO₂e/yr).',

  shopping_fashion:
    '👕 **Fast fashion has a significant but often overlooked footprint:**\n\n' +
    '- New cotton t-shirt: ~**5.5 kg CO₂e**\n' +
    '- New jeans: ~**33 kg CO₂e**\n' +
    '- New smartphone: ~**70 kg CO₂e**\n\n' +
    '💡 **Best actions:**\n' +
    '- Buy second-hand (nearly zero manufacturing emissions)\n' +
    '- Repair rather than replace electronics\n' +
    '- Wash clothes at 30°C and air-dry (saves ~150 kg CO₂e/yr)\n' +
    '- Buy fewer, higher quality items that last longer.',

  shopping_general:
    '🛍️ **Consumer shopping contributes 10–20% of a typical carbon footprint.**\n\n' +
    'The most sustainable product is the one that **already exists**.\n\n' +
    '- Each online parcel delivery: ~**0.5 kg CO₂e**\n' +
    '- 1 hour of video streaming: ~**0.036 kg CO₂e**\n\n' +
    '💡 **Key principle:** Extending the life of any product by just 1 year cuts its carbon ' +
    'footprint by ~30%. Second-hand, repair, and sharing are powerful tools.',

  offset:
    '🌳 **Carbon offsets can help, but are not a substitute for cutting emissions:**\n\n' +
    'To offset 1 tonne CO₂e through tree planting, you need ~48 trees growing for 10 years.\n\n' +
    'Higher-quality offsets include:\n' +
    '- Direct Air Capture (DAC)\n' +
    '- Verified reforestation (VCS/Gold Standard)\n' +
    '- Methane capture projects\n\n' +
    '⚠️ Always reduce first, then offset what you cannot yet eliminate. ' +
    'Be wary of cheap offsets — quality varies enormously.',

  net_zero:
    '🎯 **Net zero** means balancing greenhouse gas emissions produced with the same amount removed:\n\n' +
    '- **Not** the same as zero emissions — some sectors will still emit\n' +
    '- Achieved via: reducing emissions + carbon removal (forests, DAC, soil carbon)\n\n' +
    '**Key targets:**\n' +
    '- 🌍 Paris Agreement: limit warming to 1.5°C\n' +
    '- 📅 Global emissions must halve by 2030\n' +
    '- 🏁 Most developed nations target net zero by 2050\n\n' +
    'For individuals: a net-zero lifestyle requires ~**700 kg CO₂e/year** — a major transformation.',

  compare_average:
    `📊 **Global carbon footprint averages (annual per person):**\n\n` +
    `| Country/Region | kg CO₂e/year |\n` +
    `|----------------|--------------|\n` +
    `| 🇺🇸 USA | ~${CARBON_AVERAGES.usa.toLocaleString()} kg |\n` +
    `| 🇪🇺 EU average | ~${CARBON_AVERAGES.eu.toLocaleString()} kg |\n` +
    `| 🇬🇧 UK | ~${CARBON_AVERAGES.uk.toLocaleString()} kg |\n` +
    `| 🌍 Global average | ~${CARBON_AVERAGES.global.toLocaleString()} kg |\n` +
    `| 🇨🇳 China | ~${CARBON_AVERAGES.china.toLocaleString()} kg |\n` +
    `| 🇮🇳 India | ~${CARBON_AVERAGES.india.toLocaleString()} kg |\n` +
    `| 🎯 Paris 2030 target | ~${CARBON_AVERAGES.paris_target_2030.toLocaleString()} kg |\n\n` +
    `Use the **My Footprint** tracker to calculate yours and see exactly how you compare.`,

  reduce_general:
    '💡 **The highest-impact actions to reduce your carbon footprint:**\n\n' +
    '| Action | Annual saving |\n' +
    '|--------|---------------|\n' +
    '| Go car-free | ~2,000 kg CO₂e |\n' +
    '| Skip one long-haul flight | ~1,900 kg CO₂e |\n' +
    '| Switch to heat pump | ~1,200 kg CO₂e |\n' +
    '| Switch to plant-based diet | ~800 kg CO₂e |\n' +
    '| Renewable electricity tariff | ~820 kg CO₂e |\n\n' +
    '🎯 Use the **Next Steps** tool to get a personalised action plan based on your lifestyle.',

  thanks:
    '😊 You\'re welcome! Every action counts — even small changes add up significantly over time.\n\n' +
    'If you want to dig deeper, try the **My Footprint** tracker to calculate your exact emissions, ' +
    'or take the **Climate Quiz** to test your knowledge.',

  unknown:
    '🌿 I\'m here to help with anything related to **carbon footprints and sustainability**.\n\n' +
    'Try asking me about:\n' +
    '- ✈️ The emissions from flights or car journeys\n' +
    '- 🥩 How your diet affects your carbon footprint\n' +
    '- ⚡ Home energy and renewable electricity\n' +
    '- 💡 Practical ways to reduce your footprint\n' +
    '- 📊 How your footprint compares to averages\n\n' +
    'Or use the tabs above to **track your footprint**, take a **quiz**, or get **next steps**.',
};

// ─── Tier 1: Synchronous Static Engine ───────────────────────────────────────

/**
 * Returns a synchronous static response based on keyword intent detection.
 * Guaranteed to return a non-empty string — never throws.
 */
export function getStaticResponse(userInput: string): string {
  const intent = detectIntent(userInput);
  return STATIC_RESPONSES[intent];
}

/**
 * Simulates natural typing delay scaled to response length.
 * Caps at 1500ms to avoid frustrating users (per EFFICIENCY blueprint).
 */
export function getTypingDelay(response: string): number {
  const words = response.split(' ').length;
  return Math.min(300 + words * 20, 1500);
}

// ─── Tier 2: Footprint Context Builder ───────────────────────────────────────

/**
 * Builds a structured text summary of the user's footprint to inject
 * as context into Gemini prompts. Pure function — no side effects.
 */
export function buildFootprintContext(summary: FootprintSummary | null): string {
  if (!summary || summary.totalKgCO2e === 0) {
    return 'The user has not yet entered their footprint data.';
  }

  const { totalKgCO2e, byCategory, categoryPercentages } = summary;
  const totalTonnes = (totalKgCO2e / 1000).toFixed(2);

  const lines = [
    `User's annual carbon footprint: ${totalTonnes} tonnes CO₂e (${totalKgCO2e.toFixed(0)} kg).`,
    `Global average: ${(CARBON_AVERAGES.global / 1000).toFixed(1)} tonnes. Paris 2030 target: ${(CARBON_AVERAGES.paris_target_2030 / 1000).toFixed(1)} tonnes.`,
    `Breakdown by category:`,
    ...ACTIVITY_CATEGORIES.map((cat) => {
      const kg = byCategory[cat.id];
      const pct = categoryPercentages[cat.id].toFixed(0);
      return `  - ${cat.label}: ${kg.toFixed(0)} kg CO₂e (${pct}%)`;
    }),
  ];

  // Identify the biggest category
  const biggestCategory = (Object.keys(byCategory) as Array<keyof typeof byCategory>).reduce(
    (a, b) => (byCategory[a] > byCategory[b] ? a : b),
  );
  lines.push(`Biggest emitting category: ${biggestCategory}.`);

  if (totalKgCO2e < CARBON_AVERAGES.paris_target_2030) {
    lines.push('Status: Below the 1.5°C-compatible 2030 target — excellent!');
  } else if (totalKgCO2e < CARBON_AVERAGES.global) {
    lines.push('Status: Below the global average but above the 1.5°C target — good progress needed.');
  } else {
    lines.push(`Status: Above the global average by ${((totalKgCO2e - CARBON_AVERAGES.global) / 1000).toFixed(1)} tonnes — significant reduction opportunity.`);
  }

  return lines.join('\n');
}

// ─── Tier 2: Gemini AI Integration ───────────────────────────────────────────

/** Module-level Gemini client — initialised once, reused across calls */
let geminiClient: ReturnType<typeof GoogleGenerativeAI.prototype.getGenerativeModel> | null = null;

function getGeminiModel() {
  // Lazy initialisation — only create the client when first needed
  if (!geminiClient) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    if (!apiKey) return null; // No key — fall back to static engine silently
    const genAI = new GoogleGenerativeAI(apiKey);
    geminiClient = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  }
  return geminiClient;
}

/**
 * Calls the Gemini API with the user's message and their footprint as context.
 * Returns null on any error — callers must handle null and fall back to static.
 *
 * Security: API key read from env only. User input encoded in prompt, never in URL.
 * Input trimmed before sending (per SECURITY blueprint multi-layer validation).
 */
async function callGemini(
  userInput: string,
  footprintContext: string,
): Promise<string | null> {
  const model = getGeminiModel();
  if (!model) return null;

  const trimmed = userInput.trim(); // Layer 3 input validation (per SECURITY blueprint)
  if (!trimmed) return null;

  const prompt = [
    SYSTEM_PROMPT,
    '',
    '--- User Context ---',
    footprintContext,
    '',
    '--- User Message ---',
    trimmed,
  ].join('\n');

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    return text.length > 0 ? text : null;
  } catch {
    // Silently fall back to Tier 1 — never surface API errors to the user
    return null;
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Main entry point for the chat engine.
 *
 * Strategy:
 * 1. Try Gemini AI with footprint context (personalised, async)
 * 2. On failure or missing API key, fall back to static keyword response
 *
 * Callers can rely on this always returning a non-empty string.
 */
export async function getSmartResponse(
  userInput: string,
  footprintSummary: FootprintSummary | null,
): Promise<string> {
  const footprintContext = buildFootprintContext(footprintSummary);

  const aiResponse = await callGemini(userInput, footprintContext);
  if (aiResponse) return aiResponse;

  // Tier 1 fallback — synchronous, always available
  return getStaticResponse(userInput);
}
