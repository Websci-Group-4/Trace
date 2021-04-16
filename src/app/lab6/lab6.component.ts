import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-lab6',
  templateUrl: './lab6.component.html',
  styleUrls: ['./lab6.component.css'],
})
export class Lab6Component implements OnInit {
  constructor() {}

  visdata: any;

  ngOnInit(): void {
    axios
      .get('http://localhost:3000/organizations/visualization')
      .then((res) => {
        const svg = window.document.createElement('div');
        svg.innerHTML = res.data;
        document.getElementsByTagName('body')[0].appendChild(svg);
      });
  }
}
