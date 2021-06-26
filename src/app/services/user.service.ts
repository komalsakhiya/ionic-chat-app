import { Injectable } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from "@angular/fire/firestore";
import { BehaviorSubject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class UserService {
  currentUserSubject: BehaviorSubject<any>;
  public currentUser: Observable<any>;
  collectionName = 'users';
  constructor(private afAuth: AngularFireAuth, public afs: AngularFirestore) {
    this.currentUserSubject = new BehaviorSubject<any>(
      localStorage.getItem("uid")
    );
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): any {
    return this.currentUserSubject.value;
  }

  /**
   * Login User
   * @param {Object} data
   */
  loginUser(data) {
    return this.afAuth
      .signInWithEmailAndPassword(data.email, data.password)
      .then(
        async (res: any) => {
          console.log(res.user.uid);
          if (res.user) {
            this.afs
              .collection("users", (ref) =>
                ref.where("email", "==", data.email)
              )
              .snapshotChanges()
              .subscribe(async (data) => {
                let user = await data.map((e) => {
                  return {
                    id: e.payload.doc.id,
                  };
                });
                localStorage.setItem("userId", user[0].id);
              });
            localStorage.setItem("uid", JSON.stringify(res.user.uid));
            this.currentUserSubject.next(res.user);
          }
          return res;
        },
        (err) => {
          return err;
        }
      );
  }

  /**
   * Register User
   * @param {object} data
   */
  registerUser(data) {
    console.log(data);
    return new Promise<any>((resolve, reject) => {
      this.afAuth
        .createUserWithEmailAndPassword(data.email, data.password)
        .then(
          (res: any) => {
            // const timestamp = this.timestamp;
            data["userId"] = res.user.uid;
            // data["createdAt"] = timestamp;
            delete data["password"];
            this.afs
              .collection("users")
              .add(data)
              .then((response: any) => {
                resolve(res);
              });
          },
          (err) => reject(err)
        );
    });
  }



  /**
   * Logout
   */
  logout() {
    return new Promise((resolve, reject) => {
      if (this.afAuth.currentUser) {
        this.afAuth
          .signOut()
          .then(() => {
            localStorage.removeItem("uid");
            this.currentUserSubject.next(null);
            resolve();
          })
          .catch((error) => {
            reject();
          });
      }
    });
  }

  getAllUser(){
    return this.afs.collection(this.collectionName).snapshotChanges();
  }

  addMessage(data){
   return this.afs.collection("chatdata").add(data);
  }

  getMessages(){
    return this.afs.collection("chatdata").snapshotChanges();
  }
}
