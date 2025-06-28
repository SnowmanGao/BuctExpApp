import { jikkenMap, studentMap } from '@/core/GlobalVars';
import { cookJikkenData, cookStudentData } from '@/core/CookSystem';

export async function waitForJikkenDataAsync() {
    if (jikkenMap.value.length) return;
    const resp = await fetch('/resources/jikken_map.json');
    const json = await resp.json();
    cookJikkenData(json);
}

export async function waitForStudentDataAsync() {
    if (studentMap.value.size) return;
    const resp = await fetch('/resources/student_map.json');
    const json = await resp.json();
    cookStudentData(json);
}
