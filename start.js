const { spawn } = require('child_process');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(color, message) {
  console.log(`${color}${message}${colors.reset}`);
}

// Start MongoDB
function startMongoDB() {
  return new Promise((resolve, reject) => {
    const mongoProcess = spawn('node', ['start-mongo.js'], {
      stdio: 'pipe',
      shell: true
    });

    mongoProcess.stdout.on('data', (data) => {
      log(colors.cyan, `[MongoDB] ${data}`);
      if (data.includes('MongoDB is running')) {
        resolve();
      }
    });

    mongoProcess.stderr.on('data', (data) => {
      log(colors.yellow, `[MongoDB Error] ${data}`);
    });

    mongoProcess.on('error', (error) => {
      log(colors.yellow, `[MongoDB Error] ${error.message}`);
      reject(error);
    });
  });
}

// Start Backend
function startBackend() {
  return new Promise((resolve, reject) => {
    const backendProcess = spawn('npm', ['run', 'dev'], {
      cwd: path.join(__dirname, 'backend'),
      stdio: 'pipe',
      shell: true
    });

    backendProcess.stdout.on('data', (data) => {
      log(colors.blue, `[Backend] ${data}`);
      if (data.includes('Server running on port 5000')) {
        resolve();
      }
    });

    backendProcess.stderr.on('data', (data) => {
      log(colors.yellow, `[Backend Error] ${data}`);
    });

    backendProcess.on('error', (error) => {
      log(colors.yellow, `[Backend Error] ${error.message}`);
      reject(error);
    });
  });
}

// Start Frontend
function startFrontend() {
  return new Promise((resolve, reject) => {
    const frontendProcess = spawn('npm', ['run', 'dev:frontend'], {
      stdio: 'pipe',
      shell: true
    });

    frontendProcess.stdout.on('data', (data) => {
      log(colors.magenta, `[Frontend] ${data}`);
      if (data.includes('Local:')) {
        resolve();
      }
    });

    frontendProcess.stderr.on('data', (data) => {
      log(colors.yellow, `[Frontend Error] ${data}`);
    });

    frontendProcess.on('error', (error) => {
      log(colors.yellow, `[Frontend Error] ${error.message}`);
      reject(error);
    });
  });
}

// Handle process termination
function handleTermination() {
  process.on('SIGINT', () => {
    log(colors.yellow, '\nShutting down...');
    process.exit(0);
  });
}

async function main() {
  try {
    log(colors.bright, 'Starting TaleSpire application...\n');

    // Start MongoDB
    log(colors.cyan, 'Starting MongoDB...');
    await startMongoDB();

    // Start Backend
    log(colors.blue, 'Starting Backend...');
    await startBackend();

    // Start Frontend
    log(colors.magenta, 'Starting Frontend...');
    await startFrontend();

    // Handle termination
    handleTermination();

    log(colors.green, '\nTaleSpire is running!');
    log(colors.green, 'Frontend: http://localhost:5173');
    log(colors.green, 'Backend: http://localhost:5000');
    log(colors.green, 'WebSocket: ws://localhost:1234');
    log(colors.green, '\nPress Ctrl+C to stop all services.');
  } catch (error) {
    log(colors.yellow, `\nError starting TaleSpire: ${error.message}`);
    process.exit(1);
  }
}

main(); 