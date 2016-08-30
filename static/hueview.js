window.HueView = function(hueston) {
  'use strict';
  this.transitiontime = 0

  const createLightControl = lightid => {
    const control = document.createElement('div')

    const title = document.createElement('h3')
    title.textContent = hueston.lights[lightid].name
    control.appendChild(title)

    const toggle = document.createElement('button')
    toggle.textContent = 'Toggle'
    control.appendChild(toggle)

    const deleteLight = document.createElement('button')
    deleteLight.textContent = 'Delete'
    deleteLight.onclick = () => hueston.deleteLight(lightid)
    control.appendChild(deleteLight)

    const lightSettings = {}

    const inputConfigs = [
      {name: 'bri', placeholder: 'brightness', min: 0, max: 254},
      {name: 'sat', placeholder: 'saturation', min: 0, max: 254},
      {name: 'hue', placeholder: 'hue'       , min: 0, max: 65535}
    ]

    inputConfigs.forEach(config => {
      const input = document.createElement('input')
      input.placeholder = config.placeholder
      input.oninput = event => lightSettings[config.name] = parseInt(event.target.value)
      input.onkeydown = event => {
        console.log(event)
        if (event.key === "Enter") {
          lightSettings.on = true
          hueston.updateLight(lightid, lightSettings)
        }
      }
      control.appendChild(input)
    })

    window.control = control
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
