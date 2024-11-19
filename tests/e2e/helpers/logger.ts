import chalk from 'chalk';

/**
 * Логирует сообщение в консоль с указанным стилем.
 * @param message Сообщение для вывода.
 * @param style Функция стиля из Chalk.
 */
function logWithStyle(message: string, style: (msg: string) => string): void {
    console.log(style(message));
}

/**
 * Логирует сообщение зелёным цветом (успех).
 * @param message Сообщение для вывода.
 */
export function logSuccess(message: string): void {
    logWithStyle(`[SUCCESS] ${message}`, chalk.green.bold);
}

/**
 * Логирует сообщение жёлтым цветом (предупреждение).
 * @param message Сообщение для вывода.
 */
export function logWarning(message: string): void {
    logWithStyle(`[WARNING] ${message}`, chalk.yellow.bold);
}

/**
 * Логирует сообщение красным цветом (ошибка).
 * @param message Сообщение для вывода.
 */
export function logError(message: string): void {
    logWithStyle(`[ERROR] ${message}`, chalk.red.bold);
}

/**
 * Логирует сообщение с синим цветом (информация).
 * @param message Сообщение для вывода.
 */
export function logInfo(message: string): void {
    logWithStyle(`[INFO] ${message}`, chalk.blue.bold);
}
