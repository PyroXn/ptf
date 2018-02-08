import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import Button from 'material-ui/Button';
import Add from 'material-ui-icons/Add';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui-icons/Edit';
import DeleteIcon from 'material-ui-icons/Delete';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

class TransactionList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            transactions: []
        };
    }

    componentDidMount() {
        axios.get(`/api/transaction/${this.props.match.params.portfolioId}/${this.props.match.params.currencyId}`)
            .then(res => {
                this.setState({transactions: res.data});
            });
    }

    delete(id){
        axios.delete('/api/transaction/'+id)
            .then(() => {
                this.props.history.push("/")
            });
    }

    render() {
        const listItems = this.state.transactions.map(transaction =>
            <TableRow key={transaction._id}>
                <TableCell>{transaction.currency.FullName}</TableCell>
                <TableCell>{transaction.EUR.market_price}</TableCell>
                <TableCell>{transaction.EUR.change24}</TableCell>
                <TableCell>{transaction.EUR.volume24}</TableCell>

                <TableCell>{transaction.EUR.value}</TableCell>
                <TableCell>{transaction.action === 'BUY' ? transaction.EUR.cost : transaction.EUR.gain}</TableCell>
                <TableCell>{transaction.EUR.profit}</TableCell>
                <TableCell>{transaction.EUR.profit_pct}</TableCell>

                <TableCell>{transaction.action}</TableCell>
                <TableCell>{transaction.market.name}</TableCell>
                <TableCell>{transaction.trading_pair}</TableCell>
                <TableCell>{transaction.quantity}</TableCell>
                <TableCell>{transaction.book_price}</TableCell>
                <TableCell>{transaction.date}</TableCell>
                <TableCell>
                    <Link to={`transaction/edit/${transaction._id}`}>
                        <IconButton color="primary" aria-label="Edit">
                            <EditIcon />
                        </IconButton>
                    </Link>
                    <IconButton color="secondary" aria-label="delete" onClick={this.delete.bind(this, transaction._id)}>
                        <DeleteIcon />
                    </IconButton>
                </TableCell>

            </TableRow>
        );
        return (

            <div>
                <Link to="/transaction/create">
                    <Button variant="fab" color="primary" aria-label="add">
                        <Add />
                    </Button>
                </Link>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Currency</TableCell>
                            <TableCell>Market Price €</TableCell>
                            <TableCell>% Change 24h</TableCell>
                            <TableCell>Volume 24h</TableCell>

                            <TableCell>Value</TableCell>
                            <TableCell>Cost / Gain</TableCell>
                            <TableCell>Profit</TableCell>
                            <TableCell>Profit %</TableCell>

                            <TableCell>Action</TableCell>
                            <TableCell>Market</TableCell>
                            <TableCell>Trading Pair</TableCell>
                            <TableCell>Quantity</TableCell>
                            <TableCell>Book Price</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listItems}
                    </TableBody>
                </Table>
            </div>

        );
    }
}

export default TransactionList;