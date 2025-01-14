# getLogs-wrapper

A comprehensive wrapper for fetching logs from Ethereum-compatible RPC endpoints. The script handles dynamic batching and standardizes logs to ensure compatibility, particularly tailored for Sei’s EVM RPC implementation.

## Features

- **Dynamic Querying**: Fetch logs in bulk using `eth_getLogs` or `sei_getLogs` methods.
- **Standardized Log Index**: Ensures globally unique `logIndex` within blocks.
- **Customizable Filters**: Use parameters like `fromBlock`, `toBlock`, `address`, and `topics` to tailor log queries.
- **Error Handling**: Automatically handles common RPC issues and invalid block ranges.
- **Dual Method Support**: Choose between `eth_getLogs` and `sei_getLogs` for flexibility.

## Installation

Clone the repository:

```bash
git clone https://github.com/cordt-sei/getLogs-wrapper.git
cd getLogs-wrapper
```

Install dependencies:

```bash
npm install
```

## Usage

### Command-Line Interface

Run the script with command-line arguments for flexibility:

```bash
node script.js --rpcUrl '<RPC_URL>' --fromBlock '<FROM_BLOCK>' --toBlock '<TO_BLOCK>' --address '<ADDRESS>' --topics '<TOPICS>' --method '<METHOD>'
```

#### Parameters

- `--rpcUrl` (required): The EVM RPC endpoint URL.
- `--fromBlock` (required): Starting block number (decimal or hex with `0x` prefix).
- `--toBlock` (required): Ending block number (decimal or hex with `0x` prefix).
- `--address` (optional): Contract address for filtering logs.
- `--topics` (optional): Array of event topics for filtering.
- `--method` (optional): Log-fetching method. Options: `eth_getLogs`, `sei_getLogs`. Default: `eth_getLogs`.

#### Example Command

```bash
node script.js \
  --rpcUrl 'https://evm-rpc.sei.basementnodes.ca/' \
  --fromBlock '125571999' \
  --toBlock '125581999' \
  --address '0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7' \
  --topics '["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]' \
  --method 'sei_getLogs'
```

### Programmatic Usage

You can integrate the log-fetching functionality into your own project:

```javascript
import { fetchAndStandardizeLogs } from './wrapper.js';

async function main() {
    const rpcUrl = 'https://evm-rpc.sei.basementnodes.ca/';
    const filter = {
        fromBlock: '0x77c139f',
        toBlock: '0x77c3aaf',
        address: '0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7',
        topics: ['0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'],
    };

    try {
        const logs = await fetchAndStandardizeLogs(filter, rpcUrl, 'sei_getLogs');
        console.log('Logs:', logs);
    } catch (error) {
        console.error('Error fetching logs:', error.message);
    }
}

main();
```

## Example Output

### Input Logs:

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

### Output Logs:

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

- Ensure `fromBlock` and `toBlock` are above the base height (e.g., `125571999`) for Sei RPC.
- Verify the RPC URL and filter parameters for accuracy.
- Use `--method sei_getLogs` when working with Sei’s RPC.

## License

MIT License

---

Feel free to contribute by submitting issues or pull requests!

