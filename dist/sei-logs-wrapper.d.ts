export interface LogFilter {
    fromBlock: string | number;
    toBlock: string | number;
    address?: string | string[];
    topics?: (string | string[] | null)[];
}
export interface Log {
    address: string;
    topics: string[];
    data: string;
    blockNumber: string;
    transactionHash: string;
    transactionIndex: string;
    blockHash: string;
    logIndex: string;
    removed?: boolean;
}
/**
 * Fetch logs from an RPC endpoint, automatically handling pagination for large ranges.
 * @param {LogFilter} filter - The filter object for querying logs
 * @param {string} rpcUrl - The RPC endpoint URL
 * @param {string} method - The log-fetching method (e.g., eth_getLogs, sei_getLogs)
 * @returns {Promise<Log[]>} - Standardized logs with globally unique logIndex per block
 */
export declare function fetchLogs(filter: LogFilter, rpcUrl: string, method?: string): Promise<Log[]>;
