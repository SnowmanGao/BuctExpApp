import type {
    JikkenData,
    JikkenTimetable,
    RawJikken,
    RawStudent,
    StudentData
} from '@/core/MainModel.js';
import { TimeOfDay } from '@/core/MainModel.js';
import { computed, type Ref, ref, type ShallowRef, shallowRef } from 'vue';

// 学生字典
type StudentDictType = { [stu_id: string]: StudentData };
const studentDict: ShallowRef<StudentDictType> = shallowRef({});
const isStudentLoaded: Ref<boolean> = ref(false);

// 实验安排字典，和时间表一起加载
type JikkenDictType = { [lab_id: string]: JikkenData };
const jikkenDict: ShallowRef<JikkenDictType> = shallowRef({});
type TimeDictType = { [week: string]: { [time in TimeOfDay]: number[] } };
const timeDict: ShallowRef<TimeDictType> = shallowRef({});
const isJikkenLoaded: Ref<boolean> = ref(false);

// 当前选中的学生的 ID，为 null 则说明未选中任何学生
const curStudentId: Ref<string | null> = ref(null);
// 当前选中的学生，为 null 则说明未选中任何学生
const curStudent: Ref<StudentData | null> = computed(() => {
    if (curStudentId.value === null) return null;
    return studentDict.value[curStudentId.value];
});

function transStudentData(raw: RawStudent) {
    const cls = raw.class;
    const stu = raw.student;
    const temp: StudentDictType = {};
    for (const sid in stu) {
        temp[sid] = {
            batch: stu[sid][0],
            class: cls[stu[sid][1]],
            group: stu[sid][2]
        };
    }
    studentDict.value = temp;
}

function transJikkenData(raw: RawJikken) {
    const jk = raw.jikken;
    const tt = raw.timetable;
    const temp1: JikkenDictType = {};
    const temp2: TimeDictType = {};
    for (const id in jk) {
        temp1[id] = {
            title: jk[id][0],
            place: jk[id][1],
            teacher: jk[id][2]
        };
    }
    for (const week in tt) {
        temp2[week] = {
            [TimeOfDay.Morning]: tt[week][TimeOfDay.Morning],
            [TimeOfDay.Afternoon]: tt[week][TimeOfDay.Afternoon],
            [TimeOfDay.Evening]: tt[week][TimeOfDay.Evening]
        };
    }
    jikkenDict.value = temp1;
    timeDict.value = temp2;
}

function queryJikkenOfBatch(batch: number): JikkenTimetable {
    const result: JikkenTimetable = [];
    Object.entries(timeDict.value).forEach(([week, schedules]) => {
        Object.values(schedules).forEach((schedule, timeOfDay) => {
            const lab_id = schedule.indexOf(batch);
            if (lab_id != -1) {
                result.push({
                    lab_id: lab_id,
                    title: jikkenDict.value[lab_id].title,
                    place: jikkenDict.value[lab_id].place,
                    teacher: jikkenDict.value[lab_id].teacher,
                    week: week,
                    time_of_day: timeOfDay
                });
            }
        });
    });
    result.sort((a, b) => {
        // increasing: week, sub-increasing: time
        if (a.week === b.week) {
            return a.time_of_day - b.time_of_day;
        } else {
            return parseInt(a.week) - parseInt(b.week);
        }
    });
    return result;
}

export {
    studentDict,
    jikkenDict,
    isStudentLoaded,
    isJikkenLoaded,
    curStudentId,
    curStudent,
    queryJikkenOfBatch,
    transStudentData,
    transJikkenData
};
