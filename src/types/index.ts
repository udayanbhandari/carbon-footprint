/**
 * src/types/index.ts
 * All TypeScript types and interfaces for the Carbon Footprint Awareness Platform.
 * Single barrel file — no scattered .d.ts files (per CODE_QUALITY blueprint).
 */

// ─── Union Type Aliases ───────────────────────────────────────────────────────

/** The main navigation views available in the app */
export type ViewId =
  | 'chat'
  | 'tracker'
  | 'timeline'
  | 'quiz'
  | 'next-step';

/** Top-level activity categories that produce carbon emissions */
export type ActivityCategory =
  | 'transport'
  | 'food'
  | 'energy'
  | 'shopping';

/** Specific transport modes */
export type TransportMode =
  | 'car_petrol'
  | 'car_diesel'
  | 'car_electric'
  | 'motorcycle'
  | 'bus'
  | 'train'
  | 'flight_short'
  | 'flight_long'
  | 'cycling'
  | 'walking';

/** Diet types for food carbon estimation */
export type DietType =
  | 'vegan'
  | 'vegetarian'
  | 'pescatarian'
  | 'omnivore'
  | 'high_meat';

/** Home energy sources */
export type EnergySource =
  | 'grid_average'
  | 'renewable'
  | 'gas'
  | 'oil'
  | 'coal';

/** Climate timeline event status */
export type TimelineStatus = 'done' | 'active' | 'upcoming';

/** Quiz difficulty levels */
export type QuizDifficulty = 'easy' | 'medium' | 'hard';

/** Severity level for a reduction tip */
export type TipImpact = 'low' | 'medium' | 'high';

/** Supported display languages (ISO 639-1 codes) */
export type LanguageCode =
  | 'en'
  | 'es'
  | 'fr'
  | 'de'
  | 'hi'
  | 'pt'
  | 'zh'
  | 'ar'
  | 'ja'
  | 'ko';

/** Chat message author role */
export type MessageRole = 'user' | 'assistant';

// ─── Chat Interfaces ──────────────────────────────────────────────────────────

/** A single message in the AI chat conversation */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

// ─── Carbon Activity & Emission Interfaces ────────────────────────────────────

/**
 * An individual user activity that contributes to their carbon footprint.
 * Each activity maps to an emission factor from EMISSION_FACTORS.
 */
export interface CarbonActivity {
  id: string;
  category: ActivityCategory;
  label: string;
  description: string;
  /** SI unit for the quantity (e.g. 'km', 'kWh', 'kg', 'item') */
  unit: string;
  /** Icon emoji for UI display */
  icon: string;
  /** Default/typical value for new users */
  defaultValue: number;
  /** Emission factor in kg CO2e per unit */
  emissionFactor: number;
}

/** A top-level category grouping related carbon activities */
export interface ActivityCategoryData {
  id: ActivityCategory;
  label: string;
  icon: string;
  description: string;
  color: string;
  activities: CarbonActivity[];
}

/**
 * A user's footprint entry for a specific activity over a time period.
 * Stored in the Zustand store.
 */
export interface FootprintEntry {
  activityId: string;
  category: ActivityCategory;
  quantity: number;
  /** Computed: quantity × emissionFactor (kg CO2e) */
  kgCO2e: number;
  /** ISO date string of when this entry was recorded */
  recordedAt: string;
}

/** Aggregated footprint summary broken down by category */
export interface FootprintSummary {
  totalKgCO2e: number;
  totalTonnesCO2e: number;
  byCategory: Record<ActivityCategory, number>;
  /** Percentage share of each category */
  categoryPercentages: Record<ActivityCategory, number>;
  /** Compared to global average (2.5t/yr per person) */
  vsGlobalAverage: number;
  /** Compared to typical high-income country average (8-10t/yr) */
  vsHighIncomeAverage: number;
}

// ─── Quiz Interfaces ──────────────────────────────────────────────────────────

/** A single quiz question about carbon emissions and climate */
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: QuizDifficulty;
  /** Which category this question relates to */
  category: ActivityCategory | 'general';
  /** Interesting fact or statistic to share after answering */
  funFact?: string;
}

/** Result configuration for different quiz score ranges */
export interface QuizResultConfig {
  minScore: number;
  maxScore: number;
  label: string;
  description: string;
  icon: string;
  color: string;
}

// ─── Timeline Interfaces ──────────────────────────────────────────────────────

/** A climate milestone or historical event on the timeline */
export interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  /** Optional detailed body text */
  details?: string;
  status: TimelineStatus;
  /** Category for colour-coding */
  type: 'scientific' | 'political' | 'disaster' | 'milestone' | 'target';
  icon: string;
}

// ─── Reduction Tips & Next Steps ──────────────────────────────────────────────

/** A specific tip for reducing carbon footprint */
export interface ReductionTip {
  id: string;
  title: string;
  description: string;
  category: ActivityCategory;
  impact: TipImpact;
  /** Estimated annual kg CO2e that can be saved */
  estimatedSavingKg: number;
  /** Cost implication: true = saves money, false = costs more */
  savesMoney: boolean;
  icon: string;
}

/** A step in the personalised Next Steps wizard */
export interface WizardStep {
  id: string;
  question: string;
  /** Short label shown in progress indicator */
  label: string;
  options: WizardOption[];
}

/** An option within a wizard step */
export interface WizardOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  /** Which reduction tips to surface if this option is chosen */
  tipIds: string[];
  /** Suggested chat prompts for the AI assistant */
  chatPrompts: string[];
}

/** The final personalised action plan generated by the wizard */
export interface ActionPlan {
  tips: ReductionTip[];
  totalPotentialSavingKg: number;
  chatPrompts: string[];
  /** Motivational summary message */
  summary: string;
}

// ─── Translation Interfaces ───────────────────────────────────────────────────

/** A supported language entry for the language selector */
export interface Language {
  code: LanguageCode;
  label: string;
  nativeLabel: string;
  /** Text direction */
  dir: 'ltr' | 'rtl';
}

// ─── Emission Factor Reference ────────────────────────────────────────────────

/**
 * A reference emission factor entry from scientific sources.
 * Used to populate EMISSION_FACTORS constant in carbonData.ts.
 */
export interface EmissionFactor {
  activityId: string;
  kgCO2ePerUnit: number;
  unit: string;
  source: string;
  /** Year the factor was published or last updated */
  year: number;
}

// ─── App-level State Shape (for store reference) ──────────────────────────────

/**
 * Shape of translation key groups — used for type-checking translation calls.
 * Not the full translation object; just the top-level key categories.
 */
export type TranslationSection =
  | 'nav'
  | 'chat'
  | 'tracker'
  | 'quiz'
  | 'timeline'
  | 'nextStep'
  | 'common'
  | 'units'
  | 'categories';
