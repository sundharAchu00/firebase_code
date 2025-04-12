import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ApiService } from '../api.service';
import { ChatMessage } from './chatMessage';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent implements OnInit {
  messages: ChatMessage[] = [];
  message: string = '';

  constructor(private apiService: ApiService) { }

  ngOnInit(): void {
    this.messages.push({text: "Hello, how can I help you?", isUser: false})
  }

  sendMessage() {
    if (this.message.trim() !== '') {
      this.messages.push({ text: this.message, isUser: true });

      this.apiService.sendMessage(this.message).subscribe({
        next: (response) => {
          const reply = response.reply;
          this.messages.push({ text: reply, isUser: false });
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.messages.push({ text: "Error: Could not send message.", isUser: false });
        }
      });

      this.message = '';
    }
  }
}
