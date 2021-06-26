import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor( public afAuth: AngularFireAuth,
    public _authService:UserService,
    public router:Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    const currentUser = this._authService.currentUserValue;
    if (currentUser != null) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;

  }
}

export class LoginGuard implements CanActivate {

  constructor(
  
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = localStorage.getItem('uid');
    if (currentUser) {
      return false;
    } else {
      return true;
    }
  }
}
