var app = require('app')
var BrowserWindow = require('browser-window')

require('crash-reporter').start()

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is GCed.
var mainWindow = null

app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit()
  }
})

app.on('ready', function() {
  mainWindow = new BrowserWindow({ width: 800, height: 600 })
  mainWindow.loadUrl('file:///'+ __dirname +'/index.html')
  mainWindow.on('closed', function() {
    mainWindow = null
  })

  var ipc = require('electron-safe-ipc/host')
  var fs = require('fs')

  var db = process.env.HOME + '/todos.json'

  ipc.respond('read-todos', function() {
    return new Promise(function(resolve, reject) {
      try {
        if (fs.statSync(db).isFile()) {
          const savedTodos = fs.readFileSync(db)
          const todos = JSON.parse(savedTodos)
          resolve(todos)
        }
      }
      catch(err) {
        reject(err)
      }
    })
  })

  ipc.respond('write-todos', function(todos) {
    return new Promise(function(resolve, reject) {
      fs.writeFile(db, JSON.stringify(todos), function(err) {
        if (err) {
          reject(err)
        }
        else {
          resolve(true)
        }
      })
    })
  })
})
