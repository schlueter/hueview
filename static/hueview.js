var HueView = function(hueston) {
  'use strict';
  this.hueston = hueston
  this.makeButtonsForLights = () =>
    this.hueston.getLights().then(lights => {
      var  i
      for (var lightid in lights) {
        if (lights.hasOwnProperty(lightid)) {
          var clicker = document.createElement('button')
          clicker.dataset.lightid = lightid
          clicker.innerHTML = lights[lightid].name
          clicker.onclick = event => this.hueston.updateLight(
            event.target.dataset.lightid,
            {on: !this.hueston.lights[event.target.dataset.lightid].state.on}
          )
          document.getElementById('hueview').appendChild(clicker)
        }
      }
    })
}
