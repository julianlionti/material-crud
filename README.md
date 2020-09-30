# Material-CRUD

[![NPM](https://img.shields.io/npm/v/material-crud.svg)](https://www.npmjs.com/package/material-crud) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

Crud components with @material-ui design
  - Independant Form component to use everywhere
  - Filters
  - Sort
  - Pagination
  - Card Design

### Tech

Material-CRUD uses:

* Typescript
* Formik
* @material-ui/core 
* @material-ui/lab
* Yup for validation
* react-icons

### Installation

Material CRUD

```sh
$ npm install material-crud
OR
$ yarn add material-crud
```

Install all dependencies

```sh
$ npm install @material-ui/core @material-ui/lab axios formik react-icons moment yup
OR
$ yarn add @material-ui/core @material-ui/lab axios formik react-icons moment yup
```

### Todos

 - Write Tests
 - Full customization of inner components
 - Translations

License
----

MIT


### Troubleshooting

If the list appears empty check that you include your CRUD component inside de CRUDProvider 

```js
<CrudProvider>
  <Crud />
</CrudProvider>
OR
$ yarn add @material-ui/core @material-ui/lab axios formik react-icons moment yup
```
