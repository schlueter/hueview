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
    const control = document.createElement('div')

    const title = document.createElement('h3')
    title.textContent = hueston.lights[lightid].name
    control.appendChild(title)

    const toggle = document.createElement('button')
    toggle.dataset.lightid = lightid
    toggle.dataset.bri = 254
    toggle.dataset.hue = 10000
    toggle.dataset.sat = 254
    toggle.dataset.transitiontime = 0
    toggle.textContent = hueston.lights[lightid].name
    toggle.textContent = 'Toggle'
    toggle.onclick = setLight
    control.appendChild(toggle)

    const deleteLight = document.createElement('button')
    deleteLight.textContent = 'Delete'
    deleteLight.onclick = () => hueston.deleteLight(lightid)
    control.appendChild(deleteLight)

    const form = document.createElement('form')

    const briInput = document.createElement('input')
    form.appendChild(briInput)
    control.appendChild(form)

    document.getElementById('hueview').appendChild(control)
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
