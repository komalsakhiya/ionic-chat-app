import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastService } from '../services/toast.service';
import { UserService } from '../services/user.service';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @ViewChild(IonContent, { static: false }) contentArea: IonContent;
  details: any;
  addMessageForm: FormGroup;
  userId = localStorage.getItem('userId');
  allMessages: any = [];
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public _toastService: ToastService,
    public _userService: UserService
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.details = this.router.getCurrentNavigation().extras.state.data;
      this.details = JSON.parse(this.details)
    }
    console.log("details", this.details);

    this.addMessageForm = new FormGroup({
      message: new FormControl('', [Validators.required])
    })
  }

  ngOnInit() { }
  ionViewWillEnter() {
    this.getMessage();
  }


  sendMessage(data) {
    console.log(data)
    if (this.addMessageForm.invalid) {
      this._toastService.presentToast("Please enter message");
      return
    }
    console.log(data);
    const obj = {
      msg: data.message,
      senderId: this.userId,
      reciverId: this.details.id,
      createdAt:new Date().toISOString()
    }
    console.log("obj", obj)
    this._userService.addMessage(obj).then((res) => {
      console.log("message res", res);
      this.addMessageForm.reset();
    }).catch((err) => {
      console.log(err)
    })
  }


  getMessage() {
    this._userService.getMessages().subscribe(async (res: any) => {
      console.log("messages", res);
      this.allMessages = await res.map((e: any) => {
        return {
          message: e.payload.doc.data()
        }
      });
      console.log("mess",this.allMessages)
      this.allMessages = await this.allMessages.filter(o =>
       ( o.message.reciverId == this.details.id && o.message.senderId== this.userId) ||  ( o.message.senderId == this.details.id && o.message.reciverId== this.userId) 
      );
      this.allMessages = await this.allMessages.sort((a:any,b:any)=>{
        var dateA = new Date(a.message.createdAt).getTime();
        var dateB = new Date(b.message.createdAt).getTime();
        return dateA > dateB ? 1 : -1;  
      });
      this.contentArea.scrollToBottom();
      console.log("all message", this.allMessages)
    }, err => {
      console.log(err);
    })
  }
}
