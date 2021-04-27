import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css', '../app.component.css']
})
export class SigninComponent implements OnInit {

  data: any = { signinData: {} };

  signinForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private httpClient: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
  }

  signUser(): void {
    var values = this.signinForm.value;

    const ENDPOINT = "http://localhost:3000/auth/login";
    const BODY: any = this.signinForm.value;
    this.httpClient.post(ENDPOINT, BODY, { responseType: 'json' })
    .subscribe((res: any) => {
      this.data.signinData = res;

      if(res.message === "Login Successful!") {
        localStorage.setItem("email", values.email.toString());
        localStorage.setItem("token", res.token.toString());

        this.router.navigate(['profile']);
      }
    });
  }
}