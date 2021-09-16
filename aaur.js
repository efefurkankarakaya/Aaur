const fs = require("fs");
const path = require("path");
const cp = require("child_process");
const { once } = require("events");

const destination = "/home/efk/Downloads/aur";
const packages = fs.readdirSync(destination);

async function updateAll() {
  for (let i = 0; i < packages.length; i++) {
    let packageName = packages[i];
    let packagePath = path.join(destination, packageName);
    console.log(packageName, packagePath);
    await getLatestUpdates(packageName, packagePath);
    await installUpdates(packageName, packagePath);
  }
}

async function getLatestUpdates(packageName, packagePath) {
  const message = "Package " + packageName + " is being updated";
  console.log(message);

  const executionConfig = {
    cwd: packagePath,
  };
  await executeCommand("git pull", executionConfig);
}

async function installUpdates(packageName, packagePath) {
  const message = "Package " + packageName + " is being installed";
  console.log(message);

  const executionConfig = {
    cwd: packagePath,
  };
  await executeCommand("yes | makepkg -si", executionConfig);
}

async function executeCommand(command, config) {
  console.log(config);
  const child = cp.exec(command, config);

  child.stdout.on("data", (data) => {
    const output = data.toString();
    process.stdout.write(output);
  });
  child.stderr.on("data", (data) => {
    const output = data.toString();
    process.stdout.write(output);
  });
  child.on("error", (err) => {
    process.stdout.write(err);
  });
  child.on("exit", (code) => {
    const exitCode = code;
    process.stdout.write("Exit code: " + exitCode + "\n");
  });

  await once(child, "exit");
}

updateAll();
