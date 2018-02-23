import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';
import axios from "axios/index";
import {getRandomInt} from "../util/NumberUtil";
import {palette} from "../util/ChartUtil";
import Radio, {RadioGroup} from 'material-ui/Radio';
import {FormControlLabel} from 'material-ui/Form';
import {withStyles} from "material-ui/styles/index";

const styles = theme => ({
    inline: {
        flexDirection: 'row',
    },
});

class CurrencyHistoricalChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currencyFiat: 'EUR',
            scale: 'W',
            currency: null,
            historicalData: null,
            data: {
                labels: '',
                datasets: []
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks : {
                        },
                    }],
                    xAxes: [{
                        type: 'time',
                        time: {
                            displayFormats: {
                                'millisecond': 'SSS [ms]',
                                'second': 'h:mm:ss a', // 11:20:01 AM
                                'minute': 'h:mm:ss a', // 11:20:01 AM
                                'hour': 'MMM D, hA', // Sept 4, 5PM
                                'day': 'MMM Do', // Sep 4 2015
                                'week': 'll', // Week 46, or maybe "[W]WW - YYYY" ?
                                'month': 'MMM YYYY', // Sept 2015
                                'quarter': '[Q]Q - YYYY', // Q3
                                'year': 'YYYY', // 2015
                            },
                            tooltipFormat: 'MMM D, hA',
                        }
                    }]
                },
                legend: {
                    display: false,
                    position: 'bottom',
                },
                tooltips: {
                    mode: 'x-axis',
                    callbacks: {
                        label: (tooltipItems) => {
                            return tooltipItems.yLabel + (this.state.currencyFiat === 'USD' ? ' $' : this.state.currencyFiat === 'EUR' ? ' €' : ' \u20BF');
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 0
                    }
                },
                maintainAspectRatio: false
            }
        };
    }

    getHistorical() {
        axios.get(`/api/historical/${this.state.currency.Symbol}/${this.state.scale}`)
            .then(res => {
                this.setState({historicalData: res.data}, () => {
                    this.uploadChartData();
                });
            });
    }

    uploadChartData() {
        if (this.state.historicalData === null) {
            return;
        }
        let labels = this.state.historicalData.map(historical => new Date(historical.time * 1000));
        let datasets = [];
        datasets.push({
            label: this.state.currency.Symbol,
            fill: true,
            backgroundColor: palette[getRandomInt(72)],
            data: this.state.historicalData.map(historical => historical[this.state.currencyFiat].price),
        });
        let data = {
            labels: labels,
            datasets: datasets,
        };
        this.setState({data: data});
    };

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.currency && this.state.currency !== nextProps.currency) {
            this.setState({currency: nextProps.currency}, () => {
                this.getHistorical();
            });
        }
    }

    currencyFiatChange = (event, currencyFiat) => {
        this.setState({currencyFiat: currencyFiat }, () => {
            this.uploadChartData();
        });
    };

    scaleChange = (event, scale) => {
        this.setState({scale: scale }, () => {
            this.getHistorical();
        });
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <RadioGroup
                    aria-label="currency"
                    name="currency"
                    value={this.state.currencyFiat}
                    onChange={this.currencyFiatChange}
                    className={classes.inline}
                >
                    <FormControlLabel value="USD" control={<Radio />} label="USD" />
                    <FormControlLabel value="EUR" control={<Radio />} label="EUR" />
                    <FormControlLabel value="BTC" control={<Radio />} label="BTC" />
                </RadioGroup>
                <RadioGroup
                    aria-label="scale"
                    name="scale"
                    value={this.state.scale}
                    onChange={this.scaleChange}
                    className={classes.inline}
                >
                    <FormControlLabel value="H" control={<Radio />} label="H" />
                    <FormControlLabel value="D" control={<Radio />} label="D" />
                    <FormControlLabel value="W" control={<Radio />} label="W" />
                    <FormControlLabel value="M" control={<Radio />} label="M" />
                </RadioGroup>
                <div>
                    <Line data={this.state.data}
                              options={this.state.options}
                              width={100}
                              height={300}
                    />
                </div>
            </div>
        );
    }
}

export default withStyles(styles)(CurrencyHistoricalChart);