'use strict';
(function() {
  var promiseCount = 0;

  function testPromise() {
    var thisPromiseCount = ++promiseCount;

    var log = document.getElementById('log');
    log.insertAdjacentHTML('beforeend', thisPromiseCount + ') Started (<small>Sync code started</small>)<br/>');

    // We make a new promise: we promise a numeric count of this promise, starting from 1 (after waiting 3s)
    var p1 = new Promise(
      // The resolver function is called with the ability to resolve or
      // reject the promise
      function(resolve, reject) {
        log.insertAdjacentHTML('beforeend', thisPromiseCount + ') Promise started (<small>Async code started</small>)<br/>');
        // This is only an example to create asynchronism
        window.setTimeout(
          function() {
            // We fulfill the promise !
            resolve(thisPromiseCount);
          }, Math.random() * 2000 + 1000);
      }
    );

    // We define what to do when the promise is resolved/fulfilled with the then() call,
    // and the catch() method defines what to do if the promise is rejected.
    p1.then(
      // Log the fulfillment value
      function(val) {
          log.insertAdjacentHTML('beforeend', val +
              ') Promise fulfilled (<small>Async code terminated</small>)<br/>');
      })
    .catch(
      // Log the rejection reason
      function(reason) {
          console.log('Handle rejected promise ('+reason+') here.');
      });

    log.insertAdjacentHTML('beforeend', thisPromiseCount +
        ') Promise made (<small>Sync code terminated</small>)<br/>');
    return p1
  }

  var promises = [1,2,3,4,5,6].map(testPromise)

  Promise.all(promises)
    .then(function(values) {
      log.insertAdjacentHTML('beforeend', '*' + ') All Promises fulfilled <br/>')
    })
    .catch(function(error) {console.log(error)})
})();
(function () {
  function loadScript(url) {
    return new Promise(function(resolve, reject) {
      var head = document.getElementsByTagName('head')[0]
      var script = document.createElement('script')
      script.src = url
      script.async = false
      script.onload = function () {console.log('loaded', url)}
      head.appendChild(script)
    })
    .then(function(value) {
            console.log('loaded', url, 'successfully')
          })
    .catch(function(error) {
             console.log('failed to load', url)
           })
  }

  var includes = [
    'static/hueston.js',
    'static/hueview.js'
  ].map(loadScript)

  Promise.resolve(Promise.all(includes)
    .then(function(values) {console.log('done')})
    .catch(function(err) {console.log('errored')}))

  includes.map(function(promise) { promise.then(function (val) { console.log('foo' + val) })
                                          .catch(function (reason) {console.log('bar' + reason) })})

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
