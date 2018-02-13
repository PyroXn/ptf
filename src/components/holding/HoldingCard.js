import React, {Component} from 'react';
import Card, {CardContent, CardHeader} from 'material-ui/Card';
import {round} from "../util/NumberUtil";
import Avatar from 'material-ui/Avatar';
import {Link} from 'react-router-dom';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
    avatar: {
        borderRadius: 0,
    },
    positive: {
        color: 'green',
    },
    negative: {
        color: 'red',
    }
});

class HoldingCard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            holding: {},
        };
    }

    render() {
        const { classes } = this.props;
        return (
            <Link to={`/${this.props.portfolioId}/transactions/${this.props.items.currency._id}`} style={{textDecoration: 'none'}}>
                <Card>
                    <CardHeader
                        avatar={
                            <Avatar src={`https://www.cryptocompare.com/${this.props.items.currency.ImageUrl}`} className={classes.avatar} />
                        }
                        title={this.props.items.currency.CoinName}
                        subheader={`${this.props.items.quantity !== 0 ? round(this.props.items.quantity, 4) : ''} ${this.props.items.currency.Symbol}`}
                    />
                    {this.props.items.quantity === 0 ? (
                        <CardContent>
                            <Typography component="p">
                                PROFIT :
                                <span className={this.props.items.EUR.profit > 0 ? classes.positive : classes.negative}> {round(this.props.items.EUR.profit)} € </span>
                            </Typography>
                        </CardContent>
                    ) : (
                        <CardContent>
                            <Typography type="headline" component="h3">
                                {`VALUE : ${round(this.props.items.EUR.value)} € COST : ${round(this.props.items.EUR.cost)} €`}
                            </Typography>
                            <Typography component="p">
                                PROFIT :
                                <span className={this.props.items.EUR.profit > 0 ? classes.positive : classes.negative}> {round(this.props.items.EUR.profit)} € </span>
                                /
                                <span className={this.props.items.EUR.profit_pct > 0 ? classes.positive : classes.negative}>{round(this.props.items.EUR.profit_pct)} %</span>
                            </Typography>
                        </CardContent>
                    )}
                </Card>
            </Link>
        );
    }
}

export default withStyles(styles)(HoldingCard);
