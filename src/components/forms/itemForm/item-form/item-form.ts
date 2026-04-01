import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { Component, signal, OnInit } from '@angular/core';
import {form, FormField} from '@angular/forms/signals';
import { ItemData } from '../../../../lib/interfaces';

@Component({
  selector: 'app-item-form',
  imports: [ReactiveFormsModule],
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
  })

  name = new FormControl('')

  itemForm: FormGroup = new FormGroup({
    name: new FormControl('kj', Validators.required),
    width: new FormControl(0, [Validators.required, Validators.min(0)]),
    length: new FormControl(0, [Validators.required, Validators.min(0)]),
    isStacked: new FormControl(null),
    orderNumber: new FormControl(null),
    clientOrderNumber: new FormControl(null),
  })

  ngOnInit() {
    this.itemForm.valueChanges.subscribe(val => {
      console.log('Forms value changed:', val);
      this.calculateSpace();
    })
  }

  submit(){
    if (this.itemForm.valid) {
      console.log('Form value:', this.itemForm.value)
    }
  }

  calculateSpace() {
    console.log(Number(this.itemForm.value.width) + Number(this.itemForm.value.length));
  }

}