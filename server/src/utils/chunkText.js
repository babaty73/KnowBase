export function chunkText(text, chunkSize = 500, overlap = 50) {
  const chunks = [];

  const step = chunkSize - overlap;

  for (let start = 0; start < text.length; start += step) {
    const chunk = text.slice(start, start + chunkSize);

    chunks.push(chunk);
  }

  return chunks;
}