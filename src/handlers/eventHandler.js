// =======================================
// 📡 EVENT HANDLER
// =======================================

const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

async function loadEvents(client) {
    const eventsPath = path.join(__dirname, '..', 'events');
    
    if (!fs.existsSync(eventsPath)) {
        logger.warn('No events directory found');
        return;
    }

    const eventFiles = fs.readdirSync(eventsPath).filter(f => f.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(eventsPath, file);
        delete require.cache[require.resolve(filePath)];
        const event = require(filePath);

        if (!event.name || !event.execute) {
            logger.warn(`Skipping event ${file}: missing name or execute`);
            continue;
        }

        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }

        logger.debug(`Loaded event: ${event.name}`);
    }
}

module.exports = { loadEvents };