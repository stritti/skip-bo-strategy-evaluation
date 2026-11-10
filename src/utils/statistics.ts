/**
 * Statistical Utility Functions for Scientific Analysis
 * Implements confidence intervals, significance testing, effect sizes
 * and distribution metrics.
 *
 * Numerical special functions (ln-gamma, incomplete gamma/beta) follow the
 * standard series / continued-fraction expansions (Numerical Recipes).
 */

// ---------------------------------------------------------------------------
// Special functions
// ---------------------------------------------------------------------------

/**
 * Natural logarithm of the Gamma function (Lanczos approximation).
 */
function lnGamma(z: number): number {
    const c = [
        0.99999999999980993, 676.5203681218851, -1259.1392167224028,
        771.32342877765313, -176.61502916214059, 12.507343278686905,
        -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7
    ];
    if (z < 0.5) {
        return Math.log(Math.PI / Math.sin(Math.PI * z)) - lnGamma(1 - z);
    }
    z -= 1;
    let x = c[0];
    for (let i = 1; i < c.length; i++) {
        x += c[i] / (z + i);
    }
    const t = z + 7 + 0.5;
    return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

const GAMMA_EPS = 3e-14;
const GAMMA_FPMIN = 1e-300;
const GAMMA_ITER = 500;

/**
 * Lower regularized incomplete gamma function P(a, x) via series expansion.
 */
function gammaSeriesP(a: number, x: number): number {
    let ap = a;
    let sum = 1 / a;
    let del = sum;
    for (let n = 1; n <= GAMMA_ITER; n++) {
        ap += 1;
        del *= x / ap;
        sum += del;
        if (Math.abs(del) < Math.abs(sum) * GAMMA_EPS) break;
    }
    return sum * Math.exp(-x + a * Math.log(x) - lnGamma(a));
}

/**
 * Upper regularized incomplete gamma function Q(a, x) via continued fraction.
 */
function gammaCfQ(a: number, x: number): number {
    let b = x + 1 - a;
    let c = 1 / GAMMA_FPMIN;
    let d = 1 / b;
    let h = d;
    for (let i = 1; i <= GAMMA_ITER; i++) {
        const an = -i * (i - a);
        b += 2;
        d = an * d + b;
        if (Math.abs(d) < GAMMA_FPMIN) d = GAMMA_FPMIN;
        c = b + an / c;
        if (Math.abs(c) < GAMMA_FPMIN) c = GAMMA_FPMIN;
        d = 1 / d;
        const del = d * c;
        h *= del;
        if (Math.abs(del - 1) < GAMMA_EPS) break;
    }
    return Math.exp(-x + a * Math.log(x) - lnGamma(a)) * h;
}

/**
 * Upper regularized incomplete gamma function Q(a, x).
 */
function gammaQ(a: number, x: number): number {
    if (x < 0 || a <= 0) return NaN;
    if (x === 0) return 1;
    if (x < a + 1) return 1 - gammaSeriesP(a, x);
    return gammaCfQ(a, x);
}

/**
 * Survival function of the chi-square distribution: P(X > x) for df degrees of freedom.
 */
export function chiSquareSf(x: number, df: number): number {
    if (x <= 0) return 1;
    return gammaQ(df / 2, x / 2);
}

/**
 * Continued fraction for the regularized incomplete beta function.
 */
function betaCf(a: number, b: number, x: number): number {
    const qab = a + b;
    const qap = a + 1;
    const qam = a - 1;
    let c = 1;
    let d = 1 - (qab * x) / qap;
    if (Math.abs(d) < GAMMA_FPMIN) d = GAMMA_FPMIN;
    d = 1 / d;
    let h = d;
    for (let m = 1; m <= GAMMA_ITER; m++) {
        const m2 = 2 * m;
        let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
        d = 1 + aa * d;
        if (Math.abs(d) < GAMMA_FPMIN) d = GAMMA_FPMIN;
        c = 1 + aa / c;
        if (Math.abs(c) < GAMMA_FPMIN) c = GAMMA_FPMIN;
        d = 1 / d;
        h *= d * c;
        aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
        d = 1 + aa * d;
        if (Math.abs(d) < GAMMA_FPMIN) d = GAMMA_FPMIN;
        c = 1 + aa / c;
        if (Math.abs(c) < GAMMA_FPMIN) c = GAMMA_FPMIN;
        d = 1 / d;
        const del = d * c;
        h *= del;
        if (Math.abs(del - 1) < GAMMA_EPS) break;
    }
    return h;
}

/**
 * Regularized incomplete beta function I_x(a, b).
 */
function betaI(a: number, b: number, x: number): number {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    const bt = Math.exp(
        lnGamma(a + b) - lnGamma(a) - lnGamma(b) +
        a * Math.log(x) + b * Math.log(1 - x)
    );
    if (x < (a + 1) / (a + b + 2)) {
        return (bt * betaCf(a, b, x)) / a;
    }
    return 1 - (bt * betaCf(b, a, 1 - x)) / b;
}

/**
 * CDF of the standard normal distribution.
 */
export function normalCdf(x: number): number {
    return 0.5 * (1 + erf(x / Math.sqrt(2)));
}

/**
 * Error function approximation (Abramowitz and Stegun 7.1.26).
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
 * Quantile (inverse CDF) of the standard normal distribution (Acklam's approximation).
 */
export function normalQuantile(p: number): number {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;

    const a = [
        -3.969683028665376e+01, 2.209460984245205e+02, -2.759285104469687e+02,
        1.383577518672690e+02, -3.066479806614716e+01, 2.506628277459239e+00
    ];
    const b = [
        -5.447609879822406e+01, 1.615858368580409e+02, -1.556989798598866e+02,
        6.680131188771972e+01, -1.328068155288572e+01
    ];
    const c = [
        -7.784894002430293e-03, -3.223964580411365e-01, -2.400758277161838e+00,
        -2.549732539343734e+00, 4.374664141464968e+00, 2.938163982698783e+00
    ];
    const d = [
        7.784695709041462e-03, 3.224671290700398e-01, 2.445134137142996e+00,
        3.754408661907416e+00
    ];

    const pLow = 0.02425;
    const pHigh = 1 - pLow;
    let q: number;
    let r: number;

    if (p < pLow) {
        q = Math.sqrt(-2 * Math.log(p));
        return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
            ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    } else if (p <= pHigh) {
        q = p - 0.5;
        r = q * q;
        return (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q /
            (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
    } else {
        q = Math.sqrt(-2 * Math.log(1 - p));
        return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) /
            ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
    }
}

/**
 * CDF of Student's t distribution with df degrees of freedom.
 */
export function studentTCdf(t: number, df: number): number {
    if (df <= 0) return NaN;
    const x = df / (df + t * t);
    const ib = betaI(df / 2, 0.5, x);
    return t >= 0 ? 1 - 0.5 * ib : 0.5 * ib;
}

/**
 * Quantile of Student's t distribution (inverse CDF), found by bisection.
 */
export function studentTQuantile(p: number, df: number): number {
    if (p <= 0) return -Infinity;
    if (p >= 1) return Infinity;
    if (p === 0.5) return 0;
    if (p < 0.5) return -studentTQuantile(1 - p, df);

    let lo = 0;
    let hi = 1;
    while (studentTCdf(hi, df) < p) {
        hi *= 2;
        if (hi > 1e12) break;
    }
    for (let iter = 0; iter < 200; iter++) {
        const mid = (lo + hi) / 2;
        if (studentTCdf(mid, df) < p) lo = mid;
        else hi = mid;
    }
    return (lo + hi) / 2;
}

/**
 * Two-sided critical value of Student's t distribution, e.g. t(0.975, df) for a 95% CI.
 */
export function tCriticalValue(confidence: number = 0.95, df: number): number {
    return studentTQuantile(0.5 + confidence / 2, df);
}

// ---------------------------------------------------------------------------
// Confidence intervals
// ---------------------------------------------------------------------------

/**
 * Calculates a confidence interval for a proportion using the Wilson score method.
 * More accurate than the Wald interval, especially for p near 0/1 or small n.
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

    const z = normalQuantile(0.5 + confidence / 2);
    const z2 = z * z;
    const n = sampleSize;
    const denom = 1 + z2 / n;
    const center = (proportion + z2 / (2 * n)) / denom;
    const margin = (z / denom) * Math.sqrt(
        (proportion * (1 - proportion)) / n + z2 / (4 * n * n)
    );

    return {
        margin,
        lower: Math.max(0, center - margin),
        upper: Math.min(1, center + margin)
    };
}

/**
 * Formats a confidence interval for display
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

// ---------------------------------------------------------------------------
// Descriptive statistics
// ---------------------------------------------------------------------------

/**
 * Calculates the (population) standard deviation of a dataset.
 */
export function calculateStandardDeviation(values: number[]): number {
    if (values.length === 0) return 0;

    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;

    return Math.sqrt(variance);
}

export interface Quartiles {
    min: number;
    q1: number;
    median: number;
    q3: number;
    max: number;
    iqr: number;
    whiskerLow: number;
    whiskerHigh: number;
    outliers: number[];
}

/**
 * Calculates quartiles (Q1, median, Q3), IQR, 1.5*IQR whiskers and outliers.
 * Quartiles use linear interpolation (same convention as numpy's default).
 */
export function calculateQuartiles(values: number[]): Quartiles {
    if (values.length === 0) {
        return { min: 0, q1: 0, median: 0, q3: 0, max: 0, iqr: 0, whiskerLow: 0, whiskerHigh: 0, outliers: [] };
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

    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;
    const whiskerLow = sorted.find(v => v >= lowerFence) ?? min;
    const whiskerHigh = [...sorted].reverse().find(v => v <= upperFence) ?? max;
    const outliers = sorted.filter(v => v < lowerFence || v > upperFence);

    return { min, q1, median, q3, max, iqr, whiskerLow, whiskerHigh, outliers };
}

// ---------------------------------------------------------------------------
// Significance tests
// ---------------------------------------------------------------------------

/**
 * Binomial PMF: P(X = k) for X ~ Binomial(n, p).
 */
function binomialPmf(k: number, n: number, p: number): number {
    if (k < 0 || k > n) return 0;
    if (p === 0) return k === 0 ? 1 : 0;
    if (p === 1) return k === n ? 1 : 0;
    return Math.exp(
        lnGamma(n + 1) - lnGamma(k + 1) - lnGamma(n - k + 1) +
        k * Math.log(p) + (n - k) * Math.log(1 - p)
    );
}

/**
 * Two-sided exact binomial test p-value: sum of all outcome probabilities
 * that are not larger than the observed probability.
 */
export function binomialTwoSidedPValue(k: number, n: number, p: number = 0.5): number {
    if (n === 0) return 1;
    const pObs = binomialPmf(k, n, p);
    let pValue = 0;
    for (let i = 0; i <= n; i++) {
        const pi = binomialPmf(i, n, p);
        if (pi <= pObs * (1 + 1e-9)) pValue += pi;
    }
    return Math.min(1, pValue);
}

/**
 * Exact McNemar test for paired binary outcomes (e.g. wins vs. losses of two
 * strategies in the same set of games). With every game decisive, the
 * discordant pairs are (wins, losses) and the exact test reduces to a
 * two-sided binomial test against p = 0.5.
 *
 * @returns chi-square statistic (with continuity correction), exact p-value,
 *          significance flag and the number of discordant pairs
 */
export function mcnemarExactTest(
    wins: number,
    losses: number
): { statistic: number; pValue: number; isSignificant: boolean; discordantPairs: number } {
    const n = wins + losses;
    if (n === 0) {
        return { statistic: 0, pValue: 1, isSignificant: false, discordantPairs: 0 };
    }

    const statistic = (Math.abs(wins - losses) - 1) ** 2 / n;
    const pValue = binomialTwoSidedPValue(Math.min(wins, losses), n, 0.5);

    return {
        statistic,
        pValue,
        isSignificant: pValue < 0.05,
        discordantPairs: n
    };
}

/**
 * Chi-square test for a 2x2 contingency table. Applies Yates' continuity
 * correction by default and computes the exact p-value from the chi-square
 * survival function.
 *
 * @param wins1 - Wins for group 1
 * @param losses1 - Losses for group 1
 * @param wins2 - Wins for group 2
 * @param losses2 - Losses for group 2
 * @param continuityCorrection - Apply Yates' correction (default: true)
 */
export function chiSquareTest(
    wins1: number,
    losses1: number,
    wins2: number,
    losses2: number,
    continuityCorrection: boolean = true
): { statistic: number; pValue: number; isSignificant: boolean; degreesOfFreedom: number } {
    const total1 = wins1 + losses1;
    const total2 = wins2 + losses2;
    const totalWins = wins1 + wins2;
    const totalLosses = losses1 + losses2;
    const grandTotal = total1 + total2;

    if (grandTotal === 0) {
        return { statistic: 0, pValue: 1, isSignificant: false, degreesOfFreedom: 1 };
    }

    const expected = [
        (total1 * totalWins) / grandTotal,
        (total1 * totalLosses) / grandTotal,
        (total2 * totalWins) / grandTotal,
        (total2 * totalLosses) / grandTotal
    ];
    const observed = [wins1, losses1, wins2, losses2];

    let chiSquare = 0;
    for (let i = 0; i < 4; i++) {
        if (expected[i] === 0) continue;
        const diff = continuityCorrection
            ? Math.max(0, Math.abs(observed[i] - expected[i]) - 0.5)
            : Math.abs(observed[i] - expected[i]);
        chiSquare += (diff * diff) / expected[i];
    }

    const df = 1;
    const pValue = chiSquareSf(chiSquare, df);

    return {
        statistic: chiSquare,
        pValue,
        isSignificant: pValue < 0.05,
        degreesOfFreedom: df
    };
}

/**
 * Mann-Whitney U test (two-sided, normal approximation with tie correction)
 * for comparing two independent samples of (possibly non-normal) values,
 * e.g. game durations of two strategy matchups.
 */
export function mannWhitneyUTest(
    x: number[],
    y: number[]
): { u: number; z: number; pValue: number; isSignificant: boolean } {
    const n1 = x.length;
    const n2 = y.length;
    if (n1 === 0 || n2 === 0) {
        return { u: 0, z: 0, pValue: 1, isSignificant: false };
    }

    const combined = [
        ...x.map(v => ({ v, group: 0 })),
        ...y.map(v => ({ v, group: 1 }))
    ].sort((a, b) => a.v - b.v);

    const ranks = new Array<number>(combined.length);
    let i = 0;
    let tieTerm = 0;
    while (i < combined.length) {
        let j = i;
        while (j + 1 < combined.length && combined[j + 1].v === combined[i].v) j++;
        const avgRank = (i + j) / 2 + 1;
        for (let k = i; k <= j; k++) ranks[k] = avgRank;
        const t = j - i + 1;
        tieTerm += t * t * t - t;
        i = j + 1;
    }

    let rankSum1 = 0;
    combined.forEach((item, idx) => {
        if (item.group === 0) rankSum1 += ranks[idx];
    });

    const u1 = rankSum1 - (n1 * (n1 + 1)) / 2;
    const n = n1 + n2;
    const mu = (n1 * n2) / 2;
    const sigma = Math.sqrt(
        (n1 * n2 / 12) * ((n + 1) - tieTerm / (n * (n - 1)))
    );

    const z = sigma === 0 ? 0 : (u1 - mu) / sigma;
    const pValue = 2 * (1 - normalCdf(Math.abs(z)));

    return { u: u1, z, pValue, isSignificant: pValue < 0.05 };
}

/**
 * Holm-Bonferroni correction for multiple comparisons.
 * Returns adjusted p-values (monotonically enforced) in the original order.
 */
export function holmCorrect(pValues: number[]): number[] {
    const m = pValues.length;
    const order = pValues
        .map((p, i) => ({ p, i }))
        .sort((a, b) => a.p - b.p);

    const adjusted = new Array<number>(m);
    let runningMax = 0;
    order.forEach(({ p, i }, rank) => {
        runningMax = Math.max(runningMax, (m - rank) * p);
        adjusted[i] = Math.min(1, runningMax);
    });
    return adjusted;
}

// ---------------------------------------------------------------------------
// Effect sizes
// ---------------------------------------------------------------------------

export type Magnitude = 'negligible' | 'small' | 'medium' | 'large';

function magnitudeOf(d: number): { magnitude: Magnitude; interpretation: string } {
    if (d < 0.2) return { magnitude: 'negligible', interpretation: 'Vernachlässigbar klein' };
    if (d < 0.5) return { magnitude: 'small', interpretation: 'Kleiner Effekt' };
    if (d < 0.8) return { magnitude: 'medium', interpretation: 'Mittlerer Effekt' };
    return { magnitude: 'large', interpretation: 'Großer Effekt' };
}

/**
 * Cohen's d effect size for comparing two means (standardized mean difference).
 */
export function calculateCohenD(
    mean1: number,
    mean2: number,
    std1: number,
    std2: number,
    n1: number,
    n2: number
): { d: number; interpretation: string; magnitude: Magnitude } {
    if (n1 === 0 || n2 === 0) {
        return { d: 0, interpretation: 'Nicht berechenbar', magnitude: 'negligible' };
    }

    const pooledStd = Math.sqrt(((n1 - 1) * std1 * std1 + (n2 - 1) * std2 * std2) / (n1 + n2 - 2));
    if (pooledStd === 0) {
        return { d: 0, interpretation: 'Nicht berechenbar', magnitude: 'negligible' };
    }

    const d = Math.abs((mean1 - mean2) / pooledStd);
    const { magnitude, interpretation } = magnitudeOf(d);

    return { d, interpretation, magnitude };
}

/**
 * Cohen's h effect size for comparing two proportions.
 * Appropriate for win rates; h = |2*asin(sqrt(p1)) - 2*asin(sqrt(p2))|.
 */
export function cohensH(
    p1: number,
    p2: number
): { h: number; interpretation: string; magnitude: Magnitude } {
    const h = Math.abs(2 * Math.asin(Math.sqrt(p1)) - 2 * Math.asin(Math.sqrt(p2)));
    const { magnitude, interpretation } = magnitudeOf(h);

    return { h, interpretation, magnitude };
}

// ---------------------------------------------------------------------------
// Power analysis
// ---------------------------------------------------------------------------

/**
 * Statistical power of a two-sided two-sample test with n observations per
 * group for a given effect size (Cohen's d) and significance level.
 * Uses the normal approximation.
 *
 * @param n - Sample size per group
 * @param effectSize - Expected effect size (Cohen's d)
 * @param alpha - Significance level (default: 0.05)
 * @returns Estimated power (0-1)
 */
export function calculatePower(
    n: number,
    effectSize: number,
    alpha: number = 0.05
): number {
    if (n < 2 || effectSize === 0) return 0;

    const zAlpha = normalQuantile(1 - alpha / 2);
    const power = normalCdf(effectSize * Math.sqrt(n / 2) - zAlpha);

    return Math.max(0, Math.min(1, power));
}

/**
 * Required sample size per group to detect a given effect size with the
 * desired power and significance level (two-sided, two-sample).
 *
 * @param effectSize - Expected effect size (Cohen's d)
 * @param power - Desired power (default: 0.8)
 * @param alpha - Significance level (default: 0.05)
 * @returns Required sample size per group
 */
export function calculateRequiredSampleSize(
    effectSize: number,
    power: number = 0.8,
    alpha: number = 0.05
): number {
    if (effectSize === 0) return Infinity;

    const zAlpha = normalQuantile(1 - alpha / 2);
    const zBeta = normalQuantile(power);

    return Math.ceil(2 * Math.pow((zAlpha + zBeta) / effectSize, 2));
}
