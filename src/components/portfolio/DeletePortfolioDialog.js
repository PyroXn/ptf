import React, {Component} from 'react'
import Button from 'material-ui/Button';
import Dialog, {DialogActions, DialogContent, DialogTitle,} from 'material-ui/Dialog';
import axios from "axios/index";
import Typography from 'material-ui/Typography';

class DeletePortfolioDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _id: null,
            nbTransactions: 0,
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.portfolioId) {
            axios.get('/api/portfolio/transaction/' + nextProps.portfolioId)
                .then(res => {
                    this.setState(res.data);
                    if (res.data.transactions) {
                        this.setState({nbTransactions: res.data.transactions.length})
                    }
                });
        }
    }

    deletePortfolio = () => {
        const {_id, transactions} = this.state;
        if (_id) {
            axios.delete('/api/portfolio/'+ _id)
                .then(() => {
                    this.handleClose();
                });
        }
        if (transactions) {
            transactions.forEach(transaction => {
                axios.delete('/api/transaction/'+ transaction._id)
                    .then(() => {
                        console.log('Transaction delete');
                    });
            })
        }
    };

    handleClose = () => {
        this.props.close();
    };

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        const { open } = this.props;
        return (

                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <DialogTitle id="form-dialog-title">Delete portfolio {this.state.name} ?</DialogTitle>
                    <DialogContent>
                        {this.state.nbTransactions !== 0 &&
                            <Typography variant="subheading">
                                {this.state.nbTransactions} transaction(s) will be delete.
                            </Typography>
                        }
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.handleClose} variant="raised" color="primary">
                            Cancel
                        </Button>
                        <Button onClick={this.deletePortfolio} variant="raised" color="secondary">
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
        );
    }
}

export default DeletePortfolioDialog;
