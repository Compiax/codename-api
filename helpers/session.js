var debug     = require('debug')('odin-api:helpers:session')
var config    = require('config')
var net       = require('net')

var session = {}

session.variables = []
session.operations = []

session.setVariables = function(variables) {
    this.variables = variables
    return this
}

session.setOperations = function(operations) {
    this.operations = operations
    return this
}

session.start = function() {
  var client = new net.Socket()
  var host = config.servers.daemon.host
  var port = config.servers.daemon.port

  debug(`Attempting to connect to ${host}:${port}`)
  client.connect(port, host, () => {
      debug(`Connected to daemon on ${host}:${port}`)
      debug("Sending data:")
      let data = this.variables.map(a => JSON.stringify(a)).join('\n')+'\n'+this.operations.join(';')+';';
      client.write(data)
      debug(data)
      debug("Session sent. Awaiting result")
  })

  client.on('data', function(data) {
      debug('Received result:')
      debug(String(data))
      // client.destroy() // kill client after server's response
  })

  client.on('close', function() {
      debug('Connection closed')
  })
}

module.exports = session
