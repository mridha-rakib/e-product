import * as crypto from 'crypto';

function generateHash(name: string): string {
  const hash = crypto.createHash('md5');
  hash.update(name.toLocaleLowerCase());

  return hash.digest('hex').slice(0, 8);
}

export { generateHash };
