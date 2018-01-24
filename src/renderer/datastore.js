import Datastore from 'nedb-promise'
import path from 'path'
import { remote } from 'electron'

const userData = remote.app.getPath('userData')

const config = new Datastore({
  autoload: true,
  filename: path.join(userData, 'config.db'),
  timestampData: true
})

const tasks = new Datastore({
  autoload: true,
  filename: path.join(userData, 'tasks.db'),
  timestampData: true
})

const points = new Datastore({
  autoload: true,
  filename: path.join(userData, 'points.db'),
  timestampData: true
})

export default {
  config,
  tasks,
  points
}
