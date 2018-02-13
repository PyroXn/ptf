import React, {Component} from 'react'
import Button from 'material-ui/Button';
import Dialog, {DialogActions, DialogContent, DialogTitle,} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import axios from "axios/index";

class PortfolioDialog extends Component {

    defaultState = {
        _id: null,
        name: '',
        title: 'New Portfolio',
        wrongName: false,
        users: [],
        user: JSON.parse(localStorage.getItem('user')),
    };

    constructor(props) {
        super(props);
        this.state = this.defaultState;

        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.portfolioId) {
            axios.get('/api/portfolio/' + nextProps.portfolioId)
                .then(res => {
                    this.setState({title: 'Edit Portfolio'});
                    this.setState({wrongName: false});
                    this.setState(res.data);
                });
        } else {
            this.setState(this.defaultState);
        }
    }

    savePortfolio = () => {
        const {name, _id, users} = this.state;
        if (name) {
            if (_id) {
                axios.put('/api/portfolio/'+_id, { name })
                    .then(() => {
                        this.handleClose();
                    });
            } else {
                users.push(this.state.user);
                axios.post('/api/portfolio', {name, users})
                    .then(() => {
                        this.handleClose();
                    });
            }
        } else {
            this.setState({wrongName: true});
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
                    <DialogTitle id="form-dialog-title">{this.state.title}</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            label="Name"
                            name="name"
                            value={this.state.name}
                            onChange={this.handleChange}
                            error={this.state.wrongName}
                            helperText={this.state.wrongName ? 'The name is empty !' : ''}/>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={this.savePortfolio} variant="raised" color="secondary">
                            Save
                        </Button>
                    </DialogActions>
                </Dialog>
        );
    }
}

export default PortfolioDialog;
