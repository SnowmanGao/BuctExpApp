// 离散时间（TimeTuple）的取值范围
// 解释: 本期实验在 6 月 2 ~ 12 日均有排课，每天上午、下午、晚上都可能排课。
// 分别以 0、1、2 表示上午、下午、晚上。
export type DayDigit = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
export type PeriodDigit = '0' | '1' | '2';

// 离散时间所描述的起点
export const day_zero = new Date('2025/6/30');

// 上午、下午、晚上的具体小时时刻（24小时制）
export const time_of_day = [9.0, 13.5, 17.5];

// 实验持续的小时数
export const duration = 3.0;
