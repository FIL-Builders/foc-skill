import { Cli } from 'incur'
import { balanceCommand } from './balance.ts'
import { costsCommand } from './costs.ts'
import { depositCommand } from './deposit.ts'
import { fundCommand } from './fund.ts'
import { initCommand } from './init.ts'
import { summaryCommand } from './summary.ts'
import { withdrawCommand } from './withdraw.ts'

export const wallet = Cli.create('wallet', {
  description: 'Wallet setup and payment operations',
})

wallet.command('init', initCommand)
wallet.command('balance', balanceCommand)
wallet.command('fund', fundCommand)
wallet.command('deposit', depositCommand)
wallet.command('withdraw', withdrawCommand)
wallet.command('summary', summaryCommand)
wallet.command('costs', costsCommand)
