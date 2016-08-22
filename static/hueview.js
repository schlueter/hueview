window.HueView = function(hueston) {
  'use strict';
  this.makeButtonsForLights = () =>
    hueston.getLights().then(() => {
      const pollLights = window.setInterval(hueston.getLights, 2000)
      const setLight = event => hueston.updateLight(
        event.target.dataset.lightid,
        {
          on: !hueston.lights[event.target.dataset.lightid].state.on,
          bri: parseInt(event.target.dataset.bri),
          hue: parseInt(event.target.dataset.hue),
          sat: parseInt(event.target.dataset.sat),
          transitiontime: parseInt(event.target.dataset.transitiontime)
        }
      )
      for (let lightid in hueston.lights) {
        if (hueston.lights.hasOwnProperty(lightid)) {
          const clicker = document.createElement('button')
          clicker.dataset.lightid = lightid
          clicker.dataset.bri = 254
          clicker.dataset.hue = 10000
          clicker.dataset.sat = 254
          clicker.dataset.transitiontime = 0
          clicker.innerHTML = hueston.lights[lightid].name
          clicker.onclick = setLight
          document.getElementById('hueview').appendChild(clicker)
        }
      }})
    .catch(Error)
}
