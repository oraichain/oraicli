import dotenv from 'dotenv';

dotenv.config({ path: __dirname + '/../.env' });
const { exec } = require('child_process');

export const executeCMD = (command) => {
  exec(command, (error, stdout, stderr) => {
    if (stdout) {
      console.log(stdout);
      return;
    }
    if (error) {
      console.log(`error: ${error}`);
      return;
    }
    if (stderr) {
      console.log(`stderr: ${stderr}`);
      return;
    }
  });
};
