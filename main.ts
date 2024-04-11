import { Interpreter, Parser } from '@syuilo/aiscript';

const interpreter = new Interpreter({}, {
    out(value) {
        switch (value.type) {
            case 'str':
                console.log(value.value);
                break;
        }
    },
});

const parser = new Parser();

interpreter.exec(parser.parse(await Deno.readTextFile(Deno.args[0])));
