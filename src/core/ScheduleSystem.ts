import {
    type JikkenData,
    type JikkenSchedule,
    type JikkenTimetable,
    TimeOfDay
} from '@/core/MainModel';

class ScheduleSystem {
    static current() {
        return new Date();
    }

    static getNextJikken(schedule: JikkenSchedule): JikkenData | null {
        const current = this.current();
        schedule.sort((a, b) => a.start.getTime() - b.start.getTime());
        for (const item of schedule) {
            // TODO: 考虑迟到余量
            if (current < item.start) {
                return item.jikken;
            }
        }
        return null;
    }
}

/*
    此类为临时解决方案。
    注意，类内 week 全部表示学期内部周数！
*/
class BuctSchedule {
    // TODO: 配置文件用 Fetch API获取
    static CONFIG = {
        // 表示本学期第一周的开始日期
        week_start: new Date('2024/8/26'), // 表示实验在星期几
        jikken_day_of_week: 6, // 上午、下午、晚上到具体时间的映射（24小时制）
        time_of_day: [9.0, 13.5, 17.5]
    };

    // 根据学期内周数计算那周的开始日期
    static getDateFromWeek(week: number) {
        return this.getDateAfterDays(this.CONFIG.week_start, week * 7);
    }

    // 在给定日期上增加天数，返回新的日期对象
    static getDateAfterDays(date: Date, days: number): Date {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + days);
        return newDate;
    }

    static getDateAfterHours(date: Date, hours: number): Date {
        const newDate = new Date(date);
        newDate.setHours(date.getHours() + hours);
        return newDate;
    }

    static transToSchedule(table: JikkenTimetable): JikkenSchedule {
        function buildMyTime(period: TimeOfDay, week: number) {
            const offset = (day: number) => (day == 0 ? 6 : day - 1);
            const bs = BuctSchedule;
            const start = bs.getDateAfterDays(
                bs.getDateFromWeek(week),
                offset(bs.CONFIG.jikken_day_of_week)
            );
            start.setHours(bs.CONFIG.time_of_day[period]);
            const end = bs.getDateAfterHours(start, 2);
            return { start, end };
        }

        return table.map((item) => ({
            jikken: item,
            ...buildMyTime(item.period, parseInt(item.week))
        }));
    }
}

export { BuctSchedule, ScheduleSystem };
