import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import totalRewards from './get-total-rewards';
import dotenv from 'dotenv';
import readline from 'readline';
import fs from 'fs';
dotenv.config({ silent: process.env.NODE_ENV === 'production' });

declare var cosmos: Cosmos;

export default async (yargs: Argv) => {
    const { argv } = yargs
        .option('mnemonics', {
            describe: '',
            type: 'array',
            default: process.env.TEAM_STAKE_MNEMONIC.split(',')
        })
        .option('file', {
            describe: '',
            type: 'string'
        })
        .option('gas-limit', {
            describe: '',
            type: 'string',
            default: '200000'
        })
    const message = Cosmos.message;
    cosmos.setBech32MainPrefix('orai');
    const { mnemonics, file, gasLimit } = argv;

    const lineReader = readline.createInterface({
        input: fs.createReadStream(file)
    })
    // this list stores mapped data of ERC20 addressed to native addresses (competitions)
    let mappedAddrs = [];
    let erc20 = [];
    let native = [];
    let balances = [];

    lineReader.on('line', (line) => {
        // make sure the list is unique
        if (!mappedAddrs.includes(line)) mappedAddrs.push(line);
    }).on('close', async () => {
        console.log("size: ", mappedAddrs.length);
        // Do what you need to do with lines here
        for (let i = 0; i < mappedAddrs.length; i++) {
            let map = mappedAddrs[i];
            let mapArr = map.split(',');
            erc20.push(mapArr[0]);
            native.push(mapArr[1]);
            console.log("map arr 1: ", mapArr[1]);
            try {
                const data = await fetch(`${cosmos.url}/cosmos/bank/v1beta1/balances/${mapArr[1]}`).then((res) => res.json());
                let balance = parseInt(data.balances[0].amount);
                balances.push(balance);
            } catch (ex) {
                console.log(ex);
                continue;
            }
        }
        console.log("erc20: ", erc20.length);
        console.log("native: ", native.length);
        console.log("balances: ", balances.length);
        if (balances.length != native.length) {
            console.error("ERROR, BALANCE LENGTH DOES NOT EQUAL TO NATIVE ADDRESS LENGTH. THERE IS AT LEAST AN ERROR ADDRESS!");
        }
    });

};

// yarn oraicli distr send-rewards --rewardFile reward.xlsx
