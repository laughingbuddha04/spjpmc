import { StockSymbols } from "./Stock";

export class Trade {
    stockSymbol: StockSymbols;
    quantity: number;
    action: ActionTypes;
    price: number;
    timestamp: Date;
    constructor(stockSymbol:StockSymbols, quantity:number, action:ActionTypes, price:number) {
        this.stockSymbol =  stockSymbol;
        this.quantity = quantity;
        this.action = action;
        this.price = price;
        this.timestamp = new Date();
    }
}

export enum ActionTypes {
    NONE = '',
    BUY = 'Buy',
    SELL = 'Sell'
}