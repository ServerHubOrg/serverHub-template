/**
 * Demo App Entry
 * 
 * ServerHub CLI, MIT License
 * ServerHub MVC version 1.6.0
 * Yang Zhongdong (yangzd1996@outlook.com)
 */
const serverhub = require('serverhub-mvc');

serverhub.Run({
    BaseDir: __dirname,
    Port: 8080,
    SocketOptions:{
        Port: 8080,
        ConnectionCallback:function(socket){
            
        }
    }
});