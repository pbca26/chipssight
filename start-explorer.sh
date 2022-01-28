pkill node
BITCOIND_HOST=127.0.0.1 BITCOIND_PORT=57776 BITCOIND_USER=username BITCOIND_PASS=password BITCOIND_DATADIR=~/Users/yourusernamehere/Library/Application\ Support/Chips/ INSIGHT_NETWORK=livenet INSIGHT_PUBLIC_PATH=public INSIGHT_FORCE_RPC_SYNC=1 node node_modules/.bin/insight-bitcore-api >> nohup.out &
echo $!
