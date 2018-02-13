import React from 'react'
import {Route, Switch} from 'react-router-dom'
import TransactionList from "./transaction/TransactionList";
import TransactionForm from "./transaction/TransactionForm";
import CurrencyList from "./currency/CurrencyList";
import PortfolioList from "./portfolio/PortfolioList";
import PortfolioDashboard from "./portfolio/PortfolioDashboard";

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
    <main>
        <Switch>
            <Route exact path='/' component={PortfolioList}/>
            <Route path='/portfolios' component={PortfolioList}/>
            <Route path='/portfolio/:id' component={PortfolioDashboard}/>
            <Route path='/:portfolioId/transactions/:currencyId' component={TransactionList}/>
            <Route path='/transaction/create' component={TransactionForm}/>
            <Route path='/transaction/edit/:id' component={TransactionForm}/>
            <Route path='/currencies' component={CurrencyList}/>
        </Switch>
    </main>
)

export default Main
