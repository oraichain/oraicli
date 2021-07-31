import { Argv } from 'yargs';

export default async (yargs: Argv) => {
    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    const list = await fetch(`https://api.scan.orai.io/v1/txs-account/orai17n62uccsxaryx3lnwdk4pxxvh09rsdm570zavk?limit=100&page_id=1`).then(data => data.json());
    const mappedList = list.data.map(tx => ({ address: tx.messages[0].from_address, pubKey: tx.memo }));
    const finalList = mappedList.filter(element => base64regex.test(element.pubKey));
    const popTemp = finalList.pop();
    const finalListUnique = [...new Set(finalList)];
    console.log("final list: ", JSON.stringify(finalListUnique));
    console.log("length: ", finalListUnique.length);
};