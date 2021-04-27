import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HttpParams } from '@angular/common/http';
import {URLBuilder} from '@wizpanda/url-builder';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css', '../app.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ImageComponent implements OnInit {

  data: any = { imageData: {} };

  constructor(private httpClient: HttpClient) { }

  // http://localhost:4200/image?id=69420
  ngOnInit(): void {
  	this.getImage();
  }

  public getImage() {
    // Extract the Image ID from the link and put it in the endpoint.
	  const thisURL = new URLBuilder(window.location.href);
  	console.log(thisURL.getQueryString());
  	var imgid = thisURL.getQueryParam('imgid');

    // Make the request for the image and its information.
	  const ENDPOINT: string = "http://localhost:3000/images/get/" + imgid;
    const BODY: any = {
      "user": localStorage.getItem('userID'),
      "identifier": localStorage.getItem('email')
    };
    this.httpClient.post(ENDPOINT, BODY, { responseType: 'json' })
    .subscribe((res: any) => {
      this.data.imageData = res;
    });
  }
}
