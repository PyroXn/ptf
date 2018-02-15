import React, {Component} from 'react';
import axios from 'axios';
import Select from 'material-ui/Select';
import {MenuItem} from 'material-ui/Menu';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import {FormControl} from 'material-ui/Form';
import {InputLabel} from 'material-ui/Input';
import { Async } from 'react-select';
import 'react-select/dist/react-select.css';
import {inputDate} from "../util/DateUtil";
import {withStyles} from "material-ui/styles/index";
import Grid from 'material-ui/Grid';

const styles = theme => ({
    field: {
        width: '100%',
    },
    select: {
        marginTop: theme.spacing.unit * 2,
        width: '100%',
    },
    form: {
        margin: theme.spacing.unit,
        display: 'flex',
        flexWrap: 'wrap',
    },
});


class TransactionForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: null,
            action: 'BUY',
            market: null,
            trading_pair: '',
            book_price: 0,
            quantity: 0,
            date: inputDate(),
            portfolio: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            axios.get('/api/transaction/' + this.props.match.params.id)
                .then(res => {
                    res.data.date = res.data.date === null ? inputDate() : inputDate(new Date(this.state.date));
                    axios.get('/api/market/pairs', {
                        params: {
                            marketId: res.data.market,
                            currency: res.data.currency.Symbol
                        }
                    }).then(market => {
                        res.data.market = market.data[0];
                        this.setState(res.data);
                    });
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
        if (!val) {
            return Promise.resolve({ options: [] });
        }
        return axios.get('/api/currency/search/' + val)
            .then(res => {
                return { options: res.data};
            });
    }

    searchMarket = (val) => {
        if (!val) {
            return Promise.resolve({ options: [] });
        }
        return axios.get('/api/market/search', {
                params: {
                    name: val,
                    currency: this.state.currency.Symbol
                }
            })
            .then(res => {
                return { options: res.data};
            });
    };

    selectCurrency(val) {
        this.setState({
            currency: val
        });
    }



    render() {
        const { classes } = this.props;
        let tradingPairItems = '';
        if(this.state.market && this.state.market.pairs) {
            tradingPairItems = Object.keys(this.state.market.pairs).map(key =>
                this.state.market.pairs[key].map(value =>
                    <MenuItem key={value} value={value}>{key} / {value}</MenuItem>
                )
            );
        }

        return (
            <form onSubmit={this.handleSubmit} className={classes.form}>
                <Grid container spacing={24}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Async value={this.state.currency}
                               onChange={(response) => this.setState({ currency: response})}
                               valueKey="_id"
                               labelKey="FullName"
                               placeholder="Currency"
                               loadOptions={this.searchCurrency}
                               backspaceRemoves={true}
                               className={classes.select}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl className={classes.field}>
                            <InputLabel htmlFor="action">Action</InputLabel>
                            <Select value={this.state.action} onChange={this.handleChange}
                                    inputProps={{
                                        name: 'action',
                                        id: 'action',
                                    }}>
                                <MenuItem value={'BUY'}>Buy</MenuItem>
                                <MenuItem value={'SELL'}>Sell</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Async value={this.state.market}
                               onChange={(response) => this.setState({ market: response})}
                               valueKey="_id"
                               labelKey="name"
                               placeholder="Market"
                               loadOptions={this.searchMarket}
                               backspaceRemoves={true}
                               className={classes.select}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <FormControl className={classes.field}>
                            <InputLabel htmlFor="pairs">Trading Pair</InputLabel>
                            <Select value={this.state.trading_pair} onChange={this.handleChange}
                                    inputProps={{
                                        name: 'trading_pair',
                                        id: 'trading_pair',
                                    }}>
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {tradingPairItems}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField label="Book Price" name="book_price" value={this.state.book_price} onChange={this.handleChange} className={classes.field} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField label="Quantity" name="quantity" value={this.state.quantity} onChange={this.handleChange} className={classes.field} />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <TextField
                            label="Date"
                            name="date"
                            type="datetime-local"
                            defaultValue={this.state.date}
                            onChange={this.handleChange}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            className={classes.field}
                        />
                    </Grid>

                    <Grid item xs={12} sm={6} md={3}>
                        <Button variant="raised" type="submit" color="secondary" className={classes.select}>
                            Save
                        </Button>
                    </Grid>
                </Grid>
            </form>
        );
    }
}

export default withStyles(styles)(TransactionForm);