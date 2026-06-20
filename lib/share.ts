import { AppData } from '@/types';

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const toBase64Url = (bytes: Uint8Array): string => {
  let binary = '';
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
};

const fromBase64Url = (value: string): Uint8Array => {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  const normalized = padded + '='.repeat((4 - (padded.length % 4 || 4)) % 4);
  const binary = atob(normalized);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
};

const readStreamAsUint8Array = async (
  stream: ReadableStream<Uint8Array>,
): Promise<Uint8Array> => {
  const reader = stream.getReader();
  const chunks: Uint8Array[] = [];
  let totalLength = 0;

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    if (!value) continue;
    chunks.push(value);
    totalLength += value.length;
  }

  const result = new Uint8Array(totalLength);
  let offset = 0;
  chunks.forEach((chunk) => {
    result.set(chunk, offset);
    offset += chunk.length;
  });
  return result;
};

const ensureCompressionSupport = () => {
  if (
    typeof CompressionStream === 'undefined' ||
    typeof DecompressionStream === 'undefined'
  ) {
    throw new Error('URL sharing is not supported in this browser.');
  }
};

export const encodeShareData = async (data: AppData): Promise<string> => {
  ensureCompressionSupport();
  const source = textEncoder.encode(JSON.stringify(data));
  const stream = new Blob([source]).stream().pipeThrough(new CompressionStream('gzip'));
  const compressed = await readStreamAsUint8Array(stream);
  return toBase64Url(compressed);
};

export const decodeShareData = async (payload: string): Promise<AppData> => {
  ensureCompressionSupport();
  const compressed = fromBase64Url(payload);
  const stream = new Blob([compressed]).stream().pipeThrough(new DecompressionStream('gzip'));
  const decompressed = await readStreamAsUint8Array(stream);
  return JSON.parse(textDecoder.decode(decompressed)) as AppData;
};
