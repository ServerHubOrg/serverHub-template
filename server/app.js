/**
 * Demo App Entry
 * 
 * ServerHub Template, MIT License
 * ServerHub MVC version 1.6.2
 * Yang Zhongdong (yangzd1996@outlook.com)
 */
const serverhub = require('serverhub-mvc');
const socket = require('./lib/socket');

serverhub.Run({
    BaseDir: __dirname,
    Port: 8080,
    SocketOptions: {
        Port: 8080,
        ConnectionCallback: socket
    }
});