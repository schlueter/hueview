window.Hueston = function () {
  'use strict';
  this.username = 'zWx1OGHpLBfXiZXHgqknbNhVQwnr5sB3p3Go3gPs'
  this.storage = localStorage

  const request = (method, url, data) => {
    return new Promise((resolve, reject) => {
      const client = new XMLHttpRequest()
      client.open(method, url)

      if (data) {
        if (typeof data === "object") {
          client.send(JSON.stringify(data))
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
  }

  this.api = path => {
    const core = {
      ajax: (method, path, payload) =>
        request(method, "http://" + this.storage.getItem('hubIP') + "/api/" + this.username + "/" + path, payload)
          .then(response =>
            Array.isArray(response)
              && response[0].hasOwnProperty('error')
              && response[0].error.description === "unauthorized user" ?
            this.authorize() : response)
          .catch(Error)
    }

    return {
      delete: payload => core.ajax('DELETE', path, payload),
      get: payload => core.ajax('GET', path, payload),
      post: payload => core.ajax('POST', path, payload),
      put: payload => core.ajax('PUT', path, payload)
    }
  }

  this.authorize = () =>
    request('POST', 'http://' + this.storage.getItem('hubIP') + '/api',
         {devicetype: 'hueston#web'})
      .then(response =>
        // Validate response
        Array.isArray(response) && response[0].hasOwnProperty('success') ?
        this.username = response[0].success.username : Error(response))

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
        .catch(error => Error(error))
      : new Promise((resolve, reject) => resolve(this.storage.getItem('hubIP')))

  this.getLights = () =>
    this.getHubIP()
      .then(() => this.api('lights').get())
      .then(response => this.lights = response)
      .catch(Error)
      // TODO move this to api

  this.updateLight = (lightid, configuration) =>
    this.api('lights/' + lightid + '/state').put(configuration)
}
