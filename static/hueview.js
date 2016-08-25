window.HueView = function(hueston) {
  'use strict';

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

  hueston.getLights()
    .then(lights => createLightControls(lights))
    .then(() => createAddNewLightButton())
    .catch(Error)
}
