export type JikkenData = {
    title: string;
    place: string;
    teacher: string;
};

export type StudentData = {
    class: string;
    batch: number;
    group: number;
};

export type RawJikken = {
    jikken: { [lab_id: string]: [title: string, place: string, teacher: string] };
    timetable: { [week: string]: [morning: number[], afternoon: number[], evening: number[]] };
};

export type RawStudent = {
    class: string[];
    student: { [sid: string]: [batch: number, class_: number, group: number] };
};

export enum TimeOfDay {
    Morning = 0,
    Afternoon = 1,
    Evening = 2
}

export type JikkenTimeTableItem = {
    // 实验室编号
    lab_id: number;
    title: string;
    place: string;
    teacher: string;
    week: string;
    time_of_day: TimeOfDay;
};

export type JikkenTimetable = JikkenTimeTableItem[];

export type JikkenScheduleItem = {
    start: Date;
    end: Date;
    jikken: JikkenTimeTableItem;
};

export type JikkenSchedule = JikkenScheduleItem[];
