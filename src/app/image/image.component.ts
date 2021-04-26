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

// function plusSlides(n) {
//   showSlides(slideIndex += n);
// }

// // Thumbnail image controls
// function currentSlide(n) {
//   showSlides(slideIndex = n);
// }

// function showSlides(n) {
//   var i;
//   let slides : NodeListOf<Element> = document.getElementsByClassName("mySlides");
//   let dots  : Array<Element> = document.getElementsByClassName("demo");
//   var captionText = document.getElementById("caption");
//   if (n > slides.length) { var slideIndex = 1}
//   if (n < 1) {var slideIndex = slides.length}
//   for (i = 0; i < slides.length; i++) {
//     slides[i].style.display = "none";
//   }
//   for (i = 0; i < dots.length; i++) {
//     dots[i].className = dots[i].className.replace(" active", "");
//   }
//   slides[slideIndex-1].style.display = "block";
//   dots[slideIndex-1].className += " active";
//   captionText.innerHTML = dots[slideIndex-1].alt;
// }

export class ImageComponent implements OnInit {

  constructor(private httpClient: HttpClient) { }

// http://localhost:4200/image?id=69420
  ngOnInit(): void {
  	this.getImage();
  }

  public getImage(){
	const thisURL = new URLBuilder(window.location.href);
  	console.log(thisURL.getQueryString());
  	var imgid = thisURL.getQueryParam('imgid');
	var endpointImg = "http://localhost:3000/image/" + imgid;
    var imagePromises : Promise<Object>[] = [];
		this.httpClient.get(endpointImg.toString()).subscribe(
        (val) => {
        	 console.log(val);
        	 var imageJSON = JSON.parse(JSON.stringify(val)); 
		     let myContainer = document.getElementsByClassName('container')[0] as HTMLInputElement;
		     let imgHTML = "";
		     imgHTML += '<div class="mySlides"><div class="numbertext">1 / TODO</div><img src="' + 
		     	imageJSON.url + '" style="width:100%"></div>';
		     imgHTML += '<a class="prev" onclick="plusSlides(-1)">&#10094;</a><a class="next" onclick="plusSlides(1)">&#10095;</a>'
		     imgHTML += '<div class="caption-container"><p id="caption">' + 'TODO' + '</p></div>';
		     imgHTML += '<div class="row"><div class="column"><img class="demo cursor" width="12.5%" height="128px" src="' + 
		     	imageJSON.url + '" style="width:100%" onclick="currentSlide(1)" alt="Image One of Undefined"></div></div>'
		     myContainer.innerHTML = imgHTML;
        },
        response => {
            console.log("POST call in error", response);
        },
        () => {
            console.log("The POST observable is now completed.");
        });
  }

}
