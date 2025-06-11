import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { l10n } from 'vscode';

interface ProjectStructure {
    name: string;
    type: 'file' | 'directory';
    path: string;
    children?: ProjectStructure[];
    size?: number;
    extension?: string;
}

interface ExtensionConfig {
    language: string;
    enableOnSave: boolean;
    includeHiddenFiles: boolean;
    maxFileSize: number;
    excludePatterns: string[];
    outputFileName: string;
    outputFormat: string;
    notificationLevel: string;
}

enum OutputFormat {
    BOTH = 'both',
    TXT = 'txt',
    MD = 'md'
}

enum NotificationLevel {
    SILENT = 'silent',
    MINIMAL = 'minimal',
    ALL = 'all'
}

enum NotificationType {
    INFO = 'info',
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
    ACTIVATION = 'activation',
    COMMAND_EXECUTED = 'command_executed',
    EXPORT_STARTING = 'export_starting',
    LANGUAGE_CHANGED = 'language_changed'
}
class LocalizationManager {
    private static instance: LocalizationManager;
    private currentLanguage: string = 'en';
    private translations: { [key: string]: { [lang: string]: string } } = {};

    private constructor() {
        this.loadTranslations();
    }

    public static getInstance(): LocalizationManager {
        if (!LocalizationManager.instance) {
            LocalizationManager.instance = new LocalizationManager();
        }
        return LocalizationManager.instance;
    }

    private loadTranslations() {
        this.translations = {
            'command.exportProject.title': {
                'en': 'Export Project to Text File',
                'pt-BR': 'Exportar Projeto para Arquivo de Texto'
            },
            'command.toggleAutoExport.title': {
                'en': 'Toggle Auto Export',
                'pt-BR': 'Alternar Exportação Automática'
            },
            'export.success': {
                'en': 'Project exported successfully to: {0}',
                'pt-BR': 'Projeto exportado com sucesso para: {0}'
            },
            'export.success.multiple': {
                'en': 'Project exported successfully to: {0} and {1}',
                'pt-BR': 'Projeto exportado com sucesso para: {0} e {1}'
            },
            'export.error': {
                'en': 'Error exporting project: {0}',
                'pt-BR': 'Erro ao exportar projeto: {0}'
            },
            'export.noWorkspace': {
                'en': 'No workspace folder is open',
                'pt-BR': 'Nenhuma pasta de workspace está aberta'
            },
            'export.starting': {
                'en': 'Starting project export...',
                'pt-BR': 'Iniciando exportação do projeto...'
            },
            'export.autoEnabled': {
                'en': 'Auto-export enabled',
                'pt-BR': 'Exportação automática habilitada'
            },
            'export.autoDisabled': {
                'en': 'Auto-export disabled',
                'pt-BR': 'Exportação automática desabilitada'
            },
            'export.cleanedPrevious': {
                'en': 'Cleaned previous output file: {0}',
                'pt-BR': 'Arquivo de saída anterior removido: {0}'
            },
            'export.cleanupError': {
                'en': 'Warning: Could not clean previous output file',
                'pt-BR': 'Aviso: Não foi possível limpar arquivo de saída anterior'
            },
            'notification.level.silent': {
                'en': 'Silent',
                'pt-BR': 'Silencioso'
            },
            'notification.level.minimal': {
                'en': 'Minimal',
                'pt-BR': 'Discreto'
            },
            'notification.level.all': {
                'en': 'All Messages',
                'pt-BR': 'Todas as Mensagens'
            }
        };
    }

    public setLanguage(language: string) {
        this.currentLanguage = language;
        console.log(`LocalizationManager: Language set to ${language}`);
    }

    public getString(key: string, fallback?: string): string {
        const translation = this.translations[key]?.[this.currentLanguage];
        if (translation) {
            return translation;
        }
        
        // Fallback para inglês se a tradução não existir
        const englishTranslation = this.translations[key]?.['en'];
        if (englishTranslation) {
            return englishTranslation;
        }

        return fallback || key;
    }

    public formatString(key: string, ...args: string[]): string {
        let text = this.getString(key);
        args.forEach((arg, index) => {
            text = text.replace(`{${index}}`, arg);
        });
        return text;
    }
}

class NotificationManager {
    private localizationManager: LocalizationManager;
    private notificationLevel: NotificationLevel;

    constructor(localizationManager: LocalizationManager) {
        this.localizationManager = localizationManager;
        this.notificationLevel = NotificationLevel.MINIMAL; // Padrão
    }

    public setNotificationLevel(level: string) {
        this.notificationLevel = level as NotificationLevel;
        console.log(`NotificationManager: Notification level set to ${level}`);
    }

    public shouldShowNotification(type: NotificationType): boolean {
        switch (this.notificationLevel) {
            case NotificationLevel.SILENT:
                return false;
            
            case NotificationLevel.MINIMAL:
                return type === NotificationType.SUCCESS || 
                       type === NotificationType.ERROR;
            
            case NotificationLevel.ALL:
                return true;
            
            default:
                return true;
        }
    }

    public showInfo(message: string, type: NotificationType = NotificationType.INFO) {
        if (this.shouldShowNotification(type)) {
            vscode.window.showInformationMessage(message);
        }
        console.log(`INFO: ${message}`);
    }

    public showSuccess(message: string) {
        if (this.shouldShowNotification(NotificationType.SUCCESS)) {
            vscode.window.showInformationMessage(message);
        }
        console.log(`SUCCESS: ${message}`);
    }

    public showWarning(message: string, type: NotificationType = NotificationType.WARNING) {
        if (this.shouldShowNotification(type)) {
            vscode.window.showWarningMessage(message);
        }
        console.log(`WARNING: ${message}`);
    }

    public showError(message: string) {
        if (this.shouldShowNotification(NotificationType.ERROR)) {
            vscode.window.showErrorMessage(message);
        }
        console.log(`ERROR: ${message}`);
    }

    public showLocalizedInfo(key: string, type: NotificationType = NotificationType.INFO, ...args: string[]) {
        const message = args.length > 0 
            ? this.localizationManager.formatString(key, ...args)
            : this.localizationManager.getString(key);
        this.showInfo(message, type);
    }

    public showLocalizedSuccess(key: string, ...args: string[]) {
        const message = args.length > 0 
            ? this.localizationManager.formatString(key, ...args)
            : this.localizationManager.getString(key);
        this.showSuccess(message);
    }

    public showLocalizedWarning(key: string, type: NotificationType = NotificationType.WARNING, ...args: string[]) {
        const message = args.length > 0 
            ? this.localizationManager.formatString(key, ...args)
            : this.localizationManager.getString(key);
        this.showWarning(message, type);
    }

    public showLocalizedError(key: string, ...args: string[]) {
        const message = args.length > 0 
            ? this.localizationManager.formatString(key, ...args)
            : this.localizationManager.getString(key);
        this.showError(message);
    }
}
class ProjectExporter {
    private context: vscode.ExtensionContext;
    private outputChannel: vscode.OutputChannel;
    private modifiedFiles: Set<string> = new Set();
    private localizationManager: LocalizationManager;
    private notificationManager: NotificationManager;

    // Supported text file extensions
    private readonly textExtensions = [
        '.html', '.htm', '.css', '.js', '.jsx', '.ts', '.tsx', '.htaccess',
        '.json', '.xml', '.txt', '.md', '.yml', '.yaml',
        '.php', '.py', '.cs', '.java', '.cpp', '.c', '.h',
        '.sql', '.ps1', '.bat', '.cmd', '.sh', '.vue',
        '.svelte', '.scss', '.sass', '.less', '.ini',
        '.conf', '.config', '.log', '.gitignore', '.env',
        '.dockerfile', '.Dockerfile', '.makefile', '.Makefile',
        '.go', '.rs', '.rb', '.swift', '.kt', '.scala',
        '.r', '.R', '.m', '.mm', '.pl', '.pm', '.lua',
        '.tcl', '.vb', '.vbs', '.asm', '.s', '.f', '.f90',
        '.pro', '.cmake', '.gradle', '.properties', '.toml',
        '.lock', '.cfg', '.cnf', '.inf', '.reg', '.manifest'
    ];

    private readonly languageMap: { [key: string]: string } = {
        '.js': 'javascript',
        '.jsx': 'jsx',
        '.ts': 'typescript',
        '.tsx': 'typescript',
        '.py': 'python',
        '.java': 'java',
        '.cpp': 'cpp',
        '.c': 'c',
        '.cs': 'csharp',
        '.php': 'php',
        '.rb': 'ruby',
        '.go': 'go',
        '.rs': 'rust',
        '.swift': 'swift',
        '.kt': 'kotlin',
        '.scala': 'scala',
        '.html': 'html',
        '.css': 'css',
        '.scss': 'scss',
        '.sass': 'sass',
        '.less': 'less',
        '.xml': 'xml',
        '.json': 'json',
        '.yaml': 'yaml',
        '.yml': 'yaml',
        '.sql': 'sql',
        '.sh': 'bash',
        '.ps1': 'powershell',
        '.bat': 'batch',
        '.cmd': 'batch',
        '.dockerfile': 'dockerfile',
        '.vue': 'vue',
        '.svelte': 'svelte'
    };

    private calculateMD5(filePath: string): string {
        try {
            const fileBuffer = fs.readFileSync(filePath);
            const hash = crypto.createHash('md5');
            hash.update(fileBuffer);
            return hash.digest('hex');
        } catch (error) {
            console.error(`Error calculating MD5 for ${filePath}:`, error);
            return 'error';
        }
    }

    private calculateSHA256(filePath: string): string {
        try {
            const fileBuffer = fs.readFileSync(filePath);
            const hash = crypto.createHash('sha256');
            hash.update(fileBuffer);
            return hash.digest('hex');
        } catch (error) {
            console.error(`Error calculating SHA256 for ${filePath}:`, error);
            return 'error';
        }
    }

    private detectEncoding(filePath: string): string {
        try {
            const buffer = fs.readFileSync(filePath);
            
            if (buffer.length >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
                return 'UTF-8 (with BOM)';
            }
            
            if (buffer.length >= 2) {
                if ((buffer[0] === 0xFF && buffer[1] === 0xFE) || (buffer[0] === 0xFE && buffer[1] === 0xFF)) {
                    return 'UTF-16';
                }
            }
            
            let hasNonAscii = false;
            for (let i = 0; i < Math.min(buffer.length, 1024); i++) {
                if (buffer[i] > 127) {
                    hasNonAscii = true;
                    break;
                }
            }
            
            if (!hasNonAscii) {
                return 'ASCII';
            }
            
            try {
                const decoded = buffer.toString('utf8');
                return 'UTF-8';
            } catch {
                return 'Binary/Unknown';
            }
        } catch (error) {
            console.error(`Error detecting encoding for ${filePath}:`, error);
            return 'Unknown';
        }
    }

    private formatTimestampWithTimezone(timestamp: Date): string {
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const gmtOffset = timestamp.getTimezoneOffset();
        const gmtString = `GMT${gmtOffset <= 0 ? '+' : '-'}${Math.abs(Math.floor(gmtOffset / 60)).toString().padStart(2, '0')}:${Math.abs(gmtOffset % 60).toString().padStart(2, '0')}`;
        
        return `${timestamp.toISOString().replace('T', ' ').substring(0, 19)} (${timezone} / ${gmtString})`;
    }

    private generateTableOfContents(structure: ProjectStructure[]): string {
        let toc = `## 📑 Table of Contents\n\n`;
        
        const fileLinks = this.generateFileLinks(structure);
        if (fileLinks.length > 0) {
            toc += `**Project Files:**\n\n`;
            fileLinks.forEach(link => {
                toc += `- [📄 ${link.name}](#${link.anchor})\n`;
            });
        } else {
            toc += `*No text files found to display.*\n`;
        }
        
        toc += `\n---\n\n`;
        
        return toc;
    }

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.outputChannel = vscode.window.createOutputChannel('Easy Project Export');

        this.localizationManager = LocalizationManager.getInstance();

        this.notificationManager = new NotificationManager(this.localizationManager);

        const config = this.getConfig();
        this.localizationManager.setLanguage(config.language);
        this.notificationManager.setNotificationLevel(config.notificationLevel);

        console.log('ProjectExporter: Constructor called');
        this.outputChannel.appendLine('ProjectExporter: Constructor completed');
    }

private generateFileLinks(items: ProjectStructure[]): Array<{name: string, anchor: string}> {
    const links: Array<{name: string, anchor: string}> = [];
    
    const processItems = (items: ProjectStructure[]) => {
        for (const item of items) {
            if (item.type === 'directory' && item.children) {
                processItems(item.children);
            } else if (item.type === 'file' && this.isTextFile(item.path)) {
                const workspaceRoot = vscode.workspace.workspaceFolders![0].uri.fsPath;
                const relativePath = path.relative(workspaceRoot, item.path);
                const normalizedPath = relativePath.replace(/\\/g, '/');
                
                const anchor = normalizedPath
                    .toLowerCase()
                    .replace(/[^a-z0-9]/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, '');
                
                links.push({
                    name: normalizedPath,
                    anchor: `📄-${anchor}`
                });
            }
        }
    };
    
    processItems(items);
    return links;
}

    private getExtensionVersion(): string {
        try {
            // Usar a API do VS Code para obter metadados da extensão
            const packageJSON = this.context.extension.packageJSON;
            const version = packageJSON.version || '1.0.0';
            console.log(`ProjectExporter: Extension version: ${version}`);
            return version;
        } catch (error) {
            console.error('ProjectExporter: Error reading extension version:', error);
            // Fallback para versão padrão se houver erro
            return '1.0.0';
        }
    }

    private getExtensionInfo(): { name: string; version: string; displayName: string } {
        try {
            const packageJSON = this.context.extension.packageJSON;
            return {
                name: packageJSON.name || 'easy-whole-project-to-single-text-file-for-llms',
                version: packageJSON.version || '1.0.0',
                displayName: packageJSON.displayName || 'Easy Whole Project to Single Text File for LLMs'
            };
        } catch (error) {
            console.error('ProjectExporter: Error reading extension info:', error);
            return {
                name: 'easy-whole-project-to-single-text-file-for-llms',
                version: '1.0.0',
                displayName: 'Easy Whole Project to Single Text File for LLMs'
            };
        }
    }

    private getConfig(): ExtensionConfig {
        console.log('ProjectExporter: Getting configuration');
        const config = vscode.workspace.getConfiguration('easyProjectExport');
        const configObj = {
            language: config.get('language', 'en'),
            enableOnSave: config.get('enableOnSave', true),
            includeHiddenFiles: config.get('includeHiddenFiles', false),
            maxFileSize: config.get('maxFileSize', 1048576), // 1MB
            excludePatterns: config.get('excludePatterns', []),
            outputFileName: config.get('outputFileName', '{workspaceName}-output'),
            outputFormat: config.get('outputFormat', 'both'),
            notificationLevel: config.get('notificationLevel', 'minimal')
        };
        console.log('ProjectExporter: Configuration loaded:', configObj);
        return configObj;
    }

    public updateConfig(config: ExtensionConfig) {
        this.localizationManager.setLanguage(config.language);
        this.notificationManager.setNotificationLevel(config.notificationLevel); // NOVA LINHA
        console.log(`ProjectExporter: Configuration updated`);
    }

    private async deleteExistingOutputFile(workspacePath: string, extension: string): Promise<void> {
        try {
            const outputFileName = this.generateOutputFileName(this.getConfig(), workspacePath, extension);
            const outputFilePath = path.join(workspacePath, outputFileName);
            
            console.log(`ProjectExporter: Checking for existing ${extension.toUpperCase()} output file: ${outputFilePath}`);
            
            try {
                await fs.promises.access(outputFilePath);
                console.log(`ProjectExporter: Found existing ${extension.toUpperCase()} output file, deleting: ${outputFileName}`);
                
                await fs.promises.unlink(outputFilePath);
                console.log(`ProjectExporter: Successfully deleted existing ${extension.toUpperCase()} output file: ${outputFileName}`);
                
                const message = this.getLocalizedString('export.cleanedPrevious', `Cleaned previous output file: ${outputFileName}`);
                this.outputChannel.appendLine(message);
                
            } catch (accessError) {
                console.log(`ProjectExporter: No existing ${extension.toUpperCase()} output file found: ${outputFileName}`);
            }
            
        } catch (error) {
            console.error(`ProjectExporter: Error during ${extension.toUpperCase()} output file cleanup:`, error);
            const errorMsg = this.getLocalizedString('export.cleanupError', 'Warning: Could not clean previous output file');
            this.outputChannel.appendLine(`WARNING: ${errorMsg} - ${error}`);
        }
    }

    private isCurrentOutputFile(filePath: string, workspacePath: string): boolean {
        const config = this.getConfig();
        const fileName = path.basename(filePath);
        
        let isCurrentOutput = false;
        
        if (config.outputFormat === OutputFormat.BOTH || config.outputFormat === OutputFormat.TXT) {
            const expectedTxtFileName = this.generateOutputFileName(config, workspacePath, 'txt');
            isCurrentOutput = isCurrentOutput || fileName === expectedTxtFileName;
        }
        
        if (config.outputFormat === OutputFormat.BOTH || config.outputFormat === OutputFormat.MD) {
            const expectedMdFileName = this.generateOutputFileName(config, workspacePath, 'md');
            isCurrentOutput = isCurrentOutput || fileName === expectedMdFileName;
        }
        
        if (isCurrentOutput) {
            console.log(`ProjectExporter: Excluding current output file: ${fileName}`);
        }
        
        return isCurrentOutput;
    }

    private isLikelyOutputFile(filePath: string): boolean {
        const fileName = path.basename(filePath);
        
        const outputPatterns = [
            /-ESTRUTURA-E-ARQUIVOS-DO-PROJETO\.(txt|md)$/i,
            /-output\.(txt|md)$/i,
            /-project-export\.(txt|md)$/i,
            /-full-project\.(txt|md)$/i
        ];
        
        const isLikelyOutput = outputPatterns.some(pattern => pattern.test(fileName));
        
        if (isLikelyOutput) {
            console.log(`ProjectExporter: Excluding likely output file: ${fileName}`);
        }
        
        return isLikelyOutput;
    }

    private getLocalizedString(key: string, fallback?: string): string {
        return this.localizationManager.getString(key, fallback);
    }

    private formatLocalizedString(key: string, ...args: string[]): string {
        return this.localizationManager.formatString(key, ...args);
    }

    public updateLanguage(language: string) {
        this.localizationManager.setLanguage(language);
        console.log(`ProjectExporter: Language updated to ${language}`);
    }

    private isTextFile(filePath: string): boolean {
        const ext = path.extname(filePath).toLowerCase();
        return this.textExtensions.includes(ext);
    }

    private shouldExcludeFile(filePath: string, config: ExtensionConfig): boolean {
        const workspaceRoot = vscode.workspace.workspaceFolders![0].uri.fsPath;
        const relativePath = path.relative(workspaceRoot, filePath);
        const fileName = path.basename(filePath);
        
        const normalizedRelativePath = relativePath.replace(/\\/g, '/');

        if (this.isCurrentOutputFile(filePath, workspaceRoot)) {
            console.log(`ProjectExporter: Excluding current output file: ${normalizedRelativePath}`);
            return true;
        }

        if (this.isLikelyOutputFile(filePath)) {
            console.log(`ProjectExporter: Excluding likely output file: ${normalizedRelativePath}`);
            return true;
        }
        
        console.log(`ProjectExporter: Checking exclusion for: ${normalizedRelativePath}`);

        if (!config.includeHiddenFiles && fileName.startsWith('.')) {
            console.log(`ProjectExporter: Excluding hidden file: ${normalizedRelativePath}`);
            return true;
        }

        for (const pattern of config.excludePatterns) {
            if (this.matchesPattern(normalizedRelativePath, pattern)) {
                console.log(`ProjectExporter: Excluding by pattern "${pattern}": ${normalizedRelativePath}`);
                return true;
            }
        }

        return false;
    }

    private matchesPattern(filePath: string, pattern: string): boolean {
        const normalizedPattern = pattern.replace(/\\/g, '/');
        
        if (normalizedPattern.endsWith('/**')) {
            const basePattern = normalizedPattern.slice(0, -3); // Remove '/**'
            return filePath.startsWith(basePattern + '/') || filePath === basePattern;
        }
        
        if (normalizedPattern.endsWith('**')) {
            const basePattern = normalizedPattern.slice(0, -2); // Remove '**'
            return filePath.startsWith(basePattern);
        }
        
        let regexPattern = normalizedPattern
            .replace(/\./g, '\\.')
            .replace(/\*\*/g, '.*')
            .replace(/\*/g, '[^/]*')
            .replace(/\?/g, '[^/]');
        
        if (!regexPattern.startsWith('^')) {
            regexPattern = '^' + regexPattern;
        }
        if (!regexPattern.endsWith('$')) {
            regexPattern = regexPattern + '$';
        }
        
        try {
            const regex = new RegExp(regexPattern);
            const matches = regex.test(filePath);
            
            if (matches) {
                console.log(`ProjectExporter: Pattern "${pattern}" (regex: ${regexPattern}) matched: ${filePath}`);
            }
            
            return matches;
        } catch (error) {
            console.error(`ProjectExporter: Invalid regex pattern "${regexPattern}" from glob "${pattern}":`, error);
            return false;
        }
    }

    private generateOutputFileName(config: ExtensionConfig, workspacePath: string, extension: string): string {
        const workspaceName = path.basename(workspacePath).trim().replace(/\s+/g, '-');
        let fileName = config.outputFileName.trim();
        
        fileName = fileName.replace(/\{workspaceName\}/g, workspaceName);
        fileName = fileName.replace(/\s+/g, '-');
        fileName = fileName.replace(/[<>:"/\\|?*]/g, '-');
        fileName = fileName.replace(/\.(txt|md)$/i, '');
        
        fileName = `${fileName}.${extension}`;
        
        console.log(`ProjectExporter: Generated output filename: ${fileName}`);
        return fileName;
    }

    private async generateMarkdownContent(
        projectName: string, 
        structure: ProjectStructure[], 
        config: ExtensionConfig,
        extensionInfo: any,
        now: Date,
        timezone: string,
        gmtString: string
    ): Promise<string> {
        let content = `# 📁 PROJECT EXPORT FOR LLMs\n\n`;
        
        // Project metadata
        content += `## 📊 Project Information\n\n`;
        content += `- **Project Name**: \`${projectName}\`\n`;
        content += `- **Generated On**: ${now.toISOString().replace('T', ' ').substring(0, 19)} (${timezone} / ${gmtString})\n`;
        content += `- **Total Files Processed**: ${this.countFiles(structure)}\n`;
        content += `- **Export Tool**: ${extensionInfo.displayName} v${extensionInfo.version}\n`;
        content += `- **Tool Author**: Jota / José Guilherme Pandolfi\n\n`;

        // Used export configs
        content += `### ⚙️ Export Configuration\n\n`;
        content += `| Setting | Value |\n`;
        content += `|---------|-------|\n`;
        content += `| Language | \`${config.language}\` |\n`;
        content += `| Max File Size | \`${this.formatFileSize(config.maxFileSize)}\` |\n`;
        content += `| Include Hidden Files | \`${config.includeHiddenFiles}\` |\n`;
        content += `| Output Format | \`${config.outputFormat}\` |\n\n`;

        // Project structure
        content += `## 🌳 Project Structure\n\n`;
        content += `\`\`\`\n`;
        content += this.generateTreeStructure(structure);
        content += `\`\`\`\n\n`;

        // Table of contents
        content += this.generateTableOfContents(structure);

        // Project stats
        const stats = this.generateProjectStats(structure);
        content += `## 📈 Project Statistics\n\n`;
        content += `| Metric | Count |\n`;
        content += `|--------|-------|\n`;
        content += `| Total Files | ${stats.totalFiles} |\n`;
        content += `| Total Directories | ${stats.totalDirectories} |\n`;
        content += `| Text Files | ${stats.textFiles} |\n`;
        content += `| Binary Files | ${stats.binaryFiles} |\n`;
        content += `| Total Size | ${this.formatFileSize(stats.totalSize)} |\n\n`;

        // File types
        if (stats.fileTypes.size > 0) {
            content += `### 📄 File Types Distribution\n\n`;
            content += `| Extension | Count |\n`;
            content += `|-----------|-------|\n`;
            Array.from(stats.fileTypes.entries())
                .sort((a, b) => b[1] - a[1])
                .forEach(([ext, count]) => {
                    content += `| \`${ext || 'no extension'}\` | ${count} |\n`;
                });
            content += `\n`;
        }

        content += `## 💻 File Code Contents\n\n`;
        content += await this.generateMarkdownFileContent(structure, config);

        return content;
    }

    private generateProjectStats(items: ProjectStructure[]): {
        totalFiles: number;
        totalDirectories: number;
        textFiles: number;
        binaryFiles: number;
        totalSize: number;
        fileTypes: Map<string, number>;
    } {
        const stats = {
            totalFiles: 0,
            totalDirectories: 0,
            textFiles: 0,
            binaryFiles: 0,
            totalSize: 0,
            fileTypes: new Map<string, number>()
        };

        const processItems = (items: ProjectStructure[]) => {
            for (const item of items) {
                if (item.type === 'directory') {
                    stats.totalDirectories++;
                    if (item.children) {
                        processItems(item.children);
                    }
                } else {
                    stats.totalFiles++;
                    stats.totalSize += item.size || 0;
                    
                    if (this.isTextFile(item.path)) {
                        stats.textFiles++;
                    } else {
                        stats.binaryFiles++;
                    }

                    const ext = item.extension || '';
                    stats.fileTypes.set(ext, (stats.fileTypes.get(ext) || 0) + 1);
                }
            }
        };

        processItems(items);
        return stats;
    }

    private async generateMarkdownFileContent(items: ProjectStructure[], config: ExtensionConfig): Promise<string> {
        let content = '';
        const binaryFiles: string[] = [];

        for (const item of items) {
            if (item.type === 'directory' && item.children) {
                content += await this.generateMarkdownFileContent(item.children, config);
            } else if (item.type === 'file') {
                const workspaceRoot = vscode.workspace.workspaceFolders![0].uri.fsPath;
                const relativePath = path.relative(workspaceRoot, item.path);
                const normalizedPath = relativePath.replace(/\\/g, '/');
                
                if (this.isTextFile(item.path) && (item.size || 0) <= config.maxFileSize) {
                    try {
                        const fileContent = await fs.promises.readFile(item.path, 'utf-8');
                        const language = this.getLanguageFromExtension(item.extension || '');
                        
                        // File anchor link
                        const anchor = normalizedPath
                            .toLowerCase()
                            .replace(/[^a-z0-9]/g, '-')
                            .replace(/-+/g, '-')
                            .replace(/^-|-$/g, '');

                        content += `### <a id="📄-${anchor}"></a>📄 \`${normalizedPath}\`\n\n`;
                        
                        // File info
                        content += `**File Info:**\n`;
                        content += `- **Size**: ${this.formatFileSize(item.size || 0)}\n`;
                        content += `- **Extension**: \`${item.extension || 'none'}\`\n`;
                        content += `- **Language**: \`${language}\`\n`;
                        content += `- **Location**: \`${normalizedPath}\`\n`;
                        content += `- **Relative Path**: \`${path.dirname(normalizedPath) === '.' ? 'root' : path.dirname(normalizedPath)}\`\n`;
                        
                        // File stats
                        try {
                            const stats = await fs.promises.stat(item.path);
                            content += `- **Created**: ${this.formatTimestampWithTimezone(stats.birthtime)}\n`;
                            content += `- **Modified**: ${this.formatTimestampWithTimezone(stats.mtime)}\n`;
                        } catch (error) {
                            content += `- **Created**: Unable to retrieve\n`;
                            content += `- **Modified**: Unable to retrieve\n`;
                        }
                        
                        // Hashes
                        content += `- **MD5**: \`${this.calculateMD5(item.path)}\`\n`;
                        content += `- **SHA256**: \`${this.calculateSHA256(item.path)}\`\n`;
                        
                        // Encoding
                        content += `- **Encoding**: ${this.detectEncoding(item.path)}\n`;
                        
                        content += `\n`;
                        
                        content += `**File code content:**\n\n`;
                        
                        if (item.extension?.toLowerCase() === '.md') {
                            content += this.escapeMarkdownContent(fileContent);
                        } else {
                            content += `\`\`\`${language}\n`;
                            content += fileContent;
                            content += `\n\`\`\`\n\n`;
                        }
                        
                        content += `---\n\n`;
                    } catch (error) {
                        console.error(`Error reading file ${item.path}:`, error);
                        binaryFiles.push(normalizedPath);
                    }
                } else {
                    binaryFiles.push(normalizedPath);
                }
            }
        }

        // Ignored binaries
        if (binaryFiles.length > 0) {
            content += `## 🚫 Binary/Excluded Files\n\n`;
            content += `The following files were not included in the text content:\n\n`;
            binaryFiles.forEach(file => {
                content += `- \`${file}\`\n`;
            });
            content += `\n`;
        }

        return content;
    }
    
    private escapeMarkdownContent(content: string): string {
        let escapedContent = content;
        
        escapedContent = escapedContent.replace(/```/g, '~~~~');
        
        return `\`\`\`\`markdown\n${escapedContent}\n\`\`\`\`\n\n`;
    }

    private getLanguageFromExtension(extension: string): string {
        return this.languageMap[extension.toLowerCase()] || 'text';
    }

    private async buildProjectStructure(dirPath: string, config: ExtensionConfig): Promise<ProjectStructure[]> {
        const items: ProjectStructure[] = [];

        try {
            const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);

                if (this.shouldExcludeFile(fullPath, config)) {
                    continue;
                }

                if (entry.isDirectory()) {
                    const children = await this.buildProjectStructure(fullPath, config);
                    items.push({
                        name: entry.name,
                        type: 'directory',
                        path: fullPath,
                        children
                    });
                } else {
                    const stats = await fs.promises.stat(fullPath);
                    items.push({
                        name: entry.name,
                        type: 'file',
                        path: fullPath,
                        size: stats.size,
                        extension: path.extname(entry.name)
                    });
                }
            }
        } catch (error) {
            console.error(`Error reading directory ${dirPath}:`, error);
        }

        return items.sort((a, b) => {
            if (a.type !== b.type) {
                return a.type === 'directory' ? -1 : 1;
            }
            return a.name.localeCompare(b.name);
        });
    }

    private generateTreeStructure(items: ProjectStructure[], indent: string = ''): string {
        let result = '';

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const isLast = i === items.length - 1;
            const connector = isLast ? '└── ' : '├── ';
            const nextIndent = indent + (isLast ? '    ' : '│   ');

            if (item.type === 'directory') {
                result += `${indent}${connector}📁 ${item.name}/\n`;
                if (item.children && item.children.length > 0) {
                    result += this.generateTreeStructure(item.children, nextIndent);
                }
            } else {
                const sizeInfo = item.size ? ` (${this.formatFileSize(item.size)})` : '';
                result += `${indent}${connector}📄 ${item.name}${sizeInfo}\n`;
            }
        }

        return result;
    }

    private formatFileSize(bytes: number): string {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    private async generateFileContent(items: ProjectStructure[], config: ExtensionConfig): Promise<string> {
        let content = '';
        const binaryFiles: string[] = [];

        for (const item of items) {
            if (item.type === 'directory' && item.children) {
                content += await this.generateFileContent(item.children, config);
            } else if (item.type === 'file') {
                const workspaceRoot = vscode.workspace.workspaceFolders![0].uri.fsPath;
                const relativePath = path.relative(workspaceRoot, item.path);
                const normalizedPath = relativePath.replace(/\\/g, '/');

                if (this.isTextFile(item.path) && (item.size || 0) <= config.maxFileSize) {
                    try {
                        const fileContent = await fs.promises.readFile(item.path, 'utf-8');
                        const language = this.getLanguageFromExtension(item.extension || '');
                        
                        content += `\n\n${'='.repeat(80)}\n`;
                        content += `FILE: ${normalizedPath}\n`;
                        content += `${'='.repeat(80)}\n`;
                        
                        // NOVA SEÇÃO: Informações expandidas do arquivo
                        content += `\nFILE INFORMATION:\n`;
                        content += `${'-'.repeat(40)}\n`;
                        content += `Size: ${this.formatFileSize(item.size || 0)}\n`;
                        content += `Extension: ${item.extension || 'none'}\n`;
                        content += `Language: ${language}\n`;
                        content += `Location: ${normalizedPath}\n`;
                        content += `Relative Path: ${path.dirname(normalizedPath) === '.' ? 'root' : path.dirname(normalizedPath)}\n`;
                        
                        // Timestamps
                        try {
                            const stats = await fs.promises.stat(item.path);
                            content += `Created: ${this.formatTimestampWithTimezone(stats.birthtime)}\n`;
                            content += `Modified: ${this.formatTimestampWithTimezone(stats.mtime)}\n`;
                        } catch (error) {
                            content += `Created: Unable to retrieve\n`;
                            content += `Modified: Unable to retrieve\n`;
                        }
                        
                        // Hashes
                        content += `MD5: ${this.calculateMD5(item.path)}\n`;
                        content += `SHA256: ${this.calculateSHA256(item.path)}\n`;
                        
                        // Encoding
                        content += `Encoding: ${this.detectEncoding(item.path)}\n`;
                        
                        content += `\nFILE CONTENT:\n`;
                        content += `${'-'.repeat(40)}\n`;
                        content += fileContent;
                        content += `\n${'='.repeat(80)}\n`;
                    } catch (error) {
                        console.error(`Error reading file ${item.path}:`, error);
                        binaryFiles.push(normalizedPath);
                    }
                } else {
                    binaryFiles.push(normalizedPath);
                }
            }
        }

        if (binaryFiles.length > 0) {
            content += `\n\n${'='.repeat(80)}\n`;
            content += `BINARY/EXCLUDED FILES (not included in text content)\n`;
            content += `${'='.repeat(80)}\n`;
            binaryFiles.forEach(file => {
                content += `- ${file}\n`;
            });
        }

        return content;
    }

    private generateProjectName(workspacePath: string): string {
        const projectName = path.basename(workspacePath);
        return projectName.trim().replace(/\s+/g, '-');
    }

    public async exportProject(): Promise<void> {
        console.log('ProjectExporter: exportProject method called');
        this.outputChannel.appendLine('ProjectExporter: exportProject method called');
        
        const config = this.getConfig();

        if (!vscode.workspace.workspaceFolders || vscode.workspace.workspaceFolders.length === 0) {
            this.notificationManager.showLocalizedError('export.noWorkspace');
            this.outputChannel.appendLine('ERROR: No workspace folder found');
            return;
        }

        const workspaceFolder = vscode.workspace.workspaceFolders[0];
        const workspacePath = workspaceFolder.uri.fsPath;
        const projectName = this.generateProjectName(workspacePath);

        console.log(`ProjectExporter: Starting export for project: ${projectName}`);
        console.log(`ProjectExporter: Workspace path: ${workspacePath}`);
        console.log(`ProjectExporter: Output format: ${config.outputFormat}`);
        
        this.outputChannel.appendLine('Starting project export...');
        this.notificationManager.showLocalizedInfo('export.starting', NotificationType.EXPORT_STARTING);

        try {
            // Clean previous files
            console.log('ProjectExporter: Cleaning existing output files...');
            if (config.outputFormat === OutputFormat.BOTH || config.outputFormat === OutputFormat.TXT) {
                await this.deleteExistingOutputFile(workspacePath, 'txt');
            }
            if (config.outputFormat === OutputFormat.BOTH || config.outputFormat === OutputFormat.MD) {
                await this.deleteExistingOutputFile(workspacePath, 'md');
            }

            // Build project structure
            console.log('ProjectExporter: Building project structure...');
            const structure = await this.buildProjectStructure(workspacePath, config);
            console.log(`ProjectExporter: Structure built with ${this.countFiles(structure)} files`);

            // Get extension info
            const extensionInfo = this.getExtensionInfo();
            console.log(`ProjectExporter: Using extension version: ${extensionInfo.version}`);

            // Generate timestamp
            const now = new Date();
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const gmtOffset = now.getTimezoneOffset();
            const gmtString = `GMT${gmtOffset <= 0 ? '+' : '-'}${Math.abs(Math.floor(gmtOffset / 60)).toString().padStart(2, '0')}:${Math.abs(gmtOffset % 60).toString().padStart(2, '0')}`;

            const generatedFiles: string[] = [];

            // Generate text output (if asked)
            if (config.outputFormat === OutputFormat.BOTH || config.outputFormat === OutputFormat.TXT) {
                console.log('ProjectExporter: Generating enhanced TXT content...');
                
                let txtContent = `${'='.repeat(100)}\n`;
                txtContent += `PROJECT EXPORT FOR LLMs\n`;
                txtContent += `${'='.repeat(100)}\n\n`;
                
                txtContent += `PROJECT INFORMATION:\n`;
                txtContent += `${'-'.repeat(50)}\n`;
                txtContent += `Project Name: ${projectName}\n`;
                txtContent += `Generated On: ${now.toISOString().replace('T', ' ').substring(0, 19)} (${timezone} / ${gmtString})\n`;
                txtContent += `Total Files Processed: ${this.countFiles(structure)}\n`;
                txtContent += `Export Tool: ${extensionInfo.displayName} v${extensionInfo.version}\n`;
                txtContent += `Tool Author: Jota / José Guilherme Pandolfi\n\n`;

                txtContent += `EXPORT CONFIGURATION:\n`;
                txtContent += `${'-'.repeat(50)}\n`;
                txtContent += `Language: ${config.language}\n`;
                txtContent += `Max File Size: ${this.formatFileSize(config.maxFileSize)}\n`;
                txtContent += `Include Hidden Files: ${config.includeHiddenFiles}\n`;
                txtContent += `Output Format: ${config.outputFormat}\n`;
                txtContent += `Notification Level: ${config.notificationLevel}\n`;
                txtContent += `Custom File Name Pattern: ${config.outputFileName}\n\n`;

                txtContent += `${'='.repeat(80)}\n`;
                txtContent += `PROJECT STRUCTURE\n`;
                txtContent += `${'='.repeat(80)}\n`;
                txtContent += this.generateTreeStructure(structure);

                const stats = this.generateProjectStats(structure);
                txtContent += `\n${'='.repeat(80)}\n`;
                txtContent += `PROJECT STATISTICS\n`;
                txtContent += `${'='.repeat(80)}\n`;
                txtContent += `Total Files: ${stats.totalFiles}\n`;
                txtContent += `Total Directories: ${stats.totalDirectories}\n`;
                txtContent += `Text Files: ${stats.textFiles}\n`;
                txtContent += `Binary Files: ${stats.binaryFiles}\n`;
                txtContent += `Total Size: ${this.formatFileSize(stats.totalSize)}\n\n`;

                if (stats.fileTypes.size > 0) {
                    txtContent += `FILE TYPES DISTRIBUTION:\n`;
                    txtContent += `${'-'.repeat(30)}\n`;
                    Array.from(stats.fileTypes.entries())
                        .sort((a, b) => b[1] - a[1])
                        .forEach(([ext, count]) => {
                            const extension = ext || 'no extension';
                            txtContent += `${extension.padEnd(15)} : ${count}\n`;
                        });
                    txtContent += `\n`;
                }

                txtContent += `${'='.repeat(80)}\n`;
                txtContent += `FILE CODE CONTENTS\n`;
                txtContent += `${'='.repeat(80)}\n`;
                txtContent += await this.generateFileContent(structure, config);

                const txtFileName = this.generateOutputFileName(config, workspacePath, 'txt');
                const txtFilePath = path.join(workspacePath, txtFileName);
                
                console.log(`ProjectExporter: Saving enhanced TXT file to: ${txtFilePath}`);
                await fs.promises.writeFile(txtFilePath, txtContent, 'utf-8');
                generatedFiles.push(txtFileName);
            }

            // Generate markdown output (if asked)
            if (config.outputFormat === OutputFormat.BOTH || config.outputFormat === OutputFormat.MD) {
                console.log('ProjectExporter: Generating Markdown content...');
                
                // CORREÇÃO AQUI: Usar await para generateMarkdownContent
                const mdContent = await this.generateMarkdownContent(
                    projectName,
                    structure,
                    config,
                    extensionInfo,
                    now,
                    timezone,
                    gmtString
                );

                const mdFileName = this.generateOutputFileName(config, workspacePath, 'md');
                const mdFilePath = path.join(workspacePath, mdFileName);
                
                console.log(`ProjectExporter: Saving Markdown file to: ${mdFilePath}`);
                await fs.promises.writeFile(mdFilePath, mdContent, 'utf-8');
                generatedFiles.push(mdFileName);
            }

            // Sucess message
            if (generatedFiles.length === 1) {
                this.notificationManager.showLocalizedSuccess('export.success', generatedFiles[0]);
                this.outputChannel.appendLine(`Project exported successfully to: ${generatedFiles[0]}`);
            } else {
                this.notificationManager.showLocalizedSuccess('export.success.multiple', generatedFiles[0], generatedFiles[1]);
                this.outputChannel.appendLine(`Project exported successfully to: ${generatedFiles.join(' and ')}`);
            }

            console.log(`ProjectExporter: Export completed successfully: ${generatedFiles.join(', ')}`);

        } catch (error) {
            this.notificationManager.showLocalizedError('export.error', String(error));
            this.outputChannel.appendLine(`ERROR: Export failed - ${error}`);
        }
    }

    public getOutputFileNamePattern(): string {
        const config = this.getConfig();
        return config.outputFileName;
    }

    public getCurrentOutputFileName(workspacePath: string, extension: string = 'txt'): string {
        const config = this.getConfig();
        return this.generateOutputFileName(config, workspacePath, extension);
    }

    private countFiles(items: ProjectStructure[]): number {
        let count = 0;
        for (const item of items) {
            if (item.type === 'file') {
                count++;
            } else if (item.children) {
                count += this.countFiles(item.children);
            }
        }
        return count;
    }

    public toggleAutoExport(): void {
        console.log('ProjectExporter: toggleAutoExport called');
        const config = vscode.workspace.getConfiguration('easyProjectExport');
        const currentValue = config.get('enableOnSave', true);
        config.update('enableOnSave', !currentValue, vscode.ConfigurationTarget.Global);

        const messageKey = !currentValue ? 'export.autoEnabled' : 'export.autoDisabled';
        
        this.notificationManager.showLocalizedInfo(messageKey, NotificationType.INFO);
        this.outputChannel.appendLine(`Auto-export toggled to: ${!currentValue}`);
        console.log(`ProjectExporter: Auto-export toggled to: ${!currentValue}`);
    }

    public onFileChanged(document: vscode.TextDocument): void {
        if (document.isDirty) {
            this.modifiedFiles.add(document.uri.fsPath);
            console.log(`ProjectExporter: File marked as modified: ${document.fileName}`);
        }
    }

    public onFileSaved(document: vscode.TextDocument): void {
        console.log(`ProjectExporter: Save event detected for: ${document.fileName}`);
        console.log(`ProjectExporter: Document is dirty: ${document.isDirty}`);
        console.log(`ProjectExporter: File was in modified set: ${this.modifiedFiles.has(document.uri.fsPath)}`);
        
        const config = this.getConfig();
        if (config.enableOnSave) {
            // Process if file was modified or if we want to process all saves
            if (this.modifiedFiles.has(document.uri.fsPath) || !document.isDirty) {
                console.log('ProjectExporter: Processing save event');
                this.modifiedFiles.delete(document.uri.fsPath);
                
                // Small delay to ensure save is completed
                setTimeout(() => {
                    console.log('ProjectExporter: Triggering export from save event');
                    this.exportProject();
                }, 500);
            } else {
                console.log('ProjectExporter: Save event ignored (file not modified)');
            }
        } else {
            console.log('ProjectExporter: Auto-export is disabled');
        }
    }
}

class CommandManager {
    private context: vscode.ExtensionContext;
    private exporter: ProjectExporter;
    private localizationManager: LocalizationManager;
    private notificationManager: NotificationManager;
    private registeredCommands: vscode.Disposable[] = [];

    constructor(context: vscode.ExtensionContext, exporter: ProjectExporter) {
        this.context = context;
        this.exporter = exporter;
        this.localizationManager = LocalizationManager.getInstance();
        this.notificationManager = new NotificationManager(this.localizationManager);
    }

    public updateNotificationLevel(level: string) {
        this.notificationManager.setNotificationLevel(level);
    }

    public registerCommands() {
        this.disposeCommands();

        console.log('CommandManager: Registering commands with current language');

        const exportCommand = vscode.commands.registerCommand('easyProjectExport.exportProject', () => {
            console.log('Easy Project Export: Export command triggered');
            const commandTitle = this.localizationManager.getString('command.exportProject.title');
            
            this.notificationManager.showLocalizedInfo('command.executed', NotificationType.COMMAND_EXECUTED, commandTitle);
            this.exporter.exportProject();
        });

        const toggleCommand = vscode.commands.registerCommand('easyProjectExport.toggleAutoExport', () => {
            console.log('Easy Project Export: Toggle command triggered');
            this.exporter.toggleAutoExport();
        });

        this.registeredCommands = [exportCommand, toggleCommand];
        this.context.subscriptions.push(...this.registeredCommands);

        console.log('CommandManager: Commands registered successfully');
    }

    private disposeCommands() {
        this.registeredCommands.forEach(disposable => disposable.dispose());
        this.registeredCommands = [];
    }

    public updateCommands() {
        console.log('CommandManager: Updating commands for language change');
        this.registerCommands();
    }
}

export function activate(context: vscode.ExtensionContext) {
    console.log('Easy Project Export: Extension activation starting...');
    
    const exporter = new ProjectExporter(context);
    const commandManager = new CommandManager(context, exporter);
    const localizationManager = LocalizationManager.getInstance();
    const notificationManager = new NotificationManager(localizationManager);

    commandManager.registerCommands();

    const configChangeListener = vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('easyProjectExport.language') || 
            event.affectsConfiguration('easyProjectExport.notificationLevel') ||
            event.affectsConfiguration('easyProjectExport.outputFormat')) { 
            
            console.log('Configuration changed');
            
            const newConfig = vscode.workspace.getConfiguration('easyProjectExport');
            const newLanguage = newConfig.get('language', 'en');
            const newNotificationLevel = newConfig.get('notificationLevel', 'minimal');
            const newOutputFormat = newConfig.get('outputFormat', 'both');
            
            console.log(`Updating language to: ${newLanguage}`);
            console.log(`Updating notification level to: ${newNotificationLevel}`);
            console.log(`Updating output format to: ${newOutputFormat}`);
            localizationManager.setLanguage(newLanguage);
            notificationManager.setNotificationLevel(newNotificationLevel);
            commandManager.updateNotificationLevel(newNotificationLevel);
            
            exporter.updateConfig({
                language: newLanguage,
                enableOnSave: newConfig.get('enableOnSave', true),
                includeHiddenFiles: newConfig.get('includeHiddenFiles', false),
                maxFileSize: newConfig.get('maxFileSize', 1048576),
                excludePatterns: newConfig.get('excludePatterns', []),
                outputFileName: newConfig.get('outputFileName', '{workspaceName}-output'),
                outputFormat: newOutputFormat,
                notificationLevel: newNotificationLevel
            });
            
            commandManager.updateCommands();
            
            if (event.affectsConfiguration('easyProjectExport.language')) {
                notificationManager.showLocalizedInfo('language.changed', NotificationType.LANGUAGE_CHANGED);
            }
        }
    });

    const changeListener = vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.contentChanges.length > 0) {
            exporter.onFileChanged(event.document);
        }
    });

    const saveListener = vscode.workspace.onDidSaveTextDocument((document) => {
        exporter.onFileSaved(document);
    });

    context.subscriptions.push(
        configChangeListener,
        changeListener, 
        saveListener
    );

    notificationManager.showLocalizedInfo('activation.success', NotificationType.ACTIVATION);
    console.log('Easy Project Export: Extension activation completed successfully');
}

export function deactivate() {
    console.log('Easy Project Export: Extension deactivated');
}