import { describe, it, expect } from 'vitest';
import {
    calculateConfidenceInterval,
    calculateQuartiles,
    calculateStandardDeviation,
    chiSquareTest,
    chiSquareSf,
    mcnemarExactTest,
    binomialTwoSidedPValue,
    mannWhitneyUTest,
    calculateCohenD,
    cohensH,
    normalQuantile,
    normalCdf,
    studentTCdf,
    tCriticalValue,
    calculatePower,
    calculateRequiredSampleSize
} from '../utils/statistics';

describe('normalQuantile / normalCdf', () => {
    it('inverts the normal CDF at known points', () => {
        expect(normalQuantile(0.975)).toBeCloseTo(1.959964, 4);
        expect(normalQuantile(0.5)).toBeCloseTo(0, 10);
        expect(normalCdf(1.959964)).toBeCloseTo(0.975, 6);
    });
});

describe('calculateConfidenceInterval (Wilson score)', () => {
    it('matches the known Wilson interval for p=0.5, n=100 at 95%', () => {
        const ci = calculateConfidenceInterval(0.5, 100);
        // Wilson: center 0.5, margin ~0.0962 -> [0.4038, 0.5962] (Wald would be 0.4020/0.5980)
        expect(ci.lower).toBeCloseTo(0.4038, 3);
        expect(ci.upper).toBeCloseTo(0.5962, 3);
        expect(ci.margin).toBeCloseTo(0.0962, 3);
    });

    it('contains the proportion, respects [0,1] bounds and shrinks with n', () => {
        const ci = calculateConfidenceInterval(0.6, 1000);
        expect(ci.lower).toBeLessThanOrEqual(0.6);
        expect(ci.upper).toBeGreaterThanOrEqual(0.6);
        expect(ci.lower).toBeGreaterThanOrEqual(0);
        expect(ci.upper).toBeLessThanOrEqual(1);

        const small = calculateConfidenceInterval(0.5, 100);
        const large = calculateConfidenceInterval(0.5, 10000);
        expect(large.margin).toBeLessThan(small.margin);
    });

    it('stays inside [0,1] even for extreme proportions', () => {
        const ci = calculateConfidenceInterval(0.99, 50);
        expect(ci.upper).toBeLessThanOrEqual(1);
        expect(ci.lower).toBeGreaterThanOrEqual(0);
    });
});

describe('chiSquareSf / chiSquareTest', () => {
    it('matches known critical values for df=1', () => {
        expect(chiSquareSf(3.841, 1)).toBeCloseTo(0.05, 3);
        expect(chiSquareSf(6.635, 1)).toBeCloseTo(0.01, 3);
    });

    it('detects a strong association with continuity correction', () => {
        const res = chiSquareTest(90, 10, 10, 90);
        expect(res.isSignificant).toBe(true);
        expect(res.pValue).toBeLessThan(0.001);
        expect(res.degreesOfFreedom).toBe(1);
        // Yates-corrected statistic: 4 * (39.5^2 / 50) = 124.82
        expect(res.statistic).toBeCloseTo(124.82, 1);
    });

    it('does not detect an association for balanced data', () => {
        const res = chiSquareTest(50, 50, 50, 50);
        expect(res.statistic).toBeCloseTo(0);
        expect(res.pValue).toBeCloseTo(1, 5);
        expect(res.isSignificant).toBe(false);
    });
});

describe('mcnemarExactTest', () => {
    it('is significant for 90 wins vs 10 losses', () => {
        const res = mcnemarExactTest(90, 10);
        expect(res.discordantPairs).toBe(100);
        expect(res.statistic).toBeCloseTo(62.41, 1);
        expect(res.pValue).toBeLessThan(0.001);
        expect(res.isSignificant).toBe(true);
    });

    it('is not significant for balanced outcomes', () => {
        const res = mcnemarExactTest(50, 50);
        expect(res.pValue).toBeCloseTo(1, 5);
        expect(res.isSignificant).toBe(false);
    });

    it('binomialTwoSidedPValue is symmetric around n/2', () => {
        expect(binomialTwoSidedPValue(30, 100)).toBeCloseTo(binomialTwoSidedPValue(70, 100), 12);
        expect(binomialTwoSidedPValue(50, 100)).toBeCloseTo(1, 5);
    });
});

describe('mannWhitneyUTest', () => {
    it('detects completely separated samples', () => {
        const res = mannWhitneyUTest([1, 2, 3, 4, 5], [6, 7, 8, 9, 10]);
        expect(res.u).toBe(0);
        // mu = 12.5, sigma = sqrt(25/12 * 11) ~ 4.787 -> z ~ -2.611, p ~ 0.009
        expect(res.z).toBeCloseTo(-2.611, 3);
        expect(res.pValue).toBeLessThan(0.05);
        expect(res.isSignificant).toBe(true);
    });

    it('is not significant for identical samples', () => {
        const res = mannWhitneyUTest([1, 2, 3, 4, 5], [1, 2, 3, 4, 5]);
        expect(res.pValue).toBeGreaterThan(0.05);
        expect(res.isSignificant).toBe(false);
    });

    it('handles ties via average ranks', () => {
        const res = mannWhitneyUTest([1, 2, 2, 3], [2, 3, 4, 5]);
        expect(Number.isFinite(res.z)).toBe(true);
        expect(res.pValue).toBeGreaterThan(0.05);
    });
});

describe('studentTCdf / tCriticalValue', () => {
    it('matches known t critical values', () => {
        expect(tCriticalValue(0.95, 29)).toBeCloseTo(2.0452, 3);
        expect(tCriticalValue(0.95, 1000000)).toBeCloseTo(1.96, 2);
        expect(studentTCdf(0, 10)).toBeCloseTo(0.5, 10);
    });
});

describe('effect sizes', () => {
    it('calculateCohenD returns negligible for identical means and large for separated means', () => {
        const same = calculateCohenD(10, 10, 2, 2, 50, 50);
        expect(same.d).toBe(0);
        expect(same.magnitude).toBe('negligible');

        const diff = calculateCohenD(10, 20, 2, 2, 50, 50);
        expect(diff.d).toBe(5);
        expect(diff.magnitude).toBe('large');
    });

    it('cohensH is zero for equal proportions and large for 0.9 vs 0.5', () => {
        expect(cohensH(0.5, 0.5).h).toBe(0);
        const res = cohensH(0.9, 0.5);
        expect(res.h).toBeCloseTo(0.9273, 3);
        expect(res.magnitude).toBe('large');
    });
});

describe('power analysis', () => {
    it('calculatePower respects alpha and effect size', () => {
        // d=0.5, n=100 per group, alpha=0.05 -> power ~ 0.942
        expect(calculatePower(100, 0.5, 0.05)).toBeCloseTo(0.942, 2);
        expect(calculatePower(100, 0.5, 0.01)).toBeLessThan(calculatePower(100, 0.5, 0.05));
        expect(calculatePower(100, 0.1, 0.05)).toBeLessThan(calculatePower(100, 0.5, 0.05));
        expect(calculatePower(1, 0.5)).toBe(0);
    });

    it('calculateRequiredSampleSize respects power and alpha', () => {
        // d=0.5, power=0.8, alpha=0.05 -> n = 63 per group
        expect(calculateRequiredSampleSize(0.5, 0.8, 0.05)).toBe(63);
        expect(calculateRequiredSampleSize(0.5, 0.9, 0.05))
            .toBeGreaterThan(calculateRequiredSampleSize(0.5, 0.8, 0.05));
        expect(calculateRequiredSampleSize(0.5, 0.8, 0.01))
            .toBeGreaterThan(calculateRequiredSampleSize(0.5, 0.8, 0.05));
        expect(calculateRequiredSampleSize(0)).toBe(Infinity);
    });
});

describe('calculateQuartiles', () => {
    it('computes quartiles of a known dataset', () => {
        const q = calculateQuartiles([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        expect(q.min).toBe(1);
        expect(q.max).toBe(10);
        expect(q.median).toBe(5.5);
        expect(q.q1).toBe(3.25);
        expect(q.q3).toBe(7.75);
        expect(q.iqr).toBeCloseTo(4.5);
        expect(q.whiskerLow).toBe(1);
        expect(q.whiskerHigh).toBe(10);
        expect(q.outliers).toEqual([]);
    });

    it('detects outliers beyond the 1.5*IQR fences', () => {
        const q = calculateQuartiles([1, 2, 3, 4, 5, 6, 7, 8, 9, 100]);
        expect(q.whiskerHigh).toBe(9);
        expect(q.outliers).toEqual([100]);
    });
});

describe('calculateStandardDeviation', () => {
    it('is zero for constant data', () => {
        expect(calculateStandardDeviation([5, 5, 5])).toBe(0);
    });
});
