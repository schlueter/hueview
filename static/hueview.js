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
    const lightControl = document.createElement('div')
    const lightTitle = document.createElement('h3')
    lightTitle.textContent = hueston.lights[lightid].name
    lightControl.appendChild(lightTitle)
    const lightToggle = document.createElement('button')
    lightToggle.dataset.lightid = lightid
    lightToggle.dataset.bri = 254
    lightToggle.dataset.hue = 10000
    lightToggle.dataset.sat = 254
    lightToggle.dataset.transitiontime = 0
    lightToggle.textContent = 'Toggle'
    lightToggle.onclick = setLight
    lightControl.appendChild(lightToggle)
    const lightDelete = document.createElement('button')
    lightDelete.textContent('Delete')
    lightDelete.onclick = () => hueston.deleteLight(lightid)
    lightControl.appendChild(lightDelete)
    document.getElementById('hueview').appendChild(lightControl)
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
