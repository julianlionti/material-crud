import React from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import FormExample from './FormExample'
import CrudExample from './CrudExample'
import { CrudProvider } from 'material-crud'
import Prueba from './Prueba'
import TableExample from './TableExample'
import { english } from './lang'

const App = () => {
  const user = {
    id: 'sadasd',
    name: 'tano',
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZjIzMTg5ODgzMWIzODIxNzRkYTllZjIiLCJpYXQiOjE2MDE2NjAyOTYsImV4cCI6MTYwMjk1NjI5Nn0.lBT2plyNuYzOTjKgAKeQ4GKIkUlHBlhXh-2j-gPxCSQ',
  }

  return (
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
    </CrudProvider>
  )
}

export default App
