window.Hueston = function () {
  'use strict';
  this.username = 'zWx1OGHpLBfXiZXHgqknbNhVQwnr5sB3p3Go3gPs'

  var request = url => {
    var core = {
      ajax: (method, url, data) => {
        return new Promise((resolve, reject) => {
          var client = new XMLHttpRequest()
          var uri = url

          client.open(method, uri)

          if (data) {
            if (typeof data === "object") {
              client.send(JSON.stringify(data))
            } else {
              console.log('request function requires data be an object')
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
          .catch(error => console.log(error))
      }
    }

    return {
      'get':    payload => core.ajax('GET',    url, payload),
      'post':   payload => core.ajax('POST',   url, payload),
      'put':    payload => core.ajax('PUT',    url, payload),
      'delete': payload => core.ajax('DELETE', url, payload)
    }
  }

  this.api = (path, payload) => {
    var core = {
      ajax: (method, path, payload) => {
        return request("http://" + this.hubIP + "/api/" + this.username + "/" + path)[method.toLowerCase()](payload)
          .then(response => {
            if (Array.isArray(response)
                && response[0].hasOwnProperty('error')
                && response[0].error.description === "unauthorized user") {
              this.authorize()
              console.log(this.username)
            } else {
              return response
            }
          })
      }
    }

    return {
      'get':    payload => core.ajax('GET',    path, payload),
      'post':   payload => core.ajax('POST',   path, payload),
      'put':    payload => core.ajax('PUT',    path, payload),
      'delete': payload => core.ajax('DELETE', path, payload)
    }
  }

  this.authorize = () =>
    request('http://' + this.hubIP + '/api')
      .post({devicetype: 'hueston#web'})
      .then(response => {
        if (Array.isArray(response)
            && response[0].hasOwnProperty('success')) {
          this.username = response[0].success.username
        } else {
          return Error(response)
        }
      })

  this.getHubIP = () =>
    new Promise((resolve, reject) => {
      request("https://www.meethue.com/api/nupnp").get()
        .then(response => {
          if (response.length === 1) {
            this.hubID = response[0].id
            this.hubIP = response[0].internalipaddress
          } else {
            // TODO
            alert('Multi hub systems not yet supported')
            reject('Multi hub systems not yet supported')
          }
          resolve(this.hubIP)
        })
        .catch(error => console.log(error))
    })

  this.getLights = () =>
    new Promise((resolve, reject) => {
      // TODO move this to api
      this.getHubIP().then(hubIP => {
        this.api('lights').get()
          .then(response => {
            this.lights = response
            resolve(response)
          })
          .catch(error => console.log(error))
      })
    })

  this.updateLight = (lightid, configuration) =>
    new Promise((resolve, reject) =>
      this.api('lights/' + lightid + '/state').put(configuration)
    )
}
