import React, {Component} from 'react';
import axios from 'axios';
import {Link} from 'react-router-dom';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import FontIcon from 'material-ui/FontIcon';
import {blue500, red500} from 'material-ui/styles/colors';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn,} from 'material-ui/Table';

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
                <TableRowColumn>{portfolio._id}</TableRowColumn>
                <TableRowColumn>{portfolio.name}</TableRowColumn>
                <TableRowColumn>
                    <Link to={`portfolio/${portfolio._id}`}>
                        <FontIcon className="material-icons">visibility</FontIcon>
                    </Link>
                    <Link to={`portfolio/edit/${portfolio._id}`}>
                        <FontIcon className="material-icons" color={blue500}>edit</FontIcon>
                    </Link>
                    <FontIcon className="material-icons" color={red500} onClick={this.delete.bind(this, portfolio._id)}>delete</FontIcon>
                </TableRowColumn>

            </TableRow>
        );
        return (

            <div>
                <Link to="/portfolio/create">
                    <FloatingActionButton >
                        <ContentAdd />
                    </FloatingActionButton>
                </Link>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>Id</TableHeaderColumn>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Action</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {listItems}
                    </TableBody>
                </Table>
            </div>

        );
    }
}

export default PortfolioList;