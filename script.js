// wrapper.js

import axios from 'axios';

/**
 * Fetch and standardize logs from `eth_getLogs` on an RPC endpoint.
 * @param {Object} filter - The filter object for querying logs.
 * @param {string} rpcUrl - The RPC endpoint URL.
 * @returns {Promise<Object[]>} - Standardized logs with globally unique `logIndex` per block.
 */
export async function fetchAndStandardizeLogs(filter, rpcUrl) {
    try {
        const response = await axios.post(rpcUrl, {
            jsonrpc: '2.0',
            method: 'eth_getLogs',
            params: [filter],
            id: 'standardizedLogs',
        });

        if (response.data.error) {
            throw new Error(`RPC Error: ${response.data.error.message}`);
        }

        const logs = response.data.result;

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
