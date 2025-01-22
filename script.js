// script.js

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
        type: 'string',
        describe: 'JSON array of topics to filter logs (optional)',
    })
    .option('method', {
        type: 'string',
        describe: "Log-fetching method ('eth_getLogs' or 'sei_getLogs')",
        choices: ['eth_getLogs', 'sei_getLogs'],
        default: 'eth_getLogs',
    })
    .help()
    .argv;

async function main() {
    const { rpcUrl, fromBlock, toBlock, address, topics, method } = argv;

    try {
        // Build the filter object
        const filter = {
            fromBlock,
            toBlock,
        };

        if (address) filter.address = address;
        if (topics) {
            // Parse topics if passed as a JSON string
            try {
                filter.topics = JSON.parse(topics);
            } catch (err) {
                throw new Error(`Invalid topics format. Must be a JSON array: ${topics}`);
            }
        }

        console.log('Filter before normalization:', JSON.stringify(filter, null, 2));

        const standardizedLogs = await fetchAndStandardizeLogs(filter, rpcUrl, method);
        console.log('Standardized Logs:', JSON.stringify(standardizedLogs, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
