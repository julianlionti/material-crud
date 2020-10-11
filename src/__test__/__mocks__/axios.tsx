import { AxiosResponse } from 'axios'
import { fakeData } from '../generators'

const axiosResponse: AxiosResponse = {
  data: fakeData(),
  status: 200,
  statusText: 'OK',
  config: {},
  headers: {},
}

export default {
  get: jest.fn(() => Promise.resolve(axiosResponse)),
}
