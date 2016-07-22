#停止所有服务
pm2 stop all
#启动RPC服务
pm2 start ./RpcService/bin/RpcStartBoot -i max --node-args="--harmony "
#启动Http服务
pm2 start ./HttpService/bin/HttpStartBoot -i max --node-args="--use-strict --harmony"

#启动Web服务
pm2 start ./CoffeeShopH5/bin/www -i 1 --node-args="--use-strict --harmony"

pm2 list
