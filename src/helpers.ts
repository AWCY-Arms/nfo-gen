// Soon... https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
export default function deepClone<T>(oldObject: T): T {
    return JSON.parse(JSON.stringify(oldObject));
}

export interface IMap<T = any> {
    [key: string]: T,
}
