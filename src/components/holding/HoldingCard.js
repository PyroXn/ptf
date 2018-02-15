import React, {Component} from 'react';
import Card, {CardContent, CardHeader} from 'material-ui/Card';
import {round} from "../util/NumberUtil";
import Avatar from 'material-ui/Avatar';
import {Link} from 'react-router-dom';
import Typography from 'material-ui/Typography';
import { withStyles } from 'material-ui/styles';
import NumberHighlight from "../shared/NumberHighlight";

const styles = theme => ({
    avatar: {
        borderRadius: 0,
    },
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
                        title={`${this.props.items.currency.CoinName} - ${this.props.items.EUR.price} €`}
                        subheader={`${this.props.items.quantity !== 0 ? round(this.props.items.quantity, 4) : ''} ${this.props.items.currency.Symbol}`}
                    />
                    {this.props.items.quantity === 0 ? (
                        <CardContent>
                            <Typography component="p">
                                PROFIT : <NumberHighlight number={this.props.items.EUR.profit} suffix={'€'} />
                            </Typography>
                        </CardContent>
                    ) : (
                        <CardContent>
                            <Typography type="headline" component="h3">
                                {`VALUE : ${round(this.props.items.EUR.value)} € COST : ${round(this.props.items.EUR.cost)} €`}
                            </Typography>
                            <Typography component="p">
                                PROFIT : <NumberHighlight number={this.props.items.EUR.profit} suffix={'€'} /> / <NumberHighlight number={this.props.items.EUR.profit_pct} suffix={'%'} />
                            </Typography>
                        </CardContent>
                    )}
                </Card>
            </Link>
        );
    }
}

export default withStyles(styles)(HoldingCard);
