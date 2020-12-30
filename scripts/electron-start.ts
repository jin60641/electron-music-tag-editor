const net = require('net');
const port = process.env.PORT ? (process.env.PORT - 100) : 3000;

process.env.ELECTRON_START_URL = `http://localhost:${port}`;

const socket = new net.Socket();

const tryConnection = () => socket.connect({ port: port }, () => {});

tryConnection();

socket.on('error', (error) => {
  setTimeout(tryConnection, 1000);
});

socket.on('connect', (error) => {
  console.log('Starting electron...');
  const exec = require('child_process').exec;
  exec('yarn electron');
});
