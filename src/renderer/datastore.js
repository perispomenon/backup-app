import Datastore from 'nedb-promise'
import path from 'path'
import { remote } from 'electron'

const userData = remote.app.getPath('userData')

const config = new Datastore({
  autoload: true,
  filename: path.join(userData, './backup-app', 'config.db'),
  timestampData: true
})

const tasks = new Datastore({
  autoload: true,
  filename: path.join(userData, './backup-app', 'tasks.db'),
  timestampData: true
})

const points = new Datastore({
  autoload: true,
  filename: path.join(userData, './backup-app', 'points.db'),
  timestampData: true
})

export default {
  config,
  tasks,
  points
}
