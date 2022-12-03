import { Argv } from 'yargs';
import bech32 from 'bech32';
import Cosmos from '@oraichain/cosmosjs';
import { SigningStargateClient } from '@cosmjs/stargate';
import { DirectSecp256k1HdWallet } from '@cosmjs/proto-signing';
import { Any } from "cosmjs-types/google/protobuf/any";
import { MsgSubmitProposal } from 'cosmjs-types/cosmos/gov/v1beta1/tx';
import { TextProposal } from 'cosmjs-types/cosmos/gov/v1beta1/gov';
import { UpdateAdminProposal } from 'cosmjs-types/cosmwasm/wasm/v1/proposal';

export default async (yargs: Argv) => {
  const { argv } = yargs.positional('oldName', {
    describe: 'the old oscript name',
    type: 'string'
  });

  const signer = await DirectSecp256k1HdWallet.fromMnemonic(argv.mnemonic, { 'prefix': 'orai' });
  const account = (await signer.getAccounts())[0]

  const client = await SigningStargateClient.connectWithSigner(argv.rpc_url, signer, { 'prefix': "orai", 'gasPrice': "0orai" });

  const initial_deposit = [{ denom: "orai", amount: "10000000" }]
  const message = {
    typeUrl: "/cosmos.gov.v1beta1.MsgSubmitProposal",
    value: MsgSubmitProposal.fromPartial({
      content: Any.fromPartial({
        typeUrl: "/cosmwasm.wasm.v1.UpdateAdminProposal",
        value: UpdateAdminProposal.encode({ 'description': 'foo', 'title': 'bar', newAdmin: "orai14n3tx8s5ftzhlxvq0w5962v60vd82h30rha573", "contract": "orai1hzdlry39ydm0wqflglslcu26v6dnxzk0u9fp42" }).finish()
      }),
      proposer: account.address,
      initialDeposit: initial_deposit,
    })
  }
  console.log("message: ", message)
  const result = await client.signAndBroadcast(account.address, [message], 'auto');
  console.log("result: ", result);
}

// example: yarn oraicli proposals create-proposal-cosmjs
