import axios from 'axios';

/**
 * Converts block number to a hexadecimal string with 0x prefix.
 * Supports both decimal and hexadecimal input formats.
 * @param {string|number} value - The block number (decimal or hex).
 * @returns {string} - The normalized hexadecimal string.
 */
function toHexWithPrefix(value) {
    if (typeof value === 'string' && value.startsWith('0x')) {
        return value;
    }
    const decimalValue = parseInt(value, 10);
    if (isNaN(decimalValue)) {
        throw new Error(`Invalid block number: ${value}`);
    }
    return `0x${decimalValue.toString(16)}`;
}

/**
 * Recursive function to handle log fetching with block range splitting.
 * @param {Object} filter - The filter object for querying logs.
 * @param {string} rpcUrl - The RPC endpoint URL.
 * @param {string} method - The log-fetching method (e.g., eth_getLogs, sei_getLogs).
 * @returns {Promise<Object[]>} - Standardized logs with globally unique `logIndex` per block.
 */
async function fetchLogsRecursive(filter, rpcUrl, method) {
    // Normalize block numbers in the filter
    filter.fromBlock = toHexWithPrefix(filter.fromBlock);
    filter.toBlock = toHexWithPrefix(filter.toBlock);

    try {
        const response = await axios.post(rpcUrl, {
            jsonrpc: '2.0',
            method,
            params: [filter],
            id: 'fetchLogs',
        });

        if (response.data.error) {
            throw new Error(`RPC Error: ${response.data.error.message}`);
        }

        const logs = response.data.result;

        // If logs are exactly 10,000, split the range and fetch recursively
        if (logs.length === 10000) {
            const fromBlock = parseInt(filter.fromBlock, 16);
            const toBlock = parseInt(filter.toBlock, 16);
            const midBlock = Math.floor((fromBlock + toBlock) / 2);

            const firstHalfFilter = { ...filter, toBlock: toHexWithPrefix(midBlock) };
            const secondHalfFilter = { ...filter, fromBlock: toHexWithPrefix(midBlock + 1) };

            const [firstHalfLogs, secondHalfLogs] = await Promise.all([
                fetchLogsRecursive(firstHalfFilter, rpcUrl, method),
                fetchLogsRecursive(secondHalfFilter, rpcUrl, method),
            ]);

            // Combine and maintain order
            return [...firstHalfLogs, ...secondHalfLogs];
        }

        return logs;
    } catch (error) {
        console.error(`Error fetching logs: ${error.message}`);
        throw error;
    }
}

/**
 * Fetch and standardize logs from an RPC endpoint.
 * @param {Object} filter - The filter object for querying logs.
 * @param {string} rpcUrl - The RPC endpoint URL.
 * @param {string} method - The log-fetching method (e.g., eth_getLogs, sei_getLogs).
 * @returns {Promise<Object[]>} - Standardized logs with globally unique `logIndex` per block.
 */
export async function fetchAndStandardizeLogs(filter, rpcUrl, method = 'eth_getLogs') {
    try {
        const logs = await fetchLogsRecursive(filter, rpcUrl, method);

        const blockLogsMap = new Map();
        const standardizedLogs = logs.map((log) => {
            const blockNumber = log.blockNumber;

            if (!blockLogsMap.has(blockNumber)) {
                blockLogsMap.set(blockNumber, 0);
            }

            const globalLogIndex = blockLogsMap.get(blockNumber);
            blockLogsMap.set(blockNumber, globalLogIndex + 1);

            return {
                ...log,
                logIndex: `0x${globalLogIndex.toString(16)}`,
            };
        });

        return standardizedLogs;
    } catch (error) {
        console.error(`Error fetching or standardizing logs: ${error.message}`);
        throw error;
    }
}
