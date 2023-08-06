const config = require('./config');
const chalkTable = require('chalk-table');
const { Web3 } = require('web3');

const GAS_THRESHOLD = config.GAS_THRESHOLD;
const VALUE_THRESHOLD = config.VALUE_THRESHOLD;
const web3 = new Web3(config.REMOTE_PROVIDER);
const web3Local = new Web3(config.LOCAL_PROVIDER);
const fullTable = [];

async function subscribe(provider, providerName) {
  const chalk = (await import('chalk')).default;
  const options = {
    leftPad: 2,
    columns: [
      {field: 'transaction', name: chalk.cyan('Transaction')},
      {field: 'provider', name: chalk.cyan('Provider')}
    ]
  };
  const optionsPaired = {
    leftPad: 2,
    columns: [
      {field: 'transaction', name: chalk.cyan('Transaction')},
      {field: 'timestamp', name: chalk.cyan('Time difference (seconds)')}
    ]
  };
  const subscription = await provider.eth.subscribe('pendingTransactions', (error, result) => {
      console.log('transaction');
      if (!error) {
        console.log(result);
      } else {
        console.error(error);
      }
  });
  subscription.on('data', async function(txHash){
    try {
      const transaction = await provider.eth.getTransaction(txHash);
      const timestamp = new Date();
      const styledTxHash = transaction.gasPrice >= GAS_THRESHOLD || transaction.value >= VALUE_THRESHOLD ?
        chalk.bgGreen(txHash) : txHash;
      const pairedTransaction = fullTable.find(tx => tx.transaction === styledTxHash);
      if (pairedTransaction) {
        pairedTransaction.timestamp = (timestamp - pairedTransaction.recordedAt) / 1000 + ` (${providerName} first)`;
        pairedTransaction.modifiedAt = timestamp;
      } else {
        if (fullTable.length > (4 * 10 ** 6)) {
          fullTable.shift();
        }
        fullTable.push({
          transaction: styledTxHash,
          provider: providerName,
          recordedAt: timestamp
        });
      }
      const transactionsTable = fullTable.slice(-1 * config.REGULAR_TABLE_SIZE);
      const pairedRecords = chalkTable(optionsPaired,
        fullTable.filter(tx => tx.timestamp).sort((a, b) => a.modifiedAt - b.modifiedAt).slice(-1 * config.PAIRED_TABLE_SIZE));
      const styledTable = chalkTable(options, transactionsTable);
      console.clear();
      console.log(`Last ${config.REGULAR_TABLE_SIZE} transactions from mempool.`);
      console.table(styledTable);
      console.log(`Last ${config.PAIRED_TABLE_SIZE} mempool transactions recorded by both providers.`);
      console.table(pairedRecords);
    } catch(e) {
      //Transaction not found
      if (e.code !== 430) {
        console.log(e.code);
      }
    }
  });
}
subscribe(web3, 'remote');
subscribe(web3Local, 'local');