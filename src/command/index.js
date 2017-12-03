import Files from 'fs'
import Path from 'path'
import log from '../logging'
import { command as config } from '../../config'
import { setTimeout } from 'timers'

console.log('one one onen oone one one one oncommoand')

/**
 * Represenation of a message based command.
 */
export class Command
{
    constructor(executor, handler)
    {
        this.executors = Array.isArray(executor) ? executor : [ executor ]
        this.handler = handler
    }
}

/**
 * A relation of commands that we track.
 */
const registeredCommands = new Map()

/**
 * Begin tracking the provided command.
 * 
 * @param {Command} command Representation of the command
 */
export function registerCommand(command)
{
    const { executors, handler } = command

    executors.forEach(executor => registeredCommands.set(executor, handler))

    log.info(`registered command: ${executors}`)
}

/**
 * Check if we have a command registered under the provided executor.
 * 
 * @param {string} executor The executor
 */
export function hasCommand(executor)
{
    if (executor.startsWith(config.prefix))
        executor = executor.substring(config.prefix.length)

    return registeredCommands.has(executor)
}

/**
 * Begin parsing commands from messages.
 * 
 * @param {Client} client discord.js client
 */
export function setupHandler(client)
{
    // todo(ben)
    // register commands under 'src/command/'
    // traverseDirectory(__dirname)

    client.on('message', message => 
    {
        const split = message.content.split(' ')
    
        if (split && split[0].startsWith(config.prefix))
        {
            const command = registeredCommands.get(split[0].substring(1))
            const timedReply = text => message.reply(text).then(msg => setTimeout(() => msg.delete(), 5000))

            if (command)
            {
                message.timedReply = timedReply

                command(message, split.splice(1))
            }
            else
                timedReply('i have no command matching that..')
        }
    })
}

/**
 * Take the provided export in a file, and extract the commands out of it.
 * 
 * @param {object} entry The export entry
 */
function parseDefintion(entry)
{
    if (!entry.default)
    {
        for (let key in entry)
            parseDefintion({ default: entry[key] })

        return
    }
    else entry = entry.default
    
    if (!entry)
        throw new Error('Missing command definition')

    registerCommand(entry.executor, entry.handler)
}