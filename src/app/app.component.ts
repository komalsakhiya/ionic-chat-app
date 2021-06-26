import { Component } from "@angular/core";

import { Platform } from "@ionic/angular";
import { SplashScreen } from "@ionic-native/splash-screen/ngx";
import { StatusBar } from "@ionic-native/status-bar/ngx";
import { UserService } from "./services/user.service";
import { Router } from '@angular/router';

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  currentUserId: any;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public _userService: UserService,
    public router:Router
  ) {
    this.initializeApp();
    this._userService.currentUser.subscribe((x) => (this.currentUserId = x));
    if (this._userService.currentUserValue) {
      this.router.navigateByUrl("home/dashboard");
    }

    //Exit app
    this.platform.backButton.subscribe(() => {
      if (
        this.router.url === "/home/dashboard" ||
        this.router.url === "/login"
      ) {
        navigator["app"].exitApp();
      }
    });

  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
