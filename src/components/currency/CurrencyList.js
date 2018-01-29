import React, {Component} from 'react';
import axios from 'axios';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn,} from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';
import AutoComplete from 'material-ui/AutoComplete';


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
                <TableRowColumn>{currency.Name}</TableRowColumn>
                <TableRowColumn>{currency.Symbol}</TableRowColumn>
                <TableRowColumn>{currency.CoinName}</TableRowColumn>
                <TableRowColumn>{currency.FullName}</TableRowColumn>
                <TableRowColumn>{currency.Algorithm}</TableRowColumn>
                <TableRowColumn>{currency.ProofType}</TableRowColumn>
                <TableRowColumn>{currency.SortOrder}</TableRowColumn>
            </TableRow>
        );
        return (
            <div>
                <AutoComplete
                    floatingLabelText='Enter test'
                    dataSource={this.state.currencies}
                    onUpdateInput={(val) => this.searchSomething(val)}
                    fullWidth={true}
                    filter={(searchText, key) => true} />
                <RaisedButton label="Force update" primary={true} onClick={this.forceCurrencyUpdate} />
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Symbol</TableHeaderColumn>
                            <TableHeaderColumn>CoinName</TableHeaderColumn>
                            <TableHeaderColumn>FullName</TableHeaderColumn>
                            <TableHeaderColumn>Algorithm</TableHeaderColumn>
                            <TableHeaderColumn>ProofType</TableHeaderColumn>
                            <TableHeaderColumn>SortOrder</TableHeaderColumn>
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

export default CurrencyList;