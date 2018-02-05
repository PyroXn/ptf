import React from 'react'
import {render} from 'react-dom'
import {BrowserRouter} from 'react-router-dom'
import App from './App';
import {MuiThemeProvider, createMuiTheme} from "material-ui/styles/index";
import blue from 'material-ui/colors/blue';
import red from 'material-ui/colors/red';
import Reboot from 'material-ui/Reboot';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
    palette: {
        primary: {
            light: blue[300],
            main: blue[500],
            dark: blue[700],
        },
        secondary: {
            light: red[300],
            main: red[500],
            dark: red[700],
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