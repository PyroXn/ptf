import React, {Component} from 'react';
import axios from 'axios';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import DatePicker from 'material-ui/DatePicker';
import AutoComplete from 'material-ui/AutoComplete';

class TransactionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currencies: [],
            currency: 0,
            action: 'BUY',
            market: '',
            trading_pair: '',
            book_price: 0,
            quantity: 0,
            date: new Date(),
            portfolio: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        console.log(this.props.location.state.portfolioId);
        if (this.props.match.params.id) {
            axios.get('/api/transaction/' + this.props.match.params.id)
                .then(res => {
                    res.data.date = res.data.date === null ? new Date() : new Date(this.state.date);
                    res.data.currencies = [res.data.currency];
                    this.setState(res.data);
                });
        } else if (this.props.location.state) {
            this.setState({portfolio: this.props.location.state.portfolioId})
        }
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        const { currency, action, market, trading_pair, book_price, quantity, date, portfolio } = this.state;
        if (this.props.match.params.id) {
            axios.put('/api/transaction/'+this.props.match.params.id, {currency, action, market, trading_pair, book_price, quantity, date})
                .then(() => {
                    this.props.history.go(-1);
                });
        } else {
            axios.post('/api/transaction', {currency, action, market, trading_pair, book_price, quantity, date, portfolio})
                .then(() => {
                    this.props.history.go(-1);
                });
        }
    }

    searchCurrency(val) {
        if (val) {
            axios.get('/api/currency/search/' + val)
                .then(res => {
                    let data = res.data;
                    this.setState({currencies: data});
                });
        }
    }

    selectCurrency(val) {
        this.setState({currency: val});
    }



    render() {
        const dataSourceConfig = {
            text: 'FullName',
            value: '_id',
        };
        return (
            <form onSubmit={this.handleSubmit}>
                <AutoComplete
                    floatingLabelText="Select currency"
                    filter={AutoComplete.noFilter}
                    openOnFocus={true}
                    dataSource={this.state.currencies}
                    dataSourceConfig={dataSourceConfig}
                    onUpdateInput={(searchText) => this.searchCurrency(searchText)}
                    onNewRequest={(chosenRequest) => this.selectCurrency(chosenRequest)}
                    searchText={this.state.currency.FullName}
                />
                <SelectField floatingLabelText="Action" name="action" value={this.state.action} onChange={(event, index, response) => this.setState({ action: response})}>
                    <MenuItem value={'BUY'} primaryText="Buy" />
                    <MenuItem value={'SELL'} primaryText="Sell" />
                </SelectField>
                <TextField floatingLabelText="Market" name="market" value={this.state.market} onChange={this.handleChange} />
                <TextField floatingLabelText="Trading Pair" name="trading_pair" value={this.state.trading_pair} onChange={this.handleChange} />
                <TextField floatingLabelText="Book Price" name="book_price" value={this.state.book_price} onChange={this.handleChange} />
                <TextField floatingLabelText="Quantity" name="quantity" value={this.state.quantity} onChange={this.handleChange} />
                <DatePicker hintText="Date" DateTimeFormat={global.Intl.DateTimeFormat} locale="fr" name="date"
                            value={this.state.date} onChange={(event, date) => this.setState({ date: date})} />
                <RaisedButton type="submit" label="Save" primary={true} />
            </form>
        );
    }
}

export default TransactionForm;