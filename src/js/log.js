!function () {
  'use strict';
  const logView = document.createElement('div')
  logView.id = 'logger'
  const body = document.getElementsByTagName('body')[0]
  body.insertBefore(logView, body.children[0])
  window.log = (...args) => {
    logView.innerHTML += '<pre>' + args.join(' ')
    logView.scrollTop = logView.scrollHeight
  }
}()
