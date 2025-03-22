import { Client, Databases } from "appwrite";

const client = new Client();
client
  .setEndpoint("https://cloud.appwrite.io/v1") // Replace with your Appwrite endpoint
  .setProject(process.env.PROJECT_ID); // Replace with your Appwrite project ID

const databases = new Databases(client);

export { databases };
