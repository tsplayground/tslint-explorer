import { Injectable } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import {
  Observable,
  ReplaySubject
} from 'rxjs/Rx';
import { Message } from '../models';

@Injectable()
export class MessageService {
  private messagesSubject = new ReplaySubject<Array<Message>>();
  private messagesObservable = this.messagesSubject.asObservable();
  private messages: Array<Message> = [];
  constructor(private snackBar: MdSnackBar) {
    this.messagesObservable
      .subscribe(messages => {
        const toastMessage = messages.find(message => message.isSticky);
        if (toastMessage) {
          this.snackBar.open(toastMessage.content, toastMessage.action, {
              duration: 2000
            });
        }
      });
  }

  public toast(toastMessage: Message| string): void {
    this.messages
      .filter(message => message.isSticky)
      .forEach(message => {
        this.messages.splice(this.messages.indexOf(message), 1);
      });
    if (typeof toastMessage === 'string') {
      this.messages.push({
        isSticky: true,
        content: toastMessage
      });
    } else {
      toastMessage.isSticky = true;
      this.messages.push(toastMessage);
    }
    this.messagesSubject.next(this.messages);
  }
}
