import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Component, signal, OnInit } from '@angular/core';
import {form, FormField} from '@angular/forms/signals';
import { ItemData } from '../../../../lib/interfaces';
import { palletPlacePricePln } from '../../../../lib/data';
import { CurrencyPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localePl);
import localePl from '@angular/common/locales/pl';

@Component({
  selector: 'app-item-form',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './item-form.html',
  styleUrl: './item-form.css',
})
export class ItemForm {


  itemModel = signal<ItemData>({
    name: 'kj',
    width: 0,
    length: 0,
    isStacked: null,
    orderNumber: null,
    clientOrderNumber: null,
    gridWidth: null,
    gridLength: null
  })

  palletPlacePricePln = signal(palletPlacePricePln)

  name = new FormControl('')

  itemForm: FormGroup = new FormGroup({
    name: new FormControl('jk', Validators.required),
    width: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2400)]),
    length: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(12000)]),
    isStacked: new FormControl(null),
    orderNumber: new FormControl(null),
    clientOrderNumber: new FormControl(null),
    gridWidth: new FormControl(null),
    gridLength: new FormControl(null),
  })

  ngOnInit() {
    this.itemForm.valueChanges.subscribe(val => {
      this.calculateSpace();
    })
  }

  submit(){
    if (this.itemForm.valid) {
      // console.log('Form value:', this.itemForm.value)
    }
  }

  calculateSpace() {
    const width = Number(this.itemForm.value.width);
    const length = Number(this.itemForm.value.length);
    const newGridWidthValue = Math.ceil(width / 1200);
    const newGridLengthValue = Math.ceil(length /1200);

    const currentgridWidth = this.itemForm.get('gridWidth')?.value;
    const currentgridLength = this.itemForm.get('gridLength')?.value;

    if (currentgridWidth !== newGridWidthValue) {
      this.itemForm.get('gridWidth')?.setValue(newGridWidthValue, {emitEvent: false})
    }
    
    if (currentgridLength !== newGridLengthValue) {
      this.itemForm.get('gridLength')?.setValue(newGridLengthValue, {emitEvent: false})
    }
  }

  createArray(size: number) {
    return Array.from({length: Number(size)})
  }

  calculateTransportCost(width: number, length: number) {
    return Number(width) * Number(length) * palletPlacePricePln;
  }

}