import { Component, signal } from '@angular/core';
import { ItemForm } from "../../components/forms/itemForm/item-form/item-form";
import { Item, Position, RowKey, Truck } from '../../lib/interfaces';
import { TruckLayout } from "../../components/truck-layout/truck-layout";
import { createEmptyTruck } from '../../lib/utils';

@Component({
  selector: 'app-new-estimate',
  imports: [ItemForm, TruckLayout],
  templateUrl: './new-estimate.html',
  styleUrl: './new-estimate.css',
})
export class NewEstimate {

  exampleTruck: Truck = {
    licensePlate: "GWE 3456",
    rows: {
      A: {
        1: { orderNumber: ["jk"] },
        2: { orderNumber: null },
        3: { orderNumber: null },
        4: { orderNumber: null },
        5: { orderNumber: null },
        6: { orderNumber: null },
        7: { orderNumber: null },
        8: { orderNumber: null },
        9: { orderNumber: null },
        10: { orderNumber: null },
        11: { orderNumber: null },
        12: { orderNumber: null }
      },
      B: {
        1: { orderNumber: null },
        2: { orderNumber: null },
        3: { orderNumber: null },
        4: { orderNumber: null },
        5: { orderNumber: null },
        6: { orderNumber: null },
        7: { orderNumber: null },
        8: { orderNumber: null },
        9: { orderNumber: null },
        10: { orderNumber: null },
        11: { orderNumber: null },
        12: { orderNumber: null }
      }
    }
  }

  itemList = signal<Item[]>([])
  truckList = signal<Truck[]>([
    this.exampleTruck,
    createEmptyTruck("GDA 1234")
  ])

  selectedTruck = signal<Truck | null>(null)
  

  addItem(item: Item) {
    console.log("adding item")
    const currentItemList = this.itemList();
    const updatedItemList = [...currentItemList, item]; // adds new item
    this.itemList.set(updatedItemList);
  }

  addTruck() {
    this.truckList().push(
      createEmptyTruck()
    );
  }

  onTruckChange(event: Event, index: number) {
    const value = (event.target as HTMLSelectElement).value;

    this.itemList.update(list => 
      list.map((item, i) =>
      i === index ? {...item, truckNumber: value } : item
      )
    )
    console.log(this.itemList())
  }

  selectTruck(truck: Truck) {
    this.selectedTruck.set(truck)
  }

  showFreeTruckSpace(
    licensePlate: string | null | undefined,
    gridWidth: number | null | undefined,
    gridLength: number | null | undefined,
  ) {
    const truck = this.truckList().find(truck => {
      return truck.licensePlate === licensePlate
    })

    console.log(truck, " truck")
    let freeSpaces = []

    const positions: Position[] = [1,2,3,4,5,6,7,8,9,10,11,12];
    const rowKeys: RowKey[] = gridWidth === 2 ? ['A'] : ['A', 'B']
    console.log(rowKeys, " rowkeys", gridWidth, " gridWidthwidth")

    for (let rowKey of rowKeys) {
      for (let pos of positions) {
        // console.log(truck?.rows[rowKey][pos], `${rowKey}${pos} <-- position`)
        // console.log(truck?.rows[rowKey][pos], `${rowKey}${pos} <-- position`)

        if (truck?.rows[rowKey][pos].orderNumber === null) {
          freeSpaces.push(`${rowKey}${pos}`)
        }
      };
    };

    return freeSpaces;
  }


}
