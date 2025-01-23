import { fetchAndStandardizeLogs, LogFilter } from './sei-logs-wrapper.js';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

interface Arguments {
    rpcUrl: string;
    fromBlock: string;
    toBlock: string;
    address?: string;
    topics?: string;
    method: 'eth_getLogs' | 'sei_getLogs';
}

const argv = yargs(hideBin(process.argv))
    .options({
        rpcUrl: {
            type: 'string',
            describe: 'RPC URL for the EVM endpoint',
            demandOption: true,
        },
        fromBlock: {
            type: 'string',
            describe: 'The starting block number (hex or decimal)',
            demandOption: true,
        },
        toBlock: {
            type: 'string',
            describe: 'The ending block number (hex or decimal)',
            demandOption: true,
        },
        address: {
            type: 'string',
            describe: 'Contract address to filter logs (optional)',
        },
        topics: {
            type: 'string',
            describe: 'JSON array of topics to filter logs (optional)',
        },
        method: {
            type: 'string',
            describe: "Log-fetching method ('eth_getLogs' or 'sei_getLogs')",
            choices: ['eth_getLogs', 'sei_getLogs'] as const,
            default: 'eth_getLogs',
        },
    })
    .help()
    .parseSync() as Arguments;

async function main() {
    const {
        rpcUrl,
        fromBlock,
        toBlock,
        address,
        topics,
        method,
    } = argv;

    try {
        // Build the filter object
        const filter: LogFilter = {
            fromBlock,
            toBlock,
        };

        if (address) {
            filter.address = address;
        }

        if (topics) {
            try {
                filter.topics = JSON.parse(topics);
            } catch (err) {
                throw new Error(`Invalid topics format. Must be a JSON array: ${topics}`);
            }
        }

        console.log('Filter before processing:', JSON.stringify(filter, null, 2));
        
        const logs = await fetchAndStandardizeLogs(filter, rpcUrl, method);
        console.log('Fetched Logs:', JSON.stringify(logs, null, 2));
    } catch (error) {
        if (error instanceof Error) {
            console.error('Error:', error.message);
        } else {
            console.error('Unknown error occurred');
        }
        process.exit(1);
    }
}

main();