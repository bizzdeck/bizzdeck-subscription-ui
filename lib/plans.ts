export enum PlanType {
  LITE = 'lite',
  PLUS = 'plus',
  PRO = 'pro',
}

export type Plan = {
  id: string
  planAccessName: PlanType
  name: string
  price: number
  interval: string
  features: string[]
  popular?: boolean
}

export const PLANS: Record<PlanType, Plan> = {
  [PlanType.LITE]: {
    id: "plan_SKOpomW5AERzfn",
    planAccessName: PlanType.LITE,
    name: "BizzDeck Lite",
    price: 999,
    interval: "month",
    features: [
      "Insights: Profitability Checker",
      "Account Manager: 15-minute virtual session (once a month) - Complementary",
      "Menu Reversal: Tool access for self-use"
    ],
  },
  [PlanType.PLUS]: {
    id: "plan_SKOqPlPTRkolaC",
    planAccessName: PlanType.PLUS,
    name: "Professional",
    price: 2499,
    interval: "month",
    features: [
      "Insights: Profitability Checker",
      "Consultations: 1 strategy call/week (30 mins each)",
      "Menu Reversal: Self-access + Guidance",
      "Growth Strategy: Tailored best practices based on your cuisine, location, and goals"
    ],
    popular: true,
  },
  [PlanType.PRO]: {
    id: "plan_SKOqt3u67YtzY5",
    planAccessName: PlanType.PRO,
    name: "Enterprise",
    price: 3499,
    interval: "month",
    features: [
      "Insights: Profitability Checker",
      "Consultations: 1 strategy call/week (30 mins each)",
      "Menu Reversal: Self-access + Guidance",
      "Growth Strategy: Tailored best practices based on your cuisine, location, and goals",
      "Aggregator Support: Swiggy & Zomato account manager coordination (1 call/month each)"
    ],
  },
}

// Helper function to get all plans as an array
export const getAllPlans = (): Plan[] => {
  return Object.values(PLANS)
}

// Helper function to get plan by planAccessName
export const getPlanByAccessName = (accessName: string): Plan | undefined => {
  return PLANS[accessName as PlanType]
}

// Helper function to get plan by ID
export const getPlanById = (id: string): Plan | undefined => {
  return getAllPlans().find(plan => plan.id === id)
}
