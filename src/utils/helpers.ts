export function isFloat(num: number) {
    return num % 1 !== 0;
}

export function toSatsPerByte(input: number) {
    return input / 1000;
}

export function toSatsPerKB(input: number) {
    return input * 1000;
}
