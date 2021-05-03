const fs = require('fs');

// Trusted nodes
const trustedNodeReward = {
  theFirmSamOraiD: {
    '0x326d516587ffe78053cd292FC2979406ad29bbDD': '1.582191781',
    '0xb86802bD7ECBBb89cD0c8e3bD941251D2255f367': '1.356164384',
    '0xD1F8155C20C375A2c2CbDF73860b1005c7cB2873': '0.3842465753',
    '0x8e053EfBC3dC7a413D93d7C2a208EBad11CC99F3': '0.2251232877',
    '0xfD2E1B72beC34c50127AD9305a5c6a9e4e830eE6': '0.2034246575',
    '0x8EA17df89317a6e8f9EDB6E97c9f71D764c55596': '0.1961917808',
    '0xCA1719ed13435c94166c977bCE8A2af8b55FAc95': '0.1699726027',
    '0x22A993fe21369ff202ad16b802D5612F221390B0': '0.1264578082',
    '0x3ec221A25B2dCf5634e4ff0aF3b07ea17AE8D002': '0.1175342466',
    '0x5cc7719857713709aD18a1b24fFb2478780127e2': '0.07164164384',
    '0x45Ada6503D4dFC97f70d00790eB03D1C460B943c': '0.05424657534',
    '0xDcf231d20d0061885DbAa310c9dB6F97A5bfD175': '0.04923057534',
    '0xbC59B8C76272F8b2AcC757197f7D1CC4e794f6CB': '0.04520547945',
    '0x896119d5aC0D99d993d920e1f211B7265867897F': '0.04520547945',
    '0x3f83E3b9Ec420c2C96E7DFdEAd87155ef7388923': '0.04520547945',
    '0xa6f2b3dF509383E78cd5a500676bEAA63968f8C1': '0.04520547945',
    '0xe0ffa08A1CEC12E1383953d779Fc93C226e80761': '0.04520547945',
    '0xb8c310afE97fE0f2bE75EE8635186bc065876AAE': '0.04520547945',
    '0xa34A4Aac320a184aB85D927923f4587Df6015dEC': '0.04520547945',
    '0x21797bBc5b88bB7F5b94DE98FaB058F5987Eb060': '0.02891161644',
    '0xb73285d60eF3Ff2ed3Abf3f5B0696796cE3f22Ac': '0.02712328767',
    '0xF6f91E675494135F952FCdDdee059C3b4249115b': '0.009945205479',
  },
  stakement: {
    '0x4ce7D126DCB606008A711B46c2d8DF50D88e4244': '1.595663014',
    '0x9C2c3b36FbCE13eFB602750eF3403291824fa338': '0.642369863',
    '0x88Ed47e5f2588Bc14dF150e49DcBc2aA615f746f': '0.5943978082',
    '0x969552848E3B0A3E839B2b298E39D71881FF5327': '0.4527419178',
    '0x60107E502b09EB7465552eb419Bd0938E0b6F0E0': '0.3092054795',
    '0x1C7631Dce2b7A555680d0541F6DFcCf48e5C6E60': '0.2260273973',
    '0x396318f99F636C83117ecf6a7670999581877025': '0.1717808219',
    '0xb97Ce8F7fa5864505a06777117dCE2b87337dF30': '0.1413023836',
    '0x3678F32bE7a9998c61EC05d940a9F3a0Cf70D4a8': '0.1345523014',
    '0xDf6403e36c70B0E5151272f776233b156c8E000E': '0.1283835616',
    '0x2E072495e0ab59bc0aD1060AE8dEec76bbc401a2': '0.0904109589',
    '0x9D4c1C518442aD9Eb23cb79A4792D508b49c81af': '0.0855079726',
    '0xCE12bD75441ed2c9A5b77a8A9580CE1E976A61DC': '0.06914358904',
    '0x7C040C78cadD3ABC3fDC11A5151a305577915C5e': '0.0441259726',
    '0x1274ABefc061bdFe37FE0cc28b26B7396C08b321': '0.01175342466',
    '0x5fbFe9fC869C4481fF7BD084ece84162e4210420': '0.01000306849',
    '0x5E79289C230b3A85D66d4bF47e100d3C5097F3dA': '0.003957287671',
    '0x337A8971C8ED58FA151190798572946B86c3f545': '0.001808219178',
  },
  banana: {
    '0x9eaA601b9Bdc72A89aa6fDe1FA07428612b555E4': '0.904109589',
    '0x5ff328b43F70281b568e8d1707B6F2712a48e6bf': '0.8136986301',
    '0x2Ad00ea39566481723Da076CA727095e5Ad26084': '0.05424657534',
    '0x218DfF3cD29502f48A8d9782579a4B6CaF109750': '0.0415890411',
    '0x0B4270B40820229fE10AFBe88bc714111ee9258E': '0.002603835616',
  },
  antorai: {
    '0x406cD9B0B56f3D9C9C70ca542F0968ddFbF93C4b': '0.6780821918',
    '0x8651402A4Ba0AEAEF80B6A37225666656A6a8e7F': '0.5734866575',
    '0x8F3354262f268C5897e447Bc2A53074080b8cb8d': '0.1103013699',
    '0xD891D5F41a45C86f0A70D273767B84B3befcDe95': '0.04520547945',
    '0x3a96d6BE1Af1236c7aC6a0D6d1322Ae01AF24c4d': '0.01602443836',
    '0xbDd9BE8555eA246BF2800C0abF2509426636E9D3': '0.01184383562',
    '0x743Ef32A0749192d5e2287ab30cc81e5db3E9697': '0.00904109589',
    '0x31EFE0Abf3840f78cfFf414b44A2846fe13e4688': '0.004723972603',
  },
  Serenity: {
    '0x9FAA0E6Ee06f89fb88E74DB5099006Ae1fA702c8': '1.190812685',
  },
  stakeWithKing: {
    '0x6948E44C75C22A3B362A4AfD949f0Ec90AC7318e': '0.6780821918',
    '0x9dDa85a68c84B04aC5328f454529cec5C3fd6aBD': '0.2264667945',
  },
  arneV: {
    '0x24BfA0B0780A39B4d08Dcf88736dcF5A79B7D267': '0.6780821918',
    '0x17C10b41F3706Ecd8CED74b9B498b50e74a103B9': '0.1323327123',
  },
  titan: {
    '0xFC13Da87690d167A3cEB9F07Af735AeD3D8ffBb2': '0.6780821918',
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

const trustedValidatorsRewardDays = 7;

fs.writeFileSync('output.txt', '');
for (const erc20 in input) {
  let trustedReward = '0';
  // sum up trusted reward
  for (const type in trustedNodeReward) {
    if (trustedNodeReward[type].hasOwnProperty(erc20)) {
      trustedReward = add(trustedReward, trustedNodeReward[type][erc20]);
    }
  }
  if (trustedReward === '0') {
    continue;
  }
  // write data
  const output = `${input[erc20]}\t${trustedReward}\t${trustedValidatorsRewardDays}\t\t${erc20}\n`;
  fs.appendFileSync('output.txt', output);
}
