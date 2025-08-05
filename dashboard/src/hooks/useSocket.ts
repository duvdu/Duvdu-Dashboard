import { useContext } from "react";
import { SocketContext } from "@/contexts/SocketProvider.types";

export function useSocket() {
  return useContext(SocketContext);
}
