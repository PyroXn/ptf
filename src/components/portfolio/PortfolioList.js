import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import Button from 'material-ui/Button';
import Add from 'material-ui-icons/Add';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui-icons/Edit';
import DeleteIcon from 'material-ui-icons/Delete';
import VisibilityIcon from 'material-ui-icons/Visibility';
import Table, { TableBody, TableCell, TableHead, TableRow } from 'material-ui/Table';

class PortfolioList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            portfolios: []
        };
    }

    componentDidMount() {
        axios.get('/api/portfolio')
            .then(res => {
                this.setState({portfolios: res.data});
            });
    }

    delete(id){
        axios.delete('/api/portfolio/'+id)
            .then(() => {
                this.props.history.push("/")
            });
    }

    render() {
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
                    <Link to={`portfolio/edit/${portfolio._id}`}>
                        <IconButton color="primary" aria-label="edit">
                            <EditIcon />
                        </IconButton>
                    </Link>
                    <IconButton color="secondary" aria-label="delete" onClick={this.delete.bind(this, portfolio._id)}>
                        <DeleteIcon />
                    </IconButton>
                </TableCell>

            </TableRow>
        );
        return (

            <div>
                <Link to="/portfolio/create">
                    <Button variant="fab" color="primary" aria-label="add">
                        <Add />
                    </Button>
                </Link>
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
            </div>

        );
    }
}

export default PortfolioList;