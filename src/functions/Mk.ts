import * as fmt from '@std/fmt/colors';
import { values } from '@syuilo/aiscript';
import { namespace } from '../Namespace.ts';
import { stdio } from '../StdIO.ts';

export const Mk = namespace('Mk', {
    dialog: values.FN_NATIVE((args) => {
        const [title, text, type] = args;
        if (title == null || text == null) {
            throw new TypeError('Mk:dialog requires at least 2 arguments');
        }
        console.log(createDialog(title, text, type));
    }),

    confirm: values.FN_NATIVE(async (args) => {
        const [title, text, type] = args;
        if (title == null || text == null) {
            throw new TypeError('Mk:confirm requires at least 2 arguments');
        }
        const result = await stdio.in(createDialog(title, text, type));
        return stringToBoolean(result) ? values.TRUE : values.FALSE;
    }),
});

function passStr(value: values.Value | undefined): string {
    if (value == null || value.type != 'str') {
        return '';
    }
    return value.value;
}

function createTitle(title: string, type: string): string {
    switch (type) {
        case 'info':
        default:
            return fmt.cyan(`[${title}/INFO] `);
        case 'success':
            return fmt.green(`[${title}/SUCCESS] `);
        case 'warn':
            return fmt.yellow(`[${title}/WARN] `);
        case 'error':
            return fmt.red(`[${title}/ERROR] `);
        case 'question':
            return fmt.gray(`[${title}/QUESTION] `);
    }
}

function createDialog(
    title: values.Value,
    text: values.Value,
    type: values.Value | undefined,
): string {
    return createTitle(passStr(title), passStr(type)) + passStr(text);
}

function stringToBoolean(value: string) {
    const normalized = value.trim().toLowerCase().replace(
        /[\u30a1-\u30f6]/g,
        (substring) => String.fromCharCode(substring.charCodeAt(0) - 0x60),
    );
    switch (normalized) {
        case 'y':
        case 'yes':
        case 'はい':
        case 'true':
        case 't':
        case '':
            return true;
        default:
            return false;
    }
}
