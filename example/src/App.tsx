import React from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'

import FormExample from './FormExample'
import CrudExample from './CrudExample'

const App = () => (
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
          </ul>
        )}
      />
      <Route path="/form" component={FormExample} />
      <Route path="/crud" component={CrudExample} />
    </Switch>
  </BrowserRouter>
)

export default App
