import { Argv } from 'yargs';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { SigningStargateClient, StargateClient } from '@cosmjs/stargate';
import { stringToPath } from '@cosmjs/crypto';

export default async (yargs: Argv) => {
  const { argv } = yargs
    .positional('address', {
      describe: 'the orai address',
      type: 'string',
      default: 'orai1u4jjn7adh46gmtnf2a9tsc2g9nm489d7nuhv8n'
    })
    .option('amount', {
      default: '1',
      type: 'string'
    });
  const [to_address] = argv._.slice(-1);
  const denom = process.env.DENOM || 'orai';
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(argv.mnemonic, {
    hdPaths: [stringToPath("m/44'/118'/0'/0/0")],
    prefix: denom
  });
  const [firstAccount] = await wallet.getAccounts();

  const client = await SigningStargateClient.connectWithSigner(process.env.RPC_URL, wallet);
  const amount = { denom: 'orai', amount: argv.amount };
  console.log('amount: ', amount);
  const result = await client.sendTokens(firstAccount.address, to_address, [amount], { amount: [{ amount: String(0), denom }], gas: '2000000' }, 'Have fun with your orai coins');
  console.log('result: ', result);
};
