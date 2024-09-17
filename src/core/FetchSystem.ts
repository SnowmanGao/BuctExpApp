import {
    isJikkenLoaded,
    isStudentLoaded,
    transJikkenData,
    transStudentData
} from '@/core/MainSystem';

export async function waitForJikkenDataAsync() {
    if (isJikkenLoaded.value) return;
    console.log("ever can't we suspend the time.");
    const resp = await fetch('/resources/jikken_map.json');
    const json = await resp.json();
    isJikkenLoaded.value = true;
    transJikkenData(json);
}

export async function waitForStudentDataAsync() {
    if (isStudentLoaded.value) return;
    const resp = await fetch('/resources/student_map.json');
    const json = await resp.json();
    transStudentData(json);
    isStudentLoaded.value = true;
}
