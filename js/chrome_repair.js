
import { exec } from "child_process";
import { existsSync } from "fs";
import path from "path";

// Execute system commands
const runCommand = (cmd) =>
  new Promise((resolve, reject) => {
    exec(cmd, { shell: true }, (error, stdout, stderr) => {
      if (error) reject(stderr || error);
      resolve(stdout);
    });
  });

// Path to Chrome installer and executable
const CHROME_INSTALLER_URL = "https://dl.google.com/chrome/install/latest/chrome_installer.exe";
const CHROME_INSTALL_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

// Check if Chrome is installed
const isChromeInstalled = () => existsSync(CHROME_INSTALL_PATH);

// Uninstall Chrome silently
const uninstallChrome = async () => {
  console.log("Uninstalling Chrome...");
  try {
    await runCommand(
      `wmic product where "name='Google Chrome'" call uninstall /nointeractive`
    );
    console.log("Chrome uninstalled.");
  } catch (err) {
    console.error("Failed to uninstall Chrome. It might not be installed.", err);
  }
};

// Download and install Chrome silently
const installChrome = async () => {
  console.log("Downloading and installing Chrome...");
  const installerPath = path.join(process.env.TEMP, "chrome_installer.exe");

  try {
    await runCommand(`powershell -Command "Invoke-WebRequest -Uri '${CHROME_INSTALLER_URL}' -OutFile '${installerPath}'"`);
    await runCommand(`start /wait "" "${installerPath}" /silent /install`);
    console.log("Chrome installed successfully.");
  } catch (err) {
    console.error("Failed to install Chrome:", err);
  }
};

// Check GAUC Assembly Versions
const checkGAUC = async () => {
  console.log("Checking GAUC assembly versions...");
  try {
    const output = await runCommand('wmic datafile where "name=\'C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe\'" get Version /value');
    const installedVersion = output.match(/Version=(.*)/)?.[1];

    if (!installedVersion) throw new Error("Failed to retrieve installed version.");

    const registryOutput = await runCommand('reg query "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\SideBySide\\Assemblies"');
    
    if (!registryOutput.includes(installedVersion)) {
      console.warn("GAUC version mismatch detected. Repairing...");
      await uninstallChrome();
      await installChrome();
    } else {
      console.log("GAUC versions match. No repair needed.");
    }
  } catch (err) {
    console.error("GAUC check failed:", err);
  }
};

// Initial check: If Chrome isn't installed, install it immediately
const initialCheck = async () => {
  console.log("\n===== Running Initial Chrome Check =====");
  if (!isChromeInstalled()) {
    console.log("Chrome is missing. Installing now...");
    await installChrome();
  } else {
    console.log("Chrome is already installed. Checking integrity...");
    await checkGAUC();
  }
  console.log("===== Initial Check Complete =====\n");
};

// Run repair every 1 hour
const ONE_HOUR = 60 * 60 * 1000;

console.log("Chrome Auto-Repair Script Started. Running every 1 hour...");
initialCheck(); // Run initial check first
setInterval(initialCheck, ONE_HOUR);
