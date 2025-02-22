import { fetchLogs, LogFilter } from './sei-logs-wrapper.js';
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

    // Normalize block numbers (convert decimal to hex when necessary)
    const normalizeBlock = (block: string) => block.startsWith('0x') ? block : `0x${parseInt(block, 10).toString(16)}`;

    try {
        const parsedTopics = topics ? (() => {
            try {
                return JSON.parse(topics);
            } catch {
                console.error(`Invalid topics format. Must be a JSON array: ${topics}`);
                process.exit(1);
            }
        })() : undefined;

        // Build the filter object
        const filter: LogFilter = {
            fromBlock: normalizeBlock(fromBlock),
            toBlock: normalizeBlock(toBlock),
            ...(address && { address }),
            ...(parsedTopics && { topics: parsedTopics })
        };

        console.log('Filter before processing:', JSON.stringify(filter, null, 2));

        const logs = await fetchLogs(filter, rpcUrl, method);
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
