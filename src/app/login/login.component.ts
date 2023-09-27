import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  stayLoggedIn: boolean = false;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {}

  onSubmit(formData: any) {
    this.authService.login(formData.email, formData.password, this.stayLoggedIn);
  }
}
