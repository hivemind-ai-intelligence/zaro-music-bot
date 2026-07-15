// ==============================================
// 🎤 LYRICS FINDER - Multi-source with Genius & LRCLIB
// ==============================================

const axios = require('axios');
const config = require('../../config');
const { cleanString } = require('./formatUtils');

/**
 * Main lyrics finder - tries multiple sources
 */
async function findLyrics(title, artist = '') {
    try {
        // Try LRCLIB first (free, synced lyrics, no API key needed)
        const lrclib = await searchLRCLIB(title, artist);
        if (lrclib && lrclib.lyrics && lrclib.lyrics.length > 20) {
            return {
                source: 'LRCLIB',
                title: lrclib.title || title,
                artist: lrclib.artist || artist,
                lyrics: lrclib.lyrics,
                syncedLyrics: lrclib.syncedLyrics || null,
            };
        }

        // Try Genius if API key is available
        if (config.geniusApiKey) {
            const genius = await searchGenius(title, artist);
            if (genius && genius.lyrics && genius.lyrics.length > 20) {
                return {
                    source: 'Genius',
                    title: genius.title || title,
                    artist: genius.artist || artist,
                    lyrics: genius.lyrics,
                    thumbnail: genius.thumbnail || null,
                };
            }
        }

        // Try AZLyrics scrape as last resort
        const azlyrics = await searchAZLyrics(title, artist);
        if (azlyrics && azlyrics.lyrics && azlyrics.lyrics.length > 20) {
            return {
                source: 'AZLyrics',
                title: title,
                artist: artist,
                lyrics: azlyrics.lyrics,
            };
        }

        return null;
    } catch (error) {
        console.error('[Lyrics] Error:', error.message);
        return null;
    }
}

/**
 * Search LRCLIB API (Free, no API key needed)
 */
async function searchLRCLIB(title, artist) {
    try {
        const cleanTitle = cleanString(title).replace(/\s*\(.*?\)\s*/g, '').replace(/\s*\[.*?\]\s*/g, '');
        const cleanArtist = cleanString(artist).replace(/\s*feat\..*/i, '').replace(/\s*ft\..*/i, '');

        // Try with artist first
        let url = `https://lrclib.net/api/get?artist_name=${encodeURIComponent(cleanArtist)}&track_name=${encodeURIComponent(cleanTitle)}`;
        let res = await axios.get(url, { timeout: 5000 });
        
        if (res.data && res.data.plainLyrics) {
            return {
                title: res.data.trackName || title,
                artist: res.data.artistName || artist,
                lyrics: res.data.plainLyrics,
                syncedLyrics: res.data.syncedLyrics || null,
            };
        }

        // Try without artist
        url = `https://lrclib.net/api/get?track_name=${encodeURIComponent(cleanTitle)}`;
        res = await axios.get(url, { timeout: 5000 });
        
        if (res.data && res.data.plainLyrics) {
            return {
                title: res.data.trackName || title,
                artist: res.data.artistName || artist,
                lyrics: res.data.plainLyrics,
                syncedLyrics: res.data.syncedLyrics || null,
            };
        }

        // Try search endpoint
        const searchUrl = `https://lrclib.net/api/search?q=${encodeURIComponent(cleanTitle + ' ' + cleanArtist)}`;
        const searchRes = await axios.get(searchUrl, { timeout: 5000 });
        
        if (searchRes.data && searchRes.data.length > 0) {
            const best = searchRes.data[0];
            if (best.plainLyrics) {
                return {
                    title: best.trackName || title,
                    artist: best.artistName || artist,
                    lyrics: best.plainLyrics,
                    syncedLyrics: best.syncedLyrics || null,
                };
            }
        }

        return null;
    } catch (err) {
        console.error('[LRCLIB] Error:', err.message);
        return null;
    }
}

/**
 * Search Genius API
 */
async function searchGenius(title, artist) {
    try {
        const { Client } = require('genius-lyrics');
        const geniusClient = new Client(config.geniusApiKey);
        
        // Search
        const searches = await geniusClient.songs.search(`${title} ${artist}`);
        if (!searches || searches.length === 0) return null;
        
        // Find best match
        const cleanTitle = cleanString(title).slice(0, 30);
        let bestMatch = searches[0];
        
        for (const song of searches) {
            if (cleanString(song.title).includes(cleanTitle)) {
                bestMatch = song;
                break;
            }
        }
        
        // Get lyrics
        const lyrics = await bestMatch.lyrics();
        
        return {
            title: bestMatch.title,
            artist: bestMatch.artist?.name || artist,
            lyrics: lyrics,
            thumbnail: bestMatch.image || bestMatch.thumbnail || null,
        };
    } catch (err) {
        console.error('[Genius] Error:', err.message);
        return null;
    }
}

/**
 * Search AZLyrics (web scrape fallback)
 */
async function searchAZLyrics(title, artist) {
    try {
        const cleanTitle = cleanString(title)
            .replace(/\s*\(.*?\)\s*/g, '')
            .replace(/\s*\[.*?\]\s*/g, '')
            .replace(/[^a-z0-9]/g, '')
            .toLowerCase();
        const cleanArtist = cleanString(artist)
            .replace(/\s*feat\..*/i, '')
            .replace(/[^a-z0-9]/g, '')
            .toLowerCase();

        const url = `https://azlyrics.com/lyrics/${cleanArtist}/${cleanTitle}.html`;
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ZaroMusicBot/2.0)' },
            timeout: 8000
        });

        // Extract lyrics from HTML
        const match = data.match(/Sorry about that\. -->([\s\S]*?)<\/div>/);
        if (match) {
            const lyrics = match[1]
                .replace(/<br>/g, '\n')
                .replace(/<[^>]*>/g, '')
                .replace(/&amp;/g, '&')
                .replace(/&quot;/g, '"')
                .trim();
            return { lyrics };
        }

        return null;
    } catch (err) {
        console.error('[AZLyrics] Error:', err.message);
        return null;
    }
}

/**
 * Search lyrics for Hindi/Bengali songs specifically
 */
async function findLyricsMultiLang(title, artist, lang = 'auto') {
    // Try regular search first
    const result = await findLyrics(title, artist);
    if (result) return result;

    // For Indian songs, try with transliterated titles
    const cleanTitle = cleanString(title);
    const cleanArtist = cleanString(artist);

    // Try without feat/ft sections
    const simplifiedArtist = cleanArtist.replace(/\s*feat\..*/i, '').replace(/\s*ft\..*/i, '').trim();
    if (simplifiedArtist !== cleanArtist) {
        const retry = await findLyrics(cleanTitle, simplifiedArtist);
        if (retry) return retry;
    }

    // Try with just the main title (remove parentheses)
    const mainTitle = cleanTitle.replace(/\s*\(.*?\)\s*/g, '').trim();
    if (mainTitle !== cleanTitle) {
        const retry = await findLyrics(mainTitle, cleanArtist);
        if (retry) return retry;
    }

    return null;
}

module.exports = {
    findLyrics,
    findLyricsMultiLang,
    searchLRCLIB,
    searchGenius,
    searchAZLyrics,
};
