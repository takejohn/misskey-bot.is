import { Interpreter, Parser } from '@syuilo/aiscript';
import { stdio } from './src/StdIO.ts';
import { Mk } from './src/functions/Mk.ts';

const interpreter = new Interpreter(Mk, stdio);

const parser = new Parser();

interpreter.exec(parser.parse(await Deno.readTextFile(Deno.args[0])));
