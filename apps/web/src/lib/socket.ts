import { io, Socket } from 'socket.io-client';

const URL = window.location.origin;

export const socket: Socket = io(`${URL}/events`, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: Infinity,
});
