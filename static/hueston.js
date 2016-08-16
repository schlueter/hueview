var Hueston = Hueston || function () {
  function get(url) {
    return new Promise((resolve, reject) => {
      var req = new XMLHttpRequest()
      req.open('GET', url)

      req.onload = () => {
        if (req.status == 200) {
          resolve(req.response)
        } else {
          reject(Error(req.statusText))
        }
      }

      req.onerror = () => {
        reject(Error("Network error"))
      }

      req.send()
    })
      .then(response => JSON.parse(response))
      .catch(error => console.log(error))
  }

  function getAPI(path, hubIP) {
    hubIP = hubIP || this.hubIP
    return get("http://" + hubIP + "/api/6c3N6aVAYAIvGrpe4uF9v3PR-l7udDtKDKX0veiQ/" + path)
      .then(response => {
        console.log(response[0].error)
        if (Array.isArray(response) && response[0].hasOwnProperty('error') && response[0].error.description === "unauthorized user") {
          alert('Unauthorized!')
        } else {
          return response
        }
      })
  }

  this.hitTheLights = event => {
    var lightid = parseInt(event.target.dataset.lightid),
        transitiontimeKey = '/lights/' + lightid + '/state/transitiontime'
    return new Promise((resolve, reject) => {
      req = new XMLHttpRequest();
      req.open("PUT", "http://" + this.hubIP + "/api/6c3N6aVAYAIvGrpe4uF9v3PR-l7udDtKDKX0veiQ/lights/" + lightid + "/state", true)
      req.send(JSON.stringify({
        on: !this.lights[lightid].state.on,
        sat: 254,
        bri: 200,
        hue: 50000,
        transitiontime: 10
      }))}
    )
  }

  this.getHubIP = () => {
    return new Promise((resolve, reject) => {
      get("https://www.meethue.com/api/nupnp")
        .then(
          response => {
            if (response.length === 1) {
              this.hubID = response[0].id
              this.hubIP = response[0].internalipaddress
            } else {
              // TODO
              alert('Multi hub systems not yet supported')
              reject('Multi hub systems not yet supported')
            }
            resolve(this.hubIP)
          }
        )
        .catch(error => console.log(error))
    })
  }

  this.getLights = () => {
    return new Promise((resolve, reject) => {
      this.getHubIP().then(hubIP => {
        getAPI('lights', hubIP)
          .then(response => {
            this.lights = response
            resolve(response)
          })
          .catch(error => console.log(error))
      })
    })
  }
}
