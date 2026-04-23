import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Item, Position, RowKey, Truck } from '../../lib/interfaces';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-truck-layout',
  imports: [NgClass],
  templateUrl: './truck-layout.html',
  styleUrl: './truck-layout.css',
})
export class TruckLayout {

  rows: RowKey[] = ['A', 'B'];
  columns: Position[] = Array.from({length: 12}, (_, i) => (i + 1) as Position)

  @Input() truck: Truck | undefined | null = null
  @Input() selectedTruck: Truck | null = null;
  @Input() selectedItem: Item | null = null;

  @Output() sendSelectedTruck = new EventEmitter<Truck>();

  selectTruck() {
    if (this.truck) {
      this.sendSelectedTruck.emit(this.truck);
    }

  }

  showData(row: RowKey, col: Position ) {
    console.log(this.truck?.rows[row][col].orderNumber, " square data here")
  }


  // TODO 
  // truck should keep the Item in array, not orderNumbers, it will allow
  // conditionally change color of selected Item
  getOrderNumber(row: RowKey, col: Position): string[] | null | undefined {
    return this.truck?.rows[row]?.[col]?.orderNumber;
  }

}
