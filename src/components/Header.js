import React from 'react'
import {Link} from 'react-router-dom'
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import IconButton from 'material-ui/IconButton';
import MenuIcon from 'material-ui-icons/Menu';
import {withStyles} from 'material-ui/styles';
import Menu, {MenuItem} from 'material-ui/Menu';
import packageJson from '../../package.json';
import LoginDialog from "./user/LoginDialog";
import AccountCircle from 'material-ui-icons/AccountCircle';

const styles = {
    root: {
        width: '100%',
    },
    flex: {
        flex: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    link: {
        textDecoration: 'none',
        outline: 'none',
    },
};

class Header extends React.Component {
    state = {
        anchorPtfMenu: null,
        anchorLogoutMenu: null,
        openLoginDialog: false,
        tab: 0,
        user: JSON.parse(localStorage.getItem('user')),
    };

    handleClickPtfMenu = event => {
        this.setState({ anchorPtfMenu: event.currentTarget });
    };

    handleClosePtfMenu = () => {
        this.setState({ anchorPtfMenu: null });
    };

    handleClickLogoutMenu = event => {
        this.setState({ anchorLogoutMenu: event.currentTarget });
    };

    handleCloseLogoutMenu = () => {
        this.setState({ anchorLogoutMenu: null });
    };

    handleLogout= () => {
        localStorage.removeItem('user');
        this.setState({user: null});
        this.setState({ anchorLogoutMenu: null });
    };

    openLoginDialog = () => {
        this.setState({
            openLoginDialog: true,
            tab: 1
        });
    };

    openSignupDialog = () => {
        this.setState({
            openLoginDialog: true,
            tab: 0
        });
    };

    closeLoginDialog = () => {
        this.setState({ openLoginDialog: false });
    };

    changeTab = (tab) => {
        this.setState({ tab: tab });
    };

    userLogin = (user) => {
        this.setState({user: user});
    };

    render() {
        const { anchorPtfMenu, anchorLogoutMenu, openLoginDialog, tab, user } = this.state;
        const { classes } = this.props;

        return (
            <header>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            aria-owns={anchorPtfMenu ? 'ptf-menu' : null}
                            aria-haspopup="true"
                            onClick={this.handleClickPtfMenu}
                            className={classes.menuButton} color="inherit" aria-label="Menu">
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="ptf-menu"
                            anchorEl={anchorPtfMenu}
                            open={Boolean(anchorPtfMenu)}
                            onClose={this.handleClosePtfMenu}
                        >
                            <Link to='/' className={classes.link}><MenuItem onClick={this.handleClosePtfMenu}>Portfolios</MenuItem></Link>
                            <Link to='/currencies' className={classes.link}><MenuItem onClick={this.handleClosePtfMenu}>Currencies</MenuItem></Link>
                        </Menu>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            PTF
                        </Typography>
                        {user === null &&
                            <div>
                                <Button color="secondary" onClick={this.openSignupDialog}>Sign up</Button>
                                <Button color="secondary" onClick={this.openLoginDialog}>Login</Button>
                            </div>
                        }
                        {user !== null &&
                            <div>
                                <IconButton
                                    aria-owns={anchorLogoutMenu ? 'menu-user' : null}
                                    aria-haspopup="true"
                                    onClick={this.handleClickLogoutMenu}
                                    color="inherit"
                                >
                                    <AccountCircle />
                                </IconButton>
                                <Menu
                                    id="menu-user"
                                    anchorEl={anchorLogoutMenu}
                                    anchorOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                    open={Boolean(anchorLogoutMenu)}
                                    onClose={this.handleCloseLogoutMenu}
                                >
                                    <MenuItem onClick={this.handleLogout}>Log out</MenuItem>
                                </Menu>
                            </div>
                        }

                        <Typography variant="subheading" color="inherit">
                            v{packageJson.version}
                        </Typography>
                    </Toolbar>
                    <LoginDialog close={this.closeLoginDialog} change={this.changeTab} login={this.userLogin} tab={tab} open={openLoginDialog}/>
                </AppBar>
            </header>
        );
    }
}

export default withStyles(styles)(Header);
