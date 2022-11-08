import { Argv } from 'yargs';
import { SigningStargateClient, StargateClient, GasPrice } from '@cosmjs/stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { stringToPath } from '@cosmjs/crypto';
import { Decimal } from '@cosmjs/math';

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
  const { amount } = argv;

  const wallet = await DirectSecp256k1HdWallet.fromMnemonic(argv.mnemonic, {
    hdPaths: [stringToPath(process.env.HD_PATH || "m/44'/118'/0'/0/0")],
    prefix: "orai"
  });
  const [firstAccount] = await wallet.getAccounts();

  const client = await SigningStargateClient.connectWithSigner(process.env.RPC_URL || 'https://testnet-rpc.orai.io', wallet, {
    gasPrice: new GasPrice(Decimal.fromUserInput('0', 6), "orai"),
    prefix: "orai"
  });

  console.log("sender address: ", firstAccount.address)

  const result = await client.sendTokens(firstAccount.address, to_address, [{ denom: "orai", amount: amount.toString() }], "auto");
  console.log("send result: ", result);
};
