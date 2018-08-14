import client from './discord'
import { logging as log } from 'common'
import { token } from '../config'
import { setupHandler } from './command'
import { setup } from './feature'
import error from './error'

// dev
log.updateLoggingLevel('debug')

// setup command system
setupHandler(client)
setup(client)

client.login(token)


function cleanup()
{
    // notify every part of the app
    process.emit('cleanup')

    client.destroy().then(() => 
    {
        log.info('logged out')
        process.exit(0)
    })
}

for (let event of ['SIGTERM', 'SIGINT'])
    process.on(event, cleanup)