import type { JikkenTimetable, JikkenTimetableItem } from '@/core/models/CookedModel';
import { jikkenMap } from '@/core/GlobalVars';
import { timetableMap } from '@/core/GlobalVars';
import { queryTimeFromTuple } from '@/core/view_models/QueryRealTimes';
import dayjs from 'dayjs';
import { duration } from '@/core/Config';
import { easterEgg } from '@/core/Utils';

function queryTimetable(batch: number): JikkenTimetable {
    const result: JikkenTimetableItem[] = [];
    for (const [tuple, batches] of timetableMap.value) {
        const idx = batches.indexOf(batch);
        if (idx == -1) continue;
        const time = queryTimeFromTuple(tuple);
        result.push({
            nth: -1, // unset
            jikken: jikkenMap.value[idx],
            start_time_tuple: tuple,
            start_time: time,
            end_time: dayjs(time).add(duration, 'hour').toDate()
        });
    }
    result // set idx here
        .sort((a, b) => a.start_time.getTime() - b.start_time.getTime())
        .forEach((item, idx) => (item.nth = idx + 1));
    // easter egg
    easterEgg(result[result.length - 1].end_time);
    return result;
}

export { queryTimetable };
