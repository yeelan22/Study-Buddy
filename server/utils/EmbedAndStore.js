// server/utils/embedAndStore.js
import { getUserCollection } from '../vector/chroma.js';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { pipeline } from '@xenova/transformers';

// Lazy load the embedding model once
const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

export async function processNoteForRAG(noteText, noteId, userId) {
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 50,
  });

  const chunks = await splitter.splitText(noteText);
  const collection = await getUserCollection(userId);

  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i];
    const id = `${noteId}-${i}`;
    const embeddingTensor = await embedder(chunk, { pooling: 'mean', normalize: true });
    const embedding = Array.from(embeddingTensor.data);

    await collection.add({
      ids: [id],
      documents: [chunk],
      embeddings: [embedding],
      metadatas: [{ userId, noteId, chunkIndex: i }],
    });

      console.log(`✅ Chunk ${i} stored in Chroma`, chunk.slice(0, 50), '...');
  }

  return chunks.length;
}
