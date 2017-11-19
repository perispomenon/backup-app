'use strict'

import path from 'path'
import { app, BrowserWindow, Tray, Menu } from 'electron'

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

const iconPath = path.join(__static, 'app-icon.png')
const title = 'Программа резервного копирования'

let mainWindow
let tray
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 650,
    useContentSize: true,
    width: 1200,
    icon: iconPath,
    title: title
  })

  // mainWindow.maximize()

  mainWindow.loadURL(winURL)

  // mainWindow.on('minimize', event => {
  //   event.preventDefault()
  //   mainWindow.hide()
  // })

  mainWindow.on('close', event => {
    if (!app.isQuitting) {
      event.preventDefault()
      mainWindow.hide()
    } else {
      mainWindow = null
    }
  })

  const trayMenu = Menu.buildFromTemplate([
    { label: 'Открыть окно программы', click () { mainWindow.show() } },
    { label: 'Выйти', click () { app.isQuitting = true; app.quit() } }
  ])
  tray = new Tray(iconPath)
  tray.setTitle(title)
  tray.setToolTip(title)
  tray.setContextMenu(trayMenu)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
