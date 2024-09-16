export class StorageSystem {
    static saveSid(sid: string | null) {
        if (sid === null) {
            if (localStorage.getItem('sid') !== null)
                localStorage.removeItem('sid')
            return
        }
        localStorage.setItem('sid', sid)
    }

    static loadSid(): string | null {
        return localStorage.getItem('sid')
    }
}