/**
 * Utility Functions for Skip-Bo Game
 */

export type Rng = () => number;

/**
 * Creates a seeded pseudo-random number generator (mulberry32).
 * @param seed - 32-bit unsigned integer seed
 * @returns Function returning floats in [0, 1)
 */
export function mulberry32(seed: number): Rng {
    let a = seed >>> 0;
    return () => {
        a |= 0;
        a = (a + 0x6D2B79F5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

/**
 * Generates a random 32-bit seed (for new simulation runs).
 */
export function generateSeed(): number {
    return Math.floor(Math.random() * 4294967296);
}

/**
 * Helper to shuffle an array (Fisher-Yates)
 * @param array - Array to shuffle
 * @param rng - Random number generator (defaults to Math.random)
 * @returns Shuffled array
 */
export function shuffle<T>(array: T[], rng: Rng = Math.random): T[] {
    let currentIndex = array.length;
    let randomIndex: number;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(rng() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex]
        ];
    }

    return array;
}
