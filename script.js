import { LogsFetcher, LogFilter } from './logs-fetcher';
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
    .option('maxRetries', {
        type: 'number',
        describe: 'Maximum number of retry attempts',
        default: 3,
    })
    .option('timeout', {
        type: 'number',
        describe: 'Request timeout in milliseconds',
        default: 30000,
    })
    .option('retryDelay', {
        type: 'number',
        describe: 'Delay between retries in milliseconds',
        default: 1000,
    })
    .help()
    .argv;

async function main() {
    const {
        rpcUrl,
        fromBlock,
        toBlock,
        address,
        topics,
        method,
        maxRetries,
        timeout,
        retryDelay,
    } = argv;

    try {
        // Initialize the LogsFetcher with configuration
        const fetcher = new LogsFetcher(rpcUrl, {
            maxRetries,
            timeout,
            retryDelay,
        });

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
        
        const logs = await fetcher.fetchLogs(filter, method);
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
