import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
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
}

class ProjectExporter {
    private context: vscode.ExtensionContext;
    private outputChannel: vscode.OutputChannel;
    private modifiedFiles: Set<string> = new Set();

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

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
        this.outputChannel = vscode.window.createOutputChannel('Easy Project Export');
        console.log('ProjectExporter: Constructor called');
        this.outputChannel.appendLine('ProjectExporter: Constructor completed');
    }

    private getConfig(): ExtensionConfig {
        console.log('ProjectExporter: Getting configuration');
        const config = vscode.workspace.getConfiguration('easyProjectExport');
        const configObj = {
            language: config.get('language', 'en'),
            enableOnSave: config.get('enableOnSave', true),
            includeHiddenFiles: config.get('includeHiddenFiles', false),
            maxFileSize: config.get('maxFileSize', 1048576), // 1MB
            excludePatterns: config.get('excludePatterns', [])
        };
        console.log('ProjectExporter: Configuration loaded:', configObj);
        return configObj;
    }

    private getLocalizedString(key: string, fallback: string): string {
        const config = this.getConfig();

        const translations: { [key: string]: { [lang: string]: string } } = {
            'export.success': {
                'en': 'Project exported successfully to: {0}',
                'pt-BR': 'Projeto exportado com sucesso para: {0}'
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
            }
        };

        return translations[key]?.[config.language] || fallback;
    }

    private isTextFile(filePath: string): boolean {
        const ext = path.extname(filePath).toLowerCase();
        return this.textExtensions.includes(ext);
    }

    private shouldExcludeFile(filePath: string, config: ExtensionConfig): boolean {
        const relativePath = path.relative(vscode.workspace.workspaceFolders![0].uri.fsPath, filePath);

        // Check if file is hidden and we should exclude hidden files
        if (!config.includeHiddenFiles && path.basename(filePath).startsWith('.')) {
            return true;
        }

        // Check exclude patterns
        for (const pattern of config.excludePatterns) {
            const regex = new RegExp(pattern.replace(/\*\*/g, '.*').replace(/\*/g, '[^/]*'));
            if (regex.test(relativePath) || regex.test(path.basename(filePath))) {
                return true;
            }
        }

        return false;
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
                const relativePath = path.relative(vscode.workspace.workspaceFolders![0].uri.fsPath, item.path);

                if (this.isTextFile(item.path) && (item.size || 0) <= config.maxFileSize) {
                    try {
                        const fileContent = await fs.promises.readFile(item.path, 'utf-8');
                        content += `\n\n${'='.repeat(80)}\n`;
                        content += `FILE: ${relativePath}\n`;
                        content += `${'='.repeat(80)}\n`;
                        content += fileContent;
                        content += `\n${'='.repeat(80)}\n`;
                    } catch (error) {
                        console.error(`Error reading file ${item.path}:`, error);
                        binaryFiles.push(relativePath);
                    }
                } else {
                    binaryFiles.push(relativePath);
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
            const errorMsg = this.getLocalizedString('export.noWorkspace', 'No workspace folder is open');
            console.error('ProjectExporter: No workspace folder found');
            vscode.window.showErrorMessage(errorMsg);
            this.outputChannel.appendLine('ERROR: No workspace folder found');
            return;
        }

        const workspaceFolder = vscode.workspace.workspaceFolders[0];
        const workspacePath = workspaceFolder.uri.fsPath;
        const projectName = this.generateProjectName(workspacePath);

        console.log(`ProjectExporter: Starting export for project: ${projectName}`);
        console.log(`ProjectExporter: Workspace path: ${workspacePath}`);
        
        const startingMsg = this.getLocalizedString('export.starting', 'Starting project export...');
        this.outputChannel.appendLine(startingMsg);
        vscode.window.showInformationMessage(startingMsg);

        try {
            // Build project structure
            console.log('ProjectExporter: Building project structure...');
            const structure = await this.buildProjectStructure(workspacePath, config);
            console.log(`ProjectExporter: Structure built with ${this.countFiles(structure)} files`);

            // Generate current date/time with timezone
            const now = new Date();
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            const gmtOffset = now.getTimezoneOffset();
            const gmtString = `GMT${gmtOffset <= 0 ? '+' : '-'}${Math.abs(Math.floor(gmtOffset / 60)).toString().padStart(2, '0')}:${Math.abs(gmtOffset % 60).toString().padStart(2, '0')}`;

            // Generate content
            console.log('ProjectExporter: Generating file content...');
            let content = `${'='.repeat(100)}\n`;
            content += `PROJECT EXPORT FOR LLMs\n`;
            content += `${'='.repeat(100)}\n\n`;
            content += `Project Name: ${projectName}\n`;
            content += `Generated on: ${now.toISOString().replace('T', ' ').substring(0, 19)} (${timezone} / ${gmtString})\n`;
            content += `Total Files Processed: ${this.countFiles(structure)}\n`;
            content += `Export Tool: Easy Whole Project to Single Text File for LLMs v1.0.2\n`;
            content += `Author: Jota / José Guilherme Pandolfi\n\n`;

            content += `${'='.repeat(80)}\n`;
            content += `PROJECT STRUCTURE\n`;
            content += `${'='.repeat(80)}\n`;
            content += this.generateTreeStructure(structure);

            content += `\n${'='.repeat(80)}\n`;
            content += `FILE CONTENTS\n`;
            content += `${'='.repeat(80)}\n`;
            content += await this.generateFileContent(structure, config);

            // Save file
            const fileName = `${projectName}-ESTRUTURA-E-ARQUIVOS-DO-PROJETO.txt`;
            const filePath = path.join(workspacePath, fileName);
            
            console.log(`ProjectExporter: Saving file to: ${filePath}`);
            await fs.promises.writeFile(filePath, content, 'utf-8');
            console.log('ProjectExporter: File saved successfully');

            const message = this.getLocalizedString('export.success', 'Project exported successfully to: {0}').replace('{0}', fileName);
            vscode.window.showInformationMessage(message);
            this.outputChannel.appendLine(message);
            console.log(`ProjectExporter: Export completed successfully: ${fileName}`);

        } catch (error) {
            const errorMessage = this.getLocalizedString('export.error', 'Error exporting project: {0}').replace('{0}', String(error));
            console.error('ProjectExporter: Export failed:', error);
            vscode.window.showErrorMessage(errorMessage);
            this.outputChannel.appendLine(`ERROR: ${errorMessage}`);
        }
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

        const message = !currentValue 
            ? this.getLocalizedString('export.autoEnabled', 'Auto-export enabled')
            : this.getLocalizedString('export.autoDisabled', 'Auto-export disabled');

        vscode.window.showInformationMessage(message);
        this.outputChannel.appendLine(message);
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

export function activate(context: vscode.ExtensionContext) {
    console.log('Easy Project Export: Extension activation starting...');
    
    // Check if auto-save is enabled and warn user
    const autoSave = vscode.workspace.getConfiguration('files').get('autoSave');
    if (autoSave !== 'off') {
        console.log(`Easy Project Export: Auto-save is enabled (${autoSave})`);
        vscode.window.showWarningMessage(
            'Auto-save is enabled. This may interfere with project export triggers. Consider disabling it in File > Preferences > Settings > "auto save".'
        );
    }

    const exporter = new ProjectExporter(context);

    // Register commands with detailed logging
    console.log('Easy Project Export: Registering commands...');
    
    const exportCommand = vscode.commands.registerCommand('easyProjectExport.exportProject', () => {
        console.log('Easy Project Export: Export command triggered via command palette/menu');
        vscode.window.showInformationMessage('Export command executed!');
        exporter.exportProject();
    });

    const toggleCommand = vscode.commands.registerCommand('easyProjectExport.toggleAutoExport', () => {
        console.log('Easy Project Export: Toggle auto-export command triggered');
        exporter.toggleAutoExport();
    });

    console.log('Easy Project Export: Commands registered successfully');

    // Register event listeners with enhanced tracking
    console.log('Easy Project Export: Registering event listeners...');
    
    const changeListener = vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.contentChanges.length > 0) {
            exporter.onFileChanged(event.document);
        }
    });

    const saveListener = vscode.workspace.onDidSaveTextDocument((document) => {
        exporter.onFileSaved(document);
    });

    console.log('Easy Project Export: Event listeners registered successfully');

    context.subscriptions.push(exportCommand, toggleCommand, changeListener, saveListener);

    // Confirm activation
    const activationMessage = 'Easy Project Export: Extension activated successfully! Use Ctrl+Shift+P > "Export Project" or right-click on folder.';
    vscode.window.showInformationMessage(activationMessage);
    console.log('Easy Project Export: Extension activation completed successfully');

    // Log current workspace info
    if (vscode.workspace.workspaceFolders) {
        console.log(`Easy Project Export: Found ${vscode.workspace.workspaceFolders.length} workspace folder(s):`);
        vscode.workspace.workspaceFolders.forEach((folder, index) => {
            console.log(`  ${index + 1}. ${folder.name} (${folder.uri.fsPath})`);
        });
    } else {
        console.log('Easy Project Export: No workspace folders found');
    }
}

export function deactivate() {
    console.log('Easy Project Export: Extension deactivated');
}
