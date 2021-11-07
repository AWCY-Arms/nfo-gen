// Soon... https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
export default function deepClone(oldObject: Object) {
    return JSON.parse(JSON.stringify(oldObject));
}
