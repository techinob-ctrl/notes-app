import sharp from 'sharp';
import fs from 'node:fs/promises';

async function main() {
  const source = 'public/cats/icon.png';
  for (const [size, output] of [[192, 'public/cats/icon-192.png'], [512, 'public/cats/icon-512.png'], [180, 'app/apple-icon.png']]) {
    await sharp(source).resize(size, size, { fit: 'contain', background: '#fff4cf' }).flatten({ background: '#fff4cf' }).png().toFile(output);
  }
  const png = await sharp(source).resize(32, 32).flatten({ background: '#fff4cf' }).ensureAlpha().png().toBuffer();
  const header = Buffer.alloc(22);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header[6] = 32; header[7] = 32;
  header.writeUInt16LE(1, 10);
  header.writeUInt16LE(32, 12);
  header.writeUInt32LE(png.length, 14);
  header.writeUInt32LE(22, 18);
  await fs.writeFile('app/favicon.ico', Buffer.concat([header, png]));
  await sharp('public/cats/cover.png').resize(1200, 630, { fit: 'contain', background: '#fff6df' }).png().toFile('app/opengraph-image.png');
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
