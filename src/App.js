import React from 'react'
import Header from "./components/Header";
import Main from "./components/Main";
import packageJson from '../package.json';

const versionStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    alignContent: 'flex-end'
};

const App = () => (
    <div>
        <div style={versionStyle}>v{packageJson.version}</div>
        <div>
            <Header />
            <Main />
        </div>
    </div>
);

export default App
