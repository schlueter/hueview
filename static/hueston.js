var Hueston = Hueston || function () {
  function get(url) {
    return new Promise(function(resolve, reject) {
      var req = new XMLHttpRequest()
      req.open('GET', url)

      req.onload = function () {
        if (req.status == 200) {
          resolve(req.response)
        } else {
          reject(Error(req.statusText))
        }
      }

      req.onerror = function () {
        reject(Error("Network error"))
      }

      req.send()
    })
  }

  function getAPI(hubIP, path) {
    console.log('get', path)
    return get("http://" + hubIP + "/api/6c3N6aVAYAIvGrpe4uF9v3PR-l7udDtKDKX0veiQ/" + path)
  }

  this.getHubIP = function() {
    return get("https://www.meethue.com/api/nupnp")
  }

  this.hitTheLights = function(event) {
    console.log(event)
    var lightid = parseInt(event.target.dataset.lightid)
    if (lightState[lightid]) {
      turnOff(lightid)
    } else {
      turnOn(lightid)
    }
    lightState[lightid] = !lightState[lightid]
  }

  this.getLights = function(hubIP) {
    return getAPI(hubIP, 'lights')
  }

  this.turnOn = function(lightid) {
    httpRequest = new XMLHttpRequest();
    httpRequest.open("PUT", "http://192.168.1.108/api/6c3N6aVAYAIvGrpe4uF9v3PR-l7udDtKDKX0veiQ/lights/" + lightid + "/state", true)
    httpRequest.send(JSON.stringify({
      on: true,
      sat: 254,
      bri: 200,
      hue: 50000
    }))
  }

  this.turnOff = function(lightid) {
    httpRequest = new XMLHttpRequest();
    httpRequest.open("PUT", "http://192.168.1.108/api/6c3N6aVAYAIvGrpe4uF9v3PR-l7udDtKDKX0veiQ/lights/" + lightid + "/state", true)
    httpRequest.send(JSON.stringify({on: false}));
  }
}
