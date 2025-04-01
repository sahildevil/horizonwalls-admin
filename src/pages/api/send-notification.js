import { databases } from "../../../services/appwrite";
import { Expo } from "expo-server-sdk";
import { Query } from "appwrite"; // Make sure to import Query

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
    // Fetch all tokens from the Appwrite collection with proper pagination
    const DATABASE_ID = process.env.APPWRITE_DATABASE_ID;
    const COLLECTION_ID = process.env.APPWRITE_TOKENS_COLLECTION_ID;

    // Collect all tokens using pagination
    let allTokens = [];
    let offset = 0;
    const limit = 100; // Fetch in batches of 100
    let hasMore = true;

    console.log("Starting to fetch notification tokens...");

    while (hasMore) {
      const tokensResponse = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID,
        [Query.limit(limit), Query.offset(offset)]
      );

      const tokens = tokensResponse.documents.map((doc) => doc.token);
      allTokens = [...allTokens, ...tokens];

      console.log(
        `Fetched ${tokens.length} tokens, total so far: ${allTokens.length}`
      );

      if (tokensResponse.documents.length < limit) {
        hasMore = false;
      } else {
        offset += limit;
      }
    }

    console.log(`Total tokens fetched: ${allTokens.length}`);

    if (allTokens.length === 0) {
      return res.status(404).json({ error: "No notification tokens found" });
    }

    // Prepare messages for Expo push notifications
    const messages = allTokens
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

    console.log(`Valid messages to send: ${messages.length}`);

    if (messages.length === 0) {
      return res.status(400).json({ error: "No valid tokens found" });
    }

    // Send notifications in chunks
    const chunks = expo.chunkPushNotifications(messages);
    console.log(`Sending notifications in ${chunks.length} chunks`);

    const tickets = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      console.log(
        `Sending chunk ${i + 1} of ${chunks.length} with ${
          chunk.length
        } messages`
      );

      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        tickets.push(...ticketChunk);
        console.log(
          `Successfully sent chunk ${i + 1}, got ${ticketChunk.length} tickets`
        );
      } catch (error) {
        console.error(`Error sending chunk ${i + 1}:`, error);
      }
    }

    console.log(`Total tickets received: ${tickets.length}`);

    // Count success and error tickets
    const successful = tickets.filter((ticket) => !ticket.error).length;
    const failed = tickets.filter((ticket) => ticket.error).length;

    res.status(200).json({
      success: true,
      totalSent: successful,
      totalFailed: failed,
      totalTokens: allTokens.length,
    });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res
      .status(500)
      .json({ error: "Failed to send notifications: " + error.message });
  }
}
