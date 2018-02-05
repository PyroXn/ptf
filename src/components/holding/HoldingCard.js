import React, {Component} from 'react';
import Card, {CardContent, CardHeader} from 'material-ui/Card';
import {round} from "../util/NumberUtil";
import Avatar from 'material-ui/Avatar';
import {Link} from 'react-router-dom';
import Typography from 'material-ui/Typography';

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
                        avatar={
                            <Avatar src={`https://www.cryptocompare.com/${this.props.items.currency.ImageUrl}`} />
                        }
                        title={this.props.items.currency.CoinName}
                        subheader={this.props.items.currency.Symbol}
                    />
                    <CardContent>
                        <Typography type="headline" component="h2">
                            {`${round(this.props.items.quantity, 4)} ${this.props.items.currency.Symbol}`}
                        </Typography>
                        <Typography type="headline" component="h3">
                            {`${this.props.items.EUR.value} € (${this.props.items.EUR.profit} € / ${this.props.items.EUR.profit_pct} %)`}
                        </Typography>
                        <Typography component="p">
                            {this.props.items.EUR.market_price}  € ({this.props.items.EUR.change24})
                        </Typography>
                    </CardContent>
                </Card>
            </Link>
        );
    }
}

export default HoldingCard;
