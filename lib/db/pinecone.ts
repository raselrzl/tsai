import { Pinecone } from "@pinecone-database/pinecone";

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
});

// Pass environment as second parameter when creating the index
const index = pinecone.Index(
  process.env.PINECONE_INDEX_NAME!,
  process.env.PINECONE_ENVIRONMENT!
);

export default index;
