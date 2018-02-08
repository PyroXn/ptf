import React, {Component} from 'react';
import {Doughnut} from 'react-chartjs-2';

class PortfolioRepartitionChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {
                labels: '',
                datasets: [{
                    data: 0,
                    backgroundColor: ['#ff0029', '#377eb8', '#66a61e', '#984ea3',
                        '#00d2d5', '#ff7f00', '#af8d00', '#7f80cd'],
                    hoverBackgroundColor: ['#ff0029', '#377eb8', '#66a61e', '#984ea3',
                        '#00d2d5', '#ff7f00', '#af8d00', '#7f80cd'],
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
            let totalValue = nextProps.items.reduce(function(total, holding) { return total + holding.EUR.value }, 0);
            let labels = nextProps.items.map(holding => `${holding.currency.Symbol} (${parseFloat((holding.EUR.value*100/totalValue).toFixed(2))}%)`);

            let data = {
                labels: labels,
                datasets: [{
                    data: nextProps.items.map(holding => holding.EUR.value),
                }],
            };

            this.setState({'data': data});
        }
    }

    render() {
        return (
            <Doughnut data={this.state.data}
                      options={this.state.options}
                      width={100}
                      height={300}
            />
        );
    }
}

export default PortfolioRepartitionChart;