/**
 * Utility Functions for Skip-Bo Game
 */

/**
 * Helper to shuffle an array (Fisher-Yates)
 * @param array - Array to shuffle
 * @returns Shuffled array
 */
export function shuffle<T>(array: T[]): T[] {
    let currentIndex = array.length;
    let randomIndex: number;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex]
        ];
    }

    return array;
}
