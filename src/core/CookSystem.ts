import type { RawJikken, RawStudent } from '@/core/models/RawModel';
import { jikkenMap, studentMap } from '@/core/GlobalVars';
import { isTimeTuple } from '@/core/TimeTuple';
import { timetableMap } from '@/core/GlobalVars';

// To cook raw data into cooked data

export function cookStudentData(raw: RawStudent) {
    const cls = raw.class_map;
    const stu = raw.student_map;

    for (const sid in stu) {
        studentMap.value.set(sid, {
            batch: stu[sid][0],
            class: cls[stu[sid][1]],
            group: stu[sid][2]
        });
    }
}

export function cookJikkenData(raw: RawJikken) {
    const jk = raw.jikken;
    const tt = raw.timetable;
    for (const id in jk) {
        jikkenMap.value[id] = {
            title: jk[id][0],
            place: jk[id][1],
            teacher: jk[id][2],
            info: jk[id][3]
        };
    }
    for (const time in tt) {
        if (!isTimeTuple(time)) throw new Error(`${time} 不是一个有效的 TimeTuple`);
        timetableMap.value.set(time, tt[time]);
    }
}

// console.log(queryAaaDev());
