const fetch = require('node-fetch');

const BASE_URL = "https://lcd.orai.io";
const VAL_VOTING_POWER = 1000;
const DAYS_IN_YEARS = 365.2425;

const fetchData = async (endpoint) => {
    return fetch(`${BASE_URL}/${endpoint}`).then(data => data.json());
}

const start = async () => {
    const totalSupply = (await fetchData("cosmos/bank/v1beta1/supply")).supply[0].amount;
    console.log('total supply: ', totalSupply);
    // const inflationRate = (await fetchData("cosmos/mint/v1beta1/inflation")).inflation;
    const inflationRate = 0.0136
    console.log("inflation rate: ", inflationRate);
    const { community_tax, base_proposer_reward, bonus_proposer_reward } = (await fetchData("cosmos/distribution/v1beta1/params")).params;
    const voteMultiplier = 1 - parseFloat(community_tax) - (parseFloat(base_proposer_reward) + parseFloat(bonus_proposer_reward));
    console.log("vote multiplier: ", voteMultiplier);
    const { blocks_per_year } = (await fetchData("cosmos/mint/v1beta1/params")).params;
    console.log("blocks per year: ", blocks_per_year);
    // const { block_time } = (await fetch("https://api.scan.orai.io/v1/status").then(data => data.json()));
    const block_time = 5.9
    console.log("block time: ", block_time);
    const { bonded_tokens } = (await fetchData("cosmos/staking/v1beta1/pool")).pool;
    console.log("bonded tokens: ", bonded_tokens);

    const blockProvision = inflationRate * totalSupply / blocks_per_year;
    console.log("block provision: ", blockProvision);

    const valRewardPerBlock = blockProvision * VAL_VOTING_POWER / bonded_tokens * voteMultiplier;
    console.log("val reward per block: ", valRewardPerBlock);

    let validatorList = (await fetchData("cosmos/staking/v1beta1/validators")).validators;
    validatorList = validatorList.map(val => val.operator_address);
    for (let operatorAddr of validatorList) {
        console.log("val operator addr: ", operatorAddr);
        const { rate } = (await fetchData(`cosmos/staking/v1beta1/validators/${operatorAddr}`)).validator.commission.commission_rates;

        const delegatorsRewardPerBlock = valRewardPerBlock * (1 - rate);
        console.log("delegator rewards per block: ", delegatorsRewardPerBlock);
        const numBlocksPerDay = 60 / block_time * 60 * 24;
        console.log("num blocks per day: ", numBlocksPerDay);
        const delegatorsRewardPerDay = delegatorsRewardPerBlock * numBlocksPerDay;
        console.log("delegators reward per day: ", delegatorsRewardPerDay);
        const apr = delegatorsRewardPerDay * DAYS_IN_YEARS / VAL_VOTING_POWER * 100;

        console.log("apr: ", apr);
    }
}

start();