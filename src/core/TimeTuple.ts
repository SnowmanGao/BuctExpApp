import type { DayDigit, PeriodDigit } from '@/core/Config';

export function buildTimeTuple(day: DayDigit, period: PeriodDigit): TimeTuple {
    return `${day}.${period}`;
}

export function parseTimeTuple(timeTuple: TimeTuple): [day: DayDigit, period: PeriodDigit] {
    const [day, period] = timeTuple.split('.');
    return [day as DayDigit, period as PeriodDigit];
}

// TODO: Remove this function in production build.
export function isTimeTuple(str: string): str is TimeTuple {
    return /^\d+\.\d+$/.test(str);
}

export type TimeTuple = `${DayDigit}.${PeriodDigit}`;
