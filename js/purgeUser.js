const readline = require('readline');
const { exec } = require('child_process');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Enter the AD username to target (case-sensitive): ', (username) => {
  const psScript = path.join(__dirname, 'purgeUser.ps1');

  // Execute PowerShell with passed username
  const command = `powershell.exe -ExecutionPolicy Bypass -File "${psScript}" -TargetUsername "${username}"`;

  console.log(`\n[+] Running cleanup for user "${username}"...\n`);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`[✖] Error: ${error.message}`);
    }
    if (stderr) {
      console.error(`[!] PowerShell stderr:\n${stderr}`);
    }
    if (stdout) {
      console.log(`[✔] Output:\n${stdout}`);
    }
    rl.close();
  });
});
