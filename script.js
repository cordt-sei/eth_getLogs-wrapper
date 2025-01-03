import { fetchAndStandardizeLogs } from './wrapper.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

const argv = yargs(hideBin(process.argv))
    .option('rpcUrl', {
        type: 'string',
        describe: 'RPC URL for the EVM endpoint',
        demandOption: true,
    })
    .option('fromBlock', {
        type: 'string',
        describe: 'The starting block number (hex or decimal)',
        demandOption: true,
    })
    .option('toBlock', {
        type: 'string',
        describe: 'The ending block number (hex or decimal)',
        demandOption: true,
    })
    .option('address', {
        type: 'string',
        describe: 'Contract address to filter logs (optional)',
    })
    .option('topics', {
        type: 'array',
        describe: 'Array of topics to filter logs (optional)',
    })
    .help()
    .argv;

async function main() {
    const { rpcUrl, fromBlock, toBlock, address, topics } = argv;

    const filter = {
        fromBlock,
        toBlock,
    };

    if (address) filter.address = address;
    if (topics) filter.topics = topics;

    try {
        const standardizedLogs = await fetchAndStandardizeLogs(filter, rpcUrl);
        console.log('Standardized Logs:', JSON.stringify(standardizedLogs, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
