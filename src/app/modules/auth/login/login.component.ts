import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { isEqual } from 'lodash-es';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { AuthService, UserService } from 'src/app/core/modules/services';
import { IS_EMAIL_REGEXP } from 'src/app/core/utils';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss', '../auth.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  @Output() toRegister = new EventEmitter();

  showSpinner = false;
  hide = true;
  formLogin = this.fb.group({
    email: [
      environment.production ? '' : 'example@gmail.com',
      [Validators.required, Validators.pattern(IS_EMAIL_REGEXP)],
    ],
    password: [environment.production ? '' : '123456', Validators.required],
  });

  constructor(
    private readonly fb: FormBuilder,
    private readonly router: Router,
    private readonly authService: AuthService,
    private readonly userService: UserService
  ) {}

  get emailControl() {
    return this.formLogin.get('email') as FormControl;
  }

  ngOnInit(): void {
    this.formLogin.valueChanges
      .pipe(
        filter(() => this.emailControl.valid),
        debounceTime(900),
        distinctUntilChanged((prev, curr) => !isEqual(prev, curr))
      )
      .subscribe({
        next: ({ email }: any) => {},
      });
  }

  login() {
    this.authService.login(this.formLogin.value).subscribe({
      next: () => {
        this.router.navigate(['/bashboard']);
      },
    });
  }
}
