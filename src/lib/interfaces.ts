export interface ItemData {
    name: string;
    width: number;
    length: number;
    isStacked?: boolean | null;
    orderNumber?: string | null;
    clientOrderNumber?: string | null;
}