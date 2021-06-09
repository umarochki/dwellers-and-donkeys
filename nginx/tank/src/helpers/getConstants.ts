type ConstantsType<T extends string> = {
    [P in T]: P
}

export function getConstants<T extends string>(literalConstants: T[]): ConstantsType<T> {
    const result: any = {}

    literalConstants.forEach(constant => {
        result[constant] = constant
    })
    return result
}