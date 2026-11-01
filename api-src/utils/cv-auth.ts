import crypto from 'crypto';

const base64UrlEncode = (str: string): string => {
  return Buffer.from(str).toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

const base64UrlDecode = (str: string): string => {
  let cleaned = str.replace(/-/g, '+').replace(/_/g, '/');
  while (cleaned.length % 4) {
    cleaned += '=';
  }
  return Buffer.from(cleaned, 'base64').toString('utf-8');
};

export const signToken = (payload: any, secret: string): string => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const signature = crypto.createHmac('sha256', secret)
    .update(encodedHeader + '.' + encodedPayload)
    .digest('base64url');
  return `${encodedHeader}.${encodedPayload}.${signature}`;
};

export const verifyToken = (token: string, secret: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;
    const expectedSignature = crypto.createHmac('sha256', secret)
      .update(header + '.' + payload)
      .digest('base64url');
    if (signature !== expectedSignature) return null;
    const decodedPayload = JSON.parse(base64UrlDecode(payload));
    if (decodedPayload.exp && Date.now() > decodedPayload.exp) return null; // expired
    return decodedPayload;
  } catch (error) {
    return null;
  }
};

export const hashPassword = (password: string, salt: string): string => {
  return crypto.scryptSync(password, salt, 64).toString('hex');
};

export const generateSalt = (): string => {
  return crypto.randomBytes(16).toString('hex');
};
