# Changelog

All notable changes to the "Easy Whole Project to Single Text File for LLMs" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.3] - 2025-06-09

### Added
- **Custom Output File Name Configuration**: Users can now customize the output file name pattern through extension settings
  - New setting: `easyProjectExport.outputFileName` with default value `{workspaceName}-output`
  - Support for `{workspaceName}` placeholder that gets replaced with actual workspace name
  - Automatic space trimming and hyphen replacement for valid file names
  - Real-time configuration updates without requiring VS Code restart

- **Advanced Notification Management System**: Three-level notification control system
  - **Silent Mode**: All extension pop-up notifications are hidden
  - **Minimal Mode** (default): Only success and error notifications are shown
  - **All Messages Mode**: Complete notification experience (previous behavior)
  - New setting: `easyProjectExport.notificationLevel` with options: `silent`, `minimal`, `all`
  - Localized notification preferences in both English and Portuguese

- **Robust Multi-Language Support**: Enhanced internationalization system
  - Dynamic language switching without VS Code restart
  - Complete interface localization for English and Portuguese (Brazil)
  - Real-time command title updates when language changes
  - Improved localization management with centralized translation system

- **Dynamic Extension Version Display**: Automatic version detection in output files
  - Extension version now dynamically retrieved from package.json
  - Output file headers automatically reflect current extension version
  - No more manual version updates required in code

### Fixed
- **Pattern Exclusion System**: Major improvements to file and directory exclusion logic
  - Fixed glob pattern matching for `node_modules/**` and similar patterns
  - Enhanced pattern recognition for directory recursive exclusions (`/**` and `**`)
  - Improved regex pattern conversion for more reliable exclusions
  - Better handling of cross-platform path separators
  - More accurate exclusion logging for debugging

- **Anti-Recursion Protection**: Comprehensive system to prevent output file inclusion
  - **Layer 1**: Automatic detection and exclusion of current output file name
  - **Layer 2**: Pattern-based detection of likely extension output files
  - **Layer 3**: Proactive deletion of existing output files before generating new ones
  - Support for various output file naming patterns
  - Prevents infinite recursion and bloated output files

### Improved
- **Configuration Management**: Enhanced settings synchronization
  - All configuration changes now apply immediately without restart
  - Better error handling for configuration updates
  - Improved validation for user-provided settings

- **Logging and Debugging**: Enhanced diagnostic capabilities
  - More detailed console logging throughout the extension
  - Better error reporting with localized messages
  - Improved output channel logging for troubleshooting

- **Code Architecture**: Refactored for better maintainability
  - Introduced `NotificationManager` class for centralized notification handling
  - Enhanced `LocalizationManager` with improved translation system
  - Better separation of concerns across extension components
  - More robust error handling and recovery mechanisms

### Technical Details
- Enhanced TypeScript interfaces for better type safety
- Improved enum definitions for notification types and levels
- Better memory management with proper disposal of event listeners
- Cross-platform compatibility improvements for file path handling

## [1.0.2] - 2025-06-08

### Fixed
- Minor bug fixes and stability improvements
- Enhanced error handling for edge cases

## [1.0.1] - 2025-06-07

### Fixed
- Marketplace publication adjustments
- Updated extension metadata

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

## [Unreleased]

### Planned Features
- Workspace-specific configuration profiles
- Advanced filtering options for file types
- Export templates for different AI/LLM platforms
- Integration with popular AI services
- Project comparison and diff capabilities
- Automated project documentation generation

---

## Contributing

We welcome contributions! Please see our [GitHub repository](https://github.com/jgpandolfi/Easy-Whole-Project-to-Single-Text-File-for-LLMs) for more information on how to contribute to this project.

## Support

If you encounter any issues or have suggestions for improvements, please:
1. Check the [existing issues](https://github.com/jgpandolfi/Easy-Whole-Project-to-Single-Text-File-for-LLMs/issues)
2. Create a new issue with detailed information
3. Contact the author: [Jota / José Guilherme Pandolfi](https://github.com/jgpandolfi)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
