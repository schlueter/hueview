(function () {
'use strict';
const makeSlider = parent => {
  const verticalBar = document.createElement('div')
  verticalBar.classList.add('slider-vertical-bar')
  verticalBar.style = 'height: 100%; width: 20px; background: black; margin-left: auto; margin-right: auto'
  const horizontalBar = document.createElement('div')
  horizontalBar.style = 'height: 20px; width: 100%; position: absolute; background: black; margin-top: auto; margin-bottom: auto; top: 0'
  horizontalBar.classList.add('slider-horizontal-bar')
  horizontalBar.onmousedown = mouseDownEvent => {
    var position = mouseDownEvent.y
    event.target.onmousemove = mouseMoveEvent => {
      const movement = position - mouseMoveEvent.y
      position = mouseMoveEvent.y
      const newPosition = mouseMoveEvent.target.offsetTop - movement
      if (newPosition >= verticalBar.offsetTop - horizontalBar.offsetHeight / 2 &&
          newPosition <= verticalBar.offsetTop + verticalBar.offsetHeight - horizontalBar.offsetHeight / 2) {
        console.log(newPosition / verticalBar.offsetHeight)
        mouseMoveEvent.target.style.top = newPosition
      }
    }
  }
  const wrapper = document.createElement('div')
  wrapper.classList.add('slider-wrapper')
  wrapper.style = 'width: 100px; position: relative'
  wrapper.appendChild(verticalBar)
  wrapper.appendChild(horizontalBar)
  parent.appendChild(wrapper)
  document.onmouseup = mouseUpEvent => horizontalBar.onmousemove = null
}

const sliders = document.getElementsByClassName('slider')
for (var slider in sliders) {
  if (sliders.hasOwnProperty(slider)) {
    makeSlider(sliders[slider])
  }
}
})()
