import { Argv } from 'yargs';
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { assertIsBroadcastTxSuccess, SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import { stringToPath } from "@cosmjs/crypto";
import * as cosmwasm from '@cosmjs/cosmwasm-stargate';
import { Decimal } from "@cosmjs/math";
import { GasPrice } from '@cosmjs/stargate';
import fs from 'fs';

export default async (yargs: Argv) => {
    const { argv } = yargs
        .positional('address', {
            describe: 'the smart contract address',
            type: 'string'
        })
        .option('amount', {
            type: 'string'
        });
    const [address] = argv._.slice(-1);
    const client = await cosmwasm.SigningCosmWasmClient.connect(process.env.RPC_URL || "https://testnet-rpc.orai.io");
    const input = JSON.parse(argv.input);
    const queryResult = await client.queryContractSmart(address, input);
    console.log("query result: ", queryResult);
};
