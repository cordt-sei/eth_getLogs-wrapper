import axios from 'axios';
/**
 * fetch and standardize eth_getLogs response from sei EVM-RPC
 * @param {Object} filter - filter for log query
 * @param {string} rpcUrl - rpc endpoint
 * @returns {Promise<Object[]>} - standardized logs with unique logIndex
 */
export async function fetchAndStandardizeLogs(filter, rpcUrl) {
    try {
        // fetch logs
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
        // standardize logIndex
        const blockLogsMap = new Map();
        const standardizedLogs = logs.map((log) => {
            const blockHash = log.blockHash;
            // init block-specific log counter
            if (!blockLogsMap.has(blockHash)) {
                blockLogsMap.set(blockHash, 0);
            }
            const globalLogIndex = blockLogsMap.get(blockHash);
            blockLogsMap.set(blockHash, globalLogIndex + 1);
            return {
                ...log,
                logIndex: `0x${globalLogIndex.toString(16)}`, // Convert to hex
            };
        });
        return standardizedLogs;
    } catch (error) {
        console.error(`Error fetching or standardizing logs: ${error.message}`);
        throw error;
    }
}