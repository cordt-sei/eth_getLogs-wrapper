# getLogs-wrapper

A simple wrapper for `eth_getLogs` that dynamically queries logs and standardizes log indices (`logIndex`) for compatibility with Ethereum's EVM standards. Designed specifically for Sei's EVM RPC, where `logIndex` resets per transaction in a block.

## Features

- **Dynamic Queries**: Fetch logs directly from any EVM-compatible RPC endpoint.
- **Standardized `logIndex`**: Ensures `logIndex` is globally unique within each block, adhering to Ethereum's behavior.
- **Customizable Filters**: Supports `fromBlock`, `toBlock`, `address`, and `topics` for granular log filtering.
- **Lightweight & Simple**: Works seamlessly without intermediate file-saving or manual operations.

## Installation

Clone the repository:

```bash
git clone https://github.com/cordt-sei/getLogs-wrapper.git
cd getLogs-wrapper
```

Install dependencies:

```bash
npm install axios yargs
```

## Usage

### Command-Line Interface

Run the script directly with command-line arguments for flexibility:

```bash
node script.js --rpcUrl 'https://evm-rpc.sei.basementnodes.ca/' --fromBlock '0x7682952' --toBlock '0x7682952' --address '0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7' --topics '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
```

### Parameters

- `--rpcUrl` (required): The EVM RPC endpoint URL.
- `--fromBlock` (required): The starting block number (hex or decimal).
- `--toBlock` (required): The ending block number (hex or decimal).
- `--address` (optional): Contract address to filter logs.
- `--topics` (optional): Array of topics to filter logs (e.g., event signatures).

### Example Command

```bash
node script.js --rpcUrl 'https://evm-rpc.sei.basementnodes.ca/' --fromBlock '0x7682952' --toBlock '0x7682952' --address '0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7' --topics '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
```

### Programmatic Usage

You can also use the wrapper function directly in your project:

```javascript
import { fetchAndStandardizeLogs } from './wrapper.js';

async function main() {
    const rpcUrl = 'https://evm-rpc.sei.basementnodes.ca/';
    const filter = {
        fromBlock: '0x7682952',
        toBlock: '0x7682952',
        address: '0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7',
        topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
    };

    try {
        const standardizedLogs = await fetchAndStandardizeLogs(filter, rpcUrl);
        console.log('Standardized Logs:', JSON.stringify(standardizedLogs, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
```

## Example Output

Input:

```json
[
  {
    "blockHash": "0xf645e34f3...",
    "logIndex": "0x0",
    "transactionIndex": "0x1",
    "address": "0xe30fedd158...",
    ...
  },
  {
    "blockHash": "0xf645e34f3...",
    "logIndex": "0x0",
    "transactionIndex": "0x2",
    "address": "0x3894085ef...",
    ...
  }
]
```

Output:

```json
[
  {
    "blockHash": "0xf645e34f3...",
    "logIndex": "0x0",
    "transactionIndex": "0x1",
    "address": "0xe30fedd158...",
    ...
  },
  {
    "blockHash": "0xf645e34f3...",
    "logIndex": "0x1",
    "transactionIndex": "0x2",
    "address": "0x3894085ef...",
    ...
  }
]
```

## Notes

- Adjust filter parameters (`fromBlock`, `toBlock`, `address`, `topics`) as needed.
- Designed to handle non-standard `logIndex` behavior in Sei's EVM RPC.

## License

MIT License

---

Feel free to contribute by submitting issues or pull requests!
