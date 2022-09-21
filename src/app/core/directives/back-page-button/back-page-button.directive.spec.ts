import { TestBed } from '@angular/core/testing';
import { BackPageButtonDirective } from './back-page-button.directive';
import { Location } from '@angular/common';

describe('BackPageButtonDirective', () => {
  it('should create an instance', () => {
    const directive = new BackPageButtonDirective(TestBed.inject(Location));
    expect(directive).toBeTruthy();
  });
});
