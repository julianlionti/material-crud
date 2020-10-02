import React from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import FormExample from './FormExample'
import CrudExample from './CrudExample'
import { UserProvider, UserConfiguration } from 'material-crud'
import Prueba from './Prueba'
import TableExample from './TableExample'

const App = () => {
  const user = {
    id: 'sadasd',
    name: 'tano',
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZjIzMTg5ODgzMWIzODIxNzRkYTllZjIiLCJpYXQiOjE2MDAyMTE2NjAsImV4cCI6MTYwMTUwNzY2MH0.uoBCflglqs_wTwchDKPNjyIkRkWTbLoqRbPikOYO4bk',
  }
  const intial: UserConfiguration = {
    user,
    headers: {
      Authorization: user.token,
    },
  }

  return (
    <UserProvider intial={intial}>
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
                  <Link to="/prueba">Test Component</Link>
                </li>
              </ul>
            )}
          />
          <Route path="/form" component={FormExample} />
          <Route path="/crud" component={CrudExample} />
          <Route path="/table" component={TableExample} />
          <Route
            path="/prueba"
            component={(props: any) => <Prueba deleteRow edit {...props} />}
          />
        </Switch>
      </BrowserRouter>
    </UserProvider>
  )
}

export default App
