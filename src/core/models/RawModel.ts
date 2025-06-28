export type RawJikken = {
    // 依次罗列各个实验的主题、地点、教师、描述
    jikken: [title: string, place: string, teacher: string, info: string];
    // 索引为实验的离散时间，值为从 实验室编号 到 学生批次号 的映射
    timetable: { [time_tuple: string]: number[] };
};

export type RawStudent = {
    // 班级映射。索引为班级号，值为班级全称
    class_map: string[];
    // 学生映射。索引为学生 ID，值为批次号、班级索引号、组号
    student_map: { [sid: string]: [batch: number, class_: number, group: number] };
};
