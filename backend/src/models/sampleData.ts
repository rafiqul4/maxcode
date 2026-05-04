import type { SampleData } from "../types/api.js";

export const sampleData: SampleData = {
  title: "Deployment ready API",
  description: "Minimal sample payload used to verify the backend on Vercel and Render.",
  items: [
    { id: 1, label: "Frontend", value: "Vercel" },
    { id: 2, label: "Backend", value: "Render" },
    { id: 3, label: "Runtime", value: "Node.js" },
  ],
};