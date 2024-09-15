import type { RawJikken, RawStudent, StudentData } from '@/core/MainModel.js'
import { type Ref, ref, type ShallowRef, shallowRef } from 'vue'

// 学生字典
type StudentDictType = { [stu_id: string]: StudentData }
const studentDict: ShallowRef<StudentDictType> = shallowRef({})
let isStudentLoaded: Ref<boolean> = ref(false)

// 实验安排字典
type JikkenDictType = { [stu_id: string]: StudentData }
const jikkenDict: ShallowRef<JikkenDictType> = shallowRef({})
let isJikkenLoaded: Ref<boolean> = ref(false)

// 用学号表示当前选中的学生，为 null 则说明未选中任何学生
const curStudentId: Ref<string | null> = ref(null)


function transformJikken(raw: RawJikken) {

}

function transformStudent(raw: RawStudent) {
    const cls_map = raw.class
    const stu_map = raw.student
    let tempDict: StudentDictType = {}
    for (const sid in stu_map) {
        tempDict[sid] = {
            batch: stu_map[sid][0],
            class: cls_map[stu_map[sid][1]],
            group: stu_map[sid][2]
        }
    }
    studentDict.value = tempDict
}

export {
    studentDict, jikkenDict, isStudentLoaded, isJikkenLoaded,
    curStudentId, transformStudent, transformJikken
}