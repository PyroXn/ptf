import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import App from './App';
import {MuiThemeProvider, createMuiTheme} from "material-ui/styles/index";
import grey from 'material-ui/colors/grey';
import red from 'material-ui/colors/red';
import brown from 'material-ui/colors/brown';
import Reboot from 'material-ui/Reboot';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
    palette: {
        primary: {
            light: grey[300],
            main: grey[900],
            dark: grey[900],
            contrastText: brown[50],
        },
        secondary: {
            light: red[300],
            main: red[500],
            dark: red[700],
            contrastText: brown[50],
        },
    },
});

render(
    <BrowserRouter>
        <MuiThemeProvider theme={theme}>
            <Reboot />
            <App/>
        </MuiThemeProvider>
    </BrowserRouter>,
    document.getElementById('root')
);
// registerServiceWorker();