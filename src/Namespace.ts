import type { values } from '@syuilo/aiscript';

export function namespace(
    ns: string,
    values: Record<string, values.Value>,
): Record<string, values.Value> {
    return Object.fromEntries(
        Object.entries(values).map(([id, value]) => [ns + ':' + id, value]),
    );
}
