// ==============================================
// 🎵 ZARO MUSIC BOT - Configuration
// ==============================================

require('dotenv').config();

module.exports = {
    // Bot Core
    token: process.env.TOKEN,
    clientId: process.env.CLIENT_ID,
    prefix: process.env.PREFIX || '!',
    ownerIds: (process.env.OWNER_IDS || '').split(',').map(id => id.trim()).filter(Boolean),
    
    // Status
    statusType: process.env.STATUS_TYPE || 'LISTENING',
    statusText: process.env.STATUS_TEXT || '/play | 🎵 Music Bot',
    statusInterval: parseInt(process.env.STATUS_INTERVAL) || 15,
    
    // Audio Settings
    defaultVolume: parseInt(process.env.DEFAULT_VOLUME) || 80,
    maxVolume: parseInt(process.env.MAX_VOLUME) || 200,
    
    // Auto Behaviors
    autoLeaveTimeout: parseInt(process.env.AUTO_LEAVE_TIMEOUT) || 120,
    default247: process.env.DEFAULT_247 === 'true',
    
    // Lyrics
    defaultLyricsLang: process.env.DEFAULT_LYRICS_LANG || 'auto',
    geniusApiKey: process.env.GENIUS_API_KEY || '',
    
    // Embed Config
    embedColor: process.env.EMBED_COLOR || '#8A2BE2',
    
    // Debug
    debug: process.env.DEBUG === 'true',
    
    // Colors Array for Visual Variety
    colors: {
        primary: '#8A2BE2',    // Blue Violet
        success: '#00FF7F',   // Spring Green
        error: '#FF4444',     // Red
        warning: '#FFA500',   // Orange
        info: '#00BFFF',      // Deep Sky Blue
        queue: '#1E90FF',     // Dodger Blue
        lyrics: '#FF69B4',    // Hot Pink
        playing: '#7B68EE',   // Medium Slate Blue
        paused: '#FFD700',    // Gold
    },

    // Animated Emoji Config — Add your custom emoji IDs here for animated emojis!
    // Format: '<a:emoji_name:EMOJI_ID>' (use empty string '' for unicode fallback)
    // Get emoji IDs by uploading animated GIFs to a Discord server (with Developer Mode ON)
    emojis: {
        // Music Controls — leave empty for unicode fallback ✨
        play: '',
        pause: '',
        stop: '',
        skip: '',
        previous: '',
        shuffle: '',
        loop: '',
        loop_track: '',
        loop_queue: '',
        queue: '',
        volume_up: '',
        volume_down: '',
        volume_mute: '',
        seek: '',
        
        // Status Indicators
        online: '',
        idle: '',
        dnd: '',
        offline: '',
        loading: '',
        success: '',
        error: '',
        
        // Music Related
        music: '',
        music_note: '',
        notes: '',
        headphone: '',
        speaker: '',
        mic: '',
        dj: '',
        disc: '',
        vinyl: '',
        
        // Reaction
        like: '',
        heart: '',
        fire: '',
        sparkles: '',
        star: '',
        crown: '',
        rocket: '',
        zap: '',
        wave: '',
        party: '',
        
        // UI
        arrow_right: '',
        arrow_left: '',
        arrows_clockwise: '',
        magnifying_glass: '',
        gear: '',
        info: '',
        question: '',
        exclamation: '',
        clock: '',
        ping: '',
        link: '',
        save: '',
        delete: '',
        plus: '',
        minus: '',
    },

    // Unicode Fallback Emojis (used when custom animated emojis aren't available)
    unicodeEmojis: {
        play: '▶️',
        pause: '⏸️',
        stop: '⏹️',
        skip: '⏭️',
        previous: '⏮️',
        shuffle: '🔀',
        loop: '🔁',
        loop_track: '🔂',
        loop_queue: '🔁',
        queue: '📋',
        volume_up: '🔊',
        volume_down: '🔉',
        volume_mute: '🔇',
        seek: '⏩',
        online: '🟢',
        idle: '🟡',
        dnd: '🔴',
        offline: '⚫',
        loading: '⏳',
        success: '✅',
        error: '❌',
        music: '🎵',
        music_note: '🎶',
        notes: '🎼',
        headphone: '🎧',
        speaker: '🔊',
        mic: '🎤',
        dj: '🎧',
        disc: '💿',
        vinyl: '📀',
        like: '👍',
        heart: '❤️',
        fire: '🔥',
        sparkles: '✨',
        star: '⭐',
        crown: '👑',
        rocket: '🚀',
        zap: '⚡',
        wave: '👋',
        party: '🎉',
        arrow_right: '➡️',
        arrow_left: '⬅️',
        arrows_clockwise: '🔄',
        magnifying_glass: '🔍',
        gear: '⚙️',
        info: 'ℹ️',
        question: '❓',
        exclamation: '❗',
        clock: '🕐',
        ping: '🏓',
        link: '🔗',
        save: '💾',
        delete: '🗑️',
        plus: '➕',
        minus: '➖',
    },

    // Status Rotation Messages
    statusRotation: [
        { type: 'LISTENING', text: '/play | 🎵 Best Music' },
        { type: 'WATCHING', text: '{guilds} servers | 👑' },
        { type: 'LISTENING', text: '{members} users jammin\' 🎧' },
        { type: 'PLAYING', text: 'with beats 🎶' },
        { type: 'COMPETING', text: 'Best Discord Music Bot 🏆' },
        { type: 'WATCHING', text: 'your queue 📋' },
        { type: 'LISTENING', text: 'Hindi | English | Bangla 🎤' },
        { type: 'STREAMING', text: '24/7 Music Radio 📻' },
    ],
};
