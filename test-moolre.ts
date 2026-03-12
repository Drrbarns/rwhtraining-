import { loadEnvConfig } from '@next/env';
loadEnvConfig('./');

import { MoolreAdapter } from './src/lib/moolre-adapter';

async function testMoolre() {
    try {
        const res = await MoolreAdapter.initializeTransaction({
            email: 'test@example.com',
            amount_ghs: 50,
            tier: '50',
            phone: '0540000000',
            network: 'MTN',
            first_name: 'Test',
            last_name: 'User'
        });
        console.log(JSON.stringify(res, null, 2));
    } catch (err) {
        console.error("Caught error:", err);
    }
}

testMoolre();
