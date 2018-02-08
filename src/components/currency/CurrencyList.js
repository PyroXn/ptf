import React, {Component} from 'react';
import axios from 'axios';

import Table, {TableBody, TableCell, TableHead, TableRow} from 'material-ui/Table';
import Button from 'material-ui/Button';


class CurrencyList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currencies: [],
            currenciesFullName: []
        };
    }

    componentDidMount() {
        this.getAllCurrencies();
    }

    getAllCurrencies() {
        axios.get('/api/currency')
            .then(res => {
                let data = res.data;
                this.setState({currenciesFullName: data.map(d => d.FullName)});
                this.setState({currencies: data});
            });
    }

    forceCurrencyUpdate() {
        axios.get('/api/currency/force_update')
            .then(res => {
                console.log(res);
            });
    }

    searchSomething(val) {
        axios.get('/api/currency/search/' + val)
            .then(res => {
                let data = res.data;
                this.setState({currencies: data});
            });
    }

    render() {
        const listItems = this.state.currencies.map(currency =>
            <TableRow key={currency._id}>
                <TableCell>{currency.Name}</TableCell>
                <TableCell>{currency.Symbol}</TableCell>
                <TableCell>{currency.CoinName}</TableCell>
                <TableCell>{currency.FullName}</TableCell>
                <TableCell>{currency.Algorithm}</TableCell>
                <TableCell>{currency.ProofType}</TableCell>
                <TableCell>{currency.SortOrder}</TableCell>
            </TableRow>
        );
        return (
            <div>
                {/*<AutoComplete
                    floatingLabelText='Enter test'
                    dataSource={this.state.currencies}
                    onUpdateInput={(val) => this.searchSomething(val)}
                    fullWidth={true}
                    filter={(searchText, key) => true} />
                <Button label="Force update" primary={true} onClick={this.forceCurrencyUpdate} />*/}
                <Button variant="raised" color="primary" onClick={this.forceCurrencyUpdate}>
                    Force update
                </Button>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Symbol</TableCell>
                            <TableCell>CoinName</TableCell>
                            <TableCell>FullName</TableCell>
                            <TableCell>Algorithm</TableCell>
                            <TableCell>ProofType</TableCell>
                            <TableCell>SortOrder</TableCell>
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

export default CurrencyList;