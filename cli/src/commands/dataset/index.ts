import { Cli } from 'incur'
import { createCommand } from './create.ts'
import { detailsCommand } from './details.ts'
import { listCommand } from './list.ts'
import { terminateCommand } from './terminate.ts'
import { uploadCommand } from './upload.ts'

export const dataset = Cli.create('dataset', {
  description: 'PDP dataset management — list, create, terminate, and upload',
})

dataset.command('list', listCommand)
dataset.command('details', detailsCommand)
dataset.command('create', createCommand)
dataset.command('terminate', terminateCommand)
dataset.command('upload', uploadCommand)
