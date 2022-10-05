import { Argv } from 'yargs';
import * as cosmwasm from '@cosmjs/cosmwasm-stargate';

export const instantiate = async (argv) => {
  const { gas, source, codeId, label } = argv;

  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(argv.mnemonic, {
    hdPaths: [stringToPath(process.env.HD_PATH || "m/44'/118'/0'/0/0")],
    prefix
  });
  const [firstAccount] = await wallet.getAccounts();
  const client = await cosmwasm.SigningCosmWasmClient.connectWithSigner(process.env.RPC_URL || 'https://testnet-rpc.orai.io', wallet, {
    gasPrice: new GasPrice(Decimal.fromUserInput('0', 6), denom),
    prefix
  });

  try {
    // next instantiate code
    const input = JSON.parse(argv.input);

    const res = await client.instantiate(firstAccount, codeId, input, label);

    console.log(res.contractAddress);
    return res.contractAddress;
  } catch (error) {
    console.log('error: ', error);
  }
};

export default async (yargs: Argv) => {
  const { argv } = yargs

    .option('code-id', {
      describe: 'the code id of the smart contract',
      type: 'number'
    })
    .option('label', {
      describe: 'the label of smart contract',
      type: 'string'
    })
    .option('fees', {
      describe: 'the transaction fees',
      type: 'string'
    })
    .option('amount', {
      type: 'string'
    });

  await instantiate(argv);
};
