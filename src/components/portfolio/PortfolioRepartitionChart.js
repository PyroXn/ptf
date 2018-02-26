import React, {Component} from 'react';
import {Doughnut} from 'react-chartjs-2';
import {palette} from "../util/ChartUtil";
import {withRouter} from "react-router-dom";

class PortfolioRepartitionChart extends Component {

    constructor(props) {
        super(props);
        this.state = {
            holdings: null,
            data: {
                labels: '',
                datasets: [{
                    data: 0,
                    backgroundColor: palette,
                    hoverBackgroundColor: palette,
                }],
            },
            options: {
                legend: {
                    position: 'bottom',
                },
                maintainAspectRatio: false
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.items) {
            let holdings = nextProps.items.filter(holding => holding.quantity !== 0);
            let totalValue = holdings.reduce(function(total, holding) { return total + holding.EUR.value }, 0);
            let labels = holdings.map(holding => `${holding.currency.Symbol} (${parseFloat((holding.EUR.value*100/totalValue).toFixed(2))}%)`);

            this.setState({'holdings': holdings});
            let data = {
                labels: labels,
                datasets: [{
                    data: holdings.map(holding => holding.EUR.value),
                }],
            };

            this.setState({'data': data});
        }
    }

    goToTransaction = (elems) => {
        if (elems[0]) {
            let idx = elems[0]['_index'];
            this.props.history.push(`/${this.props.portfolioId}/transactions/${this.state.holdings[idx].currency._id}`);
        }
    };

    render() {
        return (
            <Doughnut data={this.state.data}
                      options={this.state.options}
                      width={100}
                      height={300}
                      getElementsAtEvent={this.goToTransaction}
            />
        );
    }
}

export default withRouter(PortfolioRepartitionChart);