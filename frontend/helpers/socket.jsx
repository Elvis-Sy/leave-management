import { io } from 'socket.io-client';

let socket;

export const initSocket = () => {
  if (!socket) {

    socket = io('http://localhost:5000', {
      withCredentials: true,
      transports: ['websocket'],
    });
    
  }
  return socket;
};

export const getSocket = () => {
  console.log("Socket state:", socket); // Vérifiez ici si socket est défini
  return socket;
};