import { Interpreter, Parser } from '@syuilo/aiscript';
import { StdIO } from './src/StdIO.ts';

const interpreter = new Interpreter({}, new StdIO());

const parser = new Parser();

interpreter.exec(parser.parse(await Deno.readTextFile(Deno.args[0])));
