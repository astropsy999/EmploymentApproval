/**
 * Логирует сообщение в консоль с указанным цветом.
 * @param message Сообщение для вывода.
 * @param color Цвет в формате ANSI Escape Code.
 */
export function logWithColor(message: string, color: string): void {
    console.log(`${color}${message}\x1b[0m`);
}

/**
 * Логирует сообщение зелёным цветом.
 * @param message Сообщение для вывода.
 */
export function logSuccess(message: string): void {
    const green = '\x1b[32m'; // ANSI код для зелёного цвета
    logWithColor(message, green);
}

/**
 * Логирует сообщение жёлтым цветом.
 * @param message Сообщение для вывода.
 */
export function logWarning(message: string): void {
    const yellow = '\x1b[33m'; // ANSI код для жёлтого цвета
    logWithColor(message, yellow);
}

/**
 * Логирует сообщение красным цветом.
 * @param message Сообщение для вывода.
 */
export function logError(message: string): void {
    const red = '\x1b[31m'; // ANSI код для красного цвета
    logWithColor(message, red);
}
