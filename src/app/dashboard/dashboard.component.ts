import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NavigationExtras, Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {

  allUser: any = [];
  userId = localStorage.getItem('userId');
  loading: Boolean = false;
  constructor(
    public _userService: UserService,
    public router:Router
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getAllUser();
  }

  getAllUser() {
    this.loading = true;
    this._userService.getAllUser().subscribe(async (res) => {
      this.allUser = await res.map((e: any) => {
        return {
          id: e.payload.doc.id,
          userId: e.payload.doc.data()['userId'],
          userName: e.payload.doc.data()['userName']
        }
      });
      this.allUser = await this.allUser.filter(o =>
        o.id != this.userId
      )
      this.loading = await false;
      console.log("all user", this.allUser);
    }, err => {
      console.log("all user err", err)
    })
  }

  goToChat(data){
    let navigationextras:NavigationExtras ={
      state:{
        data:JSON.stringify(data)
      }
    }
    this.router.navigate(['/home/chat'],navigationextras)
  }

  logOut(){
    this._userService.logout()
    .then(res => {
      this.router.navigateByUrl('login');
    })
    .catch(error => {
    })
  }
}
