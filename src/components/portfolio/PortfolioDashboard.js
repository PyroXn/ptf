import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import HoldingCard from "../holding/HoldingCard";
import PortfolioRepartitionChart from "./PortfolioRepartitionChart";
import {round} from "../util/NumberUtil";
import Button from 'material-ui/Button';


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
                    console.log(res.data);
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
        const listHoldingCard = this.state.holdings.map(holding =>
            <HoldingCard key={holding.currency._id} items={holding} portfolioId={this.props.match.params.id}/>
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
                    }}>
                    <Button variant="raised" color="primary">
                        Add Transaction
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
                {listHoldingCard}
            </div>
        );
    }
}

export default PortfolioDashboard;