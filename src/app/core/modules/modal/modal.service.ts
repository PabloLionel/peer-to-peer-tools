/* eslint-disable no-debugger */
/* eslint-disable no-underscore-dangle */
import { ComponentType } from '@angular/cdk/portal';
import { Injectable, TemplateRef } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { get } from 'lodash-es';
import { Subscription } from 'rxjs';
import { AppContextService } from '../services';
import { ModalComponent } from './modal.component';

interface IModalOpen {
  component: ComponentType<any> | TemplateRef<any>;
  outputs?: { [output: string]: (event: any) => void };
  inputs?: { [input: string]: any };
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private dialogRef!: MatDialogRef<any>;
  private width!: string;

  constructor(
    private readonly _dialog: MatDialog,
    private readonly appContextService: AppContextService
  ) {
    this.appContextService.breakpoint$.subscribe(({ breakpoint }) => {
      this.width = get(
        {
          s: '330px',
          m: '530px',
          lg: '1000px',
          xl: '1000px',
        },
        breakpoint
      );

      if (this.dialogRef) {
        this.dialogRef.updateSize(this.width);
      }
    });
  }

  open(
    { component, inputs, outputs }: IModalOpen,
    _config: MatDialogConfig = {}
  ) {
    const config = {
      ...{
        restoreFocus: false,
        width: this.width,
        maxHeight: 'calc(100vh - 4em)',
        position: {
          top: '2em',
        },
      },
      ..._config,
    };

    return new Promise((resolve, reject) => {
      this.dialogRef = this._dialog.open(component, config);

      Object.entries(outputs ?? {}).forEach(([output, subscriber]) => {
        if (!this.dialogRef.componentInstance.hasOwnProperty(output)) {
          return;
        }

        this.dialogRef.componentInstance[output].subscribe((event: any) => {
          subscriber(event);
        });
      });

      Object.entries(inputs ?? {}).forEach(([input, value]) => {
        this.dialogRef.componentInstance[input] = value;
      });

      const closed = this.dialogRef.afterClosed();

      const sub = closed.subscribe({
        next: (result) => {
          resolve(result);

          sub.unsubscribe();
        },
        error: reject,
      });
    });
  }

  close(optionalResult?: any) {
    if (!this.dialogRef) {
      return;
    }

    this.dialogRef.close(optionalResult);
  }

  confirm(
    data: any = {},
    _config: MatDialogConfig = {
      restoreFocus: false,
      width: '330px',
    }
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // TODO: Mover a una configuración inyectable
      data = Object.assign(
        {
          title: 'Confirmar antes de continuar',
          textBtn: 'Confirmar',
          typeModal: 'confirm',
          cancel: true,
        },
        data
      );

      const dialogRef = this._dialog.open(
        ModalComponent,
        Object.assign(_config, { data })
      );

      const closed = dialogRef.afterClosed();

      const sub = closed.subscribe({
        next: (result) => {
          resolve(result);
          sub.unsubscribe();
        },
        error: reject,
      });
    });
  }

  error(
    data: any = {},
    _config: MatDialogConfig = {
      restoreFocus: false,
      width: '330px',
    }
  ): Promise<void> {
    return new Promise((_, reject) => {
      // TODO: Mover a una configuración inyectable
      data = Object.assign(
        {
          title: 'Ocurrio un error inesperado',
          textBtn: 'Ok',
          typeModal: 'error',
        },
        data
      );

      const dialogRef = this._dialog.open(
        ModalComponent,
        Object.assign(_config, { data })
      );

      const closed = dialogRef.afterClosed();

      const sub: Subscription = closed.subscribe({
        next: () => setTimeout(() => sub.unsubscribe()),
        error: reject,
      });
    });
  }
}
