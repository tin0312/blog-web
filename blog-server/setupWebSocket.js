import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ noServer: true });

// Store connected clients with user IDs
const clients = new Map();

export function setupWebSocket(server) {
  server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });

  wss.on("connection", (ws, request) => {
    console.log("New WebSocket connection");

    // Assign userId when a client sends an "identify" event
    ws.on("message", (message) => {
      try {
        const parsed = JSON.parse(message);
        
        if (parsed.type === "identify") {
          clients.set(parsed.userId, ws);
          console.log(`User ${parsed.userId} connected to WebSocket.`);
          logActiveConnections(); // 🔥 Log active users
        }

        // Handle incoming notifications
        if (parsed.type === "notification") {
          const { receiver_id, message } = parsed;
          const receiverSocket = clients.get(receiver_id);
          if (receiverSocket) {
            receiverSocket.send(JSON.stringify({ message }));
          }
        }
      } catch (err) {
        console.error("Invalid message received:", err);
      }
    });

    ws.on("close", () => {
      console.log("WebSocket disconnected");
      clients.forEach((value, key) => {
        if (value === ws) clients.delete(key);
      });
      logActiveConnections(); // 🔥 Log after disconnection
    });
  });
}

// Function to log active connections
function logActiveConnections() {
  console.log("🔹 Active WebSocket Connections:");
  if (clients.size === 0) {
    console.log("No active users.");
  } else {
    clients.forEach((_, userId) => {
      console.log(`- User ID: ${userId}`);
    });
  }
}

export { wss, clients };
