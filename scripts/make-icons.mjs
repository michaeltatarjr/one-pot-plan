import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { crc32, deflateSync } from "node:zlib";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "public");

const BG = [0x2b, 0x1d, 0x14];
const RING = [0xd9, 0xa4, 0x5b];
const BOWL = [0xf5, 0xed, 0xe4];

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body) >>> 0);
  return Buffer.concat([len, body, crc]);
}

function mix(a, b, t) {
  return a.map((v, i) => Math.round(v + (b[i] - v) * t));
}

/** Espresso square, amber ring, and a cream bowl shape inside the maskable safe zone. */
function pixel(x, y, size) {
  const c = size / 2;
  const dx = x + 0.5 - c;
  const dy = y + 0.5 - c;
  const r = Math.hypot(dx, dy);
  const outer = size * 0.34;
  const inner = size * 0.28;
  let color = BG;

  const ringEdge = Math.min(r - inner, outer - r);
  if (ringEdge > -1) {
    color = mix(BG, RING, Math.max(0, Math.min(1, ringEdge + 0.5)));
  }

  const bowlTop = c - size * 0.02;
  const bowlR = size * 0.19;
  if (dy >= -size * 0.02) {
    const edge = bowlR - Math.hypot(dx, dy + size * 0.02 - (bowlTop - c));
    if (edge > -1 && y + 0.5 >= bowlTop) {
      color = mix(color, BOWL, Math.max(0, Math.min(1, edge + 0.5)));
    }
  }
  return color;
}

function png(size) {
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 4);
    for (let x = 0; x < size; x++) {
      const [r, g, b] = pixel(x, y, size);
      row.set([r, g, b, 255], 1 + x * 4);
    }
    rows.push(row);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr.set([8, 6, 0, 0, 0], 8);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(Buffer.concat(rows), { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

const outputs = [
  ["icons/icon-192.png", 192],
  ["icons/icon-512.png", 512],
  ["apple-touch-icon.png", 180],
  ["favicon.png", 32],
];

for (const [file, size] of outputs) {
  const path = join(root, file);
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, png(size));
  console.log(`wrote public/${file} (${size}x${size})`);
}
