import React, {Component} from 'react';
import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class PortfolioForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        if (this.props.match.params.id) {
            axios.get('/api/portfolio/' + this.props.match.params.id)
                .then(res => {
                    this.setState(res.data);
                });
        }
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        const { name } = this.state;
        if (this.props.match.params.id) {
            axios.put('/api/portfolio/'+this.props.match.params.id, { name })
                .then(() => {
                    this.props.history.push("/")
                });
        } else {
            axios.post('/api/portfolio', { name })
                .then(() => {
                    this.props.history.push("/")
                });
        }
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <TextField floatingLabelText="Name" name="name" value={this.state.name} onChange={this.handleChange} />
                <RaisedButton type="submit" label="Save" primary={true} />
            </form>
        );
    }
}

export default PortfolioForm;