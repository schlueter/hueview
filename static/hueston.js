'use strict';
var Hueston = Hueston || function () {
  this.username = 'zWx1OGHpLBfXiZXHgqknbNhVQwnr5sB3p3Go3gPs'

  var request = url => {
    var core = {
      ajax: (method, url, data) => {
        return new Promise((resolve, reject) => {
          var client = new XMLHttpRequest()
          var uri = url

          client.open(method, uri)

          if (typeof data === "object") {
            client.send(JSON.stringify(data))
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
      'get':    args => core.ajax('GET',    url, args),
      'post':   args => core.ajax('POST',   url, args),
      'put':    args => core.ajax('PUT',    url, args),
      'delete': args => core.ajax('DELETE', url, args)
    }
  }

  var api = (path, args) => {
    console.log(this.hubIP)
    console.log('api("' + path + '", "' + args + '")')
    var core = {
      ajax: (method, path, args) => {
        return request("http://" + this.hubIP + "/api/" + this.username + "/" + path).get(args)
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
      'get':    args => core.ajax('GET',    path, args),
      'post':   args => core.ajax('POST',   path, args),
      'put':    args => core.ajax('PUT',    path, args),
      'delete': args => core.ajax('DELETE', path, args)
    }
  }

  this.authorize = () => {
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
  }

  this.getHubIP = () => {
    return new Promise((resolve, reject) => {
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
  }

  this.getLights = () => {
    return new Promise((resolve, reject) => {
      // TODO move this to api
      this.getHubIP().then(hubIP => {
        api('lights').get()
          .then(response => {
            this.lights = response
            resolve(response)
          })
          .catch(error => console.log(error))
      })
    })
  }

  this.hitTheLights = event => {
    var lightid = parseInt(event.target.dataset.lightid),
        transitiontimeKey = '/lights/' + lightid + '/state/transitiontime'
    return new Promise((resolve, reject) => {
      var req = new XMLHttpRequest();
      req.open("PUT", "http://" + this.hubIP + "/api/" + this.username + "/lights/" + lightid + "/state", true)
      req.send(JSON.stringify({
        on: !this.lights[lightid].state.on,
        sat: 254,
        bri: 200,
        hue: 50000,
        transitiontime: 10
      }))}
    )
  }
}
