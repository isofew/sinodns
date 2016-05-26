#! /usr/bin/env node

var fs = require('fs');

var num = (ip) => {
  var l = ip.split('.');
  return (l[0] << 24 >>> 0) + (l[1] << 16) + (l[2] << 8) + (l[3] << 0);
};

var match = (ip, net) => {
  return ((ip ^ net[0]) >>> 0) < (1 << (32 - net[1]) >>> 0);
};

var chnroute = fs.readFileSync(__dirname + '/chnroute.txt').toString().split('\n');

chnroute.forEach((net, i) => {
  net = net.split('/');
  chnroute[i] = [num(net[0]), net[1]];
});

var inChina = (ip) => {
  ip = num(ip);
  for (var i = 0; i < chnroute.length; ++i)
    if (match(ip, chnroute[i]))
      return true;
  return false;
};

var Packet = require('native-dns-packet');
var dgram = require('dgram');

var baiduDNS = '180.76.76.76';
var googleDNS = '8.8.8.8';

var socket = dgram.createSocket('udp4');

socket.on('message', (req, client) => {
  var start = Date.now();
  var sockeT = dgram.createSocket('udp4');
  sockeT.on('message', (res, server) => {
    var answer = Packet.parse(res).answer;
    var send = () => {
      socket.send(res, client.port, client.address);
      sockeT.close();
    };
    var recordA = false;
    for(var i = 0; i < answer.length; ++i) {
      if (answer[i].type === 1) {
        recordA = true;
        if (inChina(answer[i].address) === true || server.address === googleDNS) {
          send();
          break;
        }
      }
    }
    if (!recordA) send();
  });
  sockeT.send(req, 53, baiduDNS);
  sockeT.send(req, 53, googleDNS);
  setTimeout(() => {try{sockeT.close()}catch(e){}}, 5000);
});

socket.bind(process.argv[2] || 53, process.argv[3] || '127.0.0.1');
