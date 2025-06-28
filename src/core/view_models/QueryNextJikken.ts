import type { JikkenTimetable, JikkenTimetableItem } from '@/core/models/CookedModel';

function queryNextJikken(schedule: JikkenTimetable): JikkenTimetableItem | null {
    const current = new Date();
    for (const item of schedule) {
        if (current < item.start_time) return item;
    }
    return null;
}

export { queryNextJikken };
