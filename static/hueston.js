window.Hueston = function () {
  'use strict';
  this.storage = localStorage

  const request = (method, url, data) =>
    new Promise((resolve, reject) => {
      const client = new XMLHttpRequest()
      client.open(method, url)

      if (data) {
        if (typeof data === "object") {
          client.send(JSON.stringify(data))
          log(JSON.stringify(data))
        } else {
          Error('request function requires data be an object')
        }
      } else {
        client.send()
      }

      client.onload = function() {
        if (this.status >= 200 && this.status < 300) {
          resolve(this.response);
        } else {
          reject(Error(this.statusText))
        }
      }
      client.onerror = () => reject(Error(this.statusText))
    })
      .then(response => JSON.parse(response))
      .catch(Error)

  const apiCore = (method, path, payload) =>
    request(method,
            "http://" + this.storage.getItem('hubIP') + "/api/" + this.storage.getItem('username') + "/" + path,
            payload)
      .then(response =>
        Array.isArray(response)
          && response[0].hasOwnProperty('error')
          && response[0].error.description === "unauthorized user" ?
        this.authorize() : response)
      .catch(Error)

  this.api = path => ({
    delete: payload => apiCore('DELETE', path, payload),
    get: payload => apiCore('GET', path, payload),
    post: payload => apiCore('POST', path, payload),
    put: payload => apiCore('PUT', path, payload)
  })

  this.authorize = () =>
    !this.storage.getItem('username') ?
      request('POST', 'http://' + this.storage.getItem('hubIP') + '/api',
         {devicetype: 'hueston#web'})
      .then(response =>
        // Validate response
        Array.isArray(response) && response[0].hasOwnProperty('success') ?
          this.storage.setItem('username', response[0].success.username)
        : Error(response))
    : new Promise((resolve, reject) => resolve(this.storage.getItem('username')))

  this.getHubIP = () =>
    // Check if we already have this value
    !this.storage.getItem('hubID') || !this.storage.getItem('hubIP') ?
      request('GET', "https://www.meethue.com/api/nupnp")
        .then(response => {
          if (response.length === 1) {
            this.storage.setItem('hubID', response[0].id)
            this.storage.setItem('hubIP', response[0].internalipaddress)
          } else {
            // TODO
            alert('Multi hub systems not yet supported')
            reject('Multi hub systems not yet supported')
          }
          resolve(this.storage.getItem('hubIP'))
        })
        .catch(Error)
    : new Promise((resolve, reject) => resolve(this.storage.getItem('hubIP')))

  this.getLights = () =>
    this.getHubIP()
      .then(() => this.api('lights').get())
      .then(response => this.lights = response)
      .catch(Error)

  // const waitForNewLights = () => this.api('lights/new').get()

  this.getNewLights = () =>
    this.getHubIP()
      .then(() => this.api('lights').post())
      .then(() => this.api('lights/new').get())
      .then(response => log(JSON.stringify(response)))
      .then(response => this.lights = response)
      .catch(Error)

  this.updateLight = (lightid, configuration) =>
    this.api('lights/' + lightid + '/state').put(configuration)
      .then(response => response.filter(attribute => 'success' in attribute)
        .map(attribute => Object.keys(attribute.success)
          .forEach(key =>
            this.lights[lightid].state[key.replace(/\/lights\/\d\/state\//, '')] = attribute.success[key]
          )))
      .catch(Error)

  this.deleteLight = lightid => this.api('lights/' + lightid).delete().catch(Error)
}
