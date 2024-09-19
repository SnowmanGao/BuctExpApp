import type {
    JikkenData,
    JikkenTimetable,
    RawJikken,
    RawStudent,
    StudentData
} from '@/core/MainModel.js';
import { TimeOfDay } from '@/core/MainModel.js';
import { computed, type Ref, ref, type ShallowRef, shallowRef } from 'vue';
import { BuctSchedule } from '@/core/ScheduleSystem';

// 学生字典
type StudentDictType = { [stu_id: string]: StudentData };
const studentDict: ShallowRef<StudentDictType> = shallowRef({});
const isStudentLoaded: Ref<boolean> = ref(false);

// 实验安排字典，和时间表一起加载
type JikkenDictType = { [lab_id: string]: JikkenData };
const jikkenDict: ShallowRef<JikkenDictType> = shallowRef({});
type TimetableDictType = { [week: string]: { [time in TimeOfDay]: number[] } };
const timetableDict: ShallowRef<TimetableDictType> = shallowRef({});
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
    const temp2: TimetableDictType = {};
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
    timetableDict.value = temp2;
}

function queryTimetable(batch: number): JikkenTimetable {
    const result: JikkenTimetable = [];
    Object.entries(timetableDict.value).forEach(([week, schedules]) => {
        Object.values(schedules).forEach((schedule, timeOfDay) => {
            const labId = schedule.indexOf(batch);
            const getStart = BuctSchedule.getDateFromWeekAndPeriod;
            if (labId != -1) {
                result.push({
                    serial: -1, // unset
                    title: jikkenDict.value[labId].title,
                    place: jikkenDict.value[labId].place,
                    teacher: jikkenDict.value[labId].teacher,
                    week: parseInt(week),
                    period: timeOfDay,
                    start: getStart(parseInt(week), timeOfDay)
                });
            }
        });
    });
    result
        .sort((a, b) => a.start.getTime() - b.start.getTime())
        .forEach((item, idx) => (item.serial = idx + 1));
    return result;
}

export {
    studentDict,
    jikkenDict,
    timetableDict,
    isStudentLoaded,
    isJikkenLoaded,
    curStudentId,
    curStudent,
    queryTimetable,
    transStudentData,
    transJikkenData
};
