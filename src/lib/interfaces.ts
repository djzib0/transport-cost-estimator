export interface Item {
    name: string;
    width: number;
    length: number;
    isStacked?: boolean | null;
    orderNumber?: string | null;
    clientOrderNumber?: string | null;
    gridWidth?: number | null; // keeps the number of pallete fields in truck grid row A
    gridLength?: number | null; // keeps the number of pallete fields in truck grid row B
    truckNumber?: number | null;
}

export interface GridResult {
    gridWidth: number;
    gridLength: number;
}

export interface Truck {
    licensePlate?: string;
    rowA1: {
        orderNumber: string[] | null; // can contain stacked order
    }
}