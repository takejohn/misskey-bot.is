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
        if (value.type == 'str') {
            console.log(value.value);
        }
    }

    err(e: errors.AiScriptError): void {
        console.error(e);
    }
}
