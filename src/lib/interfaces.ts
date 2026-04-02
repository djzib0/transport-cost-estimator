export interface ItemData {
    name: string;
    width: number;
    length: number;
    isStacked?: boolean | null;
    orderNumber?: string | null;
    clientOrderNumber?: string | null;
    gridWidth?: number; // keeps the number of pallete fields in truck grid row A
    gridLength?: number; // keeps the number of pallete fields in truck grid row B
}

export interface Item {

}