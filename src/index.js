import client from './discord'
import log from './logging'
import { token } from '../config'
import { setup } from './feature'


// setup command system
setup(client)


// client.on('command', async (message, command, args) => {
//     // switch to registration based system
//     if (command == 'cleanup')
//     {
//         const limit = parseInt(args[0])
//         const { channel } = message

//         const messages = await channel.fetchMessages({ limit })
//         const deleted = await channel.bulkDelete(messages)

//         message.reply(`cleaned up ${limit} messages`)
//     }
// })

client.login(token)


function cleanup()
{
    // notify every part of the app
    process.emit('cleanup')

    client.destroy().then(() => log.info('logged out'))
}

for (let event of ['SIGTERM', 'SIGINT'])
    process.on(event, cleanup)