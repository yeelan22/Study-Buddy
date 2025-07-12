// server/vector/chroma.js
import { ChromaClient } from 'chromadb';

//This client lets you list, create, and retrieve vector collections.
const client = new ChromaClient({ path: 'http://localhost:8000' });

export const getUserCollection = async (userId) => {
  const collectionName = `notes-${userId}`;
  const existing = await client.listCollections();
  let collection = existing.find((c) => c.name === collectionName);

  if (!collection) {
    collection = await client.createCollection({ name: collectionName });
  } else {
    collection = await client.getCollection({ name: collectionName });
  }

  return collection;
};
