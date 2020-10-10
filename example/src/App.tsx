import React from 'react'
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom'
import FormExample from './FormExample'
import { CrudProvider } from 'material-crud'
import Prueba from './Prueba'
import TableExample from './TableExample'
import { english } from './lang'
import ChildTable from './ChildTable'

const App = () => {
  const user = {
    id: 'sadasd',
    name: 'tano',
    token:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiI1ZjQ0MGE1YjZhOTZhMTIyMjA3YTQ5MGIiLCJpYXQiOjE2MDE5MDYyMDksImV4cCI6MTYwMzIwMjIwOX0.CwmAou4P2Ni-nl0Senk-mVATKKo-4Wd_ynnQV_Zf1Vk',
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
                  <Link to="/child">ChildTable</Link>
                </li>
                <li>
                  <Link to="/prueba">Test Component</Link>
                </li>
              </ul>
            )}
          />
          <Route path="/form" component={FormExample} />
          <Route path="/table" component={TableExample} />
          <Route path="/child" component={ChildTable} />
          <Route
            path="/prueba"
            component={(props: any) => (
              <CrudProvider>
                <Prueba height={350} deleteRow edit {...props} />
              </CrudProvider>
            )}
          />
        </Switch>
      </BrowserRouter>
    </CrudProvider>
  )
}

export default App
