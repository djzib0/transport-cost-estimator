import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Component, signal, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {form, FormField} from '@angular/forms/signals';
import { Item } from '../../../../lib/interfaces';
import { palletPlacePricePln } from '../../../../lib/data';
import { CurrencyPipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localePl);
import localePl from '@angular/common/locales/pl';
import { calculateSpace } from '../../../../lib/utils';

@Component({
  selector: 'app-item-form',
  imports: [ReactiveFormsModule, CurrencyPipe],
  templateUrl: './item-form.html',
  styleUrl: './item-form.css',
})
export class ItemForm {

  itemModel = signal<Item>({
    id: "lkjlajoiuiuyia",
    name: 'kj',
    width: 0,
    length: 0,
    isStacked: null,
    orderNumber: null,
    clientOrderNumber: null,
    gridWidth: 0,
    gridLength: 0,
    truckNumber: "",
  })

  palletPlacePricePln = signal(palletPlacePricePln)

  itemForm: FormGroup = new FormGroup({
    name: new FormControl('rudder', Validators.required),
    orderNumber: new FormControl("43216", Validators.required),
    width: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(2400)]),
    length: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(12000)]),
    isStacked: new FormControl(null),
    clientOrderNumber: new FormControl(null),
    gridWidth: new FormControl(null),
    gridLength: new FormControl(null),
    truckNumber: new FormControl(null),
    startingField: new FormControl(null)
  })

  @Output() itemCreated = new EventEmitter<Item>();

  ngOnInit() {
    this.itemForm.valueChanges.subscribe(val => {
      this.calculateSpaceFromForm();
    })
  }

  submit(){
    if (this.itemForm.valid) {
      this.itemCreated.emit(this.itemForm.value as Item);

    }
  }

  calculateSpaceFromForm() {
    const width = Number(this.itemForm.value.width);
    const length = Number(this.itemForm.value.length);
    const result = calculateSpace(width, length);

    const currentgridWidth = this.itemForm.get('gridWidth')?.value;
    const currentgridLength = this.itemForm.get('gridLength')?.value;

    if (currentgridWidth !== result.gridWidth) {
      this.itemForm.get('gridWidth')?.setValue(result.gridWidth, {emitEvent: false})
    }
    
    if (currentgridLength !== result.gridLength) {
      this.itemForm.get('gridLength')?.setValue(result.gridLength, {emitEvent: false})
    }
  }

  createArray(size: number) {
    return Array.from({length: Number(size)})
  }

  calculateTransportCost(width: number, length: number) {
    return Number(width) * Number(length) * palletPlacePricePln;
  }

}