# sei-logs-wrapper

A TypeScript utility for fetching logs from Ethereum-compatible RPC endpoints with automatic pagination and standardization. Wraps Sei's inherently limited block-range getLogs requests in a way that behaves identically to the standard EVM RPC request..

## Features

- **Query Batching**: Handles large log queries by automatically batching requests for large block ranges.
- **Overflow Handling**: Splits and re-runs any response containing exactly 10000 logs
- **Type Safety**: Full TypeScript support with comprehensive type definitions
- **Method Flexibility**: Supports both `eth_getLogs` and `sei_getLogs` methods
- **Simple Integration**: Easy to import and use in any TypeScript/JavaScript project

## Installation

```bash
npm install sei-logs-wrapper
# or
yarn add sei-logs-wrapper
```

## Usage

### As a Module

```typescript
import { getSeiLogs, LogFilter } from 'sei-logs-wrapper';

const filter: LogFilter = {
    fromBlock: '0x77c139f',  // hex or decimal string
    toBlock: '0x77c3aaf',    // hex or decimal string
    address: '0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7',  // optional
    topics: [    // optional
        '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
    ]
};

try {
    const logs = await getSeiLogs(
        filter,
        'https://your-rpc-endpoint',
        'eth_getLogs'  // or 'sei_getLogs'
    );
    console.log(logs);
} catch (error) {
    console.error('Error:', error);
}
```

### Command Line Demo

The package includes a demo script showing usage:

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

- `--rpcUrl` (required): RPC endpoint URL
- `--fromBlock` (required): Start block (hex/decimal)
- `--toBlock` (required): End block (hex/decimal)
- `--address` (optional): Contract address to filter
- `--topics` (optional): JSON array of topics
- `--method` (optional): 'eth_getLogs' or 'sei_getLogs' (default: 'eth_getLogs')

## API

### fetchAndStandardizeLogs(filter, rpcUrl, method?)

Fetches and standardizes logs from an RPC endpoint.

#### Parameters

- `filter: LogFilter` - Query parameters
  - `fromBlock: string | number` - Start block
  - `toBlock: string | number` - End block
  - `address?: string | string[]` - Optional contract address(es)
  - `topics?: (string | string[] | null)[]` - Optional log topics
- `rpcUrl: string` - RPC endpoint URL
- `method?: string` - RPC method (default: 'eth_getLogs')

#### Returns

- `Promise<Log[]>` - Array of standardized log entries

## Notes

- Block height can be specified in either decimal or hexadecimal (with '0x' prefix)
- Use 'sei_getLogs' to include mirrored events from pointer contracts

## License

MIT

---

## Contributing

Issues and pull requests are welcome!
