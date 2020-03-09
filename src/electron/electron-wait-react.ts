import net from 'net'

const port = process.env.PORT ? parseInt(process.env.PORT, 10) - 100 : 3000
const client = new net.Socket()

process.env.ELECTRON_START_URL = `http://localhost:${port}`

let startedElectron = false

const tryConnection = () =>
  client.connect(port.toString(), () => {
    client.end()
    if (!startedElectron) {
      console.log('starting electron')
      startedElectron = true
      const exec = require('child_process').exec
      exec('npm run el:start')
    }
  })

tryConnection()

client.on('error', () => {
  setTimeout(tryConnection, 2000)
})
