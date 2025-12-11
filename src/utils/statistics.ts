/**
 * Statistical Utility Functions for Scientific Analysis
 * Implements confidence intervals, significance testing, and distribution metrics
 */

/**
 * Calculates the 95% confidence interval for a proportion
 * Uses the Wald method: CI = p ± z * sqrt(p(1-p)/n)
 * 
 * @param proportion - The observed proportion (e.g., win rate)
 * @param sampleSize - Total number of observations
 * @param confidence - Confidence level (default: 0.95)
 * @returns Object with margin, lower, and upper bounds
 */
export function calculateConfidenceInterval(
    proportion: number,
    sampleSize: number,
    confidence: number = 0.95
): { margin: number; lower: number; upper: number } {
    if (sampleSize === 0) {
        return { margin: 0, lower: proportion, upper: proportion };
    }

    // Z-score for confidence level (1.96 for 95%, 2.576 for 99%)
    const zScore = confidence === 0.99 ? 2.576 : 1.96;

    // Standard error for proportion
    const standardError = Math.sqrt((proportion * (1 - proportion)) / sampleSize);

    // Margin of error
    const margin = zScore * standardError;

    return {
        margin,
        lower: Math.max(0, proportion - margin),
        upper: Math.min(1, proportion + margin)
    };
}

/**
 * Calculates standard deviation of a dataset
 * 
 * @param values - Array of numeric values
 * @returns Standard deviation
 */
export function calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;

    return Math.sqrt(variance);
}

/**
 * Calculates quartiles (Q1, Median, Q3) and IQR for box plots
 * 
 * @param values - Array of numeric values
 * @returns Object with min, q1, median, q3, max, iqr
 */
export function calculateQuartiles(values: number[]): {
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    iqr: number;
} {
    if (values.length === 0) {
        return { min: 0, q1: 0, median: 0, q3: 0, max: 0, iqr: 0 };
    }

    const sorted = [...values].sort((a, b) => a - b);
    const n = sorted.length;

    const getPercentile = (p: number) => {
        const index = (n - 1) * p;
        const lower = Math.floor(index);
        const upper = Math.ceil(index);
        const weight = index - lower;

        return sorted[lower] * (1 - weight) + sorted[upper] * weight;
    };

    const min = sorted[0];
    const q1 = getPercentile(0.25);
    const median = getPercentile(0.5);
    const q3 = getPercentile(0.75);
    const max = sorted[n - 1];
    const iqr = q3 - q1;

    return { min, q1, median, q3, max, iqr };
}

/**
 * Performs Chi-Square test for independence between two categorical variables
 * Tests if observed frequencies differ significantly from expected frequencies
 * 
 * @param wins1 - Wins for group 1
 * @param losses1 - Losses for group 1
 * @param wins2 - Wins for group 2  
 * @param losses2 - Losses for group 2
 * @returns Object with chi-square statistic, p-value, and significance flag
 */
export function chiSquareTest(
    wins1: number,
    losses1: number,
    wins2: number,
    losses2: number
): { statistic: number; pValue: number; isSignificant: boolean; degreesOfFreedom: number } {
    const total1 = wins1 + losses1;
    const total2 = wins2 + losses2;
    const totalWins = wins1 + wins2;
    const totalLosses = losses1 + losses2;
    const grandTotal = total1 + total2;

    if (grandTotal === 0) {
        return { statistic: 0, pValue: 1, isSignificant: false, degreesOfFreedom: 1 };
    }

    // Expected frequencies under null hypothesis (no association)
    const expected11 = (total1 * totalWins) / grandTotal;
    const expected12 = (total1 * totalLosses) / grandTotal;
    const expected21 = (total2 * totalWins) / grandTotal;
    const expected22 = (total2 * totalLosses) / grandTotal;

    // Chi-square statistic: Σ[(O - E)² / E]
    const chiSquare =
        Math.pow(wins1 - expected11, 2) / expected11 +
        Math.pow(losses1 - expected12, 2) / expected12 +
        Math.pow(wins2 - expected21, 2) / expected21 +
        Math.pow(losses2 - expected22, 2) / expected22;

    // Degrees of freedom for 2x2 contingency table
    const df = 1;

    // Approximate p-value using chi-square distribution
    // For df=1, we use a lookup table approximation
    const pValue = chiSquareToPValue(chiSquare, df);

    return {
        statistic: chiSquare,
        pValue,
        isSignificant: pValue < 0.05,
        degreesOfFreedom: df
    };
}

/**
 * Converts chi-square statistic to p-value (approximation for df=1)
 * Uses lookup table for common values
 */
function chiSquareToPValue(chiSquare: number, df: number): number {
    if (df !== 1) {
        // Simplified approximation for df=1 only
        throw new Error('Only df=1 is currently supported');
    }

    // Critical values for df=1
    // chi² > 3.84  → p < 0.05  (5% significance)
    // chi² > 6.63  → p < 0.01  (1% significance)
    // chi² > 10.83 → p < 0.001 (0.1% significance)

    if (chiSquare > 10.83) return 0.001;
    if (chiSquare > 6.63) return 0.01;
    if (chiSquare > 3.84) return 0.05;
    if (chiSquare > 2.71) return 0.10;

    // For low chi-square values, approximate inversely
    return Math.max(0.1, 1 / (1 + chiSquare));
}

/**
 * Formats a confidence interval for display
 * 
 * @param ci - Confidence interval object
 * @param asPercentage - Whether to display as percentage
 * @param decimals - Number of decimal places
 * @returns Formatted string
 */
export function formatConfidenceInterval(
    ci: { lower: number; upper: number; margin: number },
    asPercentage: boolean = true,
    decimals: number = 1
): string {
    const multiplier = asPercentage ? 100 : 1;
    const lower = (ci.lower * multiplier).toFixed(decimals);
    const upper = (ci.upper * multiplier).toFixed(decimals);
    const margin = (ci.margin * multiplier).toFixed(decimals);
    const unit = asPercentage ? '%' : '';

    return `±${margin}${unit} (${lower}${unit} - ${upper}${unit})`;
}

/**
 * Calculates Cohen's d effect size for comparing two groups
 * Measures the standardized difference between two means
 * 
 * @param mean1 - Mean of group 1
 * @param mean2 - Mean of group 2
 * @param std1 - Standard deviation of group 1
 * @param std2 - Standard deviation of group 2
 * @param n1 - Sample size of group 1
 * @param n2 - Sample size of group 2
 * @returns Cohen's d value and interpretation
 */
export function calculateCohenD(
    mean1: number,
    mean2: number,
    std1: number,
    std2: number,
    n1: number,
    n2: number
): { d: number; interpretation: string; magnitude: 'negligible' | 'small' | 'medium' | 'large' } {
    if (n1 === 0 || n2 === 0) {
        return { d: 0, interpretation: 'Nicht berechenbar', magnitude: 'negligible' };
    }

    // Pooled standard deviation
    const pooledStd = Math.sqrt(((n1 - 1) * std1 * std1 + (n2 - 1) * std2 * std2) / (n1 + n2 - 2));

    // Cohen's d
    const d = Math.abs((mean1 - mean2) / pooledStd);

    // Interpretation based on standard thresholds
    let magnitude: 'negligible' | 'small' | 'medium' | 'large';
    let interpretation: string;

    if (d < 0.2) {
        magnitude = 'negligible';
        interpretation = 'Vernachlässigbar klein';
    } else if (d < 0.5) {
        magnitude = 'small';
        interpretation = 'Kleiner Effekt';
    } else if (d < 0.8) {
        magnitude = 'medium';
        interpretation = 'Mittlerer Effekt';
    } else {
        magnitude = 'large';
        interpretation = 'Großer Effekt';
    }

    return { d, interpretation, magnitude };
}

/**
 * Calculates statistical power for a given sample size and effect size
 * Approximation for two-sample t-test
 * 
 * @param n - Sample size per group
 * @param effectSize - Expected effect size (Cohen's d)
 * @param alpha - Significance level (default: 0.05)
 * @returns Estimated power (0-1)
 */
export function calculatePower(
    n: number,
    effectSize: number,
    _alpha: number = 0.05  // Reserved for future use
): number {
    if (n < 2) return 0;

    // Delta (non-centrality parameter)
    const delta = effectSize * Math.sqrt(n / 2);

    // Critical t-value for alpha
    const tCrit = 1.96; // Approximation for alpha = 0.05

    // Power approximation using normal distribution
    // Power = 1 - Φ(t_crit - delta) where Φ is CDF of standard normal
    const power = 1 - cdfNormal(tCrit - delta);

    return Math.max(0, Math.min(1, power));
}

/**
 * Cumulative distribution function for standard normal distribution
 * Approximation using error function
 */
function cdfNormal(x: number): number {
    // Using approximation: CDF(x) ≈ 0.5 * (1 + erf(x/√2))
    return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

/**
 * Error function approximation (Abramowitz and Stegun)
 */
function erf(x: number): number {
    const sign = x >= 0 ? 1 : -1;
    x = Math.abs(x);

    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const t = 1 / (1 + p * x);
    const y = 1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return sign * y;
}

/**
 * Calculates required sample size for desired power
 * 
 * @param effectSize - Expected effect size (Cohen's d)
 * @param power - Desired power (default: 0.8)
 * @param alpha - Significance level (default: 0.05)
 * @returns Required sample size per group
 */
export function calculateRequiredSampleSize(
    effectSize: number,
    _power: number = 0.8,    // Reserved for future use
    _alpha: number = 0.05    // Reserved for future use
): number {
    if (effectSize === 0) return Infinity;

    // Z-scores for alpha and power
    const zAlpha = 1.96; // For alpha = 0.05 (two-tailed)
    const zBeta = 0.84;  // For power = 0.80

    // Formula: n = 2 * (z_α + z_β)² / d²
    const n = 2 * Math.pow(zAlpha + zBeta, 2) / Math.pow(effectSize, 2);

    return Math.ceil(n);
}
