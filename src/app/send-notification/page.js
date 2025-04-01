"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SendNotification() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const router = useRouter();

  const handleSendNotification = async () => {
    if (!title || !body) {
      alert("Please fill in both the title and body.");
      return;
    }

    setLoading(true);
    setStats(null);

    try {
      const response = await fetch("/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, body }),
      });

      const data = await response.json();

      if (response.ok) {
        setStats({
          totalSent: data.totalSent,
          totalFailed: data.totalFailed,
          totalTokens: data.totalTokens,
        });

        alert(
          `Notifications sent successfully!\nSent: ${data.totalSent}\nFailed: ${data.totalFailed}\nTotal Tokens: ${data.totalTokens}`
        );
      } else {
        alert(`Failed to send notification: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error sending notification:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Send Notification
        </h1>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Notification Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter notification title"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Notification Body
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter notification body"
              rows="4"
            ></textarea>
          </div>
          <button
            onClick={handleSendNotification}
            disabled={loading}
            className={`w-full px-4 py-2 text-white font-medium rounded-lg ${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } transition-colors duration-200`}
          >
            {loading ? "Sending..." : "Send Notification"}
          </button>

          {stats && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Results:</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">
                    {stats.totalSent}
                  </p>
                  <p className="text-sm text-gray-600">Sent</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-red-600">
                    {stats.totalFailed}
                  </p>
                  <p className="text-sm text-gray-600">Failed</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-600">
                    {stats.totalTokens}
                  </p>
                  <p className="text-sm text-gray-600">Total Tokens</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
