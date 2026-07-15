// ==============================================
// 🎨 EMBED BUILDER - Animated Emoji Embeds
// ==============================================

const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const config = require('../../config');
const { formatDuration, progressBar } = require('./formatUtils');

/**
 * Get emoji - tries custom animated first, falls back to unicode
 */
function e(name) {
    return config.emojis[name] || config.unicodeEmojis[name] || '';
}

/**
 * Create a beautiful animated embed for now playing
 */
function nowPlayingEmbed(track, queue, client) {
    const progress = queue?.node?.createProgressBar ? queue.node.createProgressBar() : progressBar(0, track.durationMS);
    const duration = formatDuration(track.durationMS);
    const currentTime = queue?.node?.getTimestamp ? formatDuration(queue.node.getTimestamp()?.current?.value || 0) : '0:00';
    
    const embed = new EmbedBuilder()
        .setAuthor({
            name: `${e('music_note')} Now Playing ${e('music_note')}`,
            iconURL: 'https://cdn.discordapp.com/emojis/1318992747070226452.gif'
        })
        .setTitle(`${e('disc')} ${track.title}`)
        .setURL(track.url)
        .setThumbnail(track.thumbnail || 'https://cdn.discordapp.com/emojis/1318992747070226452.gif')
        .setColor(config.colors.playing)
        .addFields(
            {
                name: `${e('mic')} Artist`,
                value: `\`${track.author || 'Unknown'}\``,
                inline: true
            },
            {
                name: `${e('clock')} Duration`,
                value: `\`${currentTime} / ${duration}\``,
                inline: true
            },
            {
                name: `${e('headphone')} Requested By`,
                value: `${track.requestedBy || 'Unknown'}`,
                inline: true
            },
            {
                name: `${e('speaker')} Volume`,
                value: `\`${queue?.volume || config.defaultVolume}%\``,
                inline: true
            },
            {
                name: `${e('queue')} Queue`,
                value: `\`${queue?.tracks?.size || 0} songs\``,
                inline: true
            },
            {
                name: `${e('loop')} Loop`,
                value: `\`${queue?.repeatMode === 0 ? 'Off' : queue?.repeatMode === 1 ? '🔂 Track' : '🔁 Queue'}\``,
                inline: true
            },
            {
                name: `${e('zap')} Progress`,
                value: `${progress}`,
                inline: false
            }
        )
        .setFooter({
            text: `${e('sparkles')} Zaro Music Bot • ${e('rocket')} Powered by Discord Player`,
            iconURL: client?.user?.displayAvatarURL() || null
        })
        .setTimestamp();

    return embed;
}

/**
 * Create queue embed with pages
 */
function queueEmbed(queue, page = 1, client) {
    const tracks = queue.tracks.toArray();
    const itemsPerPage = 10;
    const totalPages = Math.ceil(tracks.length / itemsPerPage) || 1;
    const startIndex = (page - 1) * itemsPerPage;
    const pageTracks = tracks.slice(startIndex, startIndex + itemsPerPage);
    
    const currentTrack = queue.currentTrack;
    const totalDuration = tracks.reduce((acc, t) => acc + (t.durationMS || 0), 0) + (currentTrack?.durationMS || 0);
    
    let queueList = '';
    if (pageTracks.length === 0) {
        queueList = `${e('info')} No tracks in queue! Use \`/play\` to add some songs.\n`;
    } else {
        pageTracks.forEach((track, i) => {
            const index = startIndex + i + 1;
            const dur = formatDuration(track.durationMS);
            queueList += `\`${String(index).padStart(2, '0')}\` ${e('music')} **[${track.title}](${track.url})** \`[${dur}]\` • ${track.requestedBy}\n`;
        });
    }

    const embed = new EmbedBuilder()
        .setAuthor({
            name: `${e('queue')} Server Queue ${e('queue')}`,
            iconURL: 'https://cdn.discordapp.com/emojis/1318992747070226452.gif'
        })
        .setColor(config.colors.queue)
        .setThumbnail(currentTrack?.thumbnail || null)
        .addFields(
            {
                name: `${e('disc')} Now Playing`,
                value: currentTrack 
                    ? `**[${currentTrack.title}](${currentTrack.url})**\n${e('mic')} \`${currentTrack.author}\` • ${e('clock')} \`${formatDuration(currentTrack.durationMS)}\` • ${currentTrack.requestedBy}`
                    : `${e('error')} Nothing playing!`
            },
            {
                name: `${e('notes')} Up Next (Page ${page}/${totalPages})`,
                value: queueList || 'No tracks queued',
                inline: false
            },
            {
                name: `${e('info')} Queue Summary`,
                value: `${e('notes')} **${tracks.length}** songs • ${e('clock')} **${formatDuration(totalDuration)}** total • ${e('speaker')} Vol: **${queue.volume}%** • ${e('loop')} Loop: **${queue.repeatMode === 0 ? 'Off' : queue.repeatMode === 1 ? 'Track' : 'Queue'}**`,
                inline: false
            }
        )
        .setFooter({
            text: `${e('sparkles')} Page ${page}/${totalPages} • Zaro Music Bot`,
            iconURL: client?.user?.displayAvatarURL() || null
        })
        .setTimestamp();

    return embed;
}

/**
 * Track added confirmation embed
 */
function trackAddedEmbed(track, queue, client) {
    const pos = queue?.tracks?.size || 0;
    
    const embed = new EmbedBuilder()
        .setAuthor({
            name: `${e('success')} Added to Queue! ${e('music_note')}`,
            iconURL: 'https://cdn.discordapp.com/emojis/1318992747070226452.gif'
        })
        .setTitle(`${e('plus')} ${track.title}`)
        .setURL(track.url)
        .setThumbnail(track.thumbnail || null)
        .setColor(config.colors.success)
        .addFields(
            { name: `${e('mic')} Artist`, value: `\`${track.author || 'Unknown'}\``, inline: true },
            { name: `${e('clock')} Duration`, value: `\`${formatDuration(track.durationMS)}\``, inline: true },
            { name: `${e('queue')} Queue Position`, value: `\`#${pos}\``, inline: true },
            { name: `${e('headphone')} Requested By`, value: `${track.requestedBy}`, inline: true }
        )
        .setFooter({
            text: `${e('sparkles')} Zaro Music Bot • ${e('fire')} Keep 'em coming!`,
            iconURL: client?.user?.displayAvatarURL() || null
        })
        .setTimestamp();

    return embed;
}

/**
 * Playlist added embed
 */
function playlistAddedEmbed(playlist, queue, client) {
    const embed = new EmbedBuilder()
        .setAuthor({
            name: `${e('success')} Playlist Added! ${e('party')}`,
            iconURL: 'https://cdn.discordapp.com/emojis/1318992747070226452.gif'
        })
        .setTitle(`${e('notes')} ${playlist.title}`)
        .setURL(playlist.url)
        .setThumbnail(playlist.thumbnail || null)
        .setColor(config.colors.success)
        .addFields(
            { name: `${e('queue')} Songs Added`, value: `\`${playlist.tracks.length}\` tracks`, inline: true },
            { name: `${e('clock')} Total Duration`, value: `\`${formatDuration(playlist.durationMS)}\``, inline: true },
            { name: `${e('headphone')} Requested By`, value: `${playlist.tracks[0]?.requestedBy || 'Unknown'}`, inline: true }
        )
        .setFooter({
            text: `${e('sparkles')} Zaro Music Bot • ${e('rocket')} Enjoy!`,
            iconURL: client?.user?.displayAvatarURL() || null
        })
        .setTimestamp();

    return embed;
}

/**
 * Lyrics embed
 */
function lyricsEmbed(title, artist, lyrics, page = 1, totalPages = 1, thumbnail, client) {
    // Split lyrics into chunks for pagination
    const chunkSize = 2000;
    const chunks = [];
    for (let i = 0; i < lyrics.length; i += chunkSize) {
        chunks.push(lyrics.slice(i, i + chunkSize));
    }
    const displayLyrics = chunks[page - 1] || chunks[0];

    const embed = new EmbedBuilder()
        .setAuthor({
            name: `${e('notes')} Lyrics ${e('notes')}`,
            iconURL: 'https://cdn.discordapp.com/emojis/1318992747070226452.gif'
        })
        .setTitle(`${e('mic')} ${title}`)
        .setColor(config.colors.lyrics)
        .setThumbnail(thumbnail || null)
        .addFields(
            { name: `${e('mic')} Artist`, value: `\`${artist}\``, inline: true },
            { name: `${e('info')} Page`, value: `\`${page}/${chunks.length}\``, inline: true }
        )
        .setDescription(`\`\`\`\n${displayLyrics}\n\`\`\``)
        .setFooter({
            text: `${e('sparkles')} Zaro Music Bot • Lyrics provided by Genius & LRCLIB`,
            iconURL: client?.user?.displayAvatarURL() || null
        })
        .setTimestamp();

    return { embed, totalPages: chunks.length };
}

/**
 * Help embed with category selection
 */
function helpEmbed(client, category = 'music') {
    const categories = {
        music: {
            name: `${e('music_note')} Music Commands`,
            emoji: e('music'),
            commands: [
                '`/play` — Play a song or add to queue',
                '`/stop` — Stop playback & clear queue',
                '`/skip` — Skip current song',
                '`/queue` — View server queue',
                '`/nowplaying` — Show current song info',
                '`/pause` — Pause playback',
                '`/resume` — Resume playback',
                '`/volume` — Set volume (1-200)',
                '`/shuffle` — Shuffle the queue',
                '`/loop` — Set loop mode (off/track/queue)',
                '`/remove` — Remove song from queue',
                '`/jump` — Jump to a position in queue',
                '`/clear` — Clear the queue',
                '`/seek` — Seek to position in song',
                '`/autoplay` — Toggle autoplay',
                '`/previous` — Play previous song',
                '`/replay` — Replay current song',
                '`/move` — Move song in queue',
                '`/lyrics` — Get song lyrics',
                '`/search` — Search for songs',
                '`/playlist` — Play a playlist',
                '`/save` — Save current queue',
                '`/load` — Load a saved queue',
                '`/join` — Join your voice channel',
                '`/disconnect` — Leave voice channel',
                '`/247` — Toggle 24/7 mode',
            ]
        },
        filters: {
            name: `${e('gear')} Filter Commands`,
            emoji: e('zap'),
            commands: [
                '`/bassboost` — Toggle bass boost',
                '`/equalizer` — Set custom equalizer',
                '`/filters` — List all available filters',
                '`/speed` — Change playback speed',
                '`/pitch` — Change pitch',
                '`/nightcore` — Nightcore effect',
                '`/vaporwave` — Vaporwave effect',
                '`/karaoke` — Karaoke effect',
                '`/8d` — 8D audio effect',
                '`/echo` — Echo effect',
                '`/tremolo` — Tremolo effect',
            ]
        },
        utility: {
            name: `${e('gear')} Utility Commands`,
            emoji: e('info'),
            commands: [
                '`/help` — Show this help menu',
                '`/ping` — Bot latency check',
                '`/stats` — Bot statistics',
                '`/invite` — Get bot invite link',
                '`/prefix` — Change server prefix',
                '`/status` — View bot status',
            ]
        }
    };

    const cat = categories[category] || categories.music;

    const embed = new EmbedBuilder()
        .setAuthor({
            name: `${e('crown')} Zaro Music Bot Help ${e('crown')}`,
            iconURL: client?.user?.displayAvatarURL() || 'https://cdn.discordapp.com/emojis/1318992747070226452.gif'
        })
        .setDescription(`${e('sparkles')} **Welcome to Zaro Music Bot!**\nThe most advanced Discord music bot with 40+ commands, real-time lyrics, filters & more!\n\n${e('arrow_right')} **Prefix:** \`/\` (Slash Commands)\n${e('link')} **[Invite Me](https://discord.com/oauth2/authorize?client_id=${client?.user?.id}&permissions=8&scope=bot%20applications.commands)** • **[Support Server](https://discord.gg/yourserver)**\n\n━━━━━━━━━━━━━━━━━━━━━━━━━`)
        .setColor(config.colors.primary)
        .setThumbnail(client?.user?.displayAvatarURL() || null)
        .addFields({
            name: `${cat.emoji} ${cat.name}`,
            value: cat.commands.join('\n'),
            inline: false
        })
        .addFields({
            name: `${e('compass')} Quick Navigation`,
            value: `${e('music')} Music • ${e('zap')} Filters • ${e('gear')} Utility\nUse the dropdown below to switch categories!`
        })
        .setFooter({
            text: `${e('heart')} Made with love • Zaro Music Bot v2.0`,
            iconURL: client?.user?.displayAvatarURL() || null
        })
        .setTimestamp();

    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId('help_category')
        .setPlaceholder(`${e('magnifying_glass')} Select a category...`)
        .addOptions([
            { label: '🎵 Music Commands', value: 'music', description: 'All music playback commands', emoji: '🎵' },
            { label: '⚡ Filter Commands', value: 'filters', description: 'Audio filter & effects', emoji: '⚡' },
            { label: '⚙️ Utility Commands', value: 'utility', description: 'Bot utility commands', emoji: '⚙️' },
        ]);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    return { embed, components: [row], categories };
}

/**
 * Search results embed
 */
function searchEmbed(results, client) {
    const tracks = results.slice(0, 10);
    let description = '';
    
    tracks.forEach((track, i) => {
        description += `\`${i + 1}.\` ${e('music')} **[${track.title}](${track.url})**\n${e('mic')} \`${track.author}\` • ${e('clock')} \`${formatDuration(track.durationMS)}\`\n\n`;
    });

    const embed = new EmbedBuilder()
        .setAuthor({
            name: `${e('magnifying_glass')} Search Results ${e('music_note')}`,
            iconURL: 'https://cdn.discordapp.com/emojis/1318992747070226452.gif'
        })
        .setDescription(description + `\n${e('arrow_right')} **Select a song (1-10)** or type \`cancel\` to cancel.`)
        .setColor(config.colors.info)
        .setFooter({
            text: `${e('sparkles')} Zaro Music Bot • ${e('clock')} 60s timeout`,
            iconURL: client?.user?.displayAvatarURL() || null
        })
        .setTimestamp();

    return embed;
}

/**
 * Stats embed
 */
function statsEmbed(client, player) {
    const uptime = formatDuration(client.uptime);
    const guilds = client.guilds.cache.size;
    const users = client.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0);
    const channels = client.channels.cache.size;
    const memory = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
    const ping = client.ws.ping;

    const embed = new EmbedBuilder()
        .setAuthor({
            name: `${e('rocket')} Bot Statistics ${e('rocket')}`,
            iconURL: client?.user?.displayAvatarURL() || null
        })
        .setColor(config.colors.info)
        .setThumbnail(client?.user?.displayAvatarURL() || null)
        .addFields(
            { name: `${e('online')} Servers`, value: `\`${guilds}\``, inline: true },
            { name: `${e('heart')} Users`, value: `\`${users}\``, inline: true },
            { name: `${e('speaker')} Channels`, value: `\`${channels}\``, inline: true },
            { name: `${e('ping')} Latency`, value: `\`${ping}ms\``, inline: true },
            { name: `${e('clock')} Uptime`, value: `\`${uptime}\``, inline: true },
            { name: `${e('gear')} Memory`, value: `\`${memory} MB\``, inline: true },
            { name: `${e('music')} Active Players`, value: `\`${player?.players?.size || 0}\``, inline: true },
            { name: `${e('disc')} Discord.js`, value: `\`v14.16.3\``, inline: true },
            { name: `${e('zap')} Node.js`, value: `\`${process.version}\``, inline: true }
        )
        .setFooter({
            text: `${e('sparkles')} Zaro Music Bot v2.0`,
            iconURL: client?.user?.displayAvatarURL() || null
        })
        .setTimestamp();

    return embed;
}

/**
 * Simple success/error embeds
 */
function successEmbed(message, client) {
    return new EmbedBuilder()
        .setDescription(`${e('success')} **${message}**`)
        .setColor(config.colors.success)
        .setTimestamp();
}

function errorEmbed(message, client) {
    return new EmbedBuilder()
        .setDescription(`${e('error')} **${message}**`)
        .setColor(config.colors.error)
        .setTimestamp();
}

function infoEmbed(message, client) {
    return new EmbedBuilder()
        .setDescription(`${e('info')} **${message}**`)
        .setColor(config.colors.info)
        .setTimestamp();
}

/**
 * Pause/Resume embeds
 */
function pauseEmbed(track, client) {
    return new EmbedBuilder()
        .setAuthor({ name: `${e('pause')} Playback Paused`, iconURL: client?.user?.displayAvatarURL() || null })
        .setDescription(`${e('music')} **[${track.title}](${track.url})** has been paused!\n${e('arrow_right')} Use \`/resume\` to continue playing.`)
        .setColor(config.colors.paused)
        .setThumbnail(track.thumbnail || null)
        .setTimestamp();
}

function resumeEmbed(track, client) {
    return new EmbedBuilder()
        .setAuthor({ name: `${e('play')} Playback Resumed`, iconURL: client?.user?.displayAvatarURL() || null })
        .setDescription(`${e('music')} **[${track.title}](${track.url})** has been resumed! ${e('fire')}`)
        .setColor(config.colors.success)
        .setThumbnail(track.thumbnail || null)
        .setTimestamp();
}

/**
 * Skip embed
 */
function skipEmbed(oldTrack, newTrack, client) {
    const embed = new EmbedBuilder()
        .setAuthor({ name: `${e('skip')} Track Skipped`, iconURL: client?.user?.displayAvatarURL() || null })
        .setColor(config.colors.warning)
        .addFields(
            { name: `${e('arrow_left')} Skipped`, value: `**[${oldTrack.title}](${oldTrack.url})**`, inline: false }
        );

    if (newTrack) {
        embed.addFields({ name: `${e('arrow_right')} Now Playing`, value: `**[${newTrack.title}](${newTrack.url})**`, inline: false });
        embed.setThumbnail(newTrack.thumbnail || null);
    } else {
        embed.addFields({ name: `${e('error')} Queue Ended`, value: 'No more tracks in queue. Add some with `/play`!' });
    }

    embed.setTimestamp();
    return embed;
}

/**
 * Stop embed
 */
function stopEmbed(client) {
    return new EmbedBuilder()
        .setAuthor({ name: `${e('stop')} Playback Stopped`, iconURL: client?.user?.displayAvatarURL() || null })
        .setDescription(`${e('wave')} Goodbye! Queue cleared & disconnected.\n${e('arrow_right')} Use \`/play\` to start grooving again! ${e('sparkles')}`)
        .setColor(config.colors.error)
        .setTimestamp();
}

/**
 * Filter embed
 */
function filterEmbed(filter, enabled, client) {
    return new EmbedBuilder()
        .setAuthor({
            name: `${e('gear')} Audio Filter ${e('zap')}`,
            iconURL: client?.user?.displayAvatarURL() || null
        })
        .setDescription(`${enabled ? e('success') : e('error')} **${filter}** has been **${enabled ? 'enabled' : 'disabled'}**!`)
        .setColor(enabled ? config.colors.success : config.colors.error)
        .setTimestamp();
}

/**
 * 24/7 mode embed
 */
function mode247Embed(enabled, client) {
    return new EmbedBuilder()
        .setAuthor({
            name: `${e('clock')} 24/7 Mode ${e('crown')}`,
            iconURL: client?.user?.displayAvatarURL() || null
        })
        .setDescription(`${enabled ? e('success') : e('error')} **24/7 Mode** has been **${enabled ? 'ENABLED' : 'DISABLED'}**!\n${enabled ? `${e('info')} Bot will stay in voice channel 24/7!` : `${e('info')} Bot will auto-leave when queue ends.`}`)
        .setColor(enabled ? config.colors.success : config.colors.warning)
        .setTimestamp();
}

module.exports = {
    e,
    nowPlayingEmbed,
    queueEmbed,
    trackAddedEmbed,
    playlistAddedEmbed,
    lyricsEmbed,
    helpEmbed,
    searchEmbed,
    statsEmbed,
    successEmbed,
    errorEmbed,
    infoEmbed,
    pauseEmbed,
    resumeEmbed,
    skipEmbed,
    stopEmbed,
    filterEmbed,
    mode247Embed,
};
