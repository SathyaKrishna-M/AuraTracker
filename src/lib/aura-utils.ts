export function getAuraTitle(aura: number): string {
    if (aura <= -50) return "Chaotic";
    if (aura >= -49 && aura <= 49) return "Unstable";
    if (aura >= 50 && aura <= 149) return "Neutral";
    if (aura >= 150 && aura <= 299) return "Focused";
    if (aura >= 300 && aura <= 499) return "Disciplined";
    return "Elite"; // 500+
}

export function getAuraDelta(category: string): number {
    switch (category) {
        case "SMALL_GAIN": return 5;
        case "MODERATE_GAIN": return 10;
        case "HIGH_GAIN": return 20;
        case "SMALL_LOSS": return -5;
        case "MODERATE_LOSS": return -10;
        case "HIGH_LOSS": return -20;
        default: return 0;
    }
}

export function getAuraProgress(aura: number) {
    // Define Tiers
    const TIERS = [
        { name: "Chaotic", min: -Infinity, max: -50 },
        { name: "Unstable", min: -49, max: 49 },
        { name: "Neutral", min: 50, max: 149 },
        { name: "Focused", min: 150, max: 299 },
        { name: "Disciplined", min: 300, max: 499 },
        { name: "Elite", min: 500, max: Infinity },
    ];

    // Find current tier index
    const currentTierIndex = TIERS.findIndex(t => aura >= t.min && aura <= t.max);

    // If max tier, return max progress
    if (currentTierIndex === TIERS.length - 1) {
        return {
            nextTitle: "Max Rank",
            progress: 100,
            remaining: 0,
            nextThreshold: null
        };
    }

    const currentTier = TIERS[currentTierIndex];
    const nextTier = TIERS[currentTierIndex + 1];

    // Calculate progress
    // Range covers the distance between current tier start (or min of current range) and next tier start
    // Actually, progress is usually visualized as distance from current threshold to next threshold.
    // Let's simplify: 
    // Unstable (-49 to 49). Total range size = 98. 
    // If aura is 0. 0 - (-49) = 49. 49/98 = 50%.

    // Special handling for lowest tier (Chaotic) which has no lower bound?
    // Let's assume clamping for visualization if needed, but for progress to "Unstable" (-49):
    // If aura is -100. Next is -49.

    // To make it standard, let's just track progress to NEXT threshold based on a fixed "level width" or just raw distance?
    // The user likely wants to see "How close am I to the next rank".

    const rangeStart = currentTier.min === -Infinity ? -200 : currentTier.min; // Cap visual start for chaotic
    const rangeEnd = nextTier.min; // The value needed to REACH the next tier
    const totalRange = rangeEnd - rangeStart;
    const currentProgress = aura - rangeStart;

    let percentage = (currentProgress / totalRange) * 100;
    percentage = Math.max(0, Math.min(100, percentage)); // Clamp 0-100

    return {
        nextTitle: nextTier.name,
        progress: percentage,
        remaining: rangeEnd - aura,
        nextThreshold: rangeEnd
    };
}
