// =======================================
// 🎓 PLAYER HANDLER - Discord Player Setup & Events
// =======================================

const { useMainPlayer, useQueue, QueryType, Player } = require('discord-player');
const { YoutubeiExtractor } = require('@discord-player/extractor');
const logger = require('../utils/logger');
const config = require('../../config');
const { nowPlayingEmbed, trackAddedEmbed, playlistAddedEmbed, errorEmbed, e } = require('../utils/embeds');

async function setupPlayer(client, player) {
    try {
        // Register YouTube extractor (free, no API key needed)
        await player.extractors.register(YoutubeiExtractor, {});
        logger.success('YouTube extractor registered');
        
        // Load default extractors (Spotify, SoundCloud, Apple Music, etc.)
        await player.extractors.loadDefault();
        logger.success('Default extractors loaded');
        
    } catch (err) {
        logger.error('Failed to register extractors:', err.message);
    }

    // ===== PLAYER EVENTS =====
    
    // Track starts playing
    player.events.on('playerStart', async (queue, track) => {
        const channel = queue.metadata?.channel;
        if (!channel) return;

        try {
            const embed = nowPlayingEmbed(track, queue, client);
            
            const msg = await channel.send({ embeds: [embed] });
            
            // Store the now playing message for updates
            queue.metadata.nowPlayingMessage = msg;
            
            logger.music(`▷️ Playing: ${track.title} in ${queue.guild.name}`);
        } catch (err) {
            logger.error('Error sending now playing:', err.message);
        }
    });

    // Track added to queue
    player.events.on('audioTrackAdd', async (queue, track) => {
        const channel = queue.metadata?.channel;
        if (!channel) return;

        // Only show "added to queue" if not the first track
        if (queue.tracks.size > 0 || queue.currentTrack) {
            try {
                const embed = trackAddedEmbed(track, queue, client);
                await channel.send({ embeds: [embed] });
            } catch (err) {
                logger.error('Error sending track added:', err.message);
            }
        }
    });

    // Playlist added
    player.events.on('audioTracksAdd', async (queue, tracks) => {
        const channel = queue.metadata?.channel;
        if (!channel || tracks.length <= 1) return;

        try {
            const playlist = {
                title: tracks[0]?.playlist?.title || 'Playlist',
                url: tracks[0]?.playlist?.url || '',
                thumbnail: tracks[0]?.playlist?.thumbnail || tracks[0]?.thumbnail,
                tracks: tracks,
                durationMS: tracks.reduce((a, t) => a + (t.durationMS || 0), 0),
            };
            
            const embed = playlistAddedEmbed(playlist, queue, client);
            await channel.send({ embeds: [embed] });
            
            logger.music(`📋 Playlist added: ${playlist.title} (${tracks.length} tracks)`);
        } catch (err) {
            logger.error('Error sending playlist added:', err.message);
        }
    });

    // Queue ended
    player.events.on('emptyQueue', async (queue) => {
        const channel = queue.metadata?.channel;
        if (!channel) return;

        const is247 = client._247?.get(queue.guild.id) || false;

        if (!is247) {
            try {
                await channel.send({
                    embeds: [errorEmbed('Queue ended! Leaving voice channel... Use `/247` to enable 24/7 mode.', client)]
                });
            } catch (err) {
                // Channel might be deleted
            }
            
            logger.music(`🏡 Queue ended in ${queue.guild.name}`);
        }
    });

    // Player error
    player.events.on('error', async (queue, error) => {
        logger.error(`Player error in ${queue?.guild?.name}:`, error.message);
        
        const channel = queue?.metadata?.channel;
        if (channel) {
            try {
                await channel.send({
                    embeds: [errorEmbed(`An error occurred: \`${error.message}\`. Skipping...`, client)]
                });
            } catch (err) {}
        }
    });

    // Connection error
    player.events.on('connectionError', async (queue, error) => {
        logger.error(`Connection error in ${queue?.guild?.name}:`, error.message);
        
        const channel = queue?.metadata?.channel;
        if (channel) {
            try {
                await channel.send({
                    embeds: [errorEmbed('Connection error! Trying to reconnect...', client)]
                });
            } catch (err) {}
        }
    });

    // Channel empty
    player.events.on('emptyChannel', async (queue) => {
        const is247 = client._247?.get(queue.guild.id) || false;
        
        if (!is247) {
            logger.music(`👋 Empty channel in ${queue.guild.name}, leaving...`);
        }
    });

    // Debug
    player.events.on('debug', (queue, message) => {
        if (config.debug) {
            logger.debug(`[Player Debug] ${queue.guild.name}: ${message}`);
        }
    });
}

module.exports = { setupPlayer };