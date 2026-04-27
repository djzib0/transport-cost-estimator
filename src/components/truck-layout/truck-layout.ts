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
  @Input() itemList: Item[] | null = null;
  @Input() selectedTruck: Truck | null = null;
  @Input() selectedItem: Item | null = null;

  @Output() sendSelectedTruck = new EventEmitter<Truck>();

  selectTruck() {
    if (this.truck) {
      this.sendSelectedTruck.emit(this.truck);
    }
  }

  checkIsSelected(row: RowKey, col: Position) {
    if (this.selectedItem?.id && this.truck?.rows[row]?.[col]?.ordersIds.includes(this.selectedItem?.id)) {
      return true
    }
    return false
  }

  showData(row: RowKey, col: Position ) {
    console.log(this.truck?.rows[row][col].ordersIds, " square data here")
  }

  getOrderNumber(row: RowKey, col: Position): string[] | null | undefined {
    let orderNumbers: string[] | null = [""]
    this.truck?.rows[row]?.[col]?.ordersIds.forEach(id => {
      this.itemList?.map(item => {
        if (item.orderNumber && item.id === id) {
          orderNumbers.push(item.orderNumber);
        }
      })
    })

    return orderNumbers;
  }


}
