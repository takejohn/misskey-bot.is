import * as fmt from '@std/fmt/colors';
import { errors, Interpreter, values } from '@syuilo/aiscript';

type InterpreterOptions = Exclude<
    typeof Interpreter extends new (consts: never, opts: infer T) => unknown ? T
        : never,
    undefined
>;

export class StdIO implements InterpreterOptions {
    private readonly encoder = new TextEncoder();

    private readonly decoder = new TextDecoder();

    private readonly reader = Deno.stdin.readable.getReader();

    private input = '';

    async in(q: string): Promise<string> {
        Deno.stdout.write(this.encoder.encode(q + ' '));
        let input = this.input;
        let match: RegExpExecArray | null;
        while (match = /\r|\n/.exec(input), match == null) {
            const { value: chunk } = await this.reader.read();
            input += this.decoder.decode(chunk);
        }
        this.input = input.slice(match.index + match[0].length);
        return input.slice(0, match.index);
    }

    out(value: values.Value): void {
        console.log(toColoredText(value, 0));
    }

    err(e: errors.AiScriptError): void {
        console.error(e);
    }
}

const COMMA = fmt.gray(', ');

function toColoredText(value: values.Value, depth: number): string {
    if (depth >= 6) {
        return fmt.gray('...');
    }
    switch (value.type) {
        case 'null':
            return fmt.yellow('null');
        case 'bool':
            return fmt.yellow(String(value.value));
        case 'num':
            return fmt.cyan(value.value.toString());
        case 'str':
            if (depth > 0) {
                return fmt.green(`"${value.value}"`);
            }
            return value.value;
        case 'arr':
            return fmt.gray('[') +
                value.value.map((v) => toColoredText(v, depth + 1)).join(
                    COMMA,
                ) + fmt.gray(']');
        case 'obj':
            return fmt.gray('{ ') +
                Array.from(value.value).map(([k, v]) =>
                    fmt.green(`"${k}"`) + fmt.gray(': ') +
                    toColoredText(v, depth + 1)
                ).join(COMMA) + fmt.gray(' }');
        case 'fn': {
            const args = value.args;
            return fmt.gray('@(') + (args != null ? args.join(COMMA) : '') +
                fmt.gray(') {...}');
        }
        case 'return':
            return fmt.gray('return ') + toColoredText(value.value, depth + 1);
        case 'break':
            return fmt.gray('break');
        case 'continue':
            return fmt.gray('continue');
        case 'error': {
            const info = value.info;
            return fmt.gray('error') +
                (info != null
                    ? fmt.gray('<') + toColoredText(info, depth + 1) +
                        fmt.gray('>')
                    : '') +
                fmt.gray(': ') + value.value;
        }
    }
}
