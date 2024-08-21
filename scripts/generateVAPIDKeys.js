import webpush from 'web-push';

import fs from 'node:fs';

try {
    fs.statSync('../.vapidkey');
} catch (err) {
    const vapidKey = webpush.generateVAPIDKeys();
    console.log(`Created publickey: ${vapidKey.publicKey}`);
    console.log(`Created privatekey: ${vapidKey.privateKey}`);
    fs.writeFileSync(
        '../.vapidkey',
        `${vapidKey.publicKey}\n${vapidKey.privateKey}\n`
    );
}
