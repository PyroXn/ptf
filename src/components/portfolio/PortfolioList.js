import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import Button from 'material-ui/Button';
import AddCircleOutline from 'material-ui-icons/AddCircleOutline';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui-icons/Edit';
import StarBorder from 'material-ui-icons/StarBorder';
import Star from 'material-ui-icons/Star';
import DeleteIcon from 'material-ui-icons/Delete';
import VisibilityIcon from 'material-ui-icons/Visibility';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';
import {withStyles} from "material-ui/styles/index";
import PortfolioDialog from "./PortfolioDialog";
import DeletePortfolioDialog from "./DeletePortfolioDialog";


const styles = theme => ({
    link: {
        textDecoration: 'none',
        outline: 'none',
    },
    button: {
        margin: theme.spacing.unit,
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
    },
});


class PortfolioList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            portfolios: [],
            openPortfolioDialog: false,
            openDeletePortfolioDialog: false,
            portfolioId: null,
            user: JSON.parse(localStorage.getItem('user')),
        };
    }

    componentDidMount() {
        this.getPortfolios();
    }

    getPortfolios() {
        axios.get('/api/portfolio')
            .then(res => {
                res.data.sort((a, b) =>  b.users.indexOf(this.state.user._id) - a.users.indexOf(this.state.user._id));
                this.setState({portfolios: res.data});
            });
    }

    openPortfolioDialog = (portfolioId) => {
        this.setState({ openPortfolioDialog: true });
        this.setState({portfolioId: portfolioId});
    };

    closePortfolioDialog = () => {
        this.getPortfolios();
        this.setState({portfolioId: null});
        this.setState({ openPortfolioDialog: false });
    };

    openDeletePortfolioDialog = (portfolioId) => {
        this.setState({ openDeletePortfolioDialog: true });
        this.setState({portfolioId: portfolioId});
    };

    closeDeletePortfolioDialog = () => {
        this.getPortfolios();
        this.setState({portfolioId: null});
        this.setState({ openDeletePortfolioDialog: false });
    };

    saveFavorite = (portfolio) => {
        portfolio.users.push(this.state.user);
        axios.put('/api/portfolio/'+portfolio._id, portfolio)
            .then(() => {
                this.getPortfolios();
            });
    };

    saveUnfavorite = (portfolio) => {
        const index = portfolio.users.indexOf(this.state.user._id);
        if (index > -1) {
            portfolio.users.splice(index, 1);
        }
        axios.put('/api/portfolio/'+portfolio._id, portfolio)
            .then(() => {
                this.getPortfolios();
            });
    };

    render() {
        const { classes } = this.props;

        const listItems = this.state.portfolios.map(portfolio =>
            <TableRow key={portfolio._id}>
                <TableCell>{portfolio._id}</TableCell>
                <TableCell>{portfolio.name}</TableCell>
                <TableCell>
                    <Link to={`portfolio/${portfolio._id}`}>
                        <IconButton aria-label="show">
                            <VisibilityIcon />
                        </IconButton>
                    </Link>
                    {portfolio.users.includes(this.state.user._id) ? (
                        <IconButton color="primary" aria-label="favorite" onClick={this.saveUnfavorite.bind(this, portfolio)}>
                            <Star />
                        </IconButton>
                    ) : (
                        <IconButton color="primary" aria-label="favorite" onClick={this.saveFavorite.bind(this, portfolio)}>
                            <StarBorder />
                        </IconButton>
                    )}

                    <IconButton color="primary" aria-label="edit" onClick={this.openPortfolioDialog.bind(this, portfolio._id)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="secondary" aria-label="delete" onClick={this.openDeletePortfolioDialog.bind(this, portfolio._id)}>
                        <DeleteIcon />
                    </IconButton>
                </TableCell>

            </TableRow>
        );
        return (

            <div>
                <Button variant="raised" color="secondary" aria-label="add" onClick={this.openPortfolioDialog.bind(this, null)} className={classes.button}>
                    Add portfolio
                    <AddCircleOutline className={classes.rightIcon}/>
                </Button>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listItems}
                    </TableBody>
                </Table>
                <PortfolioDialog close={this.closePortfolioDialog} open={this.state.openPortfolioDialog} portfolioId={this.state.portfolioId}/>
                <DeletePortfolioDialog close={this.closeDeletePortfolioDialog} open={this.state.openDeletePortfolioDialog} portfolioId={this.state.portfolioId}/>
            </div>

        );
    }
}

export default withStyles(styles)(PortfolioList);