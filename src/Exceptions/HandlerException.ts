import TailwindcssFontFaceException from './TailwindcssFontFaceException';

export default class HandlerException extends TailwindcssFontFaceException {
    static invalidFontFaceEntry(entry: unknown): HandlerException {
        const _entry = JSON.stringify(entry);

        return HandlerException.thow(
            `The provided font face entry \`${_entry}\` is invalid. Please ensure it follows one of the supported formats.`
        );
    }
}
