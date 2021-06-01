import { Argv } from 'yargs';

export default async (yargs: Argv) => {
  yargs
    .command(
      'get-total-rewards',
      'Get total rewards of all genesis and trusted validators',
      require('./cmd/get-total-rewards').default
    )
    .command(
      'send-rewards',
      'Send rewards to all genesis and trusted validators',
      require('./cmd/send-rewards').default
    )
    .command(
      'cal-balances',
      'Calculate balances for a list of ERC20 addresses',
      require('./cmd/cal-balances').default
    )
    .command(
      'unique',
      'Get unique mapping addresses',
      require('./cmd/unique-mapping').default
    );
};
