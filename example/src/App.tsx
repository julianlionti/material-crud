import React from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import FormExample from './FormExample'
import { CrudProvider } from 'material-crud'
import Prueba from './Prueba'
import TableExample from './TableExample'
import { english } from './lang'
import CrudTable from './CrudTable'
import { createMuiTheme, ThemeProvider } from '@material-ui/core'
import Desarrollo from './screens/Desarrollo'
import Pucara from './screens/Pucara'

const App = () => {
  const user = {
    id: 'sadasd',
    name: 'tano',
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZmFjNzY4YWJkNzI2NzJjMThlZTdhYzYiLCJpYXQiOjE2MDYzMTg4MDMsImV4cCI6MTYwNzYxNDgwM30.etu--UFHy3B5YNuRZFHXj893b4vOoEanUMqLJmo1rPE',
  }

  return (
    <ThemeProvider theme={createMuiTheme({ palette: { type: 'light' } })}>
      <CrudProvider
        lang={english}
        user={user}
        headers={{
          Authorization: user.token,
        }}>
        <BrowserRouter>
          <Switch>
            <Route
              path="/"
              exact
              component={() => (
                <ul>
                  <li>
                    <Link to="/form">Form example</Link>
                  </li>
                  <li>
                    <Link to="/crud">Crud example</Link>
                  </li>
                  <li>
                    <Link to="/table">Table example</Link>
                  </li>
                  <li>
                    <Link to="/pucara">Pucara</Link>
                  </li>
                  <li>
                    <Link to="/desarrollo">Desarrollo Asociativo</Link>
                  </li>
                </ul>
              )}
            />
            <Route path="/form" component={FormExample} />
            <Route path="/table" component={TableExample} />
            <Route path="/crud" component={CrudTable} />
            <Route path="/prueba" component={Prueba} />
            <Route path="/desarrollo" component={Desarrollo} />
            <Route path="/pucara" component={Pucara} />
          </Switch>
        </BrowserRouter>
      </CrudProvider>
    </ThemeProvider>
  )
}

export default App
