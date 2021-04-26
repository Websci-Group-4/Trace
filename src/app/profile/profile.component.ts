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
  	// TODO: get user ID from login
  	this.getImages('60796c3ac2ddb8b404621010');
  }

	public getImages(ID:string){
		var endpointUser = "http://localhost:3000/users/get/images/" + ID;
    var imagePromises : Promise<Object>[] = [];
		this.httpClient.get(endpointUser.toString()).subscribe(
        (val) => {
          let userinfo = JSON.parse(JSON.stringify(val));
          let myContainer = document.getElementById('displayname') as HTMLInputElement;
          myContainer.innerText = userinfo.firstName + ' ' + userinfo.lastName;
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
              profileImages += '<div class="col-sm-4">';
              profileImages += '<a href = "' + imglink.toString() + '">';
              profileImages += '<div class="image"><img class="img img-thumbnail full-width" src="';
              profileImages += imageJSON.url;
              profileImages += '">'
              profileImages += '<div class="gallery-title"><span class="text-break gallery-title-text">';
              profileImages += 'TODO';
              profileImages += '</span></div></div></a></div>';
              if(i+1 % 3 == 0){ profileImages += '</div>'; }
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
      var endpointImgs = "http://localhost:3000/image/permission/" + perm;
      return this.httpClient.get(endpointImgs.toString()).toPromise();
    }

}
