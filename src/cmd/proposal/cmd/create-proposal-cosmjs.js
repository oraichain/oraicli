import { Argv } from 'yargs';
import bech32 from 'bech32';
import Cosmos from '@oraichain/cosmosjs';
import { SigningStargateClient } from '@cosmjs/stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { Any } from "cosmjs-types/google/protobuf/any";
import { MsgSubmitProposal } from 'cosmjs-types/cosmos/gov/v1beta1/tx';
import { TextProposal } from 'cosmjs-types/cosmos/gov/v1beta1/gov';

export default async (yargs: Argv) => {
  const { argv } = yargs.positional('oldName', {
    describe: 'the old oscript name',
    type: 'string'
  });

  const signer = await DirectSecp256k1HdWallet.fromMnemonic(argv.mnemonic, { 'prefix': 'orai' });
  const account = (await signer.getAccounts())[0]

  const client = await SigningStargateClient.connectWithSigner(argv.rpc_url, signer, { 'prefix': "orai", 'gasPrice': "0orai" });

  const initial_deposit = [{ denom: "orai", amount: "1" }]
  const message = {
    typeUrl: "/cosmos.gov.v1beta1.MsgSubmitProposal",
    value: MsgSubmitProposal.fromPartial({
      content: Any.fromPartial({
        typeUrl: "/cosmos.gov.v1beta1.TextProposal",
        value: TextProposal.encode({ 'description': 'foo', 'title': 'bar' }).finish()
      }),
      proposer: account.address,
      initialDeposit: initial_deposit,
    })
  }
  console.log("message: ", message)
  const result = await client.signAndBroadcast(account.address, [message], 'auto');
  console.log("result: ", result);
}

// example: yarn oraicli proposals create-proposal
