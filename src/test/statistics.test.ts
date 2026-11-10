import { describe, it, expect } from 'vitest';
import {
    calculateConfidenceInterval,
    calculateQuartiles,
    calculateStandardDeviation,
    chiSquareTest,
    calculateCohenD
} from '../utils/statistics';

describe('calculateConfidenceInterval', () => {
    it('contains the proportion and respects [0, 1] bounds', () => {
        const ci = calculateConfidenceInterval(0.6, 1000);
        expect(ci.lower).toBeLessThanOrEqual(0.6);
        expect(ci.upper).toBeGreaterThanOrEqual(0.6);
        expect(ci.lower).toBeGreaterThanOrEqual(0);
        expect(ci.upper).toBeLessThanOrEqual(1);
        expect(ci.margin).toBeGreaterThan(0);
    });

    it('shrinks with larger sample size', () => {
        const small = calculateConfidenceInterval(0.5, 100);
        const large = calculateConfidenceInterval(0.5, 10000);
        expect(large.margin).toBeLessThan(small.margin);
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
    });
});

describe('calculateStandardDeviation', () => {
    it('is zero for constant data', () => {
        expect(calculateStandardDeviation([5, 5, 5])).toBe(0);
    });
});

describe('chiSquareTest', () => {
    it('detects a strong association', () => {
        const res = chiSquareTest(90, 10, 10, 90);
        expect(res.isSignificant).toBe(true);
        expect(res.pValue).toBeLessThan(0.05);
        expect(res.degreesOfFreedom).toBe(1);
    });

    it('does not detect an association for balanced data', () => {
        const res = chiSquareTest(50, 50, 50, 50);
        expect(res.statistic).toBeCloseTo(0);
        expect(res.isSignificant).toBe(false);
    });
});

describe('calculateCohenD', () => {
    it('returns negligible for identical means and large for separated means', () => {
        const same = calculateCohenD(10, 10, 2, 2, 50, 50);
        expect(same.d).toBe(0);
        expect(same.magnitude).toBe('negligible');

        const diff = calculateCohenD(10, 20, 2, 2, 50, 50);
        expect(diff.d).toBe(5);
        expect(diff.magnitude).toBe('large');
    });
});
