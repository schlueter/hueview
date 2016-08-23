window.HueView = function(hueston) {
  'use strict';
<<<<<<< a61b8c13b04e46093fed71120fa6294ca8856092
  this.makeButtonsForLights = () =>
    hueston.getLights().then(() => {
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
=======

  const setLight = event => hueston.updateLight(
    event.target.dataset.lightid,
    {
      on: !hueston.lights[event.target.dataset.lightid].state.on,
      bri: parseInt(event.target.dataset.bri),
      hue: parseInt(event.target.dataset.hue),
      sat: parseInt(event.target.dataset.sat),
      transitiontime: parseInt(event.target.dataset.transitiontime)
    })

  const createLightControl = lightid => {
    const button = document.createElement('button')
    button.dataset.lightid = lightid
    button.dataset.bri = 254
    button.dataset.hue = 10000
    button.dataset.sat = 254
    button.dataset.transitiontime = 0
    button.textContent = hueston.lights[lightid].name
    button.onclick = setLight
    document.getElementById('hueview').appendChild(button)
  }

  const createLightControls = lights => {
    for (let lightid in lights) {
      if(/^(\-|\+)?([0-9]+)$/.test(lightid)) {
        createLightControl(lightid)
      }
    }
  }

  const createAddNewLightButton = () => {
    const button = document.createElement('button')
    button.textContent = 'Add new lights'
    button.onclick = () => hueston.getNewLights()
      .then(lights => createLightControls(lights))
    document.getElementById('hueview').appendChild(button)
  }

  this.init = () =>
    hueston.getLights()
      .then(lights => createLightControls(lights))
      .then(() => createAddNewLightButton())
      .catch(error => Error(error))
  this.init()
>>>>>>> Break up view functions
}
