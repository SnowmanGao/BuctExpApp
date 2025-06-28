import type { JikkenTimetable, JikkenTimetableItem } from '@/core/models/CookedModel';

function queryCurrentJikken(schedule: JikkenTimetable): JikkenTimetableItem | null {
    const current = new Date();
    for (const item of schedule) {
        if (current < item.end_time && current > item.start_time) return item;
    }
    return null;
}

function queryJikkenRemainingSeconds(jikken: JikkenTimetableItem): number {
    return 0.001 * (jikken.end_time.getTime() - Date.now());
}

function queryJikkenProcess(jikken: JikkenTimetableItem): number {
    const end = jikken.end_time.getTime();
    const start = jikken.start_time.getTime();
    return (end - Date.now()) / (end - start);
}

export { queryCurrentJikken, queryJikkenRemainingSeconds, queryJikkenProcess };
