import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import io, { Socket } from 'socket.io-client';

interface SocketContextProps {
  socket: Socket | null;
  visitorCount: number;
  loggedUserCount: number;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [visitorCount, setVisitorCount] = useState<number>(0);
  const [loggedUserCount, setLoggedUserCount] = useState<number>(0);

  useEffect(() => {
    const socketInstance = io('https://api.duvdu.com'); // Replace with your server URL
    setSocket(socketInstance);

    socketInstance.on('getVisitorsCounter', (count: number) => {
      setVisitorCount(count);
    });

    socketInstance.on('getLoggedCounter', (count: number) => {
      setLoggedUserCount(count);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, visitorCount, loggedUserCount }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextProps => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};
