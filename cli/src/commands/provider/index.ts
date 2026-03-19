import { Cli } from 'incur'
import { listCommand } from './list.ts'

export const provider = Cli.create('provider', {
  description: 'Storage provider information',
})

provider.command('list', listCommand)
