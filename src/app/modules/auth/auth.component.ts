import { Component, OnInit } from '@angular/core';

const styles = [
  `
:host {
  display: flex;
  justify-content: center;
  align-items: center;

  height: 100vh;
}`,
];

@Component({
  selector: 'app-auth',
  template: '<router-outlet></router-outlet>',
  styles,
})
export class AuthComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
