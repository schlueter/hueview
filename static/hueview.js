window.HueView = function(hueston) {
  'use strict';
  this.makeButtonsForLights = () =>
    hueston.getLights().then(() => {
      var pollLights = window.setInterval(hueston.getLights, 2000)
      var setLight = event => hueston.updateLight(
        event.target.dataset.lightid,
        {on: !hueston.lights[event.target.dataset.lightid].state.on}
      )
      for (var lightid in hueston.lights) {
        if (hueston.lights.hasOwnProperty(lightid)) {
          var clicker = document.createElement('button')
          clicker.dataset.lightid = lightid
          clicker.innerHTML = hueston.lights[lightid].name
          clicker.onclick = setLight
          document.getElementById('hueview').appendChild(clicker)
        }
      }})
    .catch(error => Error(error))
}
