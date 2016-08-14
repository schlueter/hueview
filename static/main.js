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
    .then(function(value) { console.log('loaded', value, 'successfully') })
    .catch(function(error) { console.log('failed to load', url) })
  }

  var includes = ['static/hueston.js', 'static/hueview.js'].map(loadScript)

  Promise.all(includes)
    .then(function(values) {console.log('done', values); main()})
    .catch(function(err) {console.log('errored')})

  var main = function(values) {
    console.log(values)
    hueston = new Hueston()
    hueston.getHubIP().then(function(response) {
      var hubIP = JSON.parse(response)[0]['internalipaddress']
      hueston.getLights(hubIP).then(function(response) {
        var numberOfLights = Object.keys(JSON.parse(response)).length
        makeButtonsForLights(numberOfLights)
      }, function(error) {
        console.log('Error!', response)
      })
    }, function(error) {
      console.log('Error!', response)
    })
  }
})()
