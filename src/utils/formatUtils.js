// ==============================================
// ⏱️ FORMAT UTILS - Duration, Progress Bar, Numbers
// ==============================================

/**
 * Format milliseconds to M:SS or H:MM:SS
 */
function formatDuration(ms) {
    if (!ms || isNaN(ms)) return '0:00';
    
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));
    
    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Create a beautiful progress bar
 */
function progressBar(current, total, size = 20) {
    if (!total || total <= 0) {
        return '▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬▬';
    }
    
    const percentage = Math.min(current / total, 1);
    const filled = Math.round(size * percentage);
    const empty = size - filled;
    
    const filledBlock = '▬';
    const emptyBlock = '▬';
    const position = '🔘';
    
    let bar = '';
    for (let i = 0; i < filled; i++) bar += filledBlock;
    bar += position;
    for (let i = 0; i < empty - 1; i++) bar += emptyBlock;
    
    return bar;
}

/**
 * Format number with commas
 */
function formatNumber(num) {
    return num?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') || '0';
}

/**
 * Format bytes to human readable
 */
function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Clean string for comparison
 */
function cleanString(str) {
    return str?.toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim() || '';
}

/**
 * Truncate string with ellipsis
 */
function truncate(str, maxLen = 100) {
    if (!str) return '';
    return str.length > maxLen ? str.slice(0, maxLen - 3) + '...' : str;
}

/**
 * Generate random string
 */
function randomString(length = 8) {
    return Math.random().toString(36).substring(2, 2 + length);
}

/**
 * Parse time string like "1m 30s" to ms
 */
function parseTime(str) {
    const time = str.toLowerCase().trim();
    let ms = 0;
    
    const hourMatch = time.match(/(\d+)\s*h/);
    const minMatch = time.match(/(\d+)\s*m/);
    const secMatch = time.match(/(\d+)\s*s/);
    
    if (hourMatch) ms += parseInt(hourMatch[1]) * 3600000;
    if (minMatch) ms += parseInt(minMatch[1]) * 60000;
    if (secMatch) ms += parseInt(secMatch[1]) * 1000;
    
    return ms || parseInt(time) * 1000;
}

module.exports = {
    formatDuration,
    progressBar,
    formatNumber,
    formatBytes,
    cleanString,
    truncate,
    randomString,
    parseTime,
};
