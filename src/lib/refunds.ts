const RESTRICTED_PLAN_NAMES = new Set(["10K RED PACKET", "10K GOLD"]);

export const isRefundRestrictedOrder = (price: number, planName: string) =>
  price === 479 || RESTRICTED_PLAN_NAMES.has(planName.trim().toUpperCase());