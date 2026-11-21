export type Tier = "bronze" | "silver" | "gold" | "platinum";

export const TIERS: { key: Tier; label: string; min: number; max: number | null; ring: string; chip: string }[] = [
  { key: "bronze", label: "Bronze", min: 0, max: 50000, ring: "from-amber-500/70 to-amber-700/60", chip: "bg-amber-100 text-amber-800 border-amber-200" },
  { key: "silver", label: "Silver", min: 50001, max: 100000, ring: "from-slate-300/80 to-slate-500/60", chip: "bg-slate-100 text-slate-700 border-slate-200" },
  { key: "gold", label: "Gold", min: 100001, max: 500000, ring: "from-yellow-300/80 to-amber-500/70", chip: "bg-yellow-100 text-yellow-800 border-yellow-200" },
  { key: "platinum", label: "Platinum", min: 500001, max: null, ring: "from-indigo-300/80 to-primary/70", chip: "bg-indigo-100 text-indigo-700 border-indigo-200" },
];

export const MILESTONES: { coins: number; reward: number; label: string }[] = [
  { coins: 100000, reward: 10000, label: "100K Club" },
  { coins: 500000, reward: 50000, label: "500K Legend" },
];

export function tierMeta(tier: string) {
  return TIERS.find((t) => t.key === tier) ?? TIERS[0];
}

/** Next unreached milestone based on purchased coins. */
export function nextMilestone(purchased: number) {
  return MILESTONES.find((m) => purchased < m.coins) ?? null;
}

export function fmt(n: number) {
  return n.toLocaleString("en-IN");
}
