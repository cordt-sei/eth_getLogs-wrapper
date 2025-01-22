# getLogs-wrapper

A simple wrapper for fetching logs from Ethereum-compatible RPC endpoints.
Handles dynamic batching and standardizes logs to ensure compatibility, particularly tailored for Sei’s EVM RPC implementation.

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

#### Request

```bash
node script.js \
  --rpcUrl 'https://evm-rpc.sei.basementnodes.ca/' \
  --fromBlock '125571999' \
  --toBlock '125581999' \
  --address '0xe30fedd158a2e3b13e9badaeabafc5516e95e8c7' \
  --topics '["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"]' \
  --method 'sei_getLogs'
```

#### Response

<details>
<summary>click to expand</summary>

```json
[
  {
    "address": "0x292c6a9e316d0200af3de7ba0cf855f15a9ef2ef",
    "topics": [
      "0x33b8e51b0573ba15684e7f0715fa68a797fa99612dbbb2a10cbf6a12ae2fe84d"
    ],
    "data": "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001...",
    "blockNumber": "0x79f7f00",
    "transactionHash": "0x3c88644dfb5ea1a94f9b7372e5551e51eff1c5330e69fcd2863c578ffd24dab5",
    "transactionIndex": "0x10",
    "blockHash": "0x9c64af3d9f097223a0174898a6fe494ad768d7b030ecf9923a855c6cf5f86adf",
    "logIndex": "0x0",
    "removed": false
  },
  {
    "address": "0x292c6a9e316d0200af3de7ba0cf855f15a9ef2ef",
    "topics": [
      "0x33b8e51b0573ba15684e7f0715fa68a797fa99612dbbb2a10cbf6a12ae2fe84d"
    ],
    "data": "0x00000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000000000000000000000001...",
    "blockNumber": "0x79f7f01",
    "transactionHash": "0xcd3935ab81749fbfab513434be06b88d3d60ee9719132b40422c30b60e3a2d86",
    "transactionIndex": "0x1f",
    "blockHash": "0x02e2d9c2ca599a4bc356c3dc92499a72d2b2dea57e1ac3be663bdd01425f1425",
    "logIndex": "0x1",
    "removed": false
  }
]
```

</details>

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

## Notes

- `fromBlock` and `toBlock` may be specified in either hex or decimal format
- `--method sei_getLogs` should be used where mirrored events for pointer contracts are desired

## License

MIT License

---

Feel free to contribute by submitting issues or pull requests!

