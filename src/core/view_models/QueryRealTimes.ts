import { parseTimeTuple, type TimeTuple } from '@/core/TimeTuple';
import { day_zero, duration, time_of_day } from '@/core/Config';
import dayjs from 'dayjs';
import type { JikkenTimetableItem } from '@/core/models/CookedModel';

function queryTimeFromTuple(time_tuple: TimeTuple): Date {
    const [day, period] = parseTimeTuple(time_tuple);
    return dayjs(day_zero)
        .add(parseInt(day), 'day') //偏移天数
        .hour(time_of_day[parseInt(period)]) //偏移小时
        .toDate();
}

function queryJikkenStartAndEndTime(jikken: JikkenTimetableItem): [Date, Date] {
    const start = jikken.start_time;
    const end = dayjs(start).add(duration, 'hour').toDate();
    return [start, end];
}

function queryCurrentDayNumber(): number {
    return dayjs().diff(day_zero, 'day');
}

export { queryTimeFromTuple, queryJikkenStartAndEndTime, queryCurrentDayNumber };
