import { Argv } from 'yargs';
import Cosmos from '@oraichain/cosmosjs';
import totalRewards from './get-total-rewards';
import dotenv from 'dotenv';
import readline from 'readline';
import fs from 'fs';
dotenv.config({ silent: process.env.NODE_ENV === 'production' });

const mapping = [
    '0x005F63B3E13eC62c4D732B593240B6ca7aA22502,orai1v9adr6yykhjqnfve2m4v5w9u7hdgtd2m2y7y5j',
    '0x03214Abc9effA59a61649A5fAc320A3cCbF98B79,orai10vgrfc9mqsl3jak28m6yuau5len679z2kwm476',
    '0x1274ABefc061bdFe37FE0cc28b26B7396C08b321,orai10h7xlyk2sevyu9mzysdmnw4sqz0g0uktvye5sy',
    '0x1386D4EA93EB572Ae99b497735Eb7D94B00c1050,orai123l5vryspwwumpyw28w8a7pm42fgnr5798uuyp',
    '0x17C10b41F3706Ecd8CED74b9B498b50e74a103B9,orai1nqakz4kqdfh93pluyjtcrxceth2jalf2zlkgx9',
    '0x198ca1beaCF70b82c4e6dE21E8Cb7b6dA6D8477A,orai1dl8rq7ag2m5m9jft6gs6thydk3g92e78k66atc',
    '0x1B62243A1ff8D645A61011d4c4DD33eB295419f4,orai1ndjua4r2fuqc5kcjm0eh8gzqfdx2p4kw5qpwvl',
    '0x1C7631Dce2b7A555680d0541F6DFcCf48e5C6E60,orai1vj6sqfevzx9w4uq8ctt09cjjcxdhvufulc6nvm',
    '0x1DDDE4797A96284370861bE13e65E2162bE0b6d3,orai1mxy4jk84n37a3u7ysn8rm9rq52wn0ahe7mc2fq',
    '0x1De8EE475989A81a353ec6e4ea5a5C0aC60642d0,orai1pq5zfpp6pxclar4r57rwlfpr3l9kxfwqd3k9va',
    '0x218DfF3cD29502f48A8d9782579a4B6CaF109750,orai1zekham3c66mrq8ml9z85mvz0u5y4mqsg9z6dka',
    '0x2371983011533f7d88efc27e87b2982A863B2724,orai1p4v2y5hcy98mlrvattplxhhsf2at3me6my084l',
    '0x24BfA0B0780A39B4d08Dcf88736dcF5A79B7D267,orai17a8cjfd3yztf2clhecp6096394veg99eky0h3r',
    '0x26655D43E3DFA4f7ef6Ee94cef70Eb64632E6D59,orai1n90jn5m80lfdrexy52y89r6mym45w3qp5a0jht',
    '0x2aE9Ada4a84b8B1c31639546f3FFf91eb786647A,orai1zryrxjx5ny54ea3raylx7znh2kl5aajzkvfe3g',
    '0x2B8E14ab9cff40321338E34b94ecA23870850F5C,orai19ec904men4adk9zdwzm2xvh7v4tkz87kfzr595',
    '0x31EFE0Abf3840f78cfFf414b44A2846fe13e4688,orai13e25zx9au9vzch5g2dk8uevc0ytr2jdz5jxp62',
    '0x326d516587ffe78053cd292FC2979406ad29bbDD,orai1qdcln9krzqwywxru8jx6yq2qs9cjqcvv7wfdjv',
    '0x35c096fBBeeF7cd42b79E5f8E3fB7709eb4B8248,orai1jupa6rpzn0nmd86dyeu0q8wagf7c9pafrl3uj2',
    '0x37B76b23703bAca73F964Ca6c2f8bD6018f3dD11,orai1lmg6204f0xx6ux6cdyjkdeld68gp6rp47u95hc',
    '0x396318f99F636C83117ecf6a7670999581877025,orai1ggguyr9989aqq8j8p4lclfjgjlhd49zmczq3s2',
    '0x3a96d6BE1Af1236c7aC6a0D6d1322Ae01AF24c4d,orai12nu8dw65ra0gkw74rjfsj4a5syqzttppvsqdjp',
    '0x3b7a5Aee7B593b7f2E3DB0dfeA3FFc734eC10438,orai10dzr3yks2jrtgqjnpt6hdgf73mnset024k2lzy',
    '0x3e4A503ea62ff44c9611c04Cf2A46AC8eFf3d053,orai1e2zymyc24knrzkmha9hfl87y45a2nzrcpzuykk',
    '0x3f83E3b9Ec420c2C96E7DFdEAd87155ef7388923,orai1846aj6k4r3vpzd003jtrzfaclavj03x9damy58',
    '0x406cD9B0B56f3D9C9C70ca542F0968ddFbF93C4b,orai13ckyvg0ah9vuujtd49yner2ky92lej6n8ch2et',
    '0x40935725af606420502C8C8ef5CeEA1d92B4293e,orai1xv4vwg7tx9aqnjn0cp2xzxvm82hadgx84yl3wy',
    '0x43C146f15F353A7204eAAA61B7128bbc38A74405,orai1gg2k3lgq02sdmh3s9x93ghhced0rqvrw2qqsxs',
    '0x45Ada6503D4dFC97f70d00790eB03D1C460B943c,orai1wvu8zmxp2spyqg55l7n5jgxt7fjjtenm596ugl',
    '0x4ce7D126DCB606008A711B46c2d8DF50D88e4244,orai1cp0jml5fxkdvmajcwvkue9d0sym6s0vqkwuwu0',
    '0x5Ba42Ff329eA75510430b60B6DBCd7986D1a8e20,orai1p926xnuet2xd7rajsahsghzeg8sg0tp2s0trp9',
    '0x5cc7719857713709aD18a1b24fFb2478780127e2,orai12ld4aac0v5hj89fk0kg70qmcqtty6fe6x3s0xs',
    '0x5fbFe9fC869C4481fF7BD084ece84162e4210420,orai16fewhw2gj2095wpuhwx5sjdw5qnv2xjmskempq',
    '0x5ff328b43F70281b568e8d1707B6F2712a48e6bf,orai14nz2pqskfv9kcez8u0a9gnnsgwjerzqxg3gsyr',
    '0x6154ee6FaED512921A15c27b9290219dFA422a79,orai166a2grd5lf7txnjulwdv2mlz7e87vlwcvvw9qe',
    '0x68bC0327FC91e859dA05Eb6ba6E7a48dEc566796,orai1dj23nvr025skecc4hsj6m66em88vgd46pvzju2',
    '0x6948E44C75C22A3B362A4AfD949f0Ec90AC7318e,orai1h89umsrsstyeuet8kllwvf2tp630n77ad3rl4q',
    '0x6b680D3dd3646AA5C786F2e9194154C360906706,orai1p4v2y5hcy98mlrvattplxhhsf2at3me6my084e',
    '0x748EC2E752b038e5F3e69489833BD585EF49A92a,orai1umc78rw2wawzxf3kueva2tl8u6297vt7g78rcs',
    '0x778B8183aF396c434C0EEe6858837B5128CE9b58,orai14c9nlav4s68fc20gjhzjtrvfs7nn53jaf8luqk',
    '0x79CfA7F84Ef2865B759DE90B8D63ea974A7393ad,orai1hr45wfrtp03rmj5hszuvn7rh0fd0sj3hv0j5an',
    '0x7C040C78cadD3ABC3fDC11A5151a305577915C5e,orai165558z7ue9frsvzh8t0wg574wfl74l3m5mng0u',
    '0x7C6f4Ecf06100d0BD99a2844c2414E290858bCed,orai1n5k582ym6dzj32wdjtth5n29xu6xlecgf83nr7',
    '0x8499184b624264F199Ba90fbF0e894C379B89C78,orai1gfvtvle9ajd75ru8p3xcwktvpnfumz6lmgkg6y',
    '0x88Ed47e5f2588Bc14dF150e49DcBc2aA615f746f,orai1wmulxmxxnpvcm9yecm5988xkkdesa45yu3r836',
    '0x896119d5aC0D99d993d920e1f211B7265867897F,orai1qcm9ha6yz9mqtg8vkzr5k29ddaz8drwnre4l3j',
    '0x8B78dEb50AFA8ACB09f5A0b28a43b7F4c2f4F176,orai146tlt2sfuls7ku05msf7sa6v8saxauh2zenwlk',
    '0x8EA17df89317a6e8f9EDB6E97c9f71D764c55596,orai1kf2q94j8597tl20vccxck5e6k829399aky586h',
    '0x91968E4bde01E1dD5d595AE4d5CAF306797b6d87,orai10re2yuc5ymale0y9thxex3yh09c2h5p8kxfatw',
    '0x91e3423fB03C32ca2cb86f3246c6f57555E3aA5E,orai1zryrxjx5ny54ea3raylx7znh2kl5aajzkvfe3g',
    '0x93020e26083769eFA969e6CFfec7b0Bac67C378e,orai169uthckq3tpaatygy9ujt0pmdjkzgj7j6j9c60',
    '0x93ca1E3d7b3706836F9D29D44e91698E4C5Dd55A,orai19vanptcjahh5as5p9y7cdgfh60hxdh2wvrqyrq',
    '0x964DcAbeb569dAfc8391A28c9E87F6e293fCB114,orai1y4gyee7xznrud7zp677xhkn4s348cuzmwq6wy3',
    '0x969552848E3B0A3E839B2b298E39D71881FF5327,orai1s92spydjg22qlskp6uensnme83rwvja2jy96cq',
    '0x9b45c38b011798ACA9dFd842a824324970b40518,orai1ekgpgp4az9kj48qw0td46s9x966udz60gx6wkg',
    '0x9C2c3b36FbCE13eFB602750eF3403291824fa338,orai12lnr3wu3qfaesyah8arypkmp85eew7wccy79zd',
    '0x9D4c1C518442aD9Eb23cb79A4792D508b49c81af,orai1zkv4jmecazwn3cslqee28fjsw20aegslycqt8y',
    '0x9da72BE487b964d2afC12d937614e13EcB6F8eAA,orai1264r8ep9sjueym63ua2nwmfjsvmtas7s9ugpgx',
    '0x9dDa85a68c84B04aC5328f454529cec5C3fd6aBD,orai1vzy7m9cfeu5qrh7lmp8h9w840fauhc3mvnl8z4',
    '0x9eaA601b9Bdc72A89aa6fDe1FA07428612b555E4,orai14nz2pqskfv9kcez8u0a9gnnsgwjerzqxg3gsyr',
    '0x9FAA0E6Ee06f89fb88E74DB5099006Ae1fA702c8,orai1r5mmcqyspyj3sm9997gpv8kv6j6809m2gc2vma',
    '0x9fC03C5Be75EF984dE7C2DB5dE864333d3E8c1Ce,orai1e84mc03cv5kpda6udwxmh66dttdqng4y24v5q8',
    '0xa6f2b3dF509383E78cd5a500676bEAA63968f8C1,orai1f9qwys0406ztqdfr202zc7d5w3vttz634k9qnp',
    '0xb0487bdc8BE66895Eb1508062c73d14Bb18A88Ca,orai1su6gcna2x3a7cfsy4sadul57yd6knp2mdyta0f',
    '0xB3426078E2BC85eDDeA342f2a5Dcf0b24e70bF4b,orai1ncnyhjzh8gu7wsrjrj9eux68fku9lrm9qfe4vt',
    '0xb685D2A0068456b142a8269FfCbf19b1E18A5bD5,orai1pchmykccl6hwzg277syw5uwactwa82s9eh2y9r',
    '0xb73285d60eF3Ff2ed3Abf3f5B0696796cE3f22Ac,orai1vnurryf5y66fm9kawvqfgcdz9gz2ml0appksj4',
    '0xb86802bD7ECBBb89cD0c8e3bD941251D2255f367,orai17hyskxyhguaz8cks6puv6ycv77krxjhtlwkq56',
    '0xb8c310afE97fE0f2bE75EE8635186bc065876AAE,orai1asqdsjy4w0kv32thhysegnju98tu8kkhfga9t9',
    '0xb97Ce8F7fa5864505a06777117dCE2b87337dF30,orai1glqskm275ckm9qqae7tamw8z0g57fq82xg9jh3',
    '0xbC59B8C76272F8b2AcC757197f7D1CC4e794f6CB,orai19qgjq232n07kapp23erx8zpk9gycy58g30uu4d',
    '0xBd2b3570E7FABD201eDeDe7c7d41F2831cE3652A,orai1jkvtkngp5mtre4xp2gcwhgss5x8ejut5ysw2cs',
    '0xC77c6eAB64FB3986CEEae9a76081Dd2097EDcd0c,orai1e99xcz3s6hxxs5qrnxrp9pleg85sjga59hchf7',
    '0xc95D683346D394Cda349f142871510DbE09EadeD,orai1q5p7rgcnfmmfnehxeh0cprxetfqvy7xkp3png4',
    '0xCA1719ed13435c94166c977bCE8A2af8b55FAc95,orai12ply4cy0h2l5g4ahrzfz68yugl7jw6nmyrxnn4',
    '0xCE12bD75441ed2c9A5b77a8A9580CE1E976A61DC,orai1l3vq8vnntj6dar9prff99ckywsuzw0wq798gjz',
    '0xD1F8155C20C375A2c2CbDF73860b1005c7cB2873,orai1y4gyee7xznrud7zp677xhkn4s348cuzmwq6wy3',
    '0xD74fB38FE1C31469729C35c644390Fb2fbb5c9f4,orai1p926xnuet2xd7rajsahsghzeg8sg0tp2s0trp9',
    '0xD891D5F41a45C86f0A70D273767B84B3befcDe95,orai1znlxtk32ya99tsvgmclqk0q56a86606lehlklp',
    '0xdb7c3efC25AB85de2460938f20d39b23E94Fc804,orai1ggnsa5vcx2zzqm8l789e5yrdryr4h6u8qdskyc',
    '0xe0ffa08A1CEC12E1383953d779Fc93C226e80761,orai1cennq0ajntdmal5j7nnv3glzzqm0pyhln7rnln',
    '0xe48C53F8b02Ac43B48dBa3FabeC0E2a8E36B3C0A,orai1q74c8ruzpfm5qect0289e62dqvva37uqt2vpwx',
    '0xE622863579ed6b32c1996B4623E8B7D2E30EFCFa,orai14txsqhwerfddnw3ehqhhfcjey3l9lfq3lchj5f',
    '0xE6bc94BcB63EE208fd6899498A91418f9E9F5548,orai19qv8e6n9n6yqal3jyk7fj8p3wywxqjsjccve8p',
    '0xF6f91E675494135F952FCdDdee059C3b4249115b,orai1eucdl2fr0eydt0gc07m3c2m0gaqhxn5ttnma5x',
    '0xfb1F2B7D351A5594449bE4DaFBFe3247AEfCBcE3,orai1n5zq0uvsk7xvs2nvd2z9alw3yld9u9f3pe5fxn',
    '0xFC13Da87690d167A3cEB9F07Af735AeD3D8ffBb2,orai1u2344d8jwtsx5as7u5jw7vel28puh34qh82d3j',
    '0xfD2E1B72beC34c50127AD9305a5c6a9e4e830eE6,orai1j2ankz5s9nd7tnqjw864rz0aq9d8glm98cgynj',
    '0x77B07A432AE7A959fe9A90bB5B11C6ae9984Bcd7,orai1u2344d8jwtsx5as7u5jw7vel28puh34qh82d3j',
    '0x9693200746C056Bb3E548B6A25c5Fb1d5db2d874,orai1ld7cv7qj5td5a3y29c082c9lgw60kh6k042jym',
    '0xa34A4Aac320a184aB85D927923f4587Df6015dEC,orai19cxtwhlnfpk7vtrcn0fdj5rcka3ww09r64qyga',
    '0x5E79289C230b3A85D66d4bF47e100d3C5097F3dA,orai18a62pymppe67ya8ex6gvneqnuupr28fg64wmnn',
    '0x8F3354262f268C5897e447Bc2A53074080b8cb8d,orai13pjjdm2agu70zndzszhf5v7jweackj08fjkr03',
    '0x69Db3A04391eA1EAAcAa340Fcf4364791AAbC443,orai1eh55a89alp8srhs5pz4csddqaujlj58ywtja33'
];

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
        mappedAddrs.push(line);
    }).on('close', async () => {
        // console.log("mapped address: ", mappedAddrs);
        let intersection = mapping.filter(x => !mappedAddrs.includes(x));
        // console.log("mapped: ", mappedAddrs[0]);
        // console.log("mapping: ", mapping[0]);
        // console.log("equal?: ", mappedAddrs[0] === mapping[0])
        // // Do what you need to do with lines here
        for (let i = 0; i < mapping.length; i++) {
            let map = mapping[i];
            let mapArr = map.split(',');
            console.log(mapArr[1]);
            // console.log(mapArr[1]);
            erc20.push(mapArr[0]);
            native.push(mapArr[1]);
        }
        // console.log("erc20: ", erc20);
        // console.log("native: ", native);
        // console.log("mapping list: ", mappedAddrs);
        // console.log("intersection: ", intersection);
    });

};

// yarn oraicli distr send-rewards --rewardFile reward.xlsx
