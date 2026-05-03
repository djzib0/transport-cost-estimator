import { Component, signal } from '@angular/core';
import { ItemForm } from "../../components/forms/itemForm/item-form/item-form";
import { Item, ModalType, Position, RowKey, Truck } from '../../lib/interfaces';
import { TruckLayout } from "../../components/truck-layout/truck-layout";
import { areAdjacentFieldsEmpty, createEmptyTruck, generateId } from '../../lib/utils';
import { Modal } from "../../components/modal/modal";
import { ɵInternalFormsSharedModule } from "@angular/forms";
import { NgClass } from '@angular/common';

// TODO
// add saving to excel file
// add uploading data to excel file


@Component({
  selector: 'app-new-estimate',
  imports: [ItemForm, TruckLayout, Modal, ɵInternalFormsSharedModule, NgClass],
  templateUrl: './new-estimate.html',
  styleUrl: './new-estimate.css',
})
export class NewEstimate {

  exampleTruck: Truck = {
    id: generateId(),
    licensePlate: "GWE 3456",
    rows: {
      A: {
        // 1: { orderNumber: ["32334", "32332"] },
        1: { ordersIds: [] },
        2: { ordersIds: [] },
        3: { ordersIds: [] },
        4: { ordersIds: [] },
        5: { ordersIds: [] },
        6: { ordersIds: [] },
        7: { ordersIds: [] },
        8: { ordersIds: [] },
        9: { ordersIds: [] },
        10: { ordersIds: [] },
        11: { ordersIds: [] },
        12: { ordersIds: [] }
      },
      B: {
        1: { ordersIds: [] },
        2: { ordersIds: [] },
        3: { ordersIds: [] },
        4: { ordersIds: [] },
        5: { ordersIds: [] },
        6: { ordersIds: [] },
        7: { ordersIds: [] },
        8: { ordersIds: [] },
        9: { ordersIds: [] },
        10: { ordersIds: [] },
        11: { ordersIds: [] },
        12: { ordersIds: [] }
      }
    }
  }

  exampleItem: Item = {
    id: "idOfItem1",
    name: "rudder",
    width: 1300,
    length: 3400,
    isStacked: false,
    isOnTruck: false,
    orderNumber: "45665",
    clientOrderNumber: null,
    gridWidth: 2, // keeps the number of pallete fields in truck grid row A
    gridLength: 3, // keeps the number of pallete fields in truck grid row B
    truckId: "",
    startingField: "----",
  }

  itemList = signal<Item[]>([
    this.exampleItem,
    {
      id: "1234abcde!@",
      name: "nozzle",
      width: 400,
      length: 1100,
      isStacked: false,
      isOnTruck: false,
      orderNumber: "32146",
      clientOrderNumber: null,
      gridWidth: 1, // keeps the number of pallete fields in truck grid row A
      gridLength: 1, // keeps the number of pallete fields in truck grid row B
      truckId: "",
      startingField: "----",
    }
  ])

  truckList = signal<Truck[]>([
    this.exampleTruck,
    // createEmptyTruck("GDA 1234")
  ])

  // VARIABLES

  selectedTruck = signal<Truck | null>(null);
  selectedItem = signal<Item | null>(null);

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
      createEmptyTruck("KW 29993")
    );
  }

  onTruckChange(event: Event, index: number) {
    const raw = (event.target as HTMLSelectElement).value;
    const truckId = raw === "null" ? null : raw;

    console.log(truckId, 'i on truck change')

    this.itemList.update((list: Item[]) =>
      list.map((item, i): Item => {
        if (i === index) {
          return {
            ...item,
            truckId,
            startingField: null
          };
        }

        return item;
      })
    );
  }

  onSpaceChange(event: Event, index: number) {
    const value = (event.target as HTMLSelectElement).value;

    this.itemList.update(list =>
      list.map((item, i) =>
        i === index ? { ...item, startingField: value } : item
      )
    )

  }

  selectTruck(truck: Truck) {
    this.selectedTruck.set(truck)
  }

  saveItemOnTruck(item: Item) {
    console.log(`saving item ${item.name} from order ${item.orderNumber}`);

    const fieldsToSave: string[] = [];

    console.log(item.startingField === "----")

    const hasValidField =
      item.startingField && item.startingField !== "----";

    if (!hasValidField) {
      return;
    }

    if (hasValidField && item.startingField != null) {
      for (let i = 0; i < item.gridLength; i++) {
        const pos = Number(item.startingField.slice(1)) + i;

        if (item.gridWidth === 1) {
          fieldsToSave.push(`${item.startingField[0]}${pos}`);
        } else {
          fieldsToSave.push(`${item.startingField[0]}${pos}`);
          fieldsToSave.push(`B${pos}`);
        }
      }
    }

    // ✅ Update item list (single, predictable update)
    this.itemList.update(items =>
      items.map(el => {
        if (el.id === item.id) {
          return {
            ...el,
            isOnTruck: true,
            startingField: item.startingField,
            truckId: item.truckId
          };
        }

        return el; // ✅ keep others unchanged
      })
    );

    // ✅ Update truck
    const updatedTruckList = this.truckList().map(truck => {
      if (truck.id !== item.truckId) return truck;

      const updatedRows = { ...truck.rows };

      fieldsToSave.forEach(field => {
        const rowKey = field[0] as keyof typeof truck.rows;
        const position = Number(field.slice(1)) as keyof typeof truck.rows.A;

        updatedRows[rowKey] = {
          ...updatedRows[rowKey],
          [position]: {
            ...updatedRows[rowKey][position],
            ordersIds: item.id
              ? [
                ...(updatedRows[rowKey][position].ordersIds ?? []),
                item.id
              ]
              : updatedRows[rowKey][position].ordersIds ?? []
          }
        };
      });

      return {
        ...truck,
        rows: updatedRows
      };
    });

    this.truckList.set(updatedTruckList);
  }

  // saveItemOnTruck(item: Item) {
  //   console.log(`saving item ${item.name} from order ${item.orderNumber}`);

  //   let fieldsToSave: string[] = [];

  //   console.log(item.startingField != "----" && item.startingField != null)

  //   if (item.startingField != "----" && item.startingField != null) {
  //     for (let i = 0; i < item.gridLength; i++) {
  //       const pos = Number(item.startingField.slice(1)) + i;

  //       if (item.gridWidth === 1) {
  //         console.log(`${item.startingField[0]}${pos}`)
  //         fieldsToSave.push(`${item.startingField[0]}${pos}`);
  //       } else {
  //         fieldsToSave.push(`${item.startingField[0]}${pos}`);
  //         fieldsToSave.push(`B${pos}`);
  //       }
  //     }
  //   }

  //   // reset all 
  //   this.itemList.update(items =>
  //     items.map(el =>
  //       el.id === item.id
  //         ? {
  //           ...el,
  //           isOnTruck: true,   
  //         }
  //         : {
  //           ...el,
  //           startingField: "----",
  //           truckId: null
  //         }
  //     )
  //   );

  //   // reset remaining items in itemList
  //   // this.itemList().forEach(element => {
  //   //   if (element.id === item.id ) {
  //   //     console.log("This is the same item")
  //   //   } else {
  //   //     console.log("this is not the same item")
  //   //     element.startingField = null;
  //   //   }

  //   //   console.log(this.itemList()[1].startingField, " starting field")

  //   //   console.log(element.startingField, "element starting field")
  //   // })

  //   this.itemList.update(items =>
  //     items.map(item => {
  //       if (!item.startingField) return item;

  //       const available = this.showFreeTruckSpace(
  //         item.truckId,
  //         item.gridWidth,
  //         item.gridLength
  //       );

  //       if (!available.includes(item.startingField)) {
  //         return { ...item, startingField: null };
  //       }

  //       return item;
  //     })
  //   );

  //   const updatedTruckList = this.truckList().map(truck => {
  //     if (truck.licensePlate !== item.truckId) return truck;

  //     const updatedRows = { ...truck.rows };

  //     fieldsToSave.forEach(field => {
  //       const rowKey = field[0] as keyof typeof truck.rows;
  //       const position = Number(field.slice(1)) as keyof typeof truck.rows.A;

  //       updatedRows[rowKey] = {
  //         ...updatedRows[rowKey],
  //         [position]: {
  //           ...updatedRows[rowKey][position],
  //           ordersIds: item.id
  //             ? [
  //               ...(updatedRows[rowKey][position].ordersIds ?? []),
  //               item.id
  //             ]
  //             : updatedRows[rowKey][position].ordersIds ?? []
  //         }
  //       };
  //     });

  //     return {
  //       ...truck,
  //       rows: updatedRows
  //     };
  //   });

  //   this.truckList.set(updatedTruckList);
  // }

  removeItemFromTruck(item: Item) {
    console.log(`removing item ${item.truckId} from truck`);

    const fieldsToClear: string[] = [];

    const hasValidField =
      item.startingField && item.startingField !== "----";

    if (!hasValidField) {
      return;
    }

    // 🔹 Build same positions as in save
    for (let i = 0; i < item.gridLength; i++) {
      const pos = Number(item.startingField?.slice(1)) + i;

      if (item.gridWidth === 1 && item.startingField) {
        fieldsToClear.push(`${item.startingField[0]}${pos}`);
      } else if (item.startingField) {
        fieldsToClear.push(`${item.startingField[0]}${pos}`);
        fieldsToClear.push(`B${pos}`);
      }
    }



    // ✅ Update truck (REMOVE id instead of adding)
    const updatedTruckList = this.truckList().map(truck => {
      if (truck.id !== item.truckId) return truck;

      const updatedRows = { ...truck.rows };

      fieldsToClear.forEach(field => {
        const rowKey = field[0] as keyof typeof truck.rows;
        const position = Number(field.slice(1)) as keyof typeof truck.rows.A;

        const currentIds =
          updatedRows[rowKey][position].ordersIds ?? [];

        const filteredIds = currentIds.filter(id => id !== item.id);

        updatedRows[rowKey] = {
          ...updatedRows[rowKey],
          [position]: {
            ...updatedRows[rowKey][position],
            ordersIds: filteredIds.length > 0 ? filteredIds : null
          }
        };
      });

      return {
        ...truck,
        rows: updatedRows
      };
    });

    this.truckList.set(updatedTruckList);

    this.itemList.update(items =>
      items.map(el => {
        if (el.id === item.id) {
          return {
            ...el,
            isOnTruck: false,
            startingField: "----",
            truckId: null
          };
        }

        return el;
      })
    );
  }

  showFreeTruckSpace(
    truckId: string | null | undefined,
    gridWidth: number | null | undefined,
    gridLength: number | null | undefined,
  ) {

    const truck = this.truckList().find(truck => {
      return truck.id === truckId;
    });

    if (!truck || !gridWidth || !gridLength) return [];

    // helper → treat null as empty array
    const getIds = (cell: any): string[] =>
      Array.isArray(cell?.ordersIds) ? cell.ordersIds : [];

    let freeSpaces: string[] = [];

    const positions: Position[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    // const rowKeys: RowKey[] = gridWidth === 2 ? ['A'] : ['A', 'B']
    const rowKeys: RowKey[] = ['A', 'B'];

    if (gridWidth === 2) {
      for (let rowKey of rowKeys) {
        for (let pos of positions) {

          // check if field is empty + if adjacent fields are empty
          if (
            getIds(truck.rows[rowKey][pos]).length === 0 &&
            areAdjacentFieldsEmpty(truck, rowKey, pos, gridWidth, gridLength)
          ) {
            freeSpaces.push(`${rowKey}${pos}`);
          }
        }
      }

      // when gridWidth is 2, we take only row A coordinates
      const filteredFreeSpaces: string[] = freeSpaces.filter(item => !item.includes("B"));

      return filteredFreeSpaces;

    } else if (gridWidth === 1) {
      for (let rowKey of rowKeys) {
        for (let pos of positions) {

          // check if field is empty + if adjacent fields are empty
          if (
            getIds(truck.rows[rowKey][pos]).length === 0 &&
            areAdjacentFieldsEmpty(truck, rowKey, pos, gridWidth, gridLength)
          ) {
            freeSpaces.push(`${rowKey}${pos}`);
          }
        }
      }
    }

    return freeSpaces;
  }

  selectItem(item: Item) {
    // console.log(`passing ${item.orderNumber}`)
    if (item.id === this.selectedItem()?.id) {
      this.selectedItem.set(null);
    } else {
      this.selectedItem.set(item)
    }

    // console.log(`selected item order number is: ${this.selectedItem()?.orderNumber}`)
  }
}
