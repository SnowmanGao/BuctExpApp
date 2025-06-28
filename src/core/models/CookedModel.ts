import type { TimeTuple } from '@/core/TimeTuple';

export type JikkenData = {
    title: string;
    place: string;
    teacher: string;
    info: string;
};

export type StudentData = {
    class: string;
    batch: number;
    group: number;
};

// 学生个人视角的实验时间表
export type JikkenTimetableItem = {
    nth: number;
    jikken: JikkenData;
    start_time_tuple: TimeTuple;
    start_time: Date;
    end_time: Date;
};

// 实验时间表，
// 必须保证 JikkenTimetable 是按时间顺序排列的！
export type JikkenTimetable = readonly JikkenTimetableItem[];
