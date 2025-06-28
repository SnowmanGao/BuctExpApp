import { curStudent, curStudentId, jikkenMap, studentMap, timetableMap } from '@/core/GlobalVars';

export function queryAaaDev(): any {
    return {
        studentMap,
        jikkenMap,
        timetableMap,
        studentInfo: {
            studentId: curStudentId,
            ...curStudent
        }
    };
}
