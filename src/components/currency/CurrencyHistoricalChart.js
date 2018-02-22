import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';
import axios from "axios/index";
import {getRandomInt} from "../util/NumberUtil";

const palette = [
    '#ff0029', '#377eb8', '#66a61e', '#984ea3', '#00d2d5', '#ff7f00', '#af8d00',
    '#7f80cd', '#b3e900', '#c42e60', '#a65628', '#f781bf', '#8dd3c7', '#bebada',
    '#fb8072', '#80b1d3', '#fdb462', '#fccde5', '#bc80bd', '#ffed6f', '#c4eaff',
    '#cf8c00', '#1b9e77', '#d95f02', '#e7298a', '#e6ab02', '#a6761d', '#0097ff',
    '#00d067', '#000000', '#252525', '#525252', '#737373', '#969696', '#bdbdbd',
    '#f43600', '#4ba93b', '#5779bb', '#927acc', '#97ee3f', '#bf3947', '#9f5b00',
    '#f48758', '#8caed6', '#f2b94f', '#eff26e', '#e43872', '#d9b100', '#9d7a00',
    '#698cff', '#d9d9d9', '#00d27e', '#d06800', '#009f82', '#c49200', '#cbe8ff',
    '#fecddf', '#c27eb6', '#8cd2ce', '#c4b8d9', '#f883b0', '#a49100', '#f48800',
    '#27d0df', '#a04a9b'];

class CurrencyHistoricalChart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currency: null,
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
                        label: function(tooltipItems) {
                            return tooltipItems.yLabel + ' €';
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
        }
    }

    getHistorical(currency) {
        axios.get('/api/historical/' + currency.Symbol)
            .then(res => {
                let labels = res.data.map(historical => new Date(historical.time*1000));
                let datasets = this.state.data.datasets;
                datasets.push({
                    label: currency.Symbol,
                    fill: true,
                    backgroundColor: palette[getRandomInt(72)],
                    data: res.data.map(historical => historical.EUR.price),
                });
                let data = {
                    labels: labels,
                    datasets: datasets,
                };
                this.setState({'data': data});
            });
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps && nextProps.currency && this.state.currency !== nextProps.currency) {
            this.setState({currency: nextProps.currency});
            this.getHistorical(nextProps.currency);
        }
    }

    render() {
        return (
            <Line data={this.state.data}
                      options={this.state.options}
                      width={100}
                      height={300}
            />
        );
    }
}

export default CurrencyHistoricalChart;