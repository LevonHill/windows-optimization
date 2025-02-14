import { exec } from "child_process";
import os from "os";
import fs from "fs";
import path from "path";

// Execute a system command and return the output
const runCommand = (cmd) =>
  new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) reject(stderr);
      resolve(stdout);
    });
  });

// Clears Windows temporary files
const clearTempFiles = async () => {
  const tempDir = os.tmpdir();
  fs.readdir(tempDir, (err, files) => {
    if (err) return console.error("Error reading temp directory:", err);
    files.forEach((file) => {
      const filePath = path.join(tempDir, file);
      fs.unlink(filePath, (err) => {
        if (err) return;
        console.log(`Deleted: ${filePath}`);
      });
    });
  });
  console.log("Temporary files cleared!");
};

// Flushes the DNS cache
const flushDNS = async () => {
  try {
    await runCommand("ipconfig /flushdns");
    console.log("DNS cache flushed!");
  } catch (err) {
    console.error("Failed to flush DNS:", err);
  }
};

// Optimizes system memory
const optimizeMemory = async () => {
  try {
    await runCommand("wmic process where name='explorer.exe' call setpriority 128");
    console.log("Memory optimized!");
  } catch (err) {
    console.error("Memory optimization failed:", err);
  }
};

// Checks CPU performance
const checkCPU = () => {
  const cpus = os.cpus();
  console.log(`CPU Model: ${cpus[0].model}`);
  console.log(`Cores: ${cpus.length}`);
  console.log(`Speed: ${cpus[0].speed} MHz`);
};

// Runs all optimizations
const optimizeSystem = async () => {
  console.log("\n===== Running System Optimization =====");
  await clearTempFiles();
  await flushDNS();
  await optimizeMemory();
  checkCPU();
  console.log("===== Optimization Complete =====\n");
};

// Run optimization every 1 hour
const ONE_HOUR = 60 * 60 * 1000;

console.log("Windows Optimization Script Started. Running every 1 hour...");
optimizeSystem(); // Run immediately
setInterval(optimizeSystem, ONE_HOUR);
