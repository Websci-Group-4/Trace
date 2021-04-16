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
        const h3 = window.document.createElement('h3');
        h3.innerHTML = "Ethan's Vis #1: User Breakdown by Organization";
        document.getElementsByTagName('body')[0].append(h3);
        const svg = window.document.createElement('div');
        svg.innerHTML = res.data;
        document.getElementsByTagName('body')[0].append(svg);
      });
    axios.get('http://localhost:3000/views/visualization').then((res) => {
      const h3 = window.document.createElement('h3');
      h3.innerHTML =
        "Ethan's Vis #2: Image Views by User Permissions and Organizations";
      document.getElementsByTagName('body')[0].append(h3);
      const svg = window.document.createElement('div');
      svg.innerHTML = res.data;
      document.getElementsByTagName('body')[0].append(svg);
    });
  }
}
