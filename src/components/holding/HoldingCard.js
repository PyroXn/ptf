import React, {Component} from 'react';
import {Card, CardHeader, CardText, CardTitle} from 'material-ui/Card';
import {round} from "../util/NumberUtil";
import Avatar from 'material-ui/Avatar';
import {Link} from 'react-router-dom';

class HoldingCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            holding: {},
        };
    }

    render() {
        console.log(this.props);
        return (
            <Link to={`/${this.props.portfolioId}/transactions/${this.props.items.currency._id}`} style={{textDecoration: 'none'}}>
                <Card>
                    <CardHeader
                        title={this.props.items.currency.CoinName}
                        subtitle={this.props.items.currency.Symbol}
                        avatar={<Avatar
                            src={`https://www.cryptocompare.com/${this.props.items.currency.ImageUrl}`}
                            backgroundColor='none'
                        />}
                    />
                    <CardTitle title={`${round(this.props.items.quantity, 4)} ${this.props.items.currency.Symbol}`}
                               subtitle={`${this.props.items.EUR.value} € (${this.props.items.EUR.profit} € / ${this.props.items.EUR.profit_pct} %)`} />
                    <CardText>
                        {this.props.items.EUR.market_price}  € ({this.props.items.EUR.change24})
                    </CardText>
                </Card>
            </Link>
        );
    }
}

export default HoldingCard;
