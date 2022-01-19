// Soon... https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
export function deepClone<T>(oldObject: T): T {
    return JSON.parse(JSON.stringify(oldObject));
}

export interface IMap<T = any> {
    [key: string]: T,
}

export function cleanText(text: string) {
    return text.replace(/\t/g, "    ");
}
