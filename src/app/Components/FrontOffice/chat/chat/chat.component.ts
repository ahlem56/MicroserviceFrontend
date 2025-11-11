import { Component } from '@angular/core';
import { ChatService } from 'src/app/Core/chat.service';
@Component({
    selector: 'app-chat',
    templateUrl: './chat.component.html',
    styleUrls: ['./chat.component.css'],
    standalone: false
})
export class ChatFrontOfficeComponent {
    messages: any[] = [];
    messageContent: string = '';
    chatId: number = 1;
    sender: string = '';
    userId: number = 0;
    userProfilePhoto: string | null = null;

    constructor(private chatService: ChatService) {}

    ngOnInit(): void {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user) {
            this.sender = user.firstName ; // Nom de l'utilisateur
            this.userId = user.userId || 0;
            this.userProfilePhoto = user.userProfilePhoto || null;
        }

        const storedMessages = JSON.parse(localStorage.getItem('messages') || '[]');
        this.messages = storedMessages;

        this.chatService.getMessages().subscribe((message) => {
            this.messages.push(message);
            localStorage.setItem('messages', JSON.stringify(this.messages));
        });
    }

    sendMessage(): void {
        if (this.messageContent.trim()) {
            this.chatService.sendMessage(this.chatId, this.sender, this.messageContent);

            const newMessage = {
                sender: this.sender,
                content: this.messageContent,
                userId: this.userId,
                userProfilePhoto: this.userProfilePhoto,
                time: new Date().toLocaleTimeString(),
                likes: 0  // Ajout du compteur de likes
            };

            this.messages.push(newMessage);
            localStorage.setItem('messages', JSON.stringify(this.messages));
            this.messageContent = '';
        }
    }

    likeMessage(msg: any): void {
        msg.likes = (msg.likes || 0) + 1; // Incrémente le nombre de likes
        localStorage.setItem('messages', JSON.stringify(this.messages));
    }
    deleteMessage(msg: any): void {
        const index = this.messages.findIndex(m => m === msg);
        if (index !== -1) {
            this.messages.splice(index, 1); // Supprime le message
            localStorage.setItem('messages', JSON.stringify(this.messages));
        }
    }
    
}
