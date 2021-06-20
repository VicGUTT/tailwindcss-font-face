import crypto from 'crypto';

export default function hash(value: unknown) {
    return crypto
        .createHash('md5')
        .update(JSON.stringify(value))
        .digest('hex');
}
