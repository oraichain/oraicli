const egcd = (a, b) => {
  if (a < b) [a, b] = [b, a];
  let s = 0,
    old_s = 1;
  let t = 1,
    old_t = 0;
  let r = b,
    old_r = a;
  while (r != 0) {
    let q = Math.floor(old_r / r);
    [r, old_r] = [old_r - q * r, r];
    [s, old_s] = [old_s - q * s, s];
    [t, old_t] = [old_t - q * t, t];
  }
  console.log('Bezout coef: ', old_s, old_t);
  console.log('GCD: ', old_r);
  console.log('Quot by GCD: ', s, t);
};

console.log(egcd(29, 91));

const mul_mod = (num, mod, time) => {
  let reminder = num;
  for (let i = 1; i < time; ++i) {
    reminder *= num;
    reminder %= mod;
  }
  return reminder;
};

const plain = 67;
const encrypted = mul_mod(plain, 91, 5);
const decrypted = mul_mod(encrypted, 91, 29);

console.log({ plain, encrypted, decrypted });
