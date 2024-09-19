import { type JikkenTimetable, type JikkenTimetableItem, TimeOfDay } from '@/core/MainModel';

class ScheduleSystem {
    static current(): Date {
        return new Date();
    }

    // 根据学期内周数计算那周的开始日期
    static weekNumberToDate(start: Date, week: number): Date {
        if (week <= 0) throw new Error('Invalid week number, must be positive');
        if (!Number.isInteger(week)) throw new Error('Invalid week number, must be integer');
        return ScheduleSystem.getDateAfterDays(start, (week - 1) * 7);
    }

    static dateToWeekNumber(start: Date, date: Date): number {
        const diff = date.getTime() - start.getTime();
        return Math.ceil(diff / (7 * 86400 * 1000));
    }

    // 在给定日期上增加天数，返回新的日期对象
    static getDateAfterDays(date: Date, days: number): Date {
        const newDate = new Date(date);
        newDate.setDate(date.getDate() + days);
        return newDate;
    }

    // 在给定日期上增加小时数，返回新的日期对象
    static getDateAfterHours(date: Date, hours: number): Date {
        const newDate = new Date(date);
        newDate.setHours(date.getHours() + hours);
        return newDate;
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
        week_start: new Date('2024/8/26'),
        // 表示实验在星期几（周日为 0）
        jikken_day_of_week: 6,
        // 上午、下午、晚上到具体时间的映射（24小时制）
        time_of_day: [9.0, 13.5, 17.5],
        // 实验持续时间（小时）
        jikken_duration: 2
    };

    static getCurWeekNumber(): number {
        return ScheduleSystem.dateToWeekNumber(
            BuctSchedule.CONFIG.week_start,
            ScheduleSystem.current()
        );
    }

    static getNextJikken(schedule: JikkenTimetable): JikkenTimetableItem | null {
        const current = ScheduleSystem.current();
        schedule.sort((a, b) => a.start.getTime() - b.start.getTime());
        for (const item of schedule) {
            if (current < item.start) return item;
        }
        return null;
    }

    static getDateFromWeekAndPeriod(week: number, period: TimeOfDay): Date {
        const offset = (day: number) => (day == 0 ? 6 : day - 1);
        const config = BuctSchedule.CONFIG;
        const result = ScheduleSystem.getDateAfterDays(
            ScheduleSystem.weekNumberToDate(config.week_start, week),
            offset(config.jikken_day_of_week)
        );
        result.setHours(config.time_of_day[period]);
        return result;
    }

    static getJikkenStartAndEnd(jikken: JikkenTimetableItem) {
        // 可能废弃
        const config = BuctSchedule.CONFIG;
        const start = BuctSchedule.getDateFromWeekAndPeriod(jikken.week, jikken.period);
        const end = ScheduleSystem.getDateAfterHours(start, config.jikken_duration);
        return { start, end };
    }
}

export { BuctSchedule, ScheduleSystem };
