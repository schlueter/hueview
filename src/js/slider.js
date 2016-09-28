(function () {
  'use strict';
  var slider, initialY, movementY
  var bMouseUp = true

  document.onmouseup = () => bMouseUp = true
  document.onmousemove = onmousemoveEvent => bMouseUp ? false
    : slider.style.top = String(movementY + onmousemoveEvent.clientY - initialY) + 'px'
  document.onmousedown = onmousedownEvent => {
    var bExit = true
    for (var iNode = onmousedownEvent.target; iNode; iNode = iNode.parentNode) {
      if (iNode.className === 'slider') {
  			bExit = false
  			slider = iNode
  			break
  		}
    }
    if (bExit) {
  	  return
  	}
    bMouseUp = false
    movementY = 0
    for (var iOffPar = slider; iOffPar; iOffPar = iOffPar.offsetParent) {
      movementY += iOffPar.offsetTop
    }
    initialY = onmousedownEvent.clientY
    return false
  }
})()
