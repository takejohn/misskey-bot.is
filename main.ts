import { Parser } from 'aiscript';
import { Interpreter } from "aiscript";

const interpreter = new Interpreter({}, {
    out(value) {
        switch (value.type) {
            case 'str':
                console.log(value.value);
                break;
        }
    }
});

const parser = new Parser();

interpreter.exec(parser.parse('<: "Hello, world!"'));
