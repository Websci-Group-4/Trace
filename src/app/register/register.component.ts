import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css', '../app.component.css']
})
export class RegisterComponent implements OnInit {

  data: any = { signupData: {} };

  signupForm = new FormGroup({
    email: new FormControl(''),
    password_one: new FormControl(''),
    password_two: new FormControl('')
  });

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
  }

  registerUser(): void {
    var values = this.signupForm.value;
    if(values.password_one != values.password_two) {
      return;
    }
    // Assemble the request body.
    const BODY: any = {
      "email": values.email,
      "firstName": "Deepti",
      "lastName": "Sachi",
      "password": values.password_one,
      "organization": "608748dbd99c9572e03f2c69",
      "role": "user"
    }
    // Make the request.
    const ENDPOINT = "http://localhost:3000/auth/register";
    this.httpClient.post(ENDPOINT, BODY, { responseType: 'json' })
    .subscribe((res: any) => {
      this.data.signupData = res;
    });
  }
}
