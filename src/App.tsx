import './App.css';

import React, { Component } from 'react';
import './App.css';
import Stocks from "./components/Stocks/Stocks";
import {Stock, StockSymbols, StockTypes} from "./models/Stock";
import Trades from "./components/Trades/Trades";
import {ActionTypes, Trade} from "./models/Trade";

interface INewTrade {
    stockSymbol: StockSymbols;
    quantity:number;
    action:ActionTypes;
}
interface IStateProps {
    stocks:Stock[];
    geometricMean:number;
    trades:Trade[];
    createTradeError:string;
    newTrade:INewTrade;
}

class App extends Component {
    state:IStateProps = {
        stocks: [],
        geometricMean: 0,
        trades: [],
        createTradeError: '',
        newTrade: {
            stockSymbol: StockSymbols.NONE,
            quantity: 0,
            action: ActionTypes.NONE
        }
    }

    componentDidMount() {
        this.setState({stocks: this.loadSampleStocks()})
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <h1 className="App-title">Stock Market</h1>
                </header>
                <div>
                    <h3>Stocks</h3>
                    <Stocks stocks={this.state.stocks}
                            onStockPriceChange={(event, index) => this.onStockPriceChange(event, index)}
                    />
                    <span>Geometric Mean: {this.state.geometricMean ? this.state.geometricMean : ''}</span>
                    <div>
                        <button onClick={()=>{this.updateAllVolumeWeightedStockPrices()}}>Volume Weighted Stock Price</button>
                    </div>
                    <div>
                    <h3>Transactions</h3>
                    <Trades trades={this.state.trades}/>
                    </div>
                </div>
                <br />
                <div className='trading'>
                    <h2>Trade</h2>
                    <div>
                        <p className='error'>{ this.state.createTradeError !== '' && this.state.createTradeError}</p>
                    </div>
                    <div>
                        <span>Stock Symbol: </span>
                        <select
                            name='stockSymbol'
                            value={this.state.newTrade.stockSymbol}
                            onChange={this.onChange}
                        >
                            <option></option>
                            <option>{StockSymbols.TEA}</option>
                            <option>{StockSymbols.POP}</option>
                            <option>{StockSymbols.ALE}</option>
                            <option>{StockSymbols.GIN}</option>
                            <option>{StockSymbols.JOE}</option>
                        </select>
                    </div>
                    <div>
                        <span>Quantity of shares: </span>
                        <input
                            name='quantity'
                            type='number'
                            value={this.state.newTrade.quantity}
                            onChange={this.onChange}
                        />
                    </div>
                    <div>
                        <span>You want to: </span>
                        <input
                            name='action'
                            type="radio"
                            value={ActionTypes.BUY}
                            checked={this.state.newTrade.action === ActionTypes.BUY}
                            onChange={this.onChange}
                        />
                        <span>Buy</span>
                        <input
                            name='action'
                            type="radio"
                            value={ActionTypes.SELL}
                            checked={this.state.newTrade.action === ActionTypes.SELL}
                            onChange={this.onChange}
                        />
                        <span>Sell</span>
                    </div>
                    <button onClick={() => {this.createTransaction()}}>Create transaction</button>
                </div>
            </div>
        );
    }

    loadSampleStocks = () => {
        let sampleStocks:Stock[] = [];
        sampleStocks = [
            new Stock(StockSymbols.TEA, StockTypes.Common, 0, 0, 100, 0, 0),
            new Stock(StockSymbols.POP, StockTypes.Common, 8, 0, 100, 0, 0),
            new Stock(StockSymbols.ALE, StockTypes.Common, 23, 0, 60, 0, 0),
            new Stock(StockSymbols.GIN, StockTypes.Preferred, 8, 2, 100, 0, 0),
            new Stock(StockSymbols.JOE, StockTypes.Common, 13, 0, 250, 0, 0)
        ];
        return sampleStocks;
    }

    onStockPriceChange = (event:any, index:number) => {
        const newPriceValue = event.target.value;
        const oldStock = this.state.stocks[index];
        const updatedStock = new Stock(
            oldStock.symbol,
            oldStock.type,
            oldStock.lastDividend,
            oldStock.fixedDividend,
            oldStock.parValue,
            parseFloat(newPriceValue),
            oldStock.volumeWeightedStockPrice
        );
        const newStocks = [...this.state.stocks];
        newStocks[index] = updatedStock;
        this.setState({stocks: newStocks});
    }

    onChange = (event:any) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        const newTrade = {...this.state.newTrade, [name]: value};
        this.setState({
            newTrade: newTrade
        });
    }

    createTransaction = () => {
        if(this.isTransactionFormValid()) {
            const stock = this.state.stocks.filter(stock => stock.symbol === this.state.newTrade.stockSymbol)[0];
            if(stock.price > 0) {
                const trade = new Trade(
                    stock.symbol,
                    this.state.newTrade.quantity,
                    this.state.newTrade.action,
                    stock.price
                );
                this.updateStockVolumeWeightedStockPrice(stock, trade);
                this.setState({trades: this.state.trades.concat(trade)});
                this.setState({ createTradeError: ''});
            } else {
                this.setState({ createTradeError: 'No unit price for selected stock in stocks table'});
            }
        } else {
            this.setState({ createTradeError: 'Trade form is incomplete'});
        }

    }

    isTransactionFormValid = () => {
        const newTrade = this.state.newTrade;
        return (
            newTrade.quantity !== 0 &&
            newTrade.action !== '' &&
            newTrade.stockSymbol !== ''
        );
    }

    updateAllVolumeWeightedStockPrices = () => {
        const newStocks = [];
        for(let stock of this.state.stocks) {
            const trades = this.getLatestTransactions(this.state.trades,stock.symbol);
            const newStock = new Stock(
                stock.symbol,
                stock.type,
                stock.lastDividend,
                stock.fixedDividend,
                stock.parValue,
                stock.price,
                stock.volumeWeightedStockPrice
            );
            newStock.getVolumeWeightedStockPrice(trades);
            newStocks.push(newStock);
        }
        const newGeometricMean = this.getGeometricMean(newStocks);
        this.setState({stocks: newStocks, geometricMean: newGeometricMean});
    }

    updateStockVolumeWeightedStockPrice = (stock:Stock, trade:Trade) => {
        const updatedStock = new Stock(
            stock.symbol,
            stock.type,
            stock.lastDividend,
            stock.fixedDividend,
            stock.parValue,
            stock.price,
            stock.volumeWeightedStockPrice
        );
        const trades = this.getLatestTransactions(this.state.trades.concat(trade),stock.symbol);
        updatedStock.getVolumeWeightedStockPrice(trades);
        const newStocks = [...this.state.stocks];
        newStocks[newStocks.indexOf(stock)] = updatedStock;
        const newGeometricMean = this.getGeometricMean(newStocks);
        this.setState({stocks: newStocks, geometricMean: newGeometricMean});
    }

    getGeometricMean = (stocks:Stock[]) => {
        let stocksVolumeWeightedStockPrice = 0;
        let stockAmount = 0;

        if(stocks && stocks.length > 0) {
            for(let x=0; x<stocks.length; x++) {
                if (stocks[x].volumeWeightedStockPrice) {
                    stocksVolumeWeightedStockPrice = stocksVolumeWeightedStockPrice ? (stocksVolumeWeightedStockPrice * stocks[x].volumeWeightedStockPrice) : stocks[x].volumeWeightedStockPrice;
                    stockAmount++;
                }
            }
        }

        return stockAmount > 0 ? Math.pow(stocksVolumeWeightedStockPrice, 1/stockAmount) : 0;
    }

    getLatestTransactions = (trades:Trade[], stockSymbol:StockSymbols) => {
        return trades.filter(trade =>
            trade.stockSymbol === stockSymbol &&
            this.getDifferenceOfDatesInMinutes(trade.timestamp, new Date()) <= 15
         );


    }

    getDifferenceOfDatesInMinutes = (date1:Date, date2:Date) => {
        const diff = (date1.getTime() - date2.getTime()) / 60000;
        return Math.abs(Math.round(diff));
    }
}

export default App;
