import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Truck } from '../../lib/interfaces';

@Component({
  selector: 'app-truck-layout',
  imports: [],
  templateUrl: './truck-layout.html',
  styleUrl: './truck-layout.css',
})
export class TruckLayout {

  rows = ['A', 'B'];
  columns = Array.from({length: 12}, (_, i) => i + 1)

  @Input() truck: Truck | undefined | null = null

  @Output() sendSelectedTruck = new EventEmitter<Truck>();

  selectTruck() {
    if (this.truck) {
      this.sendSelectedTruck.emit(this.truck);
      console.log(this.truck?.licensePlate, " license plate is like here")
    }
  }
}
