export default function enumify<K extends string, T extends {[key: string]: K}>(obj: T) {
    return obj;
}
