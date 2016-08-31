window.HueView = function(hueston) {
  'use strict';
  this.transitiontime = 0

  const createLightControl = (lightid, config) => {
    const control = document.createElement('div')
    const title = document.createElement('h3')
    title.onclick = () => hueston.updateLight(lightid, {on: !config.state.on})
    title.textContent = config.name
    control.appendChild(title)

    const settings = {}

    const attributes = [
      {name: 'bri', min: 0, max: 254},
      {name: 'hue', min: 0, max: 65535},
      {name: 'sat', min: 0, max: 254}
    ]

    attributes.forEach(attribute => {
      if (attribute.name in config.state) {
        const label = document.createElement('label')
        label.innerHTML = attribute.name
        const input = document.createElement('input')
        input.defaultValue = config.state[attribute.name]
        input.oninput = event => settings[attribute.name] = parseInt(event.target.value)
        input.onkeydown = event => {
          if (event.key === 'Enter') {
              settings.on = true
              hueston.updateLight(lightid, settings)
          }
        }
        label.appendChild(input)
        control.appendChild(label)
      }
    })

    document.getElementById('hueview').appendChild(control)
  }

  const createLightControls = lights => {
    for (let lightid in lights) {
      if(/^(\-|\+)?([0-9]+)$/.test(lightid)) {
        createLightControl(lightid, lights[lightid])
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
