import axios from 'axios'
import { Loading } from 'quasar'

let loadFunction = config => {
  Loading.show()
  return config
}
let finishFunction = response => {
  Loading.hide()
  return response
}
let errorFunction = error => {
  Loading.hide()
  return Promise.reject(error)
}

const axiosInstanceJsonPlaceholder =
  axios.create({ baseURL: 'https://jsonplaceholder.typicode.com/' })
const axiosInstancePunk =
  axios.create({ baseURL: 'https://api.punkapi.com/v2/' })

axiosInstanceJsonPlaceholder.interceptors.request.use(loadFunction)
axiosInstancePunk.interceptors.request.use(loadFunction)

axiosInstanceJsonPlaceholder.interceptors.response.use(finishFunction, errorFunction)
axiosInstancePunk.interceptors.response.use(finishFunction, errorFunction)

let clients = {
  $http: {
    get () {
      return {
        jsonplaceholder: axiosInstanceJsonPlaceholder,
        punk: axiosInstancePunk
      }
    }
  }
}

axios.interceptors.response.use(function (response) {
  if (!response.data.ok) {
    return Promise.reject(response.data.errors)
  }
  return response.result
}, function (error) {
  // Do something with response error
  return Promise.reject(error)
})

export default (Vue) => {
  Object.defineProperties(Vue.prototype, clients)
}
