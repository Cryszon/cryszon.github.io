/**
 * Returns the return type of `T` if `T` is a method or the original type if
 * it's not.
 */
export type OrReturnType<T> = T extends (...args: never[]) => infer R ? R : T;
