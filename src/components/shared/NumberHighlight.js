import React, {Component} from 'react';
import {withStyles} from "material-ui/styles/index";
import {round} from "../util/NumberUtil";

const styles = theme => ({
    positive: {
        color: 'green',
    },
    negative: {
        color: 'red',
    }
});

class NumberHighlight extends Component {

    render() {
        const { number, suffix, decimal, classes } = this.props;
        return (
            <span className={number > 0 ? classes.positive : classes.negative}>
                {round(number, decimal)} {suffix}
            </span>
        );
    }
}

export default withStyles(styles)(NumberHighlight);