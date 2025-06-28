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
    jikkenMap.value = jk.map((jikken, id) => ({
        id: id,
        title: jikken[0],
        place: jikken[1],
        teacher: jikken[2],
        info: jikken[3]
    }));
    for (const time in tt) {
        if (!isTimeTuple(time)) throw new Error(`${time} 不是一个有效的 TimeTuple`);
        timetableMap.value.set(time, tt[time]);
    }
}

// console.log(queryAaaDev());
