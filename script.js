import { fetchAndStandardizeLogs } from './wrapper.js';

async function main() {
    const rpcUrl = 'https://evm-rpc.sei.basementnodes.ca/';
    const filter = {
        fromBlock: '0x7682952',
        toBlock: '0x7682952',
    };

    try {
        const standardizedLogs = await fetchAndStandardizeLogs(filter, rpcUrl);
        console.log('Standardized Logs:', JSON.stringify(standardizedLogs, null, 2));
    } catch (error) {
        console.error('Error:', error.message);
    }
}

main();
