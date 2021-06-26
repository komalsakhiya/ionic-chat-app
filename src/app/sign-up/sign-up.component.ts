import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { UserService } from "../services/user.service";
import {ToastService} from '../services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: "app-sign-up",
  templateUrl: "./sign-up.component.html",
  styleUrls: ["./sign-up.component.scss"],
})
export class SignUpComponent implements OnInit {
  registerForm: FormGroup;
  submitted: Boolean = false;
  loading: Boolean = false;
  isDisable: Boolean = false;
  constructor(
    public _userService: UserService,
    public _toastService:ToastService,
    public router:Router
    ) {
    this.registerForm = new FormGroup({
      email: new FormControl("", [Validators.required, Validators.email]),
      userName: new FormControl("", [Validators.required]),
      password: new FormControl("", [Validators.required]),
    });
  }

  ngOnInit() {}

  get f() {
    return this.registerForm.controls;
  }

  registerUser(data){
    this.submitted = true;
   
    if (this.registerForm.invalid) {
      return
    }
    this.loading = true;
    this.isDisable = true;
    console.log(data);
    this._userService.registerUser(data).then(async (res) => {
      this._toastService.presentToast("Registered successfully! Please login")
      this.loading = false;
      this.isDisable = false;
      this.registerForm.reset();
      this.submitted = false;
      this.router.navigateByUrl('login')
    }).catch((err) => {
      console.log("register err", err);
      if (err.code == 'auth/invalid-email') {
        this._toastService.presentToast('Enter Valid Email!')
      } else if (err.code == 'auth/weak-password') {
        this._toastService.presentToast('Password should be at least 6 characters')
      }
      this.loading = false;
      this.isDisable = false;
      // this._toastService.presentToast(err.message)
    })
  }
}
