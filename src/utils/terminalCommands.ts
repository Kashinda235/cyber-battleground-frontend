export interface TerminalEntry {
    id: string;
    type: 'system' | 'user' | 'error' | 'action' | 'load' | 'test' ;
    content: string;
    timestamp: string;
}

export const terminalCommand = (
    cmd: string,
    setTerminalHistory: React.Dispatch<React.SetStateAction<TerminalEntry[]>>
) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const timestamp = new Date().toLocaleTimeString();

    // Support parsing arguments while preserving quoted strings
    const args = trimmed.match(/(?:[^\s"]+|"[^"]*")+/g)?.map(arg => arg.replace(/^"|"$/g, '')) || [];
    const command = args[0].toLowerCase();

    const userEntry: TerminalEntry = {
        id: `${Date.now()}-user`,
        type: 'user',
        content: cmd,
        timestamp,
    };

    const resultEntries: TerminalEntry[] = [];

    // Helper to create response entries cleanly
    const createEntry = (content: string, type: 'system' | 'error' = 'system'): TerminalEntry => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        type,
        content,
        timestamp,
    });

    switch (command) {
        case 'help':
            resultEntries.push(createEntry(
                `Available commands:\n` +
                `  help            - Show available options\n` +
                `  about           - Display system information\n` +
                `  whoami          - Print current user session\n` +
                `  uname           - Print system & kernel architecture\n` +
                `  pwd             - Print current working directory\n` +
                `  ls [path]       - List directory contents\n` +
                `  cat <file>      - Output file contents\n` +
                `  echo <msg>      - Print a message to terminal\n` +
                `  date            - Output current system timestamp\n` +
                `  uptime          - Show session uptime\n` +
                `  ping <host>     - Ping network host\n` +
                `  history         - Show command history\n` +
                `  clear           - Clear terminal history`
            ));
            break;

        case 'about':
            resultEntries.push(createEntry('DevOS Terminal v2.4.0 — Integrated Web Command Interface.'));
            break;

        case 'whoami':
            resultEntries.push(createEntry('guest@devos-desktop'));
            break;

        case 'uname':
            const flag = args[1]?.toLowerCase();
            if (flag === '-a' || flag === '--all') {
                resultEntries.push(createEntry('DevOS 2026.1-RELEASE x86_64 WebKit/V8 JS-Kernel'));
            } else {
                resultEntries.push(createEntry('DevOS'));
            }
            break;

        case 'pwd':
            resultEntries.push(createEntry('/home/guest'));
            break;

        case 'ls':
            const path = args[1] || '.';
            if (path === '.' || path === '/home/guest') {
                resultEntries.push(createEntry('documents/   downloads/   projects/   readme.txt   config.json'));
            } else if (path === 'documents') {
                resultEntries.push(createEntry('resume.pdf   notes.md'));
            } else if (path === 'projects') {
                resultEntries.push(createEntry('web-app/   api-service/'));
            } else {
                resultEntries.push(createEntry(`ls: cannot access '${path}': No such file or directory`, 'error'));
            }
            break;

        case 'cat':
            const targetFile = args[1];
            if (!targetFile) {
                resultEntries.push(createEntry('cat: missing file operand', 'error'));
            } else if (targetFile === 'readme.txt') {
                resultEntries.push(createEntry('Welcome to DevOS! Type "help" to view all supported utilities.'));
            } else if (targetFile === 'config.json') {
                resultEntries.push(createEntry('{\n  "theme": "dark",\n  "shell": "zsh",\n  "version": "2.4.0"\n}'));
            } else {
                resultEntries.push(createEntry(`cat: ${targetFile}: No such file or directory`, 'error'));
            }
            break;

        case 'date':
            resultEntries.push(createEntry(new Date().toLocaleString()));
            break;

        case 'echo':
            resultEntries.push(createEntry(args.slice(1).join(' ') || ''));
            break;

        case 'uptime':
            const uptimeMinutes = Math.floor(performance.now() / 60000);
            resultEntries.push(createEntry(`up ${uptimeMinutes} minutes, 1 user, load average: 0.08, 0.03, 0.01`));
            break;

        case 'ping':
            const host = args[1];
            if (!host) {
                resultEntries.push(createEntry('ping: missing host destination', 'error'));
            } else {
                resultEntries.push(createEntry(
                    `PING ${host} (127.0.0.1): 56 data bytes\n` +
                    `64 bytes from 127.0.0.1: icmp_seq=0 ttl=64 time=0.042 ms\n` +
                    `64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.038 ms\n` +
                    `--- ${host} ping statistics ---\n` +
                    `2 packets transmitted, 2 packets received, 0.0% packet loss`
                ));
            }
            break;

        case 'sudo':
            resultEntries.push(createEntry('Permission denied: Guest user cannot execute root commands.', 'error'));
            break;

        case 'history':
            // Renders command history from state inside setTerminalHistory callback
            setTerminalHistory((prev) => {
                const historyLines = prev
                    .filter((e) => e.type === 'user')
                    .map((e, idx) => ` ${idx + 1}  ${e.content}`)
                    .join('\n');

                const historyEntry = createEntry(historyLines || 'No history recorded yet.');
                return [...prev, userEntry, historyEntry];
            });
            return;

        case 'clear':
            setTerminalHistory([]);
            return;

        default:
            resultEntries.push(createEntry(`Command not found: ${command}. Type 'help' for available commands.`, 'error'));
    }

    setTerminalHistory((prev) => [...prev, userEntry, ...resultEntries]);
};