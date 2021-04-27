import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import {URLBuilder} from '@wizpanda/url-builder';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css', '../app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {

    console.log(localStorage.getItem("email"));
    console.log(localStorage.getItem("token"));

  	// TODO:
    // 1: get user email from localStorage token
    // 2: use User.Router GET to retrieve user information from user email
    //    (may have to write new one)
    // 3: insert retrieved user ID into below functions
    // e.g. var endpointUser = "http://localhost:3000/users/get/byemail/" + token.email;
    //      this.httpClient.get(endpointUser.toString()).subscribe( ...
    this.getBio('608748dcd99c9572e03f2c73');
  	this.getImages('608748dcd99c9572e03f2c73');
  }

  public getBio(ID:string) {
    var endpointUser = "http://localhost:3000/users/get/images/" + ID;
    var imagePromises : Promise<Object>[] = [];
    this.httpClient.get(endpointUser.toString())
    .subscribe((val) => {
      let userinfo = JSON.parse(JSON.stringify(val));
      let myName = document.getElementById('username') as HTMLInputElement;
      let myOrg = document.getElementById('organization') as HTMLInputElement;
      var endpointOrg = "http://localhost:3000/organizations/" + userinfo.organization;

      this.httpClient.get(endpointOrg.toString())
      .subscribe((val) => {
        let orginfo = JSON.parse(JSON.stringify(val));
        myName.innerText = userinfo.firstName + " " +  userinfo.lastName;
        myOrg.innerText = orginfo.name;
      },
      (err) => {
        console.log("GET call in error", err);
      },
      () => {});
      },
    (err) => {
      console.log("GET call in error", err);
    },
    () => { }); 
  }


	public getImages(ID:string){
		var endpointUser = "http://localhost:3000/users/get/images/" + ID;
    var imagePromises : Promise<Object>[] = [];
		this.httpClient.get(endpointUser.toString()).subscribe(
        (val) => {
          let userinfo = JSON.parse(JSON.stringify(val));
          var endpointImgs = "http://localhost:3000/users/get/images/";
          for(var i = 0;i< userinfo.permissions.length; i++){
            imagePromises.push(this.getImage(userinfo.permissions[i], i));
          }
          Promise.all(imagePromises).then((data) => {
            var profileImages = ""
            for(var i = 0;i< imagePromises.length; i++){
              console.log(JSON.stringify(data[i]));
              var imageJSON = JSON.parse(JSON.stringify(data[i]));              
              let imglink = new URLBuilder("http://localhost:4200/image");
              imglink.appendQueryParam('imgid', imageJSON._id);
              if(i % 3 == 0){ profileImages += '<div class="row">'; }
              profileImages += '<div class="card col-4">';
              profileImages += '<a href = "' + imglink.toString() + '">';
              profileImages += '<div class="image"><img class="card-img-top img-thumbnail" src="';
              profileImages += imageJSON.url;
              profileImages += '" alt="'
              profileImages += imageJSON.title;
              profileImages += '">'
              profileImages += '<div class="card-body text-center"><a class="card-title">';
              profileImages += imageJSON.title;
              profileImages += '</a></div></div></a></div>';
              if(i+1 % 3 == 0){ profileImages += '</div>'; }

              // if(i % 3 == 0){ profileImages += '<div class="row">'; }
              // profileImages += '<div class="col-sm-4">';
              // profileImages += '<a href = "' + imglink.toString() + '">';
              // profileImages += '<div class="image"><img class="img img-thumbnail full-width" src="';
              // profileImages += imageJSON.url;
              // profileImages += '">'
              // profileImages += '<div class="gallery-title"><span class="text-break gallery-title-text">';
              // profileImages += 'TODO';
              // profileImages += '</span></div></div></a></div>';
              // if(i+1 % 3 == 0){ profileImages += '</div>'; }
            }           
            if(imagePromises.length % 3 != 0){ profileImages += '</div>'; }
            let myContainer = document.getElementById('profile-gallery') as HTMLInputElement;
            myContainer.innerHTML = profileImages;
          });                
        },
        (err) => {
            console.log("GET call in error", err);
        },
        () => {
            console.log("The POST observable is now completed.");
        });
    }

    // var imageJSON = JSON.parse(JSON.stringify(val));
    // var profileImages = ""
    // if(col % 3 == 0){ profileImages += '<div class="row">'; }
    // profileImages += '<div class="col-sm-4"><div class="image"><img class="img img-thumbnail full-width" src="'
    // profileImages += imageJSON.url;
    // profileImages += '"><div class="gallery-title"><span class="text-break gallery-title-text">';
    // profileImages += 'TODO';
    // profileImages += '</span></div></div>';
    // if(col+1 % 3 == 0){ profileImages += '</div>'; }
    // console.log(profileImages);

    private async getImage(perm:string, col:number){
      var endpointImgs = "http://localhost:3000/images/permission/" + perm;
      return this.httpClient.get(endpointImgs.toString()).toPromise();
    }

}
