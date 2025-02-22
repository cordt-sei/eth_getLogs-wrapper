# sei-logs-wrapper

TypeScript utility for fetching logs from Ethereum-compatible RPC endpoints with automatic pagination and standardization. This wrapper allows seamless querying of logs over large block ranges by batching requests, ensuring results are retrieved reliably without exceeding node limitations.

## Features

- **Query Batching**: Automatically splits large block ranges into smaller queries.
- **Overflow Handling**: Detects and handles cases where log responses hit the 10,000-entry limit.
- **Type Safety**: Provides full TypeScript support with strong type definitions.
- **Method Flexibility**: Supports both `eth_getLogs` and `sei_getLogs` RPC methods.
- **Ease of Use**: Compatible with both JavaScript and TypeScript projects.

## Installation

```bash
npm install sei-logs-wrapper
# or
yarn add sei-logs-wrapper
```

## Usage

### As a Module

```typescript
import { fetchLogs, LogFilter } from 'sei-logs-wrapper';

const filter: LogFilter = {
    fromBlock: '0x77c139f',  // hex or decimal
    toBlock: '0x77c3aaf',    // hex or decimal
    address: '0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7',  // optional
    topics: [    // optional
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ]
};

async function getLogs() {
    try {
        const logs = await fetchLogs(
            filter,
            'https://your-rpc-endpoint',
            'eth_getLogs'  // or 'sei_getLogs'
        );
        console.log(logs);
    } catch (error) {
        console.error('Error:', error);
    }
}

getLogs();
```

### Command Line Interface (CLI)

The package includes a CLI tool for testing queries.

```bash
npm run build
npm start -- --rpcUrl="https://your-rpc-endpoint" \
             --fromBlock="1000000" \
             --toBlock="1000100" \
             --address="0xYourContractAddress" \
             --topics='["0xYourTopic"]' \
             --method="eth_getLogs"
```

#### CLI Options

- `--rpcUrl` (required) - The RPC endpoint URL.
- `--fromBlock` (required) - Start block number (decimal or hex).
- `--toBlock` (required) - End block number (decimal or hex).
- `--address` (optional) - Contract address to filter logs.
- `--topics` (optional) - JSON array of topics to filter logs.
- `--method` (optional) - `eth_getLogs` or `sei_getLogs` (default: `eth_getLogs`).

#### CLI Examples

1. **Basic query**:
    ```bash
    yarn start --rpcUrl "https://evm.sei-main-eu.ccvalidators.com" --fromBlock "79293881" --toBlock "80293881"
    ```

2. **Filter by contract address**:
    ```bash
    yarn start --rpcUrl "https://evm.sei-main-eu.ccvalidators.com" --fromBlock "79293881" --toBlock "80293881" \
               --address "0x79828044c306dd3ae60db03cb56309883f74100b"
    ```

3. **Filter by event topics**:
    ```bash
    yarn start --rpcUrl "https://evm.sei-main-eu.ccvalidators.com" --fromBlock "79293881" --toBlock "80293881" \
               --topics '["0xea1823f879bc0cdf8f0b498e336723ace2adf2f7ea9c0a0257b0ba3e5783a956"]'
    ```

4. **Use Sei's native `sei_getLogs` method**:
    ```bash
    yarn start --rpcUrl "https://evm.sei-main-eu.ccvalidators.com" --fromBlock "79293881" --toBlock "80293881" \
               --method "sei_getLogs"
    ```

## API

### fetchLogs(filter, rpcUrl, method?)

Retrieves logs from an RPC endpoint, automatically handling batching and pagination.

#### Parameters

- `filter: LogFilter` - Query parameters:
  - `fromBlock: string | number` - Start block.
  - `toBlock: string | number` - End block.
  - `address?: string | string[]` - Contract address(es) to filter.
  - `topics?: (string | string[] | null)[]` - Optional log topics.
- `rpcUrl: string` - RPC endpoint URL.
- `method?: string` - Log-fetching method (`eth_getLogs` or `sei_getLogs`, default: `eth_getLogs`).

#### Returns

- `Promise<Log[]>` - Array of standardized log entries.

## Notes

- Block height can be specified in **decimal** or **hexadecimal** (`0x` prefix).
- Use `sei_getLogs` to retrieve logs that include **pointer contract mirrored events**.
- If a query returns **exactly 10,000 logs**, it will automatically split the block range and retry.

## License

MIT

## Contributing

Issues and pull requests are welcome!

