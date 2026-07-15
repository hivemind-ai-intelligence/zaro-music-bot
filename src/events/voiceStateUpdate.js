// =======================================
// 🊗 VOICE STATE UPDATE - Auto Disconnect
// =======================================

const logger = require('../utils/logger');
const config = require('../../config');
const { useQueue } = require('discord-player');
const { errorEmbed } = require('../utils/embeds');

module.exports = {
    name: 'voiceStateUpdate',
    async execute(oldState, newState, client) {
        // Bot left or was moved
        if (oldState.member?.user?.id === client.user.id) {
            if (!newState.channelId) {
                // Bot disconnected - clean up
                const queue = useQueue(oldState.guild.id);
                if (queue) {
                    try {
                        queue.delete();
                    } catch (err) {}
                }
                
                client._247?.delete(oldState.guild.id);
                logger.music(`🔌 Disconnected from ${oldState.guild.name}`);
            }
        }

        // Check if channel is empty (only bot remaining)
        if (newState.channelId && newState.channel?.members?.size === 1 
            && newState.channel.members.has(client.user.id)
            && client._247?.get(newState.guild.id) !== true) {
            
            // Wait autoLeaveTimeout then check again
            const guildId = newState.guild.id;
            
            setTimeout(async () => {
                const channel = client.channels.cache.get(newState.channelId);
                if (channel && channel.members?.size === 1 && channel.members.has(client.user.id)) {
                    const queue = useQueue(guildId);
                    const textChannel = queue?.metadata?.channel;
                    
                    if (textChannel) {
                        await textChannel.send({
                            embeds: [errorEmbed('Everyone left! Disconnecting... Use `/247` to keep me 24/7.', client)]
                        }).catch(() => {});
                    }
                    
                    if (queue) {
                        queue.delete();
                    }
                    
                    client._247?.delete(guildId);
                }
            }, (config.autoLeaveTimeout || 120) * 1000);
        }
    }
};