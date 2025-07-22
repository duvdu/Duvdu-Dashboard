import { type Socket } from "socket.io-client";

export interface SocketContextValue {
  socket: Socket | null;
}

import { createContext } from "react";

export const SocketContext = createContext<SocketContextValue>({
  socket: null,
});
