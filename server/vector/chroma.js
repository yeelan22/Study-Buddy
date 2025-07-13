import { ChromaClient } from 'chromadb';

const client = new ChromaClient({ path: 'http://localhost:8000' });

// Dummy embedding function – tells Chroma not to embed anything itself
const dummyEmbeddingFunction = {
  generate: async () => {
    throw new Error('You must embed manually using Xenova.');
  },
};

export const getUserCollection = async (userId) => {
  const collectionName = `notes-${userId}`;

  const existing = await client.listCollections();
  let collection = existing.find((c) => c.name === collectionName);

  if (!collection) {
    collection = await client.createCollection({
      name: collectionName,
      embeddingFunction: dummyEmbeddingFunction, // 🔧 critical line
    });
  } else {
    // Re-bind embedding function manually to fix warning
    collection.embeddingFunction = dummyEmbeddingFunction;
  }

  return collection;
};

