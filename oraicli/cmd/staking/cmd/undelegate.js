import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import bech32 from 'bech32';

declare var cosmos: Cosmos;

export default async (yargs: Argv) => {
    const { argv } = yargs;
    const message = Cosmos.message;
    const listMnemonics = process.env.LIST_SEND_MNEMONIC.split(",");
    for (let mnemonic of listMnemonics) {
        const childKey = cosmos.getChildKey(mnemonic);
        const delegator = cosmos.getAddress(mnemonic);
        const delegations = (await cosmos.get(`/cosmos/staking/v1beta1/delegations/${delegator}`)).delegation_responses;
        for (let delegationObj of delegations) {
            const { delegation } = delegationObj;
            // if (delegation.validator_address === "oraivaloper14vcw5qk0tdvknpa38wz46js5g7vrvut8ku5kaa" || delegation.validator_address === "oraivaloper1rqq57xt5r5pnuguffcrltnvkul7n0jdxxdgey0" || delegation.validator_address === "oraivaloper1mxqeldsxg60t2y6gngpdm5jf3k96dnju5el96f") {
            //     continue;
            // }
            const msgDelegate = new message.cosmos.staking.v1beta1.MsgUndelegate({
                delegator_address: delegator,
                validator_address: delegation.validator_address,
                amount: { denom: cosmos.bech32MainPrefix, amount: delegationObj.balance.amount }
            });

            const msgDelegateAny = new message.google.protobuf.Any({
                type_url: '/cosmos.staking.v1beta1.MsgUndelegate',
                value: message.cosmos.staking.v1beta1.MsgUndelegate.encode(msgDelegate).finish()
            });

            const txBody = new message.cosmos.tx.v1beta1.TxBody({
                messages: [msgDelegateAny],
                memo: ''
            });

            try {
                const response = await cosmos.submit(childKey, txBody, 'BROADCAST_MODE_BLOCK', isNaN(argv.fees) ? 0 : parseInt(argv.fees));
                console.log(response);
            } catch (ex) {
                console.log(ex);
            }
        }
    }
};

// yarn oraicli staking delegate --address oraivaloper1x6xl5kls4xkmkv3rst5tndmxtqt0u8dx7e4hn0 --amount 1 --chain-id private-Oraichain
