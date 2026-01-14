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
