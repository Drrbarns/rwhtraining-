/** Total masterclass program fee (Ghana Cedis). */
export const COURSE_TOTAL_GHS = 2200;

/** Initial checkout amount for each payment tier (20% / 50% / 100% of {@link COURSE_TOTAL_GHS}). */
export function tierInitialAmountGhs(tier: string): number {
    if (tier === "20") return 440;
    if (tier === "100") return 2200;
    return 1100;
}
