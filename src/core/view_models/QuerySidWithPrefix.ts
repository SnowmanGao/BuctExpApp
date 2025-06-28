import { studentMap } from '@/core/GlobalVars';

function querySidWithPrefix(prefix: string, take_count: number): string[] {
    const result: string[] = [];
    for (const key of studentMap.value.keys()) {
        if (key.includes(prefix)) {
            result.push(key);
            if (result.length >= take_count) break;
        }
    }
    return result;
}

export { querySidWithPrefix };
