import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import HoldingCard from "../holding/HoldingCard";
import PortfolioRepartitionChart from "./PortfolioRepartitionChart";
import {round} from "../util/NumberUtil";
import Button from 'material-ui/Button';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import AddCircleOutline from 'material-ui-icons/AddCircleOutline';

const styles = theme => ({
    root: {
        flexGrow: 1,
        padding: 24,
    },
    link: {
        textDecoration: 'none',
        outline: 'none',
    },
    button: {
        margin: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
});

class PortfolioDashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            portfolio: '',
            name: '',
            holdings: [],
        };
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            axios.get('/api/portfolio/' + this.props.match.params.id + '/detail')
                .then(res => {
                    res.data.sort((a, b) =>  b.EUR.value - a.EUR.value);
                    this.setState({holdings: res.data});
                });

            axios.get('/api/portfolio/' + this.props.match.params.id)
                .then(res => {
                    this.setState({portfolio: res.data});
                    this.setState({name: this.state.portfolio.name});
                });
        }
    }

    render() {
        const { classes } = this.props;
        const listHoldingCard = this.state.holdings.map(holding =>
            <Grid key={holding.currency._id} item xs={12} sm={6} md={3}>
                <HoldingCard items={holding} portfolioId={this.props.match.params.id}/>
            </Grid>
        );

        let totalValue = round(this.state.holdings.reduce(function(total, holding) { return total + holding.EUR.value }, 0));
        let totalProfit = round(this.state.holdings.reduce(function(total, holding) { return total + holding.EUR.profit }, 0));
        let totalCost = round(this.state.holdings.reduce(function(total, holding) { return total + holding.EUR.cost }, 0));

        return (
            <div>
                <h2>{this.state.name}</h2>
                <Link to={{
                        pathname: '/transaction/create',
                        state: { portfolioId: this.props.match.params.id }
                    }} className={classes.link}>
                    <Button variant="raised" color="secondary" aria-label="add" className={classes.button}>
                        Add Transaction
                        <AddCircleOutline className={classes.rightIcon}/>
                    </Button>
                </Link>

                <div>
                    Cost : {totalCost} €
                </div>
                <div>
                    Total value : {totalValue} €
                </div>
                <div>
                    Gains and losses : {totalProfit} € ({round(totalProfit/totalCost*100)} %)
                </div>
                <div>
                    <PortfolioRepartitionChart items={this.state.holdings}/>
                </div>
                <div className={classes.root}>
                    <Grid container spacing={24}>
                        {listHoldingCard}
                    </Grid>
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(PortfolioDashboard);