import { type JikkenSchedule, type JikkenTimetable, TimeOfDay } from '@/core/MainModel';

class BuctSchedule {
    static CONFIG = {
        base_week: 34,
        jikken_day_of_week: 6,
        // 将上午、下午、晚上映射为具体时间（24小时制）
        time_of_day: [9.0, 13.5, 17.5]
    };

    static getWeekOfYear(date: Date) {
        const [y, m, d] = [date.getFullYear(), date.getMonth(), date.getDate()];
        const date1 = new Date(y, m, d);
        const date2 = new Date(y, 0, 1);
        const day = Math.round((date1.valueOf() - date2.valueOf()) / 86400000);
        return Math.ceil((day + (date2.getDay() + 1 - 1)) / 7);
    }

    static getWeekOfBuct(date: Date) {
        const week = this.getWeekOfYear(date);
        return week - this.CONFIG.base_week;
    }

    // static transToSchedule(table: JikkenTimetable): JikkenSchedule {
    //     return table.map((item) => ({
    //         jikken: item,
    //         ...this.buildTime(item.time_of_day, item.week)
    //     }));
    // }

    // private static buildTime(period: TimeOfDay, buct_week: string) {
    //     const start = new Date()
    //     return { start: new Date(), end: new Date() };
    // }
}

export { BuctSchedule };
