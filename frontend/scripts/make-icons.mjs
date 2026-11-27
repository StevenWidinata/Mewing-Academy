// Generates app icons and the link-preview image as valid PNGs with no image
// library — a pixel cat (Mewy) on a sky-blue background. Uses Node's zlib for PNG IDAT compression.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const pub = join(dirname(fileURLToPath(import.meta.url)), '..', 'public');
mkdirSync(pub, { recursive: true });

const C = {
  bg: [29, 90, 143],
  y: [255, 204, 0],
  yd: [224, 168, 0],
  k: [16, 42, 67],
  p: [255, 92, 168],
  w: [253, 246, 227],
};

// 16x16 logical cat, same as the on-screen Mewy mascot.
function catPixel(gx, gy) {
  const inRect = (x1, y1, x2, y2) => gx >= x1 && gx <= x2 && gy >= y1 && gy <= y2;
  // mouth/nose/eyes drawn last (on top)
  if (inRect(5, 6, 6, 7) || inRect(9, 6, 10, 7)) return gx === 5 || gx === 9 ? (gy === 6 ? C.w : C.k) : C.k;
  if (inRect(7, 8, 8, 8)) return C.p;
  if ((gx === 6 || gx === 9) && gy === 9) return C.k;
  if (inRect(7, 9, 8, 9)) return C.k;
  // ears inner
  if (inRect(3, 2, 3, 3) || inRect(12, 2, 12, 3)) return C.p;
  // ears outer
  if (inRect(2, 1, 3, 3) || inRect(12, 1, 13, 3)) return C.y;
  // lower cheeks shading
  if (inRect(3, 11, 12, 12)) return C.yd;
  // head
  if (inRect(3, 3, 12, 12) || inRect(2, 5, 2, 10) || inRect(13, 5, 13, 10)) return C.y;
  return null;
}

function makeIcon(size) {
  const scale = size / 16;
  const row = size * 3 + 1; // RGB + 1 filter byte per row
  const raw = Buffer.alloc(row * size);
  for (let y = 0; y < size; y++) {
    raw[y * row] = 0; // filter: none
    for (let x = 0; x < size; x++) {
      const gx = Math.floor(x / scale);
      const gy = Math.floor(y / scale);
      const px = catPixel(gx, gy) ?? C.bg;
      const o = y * row + 1 + x * 3;
      raw[o] = px[0];
      raw[o + 1] = px[1];
      raw[o + 2] = px[2];
    }
  }
  return encodePng(size, size, raw);
}

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return (~c) >>> 0;
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const body = Buffer.concat([typeBuf, data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body), 0);
  return Buffer.concat([len, body, crc]);
}

function encodePng(w, h, raw) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: truecolor RGB
  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}

/** 1200x630 link-preview image (og:image): Mewy on a sky gradient with pixel stars. */
function makeOg() {
  const W = 1200;
  const H = 630;
  const cell = 24; // Mewy is 16 cells = 384px
  const catX = (W - 16 * cell) / 2;
  const catY = 90;
  const top = [29, 90, 143];
  const bottom = [168, 220, 247];
  const stars = [[120, 90], [260, 200], [180, 430], [980, 120], [1080, 300], [900, 470], [330, 540], [1010, 560], [70, 300], [1150, 80]];
  const row = W * 3 + 1;
  const raw = Buffer.alloc(row * H);
  for (let y = 0; y < H; y++) {
    raw[y * row] = 0;
    const t = y / (H - 1);
    const sky = top.map((c, i) => Math.round(c + (bottom[i] - c) * t));
    for (let x = 0; x < W; x++) {
      let px = sky;
      // Yellow ground strip with a navy top edge
      if (y >= H - 40) px = y < H - 34 ? C.k : C.y;
      // 8x8 pixel stars with a plus shape
      for (const [sx, sy] of stars) {
        const dx = Math.abs(x - sx);
        const dy = Math.abs(y - sy);
        if ((dx < 4 && dy < 12) || (dy < 4 && dx < 12)) px = C.w;
      }
      // Mewy, with a hard navy drop shadow
      const gx = Math.floor((x - catX) / cell);
      const gy = Math.floor((y - catY) / cell);
      const sgx = Math.floor((x - catX - 16) / cell);
      const sgy = Math.floor((y - catY - 16) / cell);
      const inCat = x >= catX && y >= catY && gx < 16 && gy < 16 ? catPixel(gx, gy) : null;
      const inShadow = x >= catX + 16 && y >= catY + 16 && sgx < 16 && sgy < 16 ? catPixel(sgx, sgy) : null;
      if (inShadow && !inCat) px = C.k;
      if (inCat) px = inCat;
      const o = y * row + 1 + x * 3;
      raw[o] = px[0];
      raw[o + 1] = px[1];
      raw[o + 2] = px[2];
    }
  }
  return encodePng(W, H, raw);
}

writeFileSync(join(pub, 'og-image.png'), makeOg());

for (const size of [192, 512]) {
  writeFileSync(join(pub, `icon-${size}.png`), makeIcon(size));
}
// A small favicon too.
const favSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="#1d5a8f"/><rect x="3" y="3" width="10" height="10" fill="#ffcc00"/><rect x="5" y="6" width="2" height="2" fill="#102a43"/><rect x="9" y="6" width="2" height="2" fill="#102a43"/><rect x="7" y="8" width="2" height="1" fill="#ff5ca8"/></svg>`;
writeFileSync(join(pub, 'favicon.svg'), favSvg);
console.log('[icons] wrote icon-192.png, icon-512.png, og-image.png, favicon.svg');
