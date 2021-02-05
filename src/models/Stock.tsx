import { Trade } from "./Trade";

export enum StockSymbols {
    NONE = '',
    TEA = 'TEA',
    POP = 'POP',
    ALE = 'ALE',
    GIN = 'GIN',
    JOE = 'JOE'
}

export enum StockTypes {
    NONE = '',
    Common = 'Common',
    Preferred = 'Preferred'
}
export class Stock {
    symbol: StockSymbols;
    type: StockTypes;
    lastDividend: number;
    fixedDividend: number;
    parValue: number;
    volumeWeightedStockPrice: number;
    price: number;
    dividendYield: number;
    peRatio: number;

    constructor(
        symbol:StockSymbols, type:StockTypes, lastDividend:number, fixedDividend:number,
        parValue:number, price:number, volumeWeightedStockPrice:number) {
        this.symbol = symbol;
        this.type = type;
        this.lastDividend = lastDividend;
        this.fixedDividend = fixedDividend;
        this.parValue = parValue;
        this.volumeWeightedStockPrice = volumeWeightedStockPrice;
        if (price) {
            this.setPrice(price);
        }
    };

    setPrice = (price:number) => {
        this.price = price;
        this.getDividendYield();
        this.getPERatio();
    };

    getVolumeWeightedStockPrice = (trades:Trade[]) => {
        let volumeWeightedStockPriceDividend = 0;
        let volumeWeightedStockPriceDivisor = 0;
        for (let trade of trades) {
            volumeWeightedStockPriceDividend = volumeWeightedStockPriceDividend + (trade.price * trade.quantity);
            volumeWeightedStockPriceDivisor = volumeWeightedStockPriceDivisor + trade.quantity;
        }
        this.volumeWeightedStockPrice = volumeWeightedStockPriceDividend / volumeWeightedStockPriceDivisor;
    }

    getDividendYield = () => {
        if (this.type === StockTypes.Common) {
            if (this.isNumber(this.lastDividend) && this.isPositive(this.price)) {
                this.dividendYield = this.lastDividend / this.price;
            }
            else {
                this.dividendYield = 0;
            }
        } else if (this.type === StockTypes.Preferred) {
            if(this.isNumber(this.fixedDividend) && this.isNumber(this.parValue) && this.isPositive(this.price)) {
                this.dividendYield = this.fixedDividend * this.parValue / this.price;
            }
            else {
                this.dividendYield = 0;
            }
        }
    };

    getPERatio = () => {
        if(this.isNumber(this.price) && this.isPositive(this.dividendYield)) {
            this.peRatio = this.price / this.dividendYield;
        }
    };

    isNumber = (value:any) => {
        return value && typeof value === 'number';
    }

    isPositive = (value:number) => {
        return this.isNumber(value) && value > 0;
    }
}


