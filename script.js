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
        type: 'array',
        describe: 'Array of topics to filter logs (optional)',
    })
    .option('method', {
        type: 'string',
        describe: "Log-fetching method ('eth_getLogs' or 'sei_getLogs')",
        choices: ['eth_getLogs', 'sei_getLogs'],
        default: 'eth_getLogs',
    })
    .help()
    .argv;

function toHexWithPrefix(value) {
    // Ensure it's a valid decimal or already a hex string with 0x prefix
    if (typeof value === 'string' && value.startsWith('0x')) {
        return value;
    }

    const decimalValue = parseInt(value, 10);
    if (isNaN(decimalValue)) {
        throw new Error(`Invalid decimal value: ${value}`);
    }

    return `0x${decimalValue.toString(16)}`;
}

function toDecimal(value) {
    // Ensure it's a valid hex string or already a decimal number
    if (typeof value === 'string' && value.startsWith('0x')) {
        const decimalValue = parseInt(value, 16);
        if (isNaN(decimalValue)) {
            throw new Error(`Invalid hex value: ${value}`);
        }
        return decimalValue;
    }

    const decimalValue = parseInt(value, 10);
    if (isNaN(decimalValue)) {
        throw new Error(`Invalid decimal value: ${value}`);
    }

    return decimalValue;
}

async function main() {
    const { rpcUrl, fromBlock, toBlock, address, topics, method } = argv;

    try {
        // Convert inputs to ensure consistency
        const filter = {
            fromBlock: toHexWithPrefix(fromBlock),
            toBlock: toHexWithPrefix(toBlock),
        };

        if (address) filter.address = address;
        if (topics) filter.topics = topics;

        console.log(`Filter in hex: ${JSON.stringify(filter)}`);
        console.log(`Converted fromBlock (decimal): ${toDecimal(fromBlock)}`);
        console.log(`Converted toBlock (decimal): ${toDecimal(toBlock)}`);

        const standardizedLogs = await fetchAndStandardizeLogs(filter, rpcUrl, method);
        console.log('Standardized Logs:', JSON.stringify(standardizedLogs, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
