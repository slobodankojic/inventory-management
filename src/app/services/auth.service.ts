import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedInGuard: boolean = false;
  private loggedIn = new BehaviorSubject<boolean>(false);
  constructor(private afAuth: AngularFireAuth, private toastr: ToastrService, private router: Router) {
    this.checkStayLoggedIn();
   }

  get isLoggedIn() {
    return this.loggedIn.asObservable();
  }
  login(email: any, password: any, stayLoggedIn: boolean){
    this.afAuth.signInWithEmailAndPassword(email, password).then(logRef => {
      this.toastr.success('Uspeno logovanje..!');
      this.loggedIn.next(true);
      this.isLoggedInGuard = true;
      if (stayLoggedIn) {
        this.stayLoggedIn(email, password);
      }
      this.router.navigate(['products']);
    }).catch(err => {
      this.toastr.warning(err);
    })
  }

  logOut(){
    this.afAuth.signOut().then(() => {
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userPassword');
      this.toastr.success('Uspesno ste se izlogovali');
      this.loggedIn.next(false);
      this.isLoggedInGuard = false;
      this.router.navigate(['login']);
    });
  }

  stayLoggedIn(email: string, password: string) {
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userPassword', password);
  }

  checkStayLoggedIn() {
    const userEmail = localStorage.getItem('userEmail');
    const userPassword = localStorage.getItem('userPassword');
    if (userEmail && userPassword) {
      this.afAuth.signInWithEmailAndPassword(userEmail, userPassword).then(logRef => {
        this.loggedIn.next(true);
        this.isLoggedInGuard = true;
        this.router.navigate(['products']);
      }).catch(err => {
        this.toastr.warning(err);
      })
    }
  }
}
