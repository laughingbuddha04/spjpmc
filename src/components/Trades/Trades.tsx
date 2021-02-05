import { Trade } from '../../models/Trade';

export interface IProps {
    trades:Trade[];
}

const Trades = (props:IProps) => {
    const trades = props.trades ? props.trades.map((trade, index) =>
        <tr key={index + 1}>
            <td>{trade.timestamp.toUTCString}</td>
            <td>{trade.stockSymbol}</td>
            <td>{trade.quantity}</td>
            <td>{trade.action}</td>
            <td>{trade.price}</td>
            <td>{trade.price * trade.quantity}</td>
        </tr>
    ) : null;
    return (
        <table className='table'>
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Stock symbol</th>
                    <th>Quantity of shares</th>
                    <th>Indicator</th>
                    <th>Traded price</th>
                    <th>Total Price</th>
                </tr>
            </thead>
            <tbody>
                {trades}
            </tbody>
        </table>
    );
};

export default Trades;