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
      {name: 'on', min: false, max: true},
      {name: 'bri', min: 0, max: 254},
      {name: 'hue', min: 0, max: 65535},
      {name: 'sat', min: 0, max: 254}
    ]

    attributes.forEach(attribute => {
      if (attribute.name === 'on') {
        const toggle = () => hueston.updateLight(lightid, {on: !config.state.on})
                               .then(() => {
                                 if (config.state.on) {
                                   icon.classList.remove('fa-toggle-off')
                                   icon.classList.add('fa-toggle-on')
                                 } else {
                                   icon.classList.remove('fa-toggle-on')
                                   icon.classList.add('fa-toggle-off')
                                 }
                               })
        const anchor = document.createElement('a')
        anchor.tabIndex = 0
        anchor.onclick = toggle
        anchor.onkeydown = event => {
          if (event.key === 'Enter' || event.key === ' ') {
            toggle()
          }
        }
        const icon = document.createElement('i')
        icon.classList.add('fa')
        icon.setAttribute('aria-hidden', true)
        // Set up initial state
        if (config.state.on) {
          icon.classList.add('fa-toggle-on')
        } else {
          icon.classList.add('fa-toggle-off')
        }
        anchor.setAttribute('aria-label', 'Toggle light ' + lightid)
        anchor.appendChild(icon)
        control.appendChild(anchor)
      } else if (attribute.name in config.state) {
        const label = document.createElement('label')
        label.innerHTML = attribute.name
        const input = document.createElement('input')
        input.defaultValue = config.state[attribute.name]
        input.oninput = event => settings[attribute.name] = parseInt(event.target.value)
        input.onkeydown = event => {
          if (event.key === 'Enter') {
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
