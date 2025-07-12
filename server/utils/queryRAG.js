import { pipeline } from '@xenova/transformers';
import { getUserCollection } from '../vector/chroma.js';
import { PromptTemplate } from "@langchain/core/prompts";
const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
const retrievalTemplate = new PromptTemplate({
  inputVariables: ['query', 'context', 'history'],
  template: `
You are a helpful assistant. Use the following context:
{context}
Conversation history:
{history}
User asks:
{query}
Answer in detail:
`
});

export async function answerWithRAG(userId, userQuery) {
  const col = await getUserCollection(userId);
  const qEmb = Array.from((await embedder(userQuery, { pooling: 'mean', normalize: true })).data);
  
  const res = await col.query({
    queryEmbeddings: [qEmb],
    nResults: 3,
    include: ['documents']
  });

  const contexts = res[0].documents.join('\n---\n');
  const chat = (await import('../models/chat.js')).default;
  const chatDoc = await chat.findOne({ userId });
  const history = chatDoc?.messages.map(m => `${m.role}: ${m.content}`).join('\n') || '';
  const prompt = retrievalTemplate.format({ query: userQuery, context: contexts, history });
  
  const reply = await (await import('axios')).default.post(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      model: "mistralai/mistral-7b-instruct",
      messages: [{ role: 'system', content: prompt }]
    },
    { headers: { Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}` }}
  );
  return reply.data.choices[0].message;
}
