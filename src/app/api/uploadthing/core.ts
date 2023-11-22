import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/dist/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { SupabaseVectorStore } from "langchain/vectorstores/supabase";
import { pinecone } from "@/lib/pinecone";
import { client } from "@/lib/supabase";

const f = createUploadthing();

export const ourFileRouter = {
  pdfUploader: f({ pdf: { maxFileSize: "128MB" } })
    .middleware(async ({ req }) => {
      const { getUser } = getKindeServerSession();
      const user = await getUser();

      if (!user || !user.id) throw new Error("Unauthorized");

      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const createdFile = await db.file.create({
        data: {
          key: file.key,
          name: file.name,
          userId: metadata.userId,
          url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
          uploadStatus: "PROCCESSING",
        },
      });

      try {
        const response = await fetch(
          `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
        );
        const blob = await response.blob();

        const loader = new PDFLoader(blob);

        const pageLevelDocs = await loader.load();
        const pagesAmt = pageLevelDocs.length;

        const pineconeIndex = pinecone.Index("reader");

        const embeddings = new OpenAIEmbeddings({
          openAIApiKey: process.env.OPENAI_API_KEY,
        });

        const vectorStore = await SupabaseVectorStore.fromDocuments(
          pageLevelDocs,
          embeddings,
          {
            tableName: "documents",
            client: client,
            queryName: "match_documents",

          }
        );

        // console.log(vectorStore.)

        const store = await PineconeStore.fromDocuments(
          pageLevelDocs,
          embeddings,
          {
            pineconeIndex,
            namespace: createdFile.id,
          }
        );

        // console.log(store.lc_id)

        await db.file.update({
          where: { id: createdFile.id },
          data: {
            uploadStatus: "SUCCESS",
          },
        });
      } catch (error) {
        console.log("error", error);
        await db.file.update({
          where: { id: createdFile.id },
          data: {
            uploadStatus: "FAILED",
          },
        });
      }
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
