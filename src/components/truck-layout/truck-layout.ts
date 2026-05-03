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
    const ids = this.truck?.rows[row]?.[col]?.ordersIds;

    if (!this.selectedItem?.id || !Array.isArray(ids)) {
      return false;
    }

    return ids.includes(this.selectedItem.id);
  }

  showData(row: RowKey, col: Position ) {
    console.log(this.truck?.rows[row][col].ordersIds, " square data here")
  }

  getOrderNumber(row: RowKey, col: Position): string[] | null {
  const ids = this.truck?.rows[row]?.[col]?.ordersIds;

  // 👉 keep null if no data
  if (!Array.isArray(ids)) return null;

  const orderNumbers: string[] = [];

  ids.forEach(id => {
    const found = this.itemList?.find(item => item.id === id);

    if (found?.orderNumber) {
      orderNumbers.push(found.orderNumber);
    }
  });

  // 👉 return null instead of empty array if nothing found
  return orderNumbers.length > 0 ? orderNumbers : [];
}


}
