# Changelog

All notable changes to the "Easy Whole Project to Single Text File for LLMs" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-06-06

### Added
- Initial release of Easy Whole Project to Single Text File for LLMs
- Automatic project export on file save (Ctrl+S)
- Complete project structure visualization as tree
- Full source code content extraction for 50+ file types
- Multi-language support (English and Portuguese Brazil)
- Configurable exclusion patterns and file size limits
- Binary file listing for non-text files
- Manual export command via Command Palette and context menu
- Smart exclusions for common non-essential files
- Timezone-aware timestamp generation
- Comprehensive error handling and user feedback
- Output channel for logging and debugging
- Settings for customizing extension behavior

### Features
- **Supported File Extensions**: `.html`, `.htm`, `.css`, `.js`, `.jsx`, `.ts`, `.tsx`, `.json`, `.xml`, `.txt`, `.md`, `.yml`, `.yaml`, `.php`, `.py`, `.cs`, `.java`, `.cpp`, `.c`, `.h`, `.sql`, `.ps1`, `.bat`, `.cmd`, `.sh`, `.vue`, `.svelte`, `.scss`, `.sass`, `.less`, `.ini`, `.conf`, `.config`, `.log`, `.gitignore`, `.env`, `.dockerfile`, `.go`, `.rs`, `.rb`, `.swift`, `.kt`, `.scala`, `.r`, `.lua`, `.vb`, `.asm`, and more
- **Default Exclusions**: `node_modules/**`, `.git/**`, `dist/**`, `build/**`, `*.min.js`, `*.map`, `.vscode/**`, `*.log`
- **File Format**: `<PROJECT-NAME>-ESTRUTURA-E-ARQUIVOS-DO-PROJETO.txt`
- **Commands**: 
  - `easyProjectExport.exportProject` - Export Project to Text File
  - `easyProjectExport.toggleAutoExport` - Toggle Auto Export

### Configuration Options
- `easyProjectExport.language` - Interface language (en/pt-BR)
- `easyProjectExport.enableOnSave` - Enable auto-export on save
- `easyProjectExport.includeHiddenFiles` - Include hidden files/directories
- `easyProjectExport.maxFileSize` - Maximum file size in bytes (1MB default)
- `easyProjectExport.excludePatterns` - Patterns to exclude from export

### Technical Details
- **Minimum VS Code Version**: 1.74.0
- **Language**: TypeScript
- **Dependencies**: @vscode/l10n for localization
- **Build Tools**: TypeScript compiler, ESLint
- **Categories**: Other, Snippets, Formatters
