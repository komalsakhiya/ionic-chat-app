import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from "../services/user.service";
import { Router } from "@angular/router";
import { ToastService } from "../services/toast.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submitted: Boolean = false;
  loading: Boolean = false;
  isDisable: Boolean = false;
  constructor(
    public _userService: UserService,
    public _toastService: ToastService,
    public router: Router
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit() {}

  get f() {
    return this.loginForm.controls;
  }

  loginUser(data) {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    }
    this.loading = true;
    this.isDisable = true;
    console.log(data);
    this._userService.loginUser(data).then(async (res) => {
      console.log("res:", res.code);
      if (res.user) {
        this._toastService.presentToast("Logged in successfully");
        localStorage.setItem("uid", res.user.uid);
        this.router.navigateByUrl("home/dashboard");
        this.loginForm.reset();
      } else {
        if (res.code == "auth/user-not-found") {
          this._toastService.presentToast("No user found!");
        } else if (res.code == "auth/wrong-password") {
          this._toastService.presentToast("Password is not valid!");
        }
      }
      this.loading = false;
      this.isDisable = false;
      this.submitted = false;
    });
  }
}
