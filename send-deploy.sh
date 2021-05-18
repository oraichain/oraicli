#!/bin/bash

addrs=$(cat $HOME/HUST/20202/thesis/addrs.txt)
length=$(cat $HOME/HUST/20202/thesis/addr-length.txt)

val=10000000
sum=$(( $val*$length ))
num=""

for i in $(seq 1 $length); do
    num+=" $val"
done

yarn oraicli multisend $sum --receivers $addrs --receiver-amounts $num

bash ./deploy_ai_services.sh dsource_price_special testcase_price_special oscript_price_special '' '' '' 1 ../oraiwasm/package/price 0orai --gas-limit 4000000