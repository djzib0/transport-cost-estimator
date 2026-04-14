import { Component, signal } from '@angular/core';
import { ItemForm } from "../../components/forms/itemForm/item-form/item-form";
import { Item, ModalType, Position, RowKey, Truck } from '../../lib/interfaces';
import { TruckLayout } from "../../components/truck-layout/truck-layout";
import { areAdjacentFieldsEmpty, createEmptyTruck } from '../../lib/utils';
import { Modal } from "../../components/modal/modal";

@Component({
  selector: 'app-new-estimate',
  imports: [ItemForm, TruckLayout, Modal],
  templateUrl: './new-estimate.html',
  styleUrl: './new-estimate.css',
})
export class NewEstimate {

  exampleTruck: Truck = {
    licensePlate: "GWE 3456",
    rows: {
      A: {
        // 1: { orderNumber: ["32334", "32332"] },
        1: { orderNumber: null },
        2: { orderNumber: null },
        3: { orderNumber: ["32335"] },
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
        5: { orderNumber: ["32338"] },
        6: { orderNumber: null },
        7: { orderNumber: null },
        8: { orderNumber: null },
        9: { orderNumber: null },
        10: { orderNumber: ["32338"] },
        11: { orderNumber: null },
        12: { orderNumber: null }
      }
    }
  }

  exampleItem: Item = {
    name: "rudder",
    width: 1300,
    length: 3400,
    isStacked: false,
    orderNumber: "45665",
    clientOrderNumber: null,
    gridWidth: 2, // keeps the number of pallete fields in truck grid row A
    gridLength: 3, // keeps the number of pallete fields in truck grid row B
    truckNumber: null,
    startingField: ["A", 1]
  }

  itemList = signal<Item[]>([
    this.exampleItem,
    {
    name: "nozzle",
    width: 400,
    length: 1100,
    isStacked: false,
    orderNumber: "45665",
    clientOrderNumber: null,
    gridWidth: 1, // keeps the number of pallete fields in truck grid row A
    gridLength: 1, // keeps the number of pallete fields in truck grid row B
    truckNumber: null,
    startingField: null,
    }
  ])
  
  truckList = signal<Truck[]>([
    this.exampleTruck,
    // createEmptyTruck("GDA 1234")
  ])

  // VARIABLES

  selectedTruck = signal<Truck | null>(null)

  // END OF VARIABLES

  //MODAL controls
  isModalOpen = signal<boolean>(false);
  modalTitle = signal<string>("");
  modalText = signal<string>("");
  modalType = signal<ModalType>("default");

  openModal(modalTitle: string, modalText: string, modalType: ModalType) {
    this.modalTitle.set(modalTitle);
    this.modalText.set(modalText);
    this.modalType.set(modalType);
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.modalTitle.set("");
    this.modalText.set("");
    this.modalType.set("default");
    this.isModalOpen.set(false);
  }
  

  addItem(item: Item) {
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
  }

  onSpaceChange(event: Event, index: number) {
    const value = (event.target as HTMLSelectElement).value;
    console.log(value)
    this.itemList.update(list => 
      list.map((item, i) =>
      i === index ? {...item, startingField: [value[0], Number(value[1])] } : item
      )
    )
    console.log(this.itemList())
  }

  selectTruck(truck: Truck) {
    this.selectedTruck.set(truck)
  }

  saveItemOnTruck(item: Item) {
    console.log(`saving item ${item.name} from order ${item.orderNumber}`)
    console.log(`staring point is ${item.startingField?.[0]}, ${item.startingField?.[1]} ${Number(item.startingField?.slice(1))}`)
    const updatedTruckList = this.truckList().map(truck =>
    truck.licensePlate === item.truckNumber
      ? {
          ...truck,
          rows: {
            ...truck.rows,
            [item.startingField?.[0] as keyof typeof truck.rows]: {
              ...truck.rows[item.startingField?.[0] as keyof typeof truck.rows],
              [Number(item.startingField?.slice(1)) as keyof typeof truck.rows.A]: {
                ...truck.rows[
                  item.startingField?.[0] as keyof typeof truck.rows
                ][
                  Number(item.startingField?.slice(1)) as keyof typeof truck.rows.A
                ],
                orderNumber: item.orderNumber
                  ? [
                      ...(
                        truck.rows[
                          item.startingField?.[0] as keyof typeof truck.rows
                        ][
                          Number(item.startingField?.slice(1)) as keyof typeof truck.rows.A
                        ].orderNumber ?? []
                      ),
                      item.orderNumber
                    ]
                  : truck.rows[
                      item.startingField?.[0] as keyof typeof truck.rows
                    ][
                      Number(item.startingField?.slice(1)) as keyof typeof truck.rows.A
                    ].orderNumber ?? []
              }
            }
          }
        }
      : truck
  );

  this.truckList.set(updatedTruckList);
    console.log(this.truckList(), " updated trucks")
  }

  showFreeTruckSpace(
    licensePlate: string | null | undefined,
    gridWidth: number | null | undefined,
    gridLength: number | null | undefined,
  ) {
    const truck = this.truckList().find(truck => {
      return truck.licensePlate === licensePlate
    })

    // console.log(truck, " truck")
    let freeSpaces: string[] = []

    const positions: Position[] = [1,2,3,4,5,6,7,8,9,10,11,12];
    // const rowKeys: RowKey[] = gridWidth === 2 ? ['A'] : ['A', 'B']
    const rowKeys: RowKey[] = ['A', 'B']
    
    if (gridWidth === 2) {
      for (let rowKey of rowKeys) {
        for (let pos of positions) {
          // console.log(truck?.rows[rowKey][pos], `${rowKey}${pos} <-- position`)
          // console.log(truck?.rows[rowKey][pos], `${rowKey}${pos} <-- position`)
          if (
            (gridWidth && gridLength) 
            && truck?.rows[rowKey][pos].orderNumber === null
            && areAdjacentFieldsEmpty(truck, rowKey, pos, gridWidth, gridLength)
          ) {
            freeSpaces.push(`${rowKey}${pos}`)
          }
        };
      };

      // when gridWidth is 2, we take only row A coordinates
      const filteredFreeSpaces: string[] = freeSpaces.filter(item => !item.includes("B"))

      return filteredFreeSpaces || [];

    } else if (gridWidth === 1) {
        for (let rowKey of rowKeys) {
          for (let pos of positions) {
            // console.log(truck?.rows[rowKey][pos], `${rowKey}${pos} <-- position`)
            // console.log(truck?.rows[rowKey][pos], `${rowKey}${pos} <-- position`)
    
            if (
              (gridWidth && gridLength) 
              && truck?.rows[rowKey][pos].orderNumber === null
              && areAdjacentFieldsEmpty(truck, rowKey, pos, gridWidth, gridLength)
            ) {
              freeSpaces.push(`${rowKey}${pos}`)
            }
          };
        };
    };

    return freeSpaces;
  }
}
