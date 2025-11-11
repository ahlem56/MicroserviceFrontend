import { Injectable } from '@angular/core';
import { Client } from '@stomp/stompjs';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private messages: any[] = []; // Stocke les messages en mémoire
  private stompClient!: Client;
  private messageSubject = new Subject<any>();

  constructor() {
    this.initializeWebSocket();
  }

  private initializeWebSocket() {
    this.stompClient = new Client({
      brokerURL: 'ws://localhost:8089/ws-chat',
      connectHeaders: {},
      debug: (msg: string) => console.log(msg),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    this.stompClient.onConnect = () => {
      console.log('Connected to WebSocket');
      this.stompClient.subscribe('/topic/messages', (message) => {
        this.messageSubject.next(JSON.parse(message.body));
      });
    };

    this.stompClient.activate();
  }

  sendMessage(chatId: number, sender: string, content: string) {
    if (this.stompClient && this.stompClient.connected) {
      const chatMessage = { sender, content, chat: { chatId } };
      this.stompClient.publish({ destination: '/app/send', body: JSON.stringify(chatMessage) });
    } else {
      console.error('WebSocket not connected!');
    }
  }

  getMessages(): Observable<any> {
    return this.messageSubject.asObservable();
  }}
