import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500} from 'material-ui/styles/colors';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn,} from 'material-ui/Table';

class TransactionList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            transactions: []
        };
    }

    componentDidMount() {
        console.log(this.props.match.params);
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
                <TableRowColumn>{transaction.currency.FullName}</TableRowColumn>
                <TableRowColumn>{transaction.EUR.market_price}</TableRowColumn>
                <TableRowColumn>{transaction.EUR.change24}</TableRowColumn>
                <TableRowColumn>{transaction.EUR.volume24}</TableRowColumn>

                <TableRowColumn>{transaction.EUR.value}</TableRowColumn>
                <TableRowColumn>{transaction.EUR.cost}</TableRowColumn>
                <TableRowColumn>{transaction.EUR.profit}</TableRowColumn>
                <TableRowColumn>{transaction.EUR.profit_pct}</TableRowColumn>

                <TableRowColumn>{transaction.action}</TableRowColumn>
                <TableRowColumn>{transaction.market}</TableRowColumn>
                <TableRowColumn>{transaction.trading_pair}</TableRowColumn>
                <TableRowColumn>{transaction.quantity}</TableRowColumn>
                <TableRowColumn>{transaction.book_price}</TableRowColumn>
                <TableRowColumn>{transaction.date}</TableRowColumn>
                <TableRowColumn>
                    <Link to={`transaction/edit/${transaction._id}`}>
                        <FontIcon className="material-icons" color={blue500}>edit</FontIcon>
                    </Link>
                    <FontIcon className="material-icons" color={red500} onClick={this.delete.bind(this, transaction._id)}>delete</FontIcon>
                </TableRowColumn>

            </TableRow>
        );
        return (

            <div>
                <Link to="/transaction/create">
                    <FloatingActionButton >
                        <ContentAdd />
                    </FloatingActionButton>
                </Link>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>Currency</TableHeaderColumn>
                            <TableHeaderColumn>Market Price €</TableHeaderColumn>
                            <TableHeaderColumn>% Change 24h</TableHeaderColumn>
                            <TableHeaderColumn>Volume 24h</TableHeaderColumn>

                            <TableHeaderColumn>Value</TableHeaderColumn>
                            <TableHeaderColumn>Cost</TableHeaderColumn>
                            <TableHeaderColumn>Profit</TableHeaderColumn>
                            <TableHeaderColumn>Profit %</TableHeaderColumn>

                            <TableHeaderColumn>Action</TableHeaderColumn>
                            <TableHeaderColumn>Market</TableHeaderColumn>
                            <TableHeaderColumn>Trading Pair</TableHeaderColumn>
                            <TableHeaderColumn>Quantity</TableHeaderColumn>
                            <TableHeaderColumn>Book Price</TableHeaderColumn>
                            <TableHeaderColumn>Date</TableHeaderColumn>
                            <TableHeaderColumn>Action</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {listItems}
                    </TableBody>
                </Table>
            </div>

        );
    }
}

export default TransactionList;