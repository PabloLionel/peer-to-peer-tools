/* eslint-disable no-underscore-dangle */
import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  Optional,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalComponent {
  // TODO: Definir una interfaz para el MAT_DIALOG_DATA
  public constructor(
    @Optional()
    readonly _dialogRef: MatDialogRef<ModalComponent>,
    @Optional()
    @Inject(MAT_DIALOG_DATA)
    readonly _data?: any
  ) {}

  get data(): any {
    return { menssage: '', ...this._data };
  }

}
