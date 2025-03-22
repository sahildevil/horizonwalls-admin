import { databases } from "../../../services/appwrite";
import { Expo } from "expo-server-sdk";
import { Databases } from "appwrite";

const expo = new Expo();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, body } = req.body;

  if (!title || !body) {
    return res.status(400).json({ error: "Title and body are required" });
  }

  try {
    // Fetch all tokens from the Appwrite collection
    const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
    const COLLECTION_ID = process.env.APPWRITE_TOKENS_COLLECTION_ID;

    const tokensResponse = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID
    );
    const tokens = tokensResponse.documents.map((doc) => doc.token);

    // Prepare messages for Expo push notifications
    const messages = tokens
      .map((token) => {
        if (!Expo.isExpoPushToken(token)) {
          console.error(`Invalid Expo push token: ${token}`);
          return null;
        }

        return {
          to: token,
          sound: "default",
          title: title,
          body: body,
          data: { title, body },
        };
      })
      .filter(Boolean);

    // Send notifications in chunks
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    for (const chunk of chunks) {
      const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
      tickets.push(...ticketChunk);
    }

    res.status(200).json({ success: true, tickets });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({ error: "Failed to send notifications" });
  }
}
