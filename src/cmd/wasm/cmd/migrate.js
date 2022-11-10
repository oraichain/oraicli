import { Argv } from 'yargs';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
import { Decimal } from '@cosmjs/math';
import { GasPrice } from '@cosmjs/stargate';

export const migrate = async (argv) => {
  const [address] = argv._.slice(-1);
  const { codeId } = argv;
  const prefix = process.env.PREFIX || 'orai';
  const denom = process.env.DENOM || 'orai';
  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(argv.mnemonic, {
    prefix
  });
  const [firstAccount] = await wallet.getAccounts();
  const client = await cosmwasm.SigningCosmWasmClient.connectWithSigner(process.env.RPC_URL, wallet, {
    gasPrice: new GasPrice(Decimal.fromUserInput('0', 6), denom),
    prefix
  });

  try {
    // next instantiate code
    const input = JSON.parse(argv.input);

    const res = await client.migrate(firstAccount.address, address, codeId, input, 'auto');

    console.log(res);
  } catch (error) {
    console.log('error: ', error);
  }
};

export default async (yargs: Argv) => {
  const { argv } = yargs
    .positional('address', {
      describe: 'the smart contract address',
      type: 'string'
    })
    .option('code-id', {
      describe: 'the code id of the smart contract',
      type: 'number'
    });
  await migrate(argv);
};
