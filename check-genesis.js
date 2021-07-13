const fs = require('fs');

// Genesis nodes
const genesisNodeReward = {
  theFirmCommunityCookieFactor: {
    '0x8ae1874f2F9f26Eeecf1855aDEC19F530e3CdEaa': '0.0009863013699',
    '0x8EA17df89317a6e8f9EDB6E97c9f71D764c55596': '3.193643836',
    '0xE6bc94BcB63EE208fd6899498A91418f9E9F5548': '3.156164384',
    '0x5fd9C4368ee7E8fc79e48fBa390c148fd16453Ee': '3.106388712',
    '0x326d516587ffe78053cd292FC2979406ad29bbDD': '2.169863014',
    '0x3b7a5Aee7B593b7f2E3DB0dfeA3FFc734eC10438': '1.973589041',
    '0x748EC2E752b038e5F3e69489833BD585EF49A92a': '1.600767123',
    '0x9eaA601b9Bdc72A89aa6fDe1FA07428612b555E4': '1.578082192',
    '0x1386D4EA93EB572Ae99b497735Eb7D94B00c1050': '1.479452055',
    '0xCa83A74291e78B534b9EF1D0047a663942645741': '0.9863013699',
    '0x69D3277B0f2dbBd97f666cfDE812e347ED26cc9a': '0.9863013699',
    '0xBd2b3570E7FABD201eDeDe7c7d41F2831cE3652A': '0.8225753425',
    '0x5cc7719857713709aD18a1b24fFb2478780127e2': '0.6826704658',
    '0xa91B82084b37b01a7B5FD60160EeF7b04302517f': '0.530630137',
    '0x03214Abc9effA59a61649A5fAc320A3cCbF98B79': '0.5030136986',
    '0x969552848E3B0A3E839B2b298E39D71881FF5327': '0.4931506849',
    '0x38c556dEb5E0717a47ac621a5891252F50d9C87c': '0.4438356164',
    '0xb97Ce8F7fa5864505a06777117dCE2b87337dF30': '0.3945205479',
    '0xd439ACcb5c6B1f93f19A2e80F408c76b6579D07F': '0.2860273973',
    '0xA88bd387006B0fc452FD7934fb9Faa8E7A1aA8D9': '0.2357260274',
    '0xcFdc2bfD2c59499300f4f7372cD9B1E9AE4cd075': '0.2051506849',
    '0xc95D683346D394Cda349f142871510DbE09EadeD': '0.1538630137',
    '0xDf6403e36c70B0E5151272f776233b156c8E000E': '0.1479452055',
    '0x37B76b23703bAca73F964Ca6c2f8bD6018f3dD11': '0.1479452055',
    '0x4acbA0876Cb0D9Dd8992ABC743333E686b4EF71A': '0.1351834521',
    '0x964DcAbeb569dAfc8391A28c9E87F6e293fCB114': '0.1075068493',
    '0x35A1be7e44ae96034b5B7726a27131Ba31BB7F41': '0.09863013699',
    '0xb909Cc59527BB84C4129A18DfB17F1f95c2f9540': '0.09863013699',
    '0x69Db3A04391eA1EAAcAa340Fcf4364791AAbC443': '0.07726191781',
    '0x198ca1beaCF70b82c4e6dE21E8Cb7b6dA6D8477A': '0.05476536986',
    '0x0D205efD9f21B59B3608013252EDEF572F9f234C': '0.03977457534',
    '0x35c096fBBeeF7cd42b79E5f8E3fB7709eb4B8248': '0.03798443836',
    '0x94dd84e72f56FBD3678a0D5264C7acD00D9971aC': '0.03464876712',
    '0x6154ee6FaED512921A15c27b9290219dFA422a79': '0.03442191781',
    '0xE6EAc0f55E3F5eCEFAe3877015fb8631C95a3a45': '0.03400372603',
    '0x45Ada6503D4dFC97f70d00790eB03D1C460B943c': '0.02860273973',
    '0x826E88287aF71CD1B89e16Edf979B7B997DA7F83': '0.02741424658',
    '0x1274ABefc061bdFe37FE0cc28b26B7396C08b321': '0.02672186301',
    '0xdb7c3efC25AB85de2460938f20d39b23E94Fc804': '0.02231408219',
    '0x91968E4bde01E1dD5d595AE4d5CAF306797b6d87': '0.02128339726',
    '0x3ec221A25B2dCf5634e4ff0aF3b07ea17AE8D002': '0.01984832877',
    '0x5e1BECfEe78D1b69eEAE019D6a083bf993f6Cc3d': '0.01102487671',
    '0x9693200746C056Bb3E548B6A25c5Fb1d5db2d874': '0.01026246575',
    '0xD1F8155C20C375A2c2CbDF73860b1005c7cB2873': '0.008876712329',
    '0xE29304F861d38Cee951770Cb5a23AC3CceD3FBaE': '0.008521643836',
    '0xAe8Da4A9792503f1eC97eD035e35133A9E65a61f': '0.007890410959',
    '0x19e923a5C8E0661259402bf398ed7668908226d0': '0.004931506849',
    '0x08276C87936B7509012f98CB482DA92754E66eC2': '0.00295890411',
    '0x8499184b624264F199Ba90fbF0e894C379B89C78': '0.002436164384',
    '0xe48C53F8b02Ac43B48dBa3FabeC0E2a8E36B3C0A': '0.00199430137',
    '0xc8b42A0391DD92B8b8Ea08CbAadecfAa9A1B46C2': '0.00197260274',
    '0x1B62243A1ff8D645A61011d4c4DD33eB295419f4': '0.001379835616',
    '0x337A8971C8ED58FA151190798572946B86c3f545': '0.0009863013699',
    '0x2371983011533f7d88efc27e87b2982A863B2724': '0.000009863013699',
    '0x1De8EE475989A81a353ec6e4ea5a5C0aC60642d0': '0',
    '0x6B26d01bC7E0e92bb849Ee34d9BbCD4e03a8361F': '0',
  },
  quantumSamOrai: {
    '0xD891D5F41a45C86f0A70D273767B84B3befcDe95': '4.931506849',
    '0xE6bc94BcB63EE208fd6899498A91418f9E9F5548': '3.945205479',
    '0xCa83A74291e78B534b9EF1D0047a663942645741': '2.95890411',
    '0x288DfFBF05906381E0b96C2FB8c1961e16851ac7': '1.578082192',
    '0xc42A0e898c38E073137ccAeCb9D49748DCcF5cb5': '1.010958904',
    '0xbf5d3Fc4300Eae8730feC11B46376592099F4C3B': '0.9093688767',
    '0x969552848E3B0A3E839B2b298E39D71881FF5327': '0.4931506849',
    '0x26655D43E3DFA4f7ef6Ee94cef70Eb64632E6D59': '0.3510433973',
    '0x9da72BE487b964d2afC12d937614e13EcB6F8eAA': '0.311069589',
    '0xb0487bdc8BE66895Eb1508062c73d14Bb18A88Ca': '0.1430136986',
    '0xb73285d60eF3Ff2ed3Abf3f5B0696796cE3f22Ac': '0.1084931507',
    '0xC77c6eAB64FB3986CEEae9a76081Dd2097EDcd0c': '0.1042707945',
    '0x04d50dae507E89347DD768Ee5a78cE656f85a704': '0.1027321644',
    '0xFdbaE271a4cBD081794FD87489c84f841852e0Bc': '0.1005435616',
    '0x396318f99F636C83117ecf6a7670999581877025': '0.09961643836',
    '0x8499184b624264F199Ba90fbF0e894C379B89C78': '0.09617917808',
    '0x93020e26083769eFA969e6CFfec7b0Bac67C378e': '0.05067517808',
    '0xb685D2A0068456b142a8269FfCbf19b1E18A5bD5': '0.03747945205',
    '0x7434fa91Ff058bA409074b1EaEF03F8741C5Af59': '0.03149852055',
    '0x3e4A503ea62ff44c9611c04Cf2A46AC8eFf3d053': '0.03141468493',
    '0x3e0A48fa9ED56cD4fe6303206D033865b2AFbc1D': '0.02944306849',
    '0x446A56E78de87E8D36D5f4Adf783b4fd7BAfAc12': '0.02857512329',
    '0x2B8E14ab9cff40321338E34b94ecA23870850F5C': '0.02680668493',
    '0xfb1F2B7D351A5594449bE4DaFBFe3247AEfCBcE3': '0.02353117808',
    '0x91968E4bde01E1dD5d595AE4d5CAF306797b6d87': '0.02081884932',
    '0x9b45c38b011798ACA9dFd842a824324970b40518': '0.01564767123',
    '0xdb7c3efC25AB85de2460938f20d39b23E94Fc804': '0.007277917808',
    '0x0cBe393a9F3cE40575939103d849587D30e5357D': '0.002998356164',
    '0x262b61F985C7911aD45aaf9a09e39a69208F0B69': '0',
    '0xE9320314D109d41380CBc06BAFddd834db9ae71D': '0',
  },
  oraiVanguard: {
    '0x5Ba42Ff329eA75510430b60B6DBCd7986D1a8e20': '2.658148274',
    '0x68bC0327FC91e859dA05Eb6ba6E7a48dEc566796': '1.333798027',
    '0x9B3fBCC8890851540797F3838B6B4b990474eEf6': '0.8679452055',
    '0xD1F8155C20C375A2c2CbDF73860b1005c7cB2873': '0.7397358904',
    '0x91e3423fB03C32ca2cb86f3246c6f57555E3aA5E': '0.4941369863',
    '0x77B07A432AE7A959fe9A90bB5B11C6ae9984Bcd7': '0.4931506849',
    '0x778B8183aF396c434C0EEe6858837B5128CE9b58': '0.4931506849',
    '0x2aE9Ada4a84b8B1c31639546f3FFf91eb786647A': '0.4931506849',
    '0x8d6762cE0Ae6f1e6135c62955CC00c5c4Ee06C56': '0.4103013699',
    '0x9da72BE487b964d2afC12d937614e13EcB6F8eAA': '0.3106849315',
    '0x66D45a58CF49f054938c0a288793c420Fe98bB04': '0.2584109589',
    '0x62a1ea11117e69F73e2e61B7388865b76b0514D0': '0.2475616438',
    '0xD891D5F41a45C86f0A70D273767B84B3befcDe95': '0.2465753425',
    '0x93ca1E3d7b3706836F9D29D44e91698E4C5Dd55A': '0.2169863014',
    '0x79CfA7F84Ef2865B759DE90B8D63ea974A7393ad': '0.1505204384',
    '0xf4245b57FCE109E7f9acB5a1739bC0Ce12A60A07': '0.1488644384',
    '0xE622863579ed6b32c1996B4623E8B7D2E30EFCFa': '0.1441972603',
    '0xB3426078E2BC85eDDeA342f2a5Dcf0b24e70bF4b': '0.1035616438',
    '0xF0Ba2Acba805B4AF89A9E0848A28DCD510b89569': '0.09863013699',
    '0x1De8EE475989A81a353ec6e4ea5a5C0aC60642d0': '0.08975342466',
    '0x35A1be7e44ae96034b5B7726a27131Ba31BB7F41': '0.06410958904',
    '0x9fC03C5Be75EF984dE7C2DB5dE864333d3E8c1Ce': '0.03541216438',
    '0x5091081516C8695Dfa1BfdE3d7b33480C2cB2FcA': '0.0295890411',
    '0xF1ceBC5F4569984c5C82a35AC722b4b5225f6beF': '0.0197260274',
    '0xf46FCE50b99BdFB62e89eF2AF09A800cFb87Ea42': '0.009863013699',
    '0x45Ada6503D4dFC97f70d00790eB03D1C460B943c': '0.009863013699',
    '0xee1c67b28Ee0552844cF23d7B7C00aCf32363879': '0.009863013699',
    '0x0B4270B40820229fE10AFBe88bc714111ee9258E': '0.004458082192',
    '0x262b61F985C7911aD45aaf9a09e39a69208F0B69': '0',
  },
}

/**
 * Add big number
 * @param f {string}
 * @param s {string}
 * @returns {string}
 */
function addBig(f, s) {
  if (f.length < s.length) {
    [f, s] = [s, f];
  }
  let rs = [];
  let carryOut = 0, i;
  const temp1 = f.split('').reverse();
  const temp2 = s.split('').reverse();
  for (i = 0; i < temp1.length && i < temp2.length; ++i) {
    const sum = parseInt(temp1[i]) + parseInt(temp2[i]) + carryOut;
    if (sum > 9) {
      carryOut = 1;
    } else {
      carryOut = 0;
    }
    rs.push(sum % 10);
  }

  if (i === temp2.length) {
    if (carryOut === 1) {
      for (; i < temp1.length; ++i) {
        const sum = parseInt(temp1[i]) + carryOut;
        if (sum > 9) {
          carryOut = 1;
        } else {
          carryOut = 0;
        }
        rs.push(sum % 10);
      }
      if (carryOut === 1) {
        rs.push(1);
      }
    } else {
      rs = rs.concat(temp1.slice(i));
    }
  }
  return rs.reverse().join('');
}

/**
 * Add two number
 * @param a {string} number with format xxx.yyy
 * @param b {string} number with format xxx.yyy
 * @return {string}
 */
const add = (a, b) => {

  const getDebt = numb => {
    const dotIndex = numb.indexOf('.');
    if (dotIndex !== -1) {
      return numb.substring(dotIndex + 1).length;
    }
    return 0;
  };

  const debtA = getDebt(a);
  const debtB = getDebt(b);
  const debt = Math.max(debtA, debtB);
  for (let i = 0; i < debt - debtA; i++) {
    a += '0';
  }
  for (let i = 0; i < debt - debtB; i++) {
    b += '0';
  }
  a = a.replace('.', '');
  b = b.replace('.', '');

  const tempResult = addBig(a, b);


  // pay debt
  const integerPart = tempResult.substring(0, tempResult.length - debt);
  const fractionPart = tempResult.substring(tempResult.length - debt);
  return (integerPart + '.' + fractionPart).replace(/(\.)?0+$/, '');
};
console.log(add('0', '0'));
const input1 = fs.readFileSync('./mapping.txt', 'utf8').split('\n').reduce((o, prev) => {
  const [erc20Addr, nativeAddr] = prev.trim().split(',');
  o[erc20Addr] = nativeAddr;
  return o;
}, {});

// const input2 = fs.readFileSync('./input2.txt', 'utf8').split('\n').reduce((o, prev) => {
//   const [erc20Addr, nativeAddr] = prev.trim().split(',');
//   o[erc20Addr] = nativeAddr;
//   return o;
// }, {});

const input = Object.assign(input1);

const genesisValidatorsRewardDays = 7;

fs.writeFileSync('output.txt', '');
for (const erc20 in input) {
  let genesisReward = '0';
  // sum up genesis reward;
  for (const type in genesisNodeReward) {
    if (genesisNodeReward[type].hasOwnProperty(erc20)) {
      genesisReward = add(genesisReward, genesisNodeReward[type][erc20]);
    }
  }
  if (genesisReward === '0') {
    continue;
  }
  // write data
  const output = `${input[erc20]}\t${genesisReward}\t${genesisValidatorsRewardDays}\t\t${erc20}\n`;
  fs.appendFileSync('output.txt', output);
}
