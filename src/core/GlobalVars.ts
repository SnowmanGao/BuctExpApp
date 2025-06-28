import { computed, type Ref, ref, type ShallowRef, shallowRef } from 'vue';
import { type JikkenData, type StudentData } from '@/core/models/CookedModel';
import type { TimeTuple } from '@/core/TimeTuple';

// 学生映射
// 学生 ID 到学生对象的映射
const studentMap: ShallowRef<Map<string, StudentData>> = shallowRef(new Map());

// 实验映射
// 实验室 ID 到该实验室内安排的实验对象的映射
// （和 timetableMap 一起加载）
const jikkenMap: ShallowRef<JikkenData[]> = shallowRef([]);

/*
 * 提示：实验室 ID（实验 ID）默认从 0 开始。
 * 为减少网络传输信息量，不再建立实验室 ID 映射表，而是直接作为数组索引。
 * 还有，一个实验室只能做一个实验，它们是一一对应的。
 */
// 时间表映射
// 通过 离散时间 查询得到从 实验室编号 到 学生批次号 的映射
const timetableMap: ShallowRef<Map<TimeTuple, number[]>> = shallowRef(new Map());

// 当前选中的学生的 ID
const curStudentId: Ref<string | null> = ref(null);

// 当前选中的学生对象
const curStudent: Ref<StudentData | null> = computed(() => {
    if (curStudentId.value === null) return null;
    return studentMap.value.get(curStudentId.value) ?? null;
});

export { studentMap, jikkenMap, timetableMap, curStudentId, curStudent };
