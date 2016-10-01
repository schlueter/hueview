var slider, initialY, movementY
var mouseUp = true

document.onmouseup = () => mouseUp = true
document.onmousemove = event => {
  if (!mouseUp && event.clientY > slider.parentElement.offsetTop
      && event.clientY < slider.parentElement.offsetTop + slider.parentElement.offsetHeight) {
    slider.style.top = String(movementY + event.clientY - initialY) + 'px'
    slider.dataset.position = (event.clientY - slider.parentElement.offsetTop)/(slider.parentElement.offsetTop + slider.parentElement.offsetHeight)
    console.log((event.clientY - slider.parentElement.offsetTop)/(slider.parentElement.offsetTop + slider.parentElement.offsetHeight))
  }
  return false
}
document.onmousedown = event => {
  if (event.target.classList.contains('slider')) {
    slider = event.target
    mouseUp = false
    movementY = slider.offsetTop
    initialY = event.clientY
  }
  return false
}
