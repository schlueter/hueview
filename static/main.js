'use strict';
(function() {
  function loadScript(url) {
    return new Promise(function(resolve, reject) {
      var head = document.getElementsByTagName('head')[0]
      var script = document.createElement('script')
      script.src = url
      script.async = false
      script.onload = () => resolve(url)
      head.appendChild(script)
    })
  }

  Promise.all([
    'static/hueston.js',
    'static/hueview.js'
  ].map(loadScript))
    .then(values => main())
    .catch(error => console.log('errored', error))

  var main = function() {
    var hueston = new Hueston()
    var hueView = new HueView()
    hueston.getLights().then(lights => {
      var numberOfLights = Object.keys(lights).length
      hueView.makeButtonsForLights(numberOfLights, hueston)
    })
    .catch(error => console.log('Error!', error))
  }
})()
