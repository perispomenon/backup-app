import Datastore from 'nedb-promise'
import path from 'path'
import { remote } from 'electron'

const config = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), './backup-app/config.db'),
  timestampData: true
})

const tasks = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), './backup-app/tasks.db'),
  timestampData: true
})

const points = new Datastore({
  autoload: true,
  filename: path.join(remote.app.getPath('userData'), './backup-app/points.db'),
  timestampData: true
})

export default {
  config,
  tasks,
  points
}
