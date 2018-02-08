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
                            {`VALUE : ${round(this.props.items.EUR.value)} € COST : ${round(this.props.items.EUR.cost)} €`}
                        </Typography>
                        <Typography component="p">
                            {`PROFIT : ${round(this.props.items.EUR.profit)} € / ${round(this.props.items.EUR.profit_pct)} %`}
                        </Typography>
                    </CardContent>
                </Card>
            </Link>
        );
    }
}

export default HoldingCard;
