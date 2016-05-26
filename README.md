SinoDNS
------
node.js version of [ChinaDNS](https://github.com/shadowsocks/ChinaDNS)

### Installation

```
npm -g install sinodns
```

### Usage

```
sinodns [port] [address]
```
The command above will run a dns relay listening on address:port, 
forwarding requests to 180.76.76.76(Baidu DNS) and 8.8.8.8(Google DNS).

By default, the address is 127.0.0.1:53

SinoDNS works better with cache. (e.g. dnsmasq)

### Procedure

Here's how it works:

 * Forward requests to both upstream server (Baidu's and Google's)
 * if there's no A record answered, use Baidu's answer
 * else if A record's address is in China, use Baidu's answer
 * else use Google's answer
