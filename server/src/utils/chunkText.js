export function chunkText(text, chunkSize = 500) {
  const chunks = [];

  for (let start = 0; start < text.length; start += chunkSize) {
    const chunk = text.slice(start, start + chunkSize);

    chunks.push(chunk);
  }

  return chunks;
}