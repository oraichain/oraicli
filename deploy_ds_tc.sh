#!/bin/bash

CHAIN_ID=${CHAIN_ID:-Oraichain}
TYPE=${1:-datasource}
IFS=',' read -r -a SCRIPT <<< "$2"
SCRIPT=${SCRIPT:-classification}
INPUT=${3:-''}
NONCE=${4:-1}
DIR_PATH=${5:-$PWD}
FEES=${6:-0}

echo "scripts: ${SCRIPT[@]}"
echo "dir path: $DIR_PATH"

# deploy smart contract data source and create data source
for i in "${SCRIPT[@]}"
do
    yarn oraicli wasm deploy $DIR_PATH/$i/artifacts/$i.wasm --label "$i $NONCE" --input $INPUT --fees $FEES --chain-id $CHAIN_ID --gas 40000000

    # check if the data source exists or not
    yarn oraicli provider get-script $TYPE $i
    description="production $i"
    address=$(cat $PWD/address.txt)
    echo "address: $address"
    echo "description: $description"
    echo "$TYPE file: $i"

    # if the file is not empty, then the data source does not exist. We create new
    if [ -s $PWD/is_exist.txt ]
    then
        yarn oraicli provider set-$TYPE $i "production $i" $address --fees $FEES --chain-id $CHAIN_ID --gas 40000000
    else
        # if it exists already, we update the contract
        yarn oraicli provider edit-$TYPE $i $i "production $i" $address --fees $FEES --chain-id $CHAIN_ID --gas 40000000
    fi
    sleep 6
done

# ./deploy_ds_tc.sh datasource classification '' 17 ../oraiwasm/package/cv 5000orai
# ./deploy_ds_tc.sh testcase classification_testcase '' 17 ../oraiwasm/package/cv 5000orai