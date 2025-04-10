import { useState, useEffect } from "react";

function useWebSocket({ socketUrl, userId }) {
  const [data, setData] = useState();
  const [ws, setWs] = useState(null);
  const [readyState, setReadyState] = useState(false);

  useEffect(() => {
    if (!userId) return; // If no userId, do not create WebSocket

    const wsInstance = new WebSocket(socketUrl);
    setWs(wsInstance);

    wsInstance.onopen = () => {
      console.log("Connected to WebSocket");
      setReadyState(true);
      // Identify user when WebSocket connects
      wsInstance.send(JSON.stringify({ type: "identify", userId }));
    };

    wsInstance.onmessage = (event) => {
      console.log(JSON.parse(event.data));
      setData(JSON.parse(event.data));
    };

    wsInstance.onclose = () => {
      setReadyState(false);
      setTimeout(() => {
        setWs(new WebSocket(socketUrl)); // Reconnect if closed
      }, 2000);
    };

    return () => {
      wsInstance.close();
    };
  }, [socketUrl, userId]); 

  const send = (msg) => {
    if (ws && readyState) {
      ws.send(JSON.stringify(msg));
    }
  };

  return { send, data, readyState };
}

export default useWebSocket;
