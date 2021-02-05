import React from 'react';
import { Stock } from '../../models/Stock';
import './Stocks.css';

export interface IProps {
    stocks:Stock[];
    onStockPriceChange:(event:any, index:any) => any;
}

const Stocks = (props:IProps) => {
    const sampleDataForStocks = props.stocks ?
        props.stocks.map((stock:Stock, index:number) => (
            <tr key={index + 1}>
                <td>{stock.symbol ? stock.symbol : ''}</td>
                <td>{stock.type ? stock.type : ''}</td>
                <td>{stock.lastDividend ? stock.lastDividend : ''}</td>
                <td>{stock.fixedDividend ? stock.fixedDividend : ''}</td>
                <td>{stock.parValue ? stock.parValue : ''}</td>
                <td><input type='number' onChange={(event) => props.onStockPriceChange(event, index)}/></td>
                <td>{stock.dividendYield ? stock.dividendYield.toFixed(2) : ''}</td>
                <td>{stock.peRatio ? stock.peRatio : ''}</td>
                <td>{stock.volumeWeightedStockPrice ? stock.volumeWeightedStockPrice : ''}</td>
            </tr>
        )): [];
    return (
        <table className='table'>
            <thead>
            <tr>
                <th>Stock symbol</th>
                <th>Type</th>
                <th>Last dividend</th>
                <th>Fixed dividend</th>
                <th>Par value</th>
                <th>Price</th>
                <th>Dividend yield</th>
                <th>P/E ratio</th>
                <th>Volume weighted stock price</th>
            </tr>
            </thead>
            <tbody>
            {sampleDataForStocks}
            </tbody>
        </table>
    );
}

export default Stocks;
