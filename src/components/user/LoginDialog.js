import React, {Component} from 'react'
import Button from 'material-ui/Button';
import Dialog, {DialogActions, DialogContent, DialogTitle,} from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import AppBar from 'material-ui/AppBar';
import Tabs, {Tab} from 'material-ui/Tabs';
import axios from "axios/index";

class LoginDialog extends Component {
    constructor(props) {
        super(props);
        this.state={
            email:'',
            pseudo:'',
            wrongMail: false,
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    signup = () => {
        const { email, pseudo } = this.state;
        axios.post('/api/user', {email, pseudo})
            .then(() => {
                this.props.change(1);
            });
    };

    signin = () => {
        const { email } = this.state;
        axios.get('/api/user/'+ email)
            .then((res) => {
                if (res.data === null) {
                    this.setState({wrongMail: true});
                } else {
                    this.props.login(res.data);
                    localStorage.setItem('user', JSON.stringify(res.data));
                    this.handleClose();
                }
            });
    };


    handleClose = () => {
        this.props.close();
    };

    handleChangeTab = (event, tab) => {
        this.props.change(tab);
    };

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        const { open, tab } = this.props;
        return (

                <Dialog
                    open={open}
                    onClose={this.handleClose}
                    aria-labelledby="form-dialog-title"
                >
                    <AppBar position="static">
                        <Tabs
                            value={tab}
                            onChange={this.handleChangeTab}
                            fullWidth
                        >
                            <Tab label="Sign up" />
                            <Tab label="Log in" />
                        </Tabs>
                    </AppBar>
                    {tab === 0 &&
                    <div>
                        <DialogTitle id="form-dialog-title">Sign up</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="email"
                                label="Email Address"
                                type="email"
                                fullWidth
                                value={this.state.email}
                                onChange={this.handleChange}
                            />
                            <TextField
                                margin="dense"
                                name="pseudo"
                                label="Pseudo"
                                type="pseudo"
                                fullWidth
                                value={this.state.pseudo}
                                onChange={this.handleChange}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.signup} color="secondary">
                                Sign up
                            </Button>
                        </DialogActions>
                    </div>

                    }
                    {tab === 1 &&
                    <div>
                        <DialogTitle id="form-dialog-title">Login</DialogTitle>
                        <DialogContent>
                            <TextField
                                autoFocus
                                margin="dense"
                                name="email"
                                label="Email Address"
                                type="email"
                                fullWidth
                                value={this.state.email}
                                error={this.state.wrongMail}
                                onChange={this.handleChange}
                                helperText={this.state.wrongMail ? 'The email is incorrect !' : ''}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.signin} color="secondary">
                                Log in
                            </Button>
                        </DialogActions>
                    </div>
                    }
                </Dialog>
        );
    }
}

export default LoginDialog;
