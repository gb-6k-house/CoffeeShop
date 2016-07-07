#停止所有服务
pm2 stop all
#启动RPC服务
pm2 start ./RpcService/bin/RpcStartBoot -i max
#启动Http服务
pm2 start ./HttpService/bin/HttpStartBoot -i max
pm2 list
