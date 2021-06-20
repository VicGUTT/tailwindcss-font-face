export default class TailwindcssFontFaceException extends Error {
    protected static thow(message: string): TailwindcssFontFaceException {
        return new TailwindcssFontFaceException(`[TailwindCSS FontFace plugin]: ${message}`);
    }
}
