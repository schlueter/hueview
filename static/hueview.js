'use strict';
var HueView = HueView || function(hueston) {
  this.hueston = hueston
  this.makeButtonsForLights = () => {
    var body = document.getElementById('hueview'),
        i,
        clicker
    this.hueston.getLights().then(lights => {
      for (var lightid in lights) {
        if (lights.hasOwnProperty(lightid)) {
          clicker = document.createElement('button')
          clicker.dataset.lightid = lightid
          clicker.innerHTML = lights[lightid].name
          clicker.onclick = event => {
            var lightid = parseInt(event.target.dataset.lightid)
            this.hueston.updateLight(lightid,
              {on: !this.hueston.lights[lightid].state.on}
            )
          }
          body.appendChild(clicker)
        }
      }
    })
  }
}
