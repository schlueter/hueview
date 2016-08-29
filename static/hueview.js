window.HueView = function(hueston) {
  'use strict';
  this.transitiontime = 0

  const setLight = event => {
    const form = event.target
    console.log(event)
    const update = {
      on: !hueston.lights[form.dataset.lightid].state.on,
      bri: parseInt(form.elements.bri.value),
      hue: parseInt(form.elements.hue.value),
      sat: parseInt(form.elements.sat.value),
      transitiontime: this.transitiontime
    }

    hueston.updateLight(form.dataset.lightid, update)
    return false
  }

  const createLightControl = lightid => {
    const control = document.createElement('div')

    const form = document.createElement('form')
    form.dataset.lightid = lightid

    const title = document.createElement('h3')
    title.textContent = hueston.lights[lightid].name
    control.appendChild(title)

    const toggle = document.createElement('button')
    toggle.textContent = 'Toggle'
    form.appendChild(toggle)

    const deleteLight = document.createElement('button')
    deleteLight.textContent = 'Delete'
    deleteLight.onclick = () => hueston.deleteLight(lightid)
    control.appendChild(deleteLight)

    const briInput = document.createElement('input')
    briInput.name = 'bri'
    briInput.defaultValue = 'bri'
    form.appendChild(briInput)

    const hueInput = document.createElement('input')
    hueInput.name = 'hue'
    hueInput.defaultValue = 'hue'
    form.appendChild(hueInput)

    const satInput = document.createElement('input')
    satInput.name = 'sat'
    satInput.defaultValue = 'sat'
    form.appendChild(satInput)

    window.form = form
    form.onsubmit = setLight
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
