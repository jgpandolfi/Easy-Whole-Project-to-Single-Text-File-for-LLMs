# Easy Whole Project to Single Text File for LLMs

[![Version](https://img.shields.io/visual-studio-marketplace/v/jgpandolfi.easy-whole-project-to-single-text-file-for-llms)](https://marketplace.visualstudio.com/items?itemName=jgpandolfi.easy-whole-project-to-single-text-file-for-llms)
[![Downloads](https://img.shields.io/visual-studio-marketplace/d/jgpandolfi.easy-whole-project-to-single-text-file-for-llms)](https://marketplace.visualstudio.com/items?itemName=jgpandolfi.easy-whole-project-to-single-text-file-for-llms)
[![Rating](https://img.shields.io/visual-studio-marketplace/r/jgpandolfi.easy-whole-project-to-single-text-file-for-llms)](https://marketplace.visualstudio.com/items?itemName=jgpandolfi.easy-whole-project-to-single-text-file-for-llms)
[![License](https://img.shields.io/github/license/jgpandolfi/Easy-Whole-Project-to-Single-Text-File-for-LLMs)](https://github.com/jgpandolfi/Easy-Whole-Project-to-Single-Text-File-for-LLMs/blob/main/LICENSE)

Transform your entire project into a single, well-structured text file perfect for sharing with AI tools and Large Language Models (LLMs) like ChatGPT, Claude, Gemini, and others.

## ✨ Features

### 🚀 **Automatic Export on Save**
- Triggers automatically when you save any file (Ctrl+S)
- Instantly generates comprehensive project documentation
- Configurable auto-export settings

### 📁 **Complete Project Structure**
- Visual tree representation of your project hierarchy
- File sizes and counts for easy reference
- Emoji icons for better readability

### 💻 **Extensive File Type Support**
Supports 50+ file extensions including:
- **Web**: `.html`, `.css`, `.js`, `.jsx`, `.ts`, `.tsx`, `.vue`, `.svelte`
- **Backend**: `.php`, `.py`, `.cs`, `.java`, `.cpp`, `.c`, `.h`, `.go`, `.rs`
- **Config**: `.json`, `.xml`, `.yaml`, `.yml`, `.ini`, `.conf`, `.env`
- **Documentation**: `.md`, `.txt`, `.log`
- **And many more!**

### 🎯 **Smart Content Organization**
- Full source code content for supported files
- Binary file detection and listing
- Anti-recursion protection to prevent output file inclusion
- Automatic cleanup of previous exports

### 🌍 **Multi-Language Support**
- **English** and **Portuguese (Brazil)** interfaces
- Dynamic language switching without restart
- Localized notifications and messages

### ⚙️ **Advanced Configuration**
- **Custom output filename patterns** with `{workspaceName}` placeholder
- **Flexible exclusion patterns** for files and directories
- **File size limits** to prevent memory issues
- **Hidden file inclusion** options
- **Notification levels**: Silent, Minimal, or All messages

### 🔧 **Smart Exclusions**
Default exclusions include:
- `node_modules/**`
- `.git/**`
- `dist/**`, `build/**`
- `*.min.js`, `*.map`
- `.vscode/**`
- `*.log`

## 📦 Installation

### From VS Code Marketplace
1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Easy Whole Project to Single Text File for LLMs"
4. Click "Install"

### From Command Line
```
code --install-extension jgpandolfi.easy-whole-project-to-single-text-file-for-llms
```


## 🚀 Quick Start

1. **Open your project** in VS Code
2. **Save any file** (Ctrl+S) or use the manual export
3. **Find the generated file** in your project root (e.g., `my-project-output.txt`)
4. **Share with AI tools** for comprehensive project analysis

## 💡 Usage

### Automatic Export
The extension automatically generates a text file whenever you save a file in your project (if auto-export is enabled).

### Manual Export
- **Command Palette**: Ctrl+Shift+P → "Export Project to Text File"
- **Context Menu**: Right-click on any folder → "Export Project to Text File"

### Toggle Auto-Export
- **Command Palette**: Ctrl+Shift+P → "Toggle Auto Export"

## ⚙️ Configuration

Access settings via `File > Preferences > Settings` and search for "Easy Project Export":

| Setting | Description | Default |
|---------|-------------|---------|
| **Language** | Interface language (en/pt-BR) | `en` |
| **Enable On Save** | Auto-export when saving files | `true` |
| **Output File Name** | Custom filename pattern | `{workspaceName}-output` |
| **Notification Level** | Control notification frequency | `minimal` |
| **Include Hidden Files** | Include dot files and folders | `false` |
| **Max File Size** | Maximum file size to include (bytes) | `1048576` (1MB) |
| **Exclude Patterns** | Glob patterns to exclude | See defaults above |

### Output Filename Customization
Use the `{workspaceName}` placeholder in your custom filename:
- `{workspaceName}-export` → `my-project-export.txt`
- `project-{workspaceName}-full` → `project-my-project-full.txt`
- `my-custom-name` → `my-custom-name.txt`

### Notification Levels
- **Silent**: No pop-up notifications
- **Minimal**: Only success and error messages (default)
- **All**: Complete notification experience

## 📄 Output Format

The generated file includes:
```
================================================================================
PROJECT EXPORT FOR LLMs

Project Name: my-awesome-project
Generated on: 2025-06-09 00:41:03 (America/Sao_Paulo / GMT-03:00)
Total Files Processed: 25
Export Tool: Easy Whole Project to Single Text File for LLMs v1.0.3
Tool Author: Jota / José Guilherme Pandolfi
================================================================================
PROJECT STRUCTURE

├── 📁 src/
│ ├── 📄 index.html (2.3 KB)
│ ├── 📄 styles.css (1.8 KB)
│ └── 📄 app.js (5.2 KB)
├── 📁 docs/
│ └── 📄 README.md (3.1 KB)
└── 📄 package.json (1.2 KB)
================================================================================
FILE CONTENTS
================================================================================
FILE: src/index.html
<!DOCTYPE html> <html> ...
```

## 🤖 Perfect for AI Tools

This extension is specifically designed for sharing projects with AI assistants:

- **ChatGPT:** Paste the entire file for comprehensive code analysis
- **Claude:** Perfect for large project understanding with context
- **GitHub Copilot:** Enhanced code suggestions with full project context
- **Gemini:** Complete project overview for detailed assistance
- **Custom LLMs:** Structured format for any AI model

## 🛡️ Security & Privacy
- Local processing only - no data sent to external servers
- Respects .gitignore patterns and custom exclusions
- No sensitive file inclusion by default
- Open source - review the code yourself

## 📊 Technical Details

- Minimum VS Code Version: 1.74.0
- Language: TypeScript
- File Encoding: UTF-8 (supports international characters)
- Platform Support: Windows, macOS, Linux
- Memory Efficient: Streams large files, respects size limits

## 🚨 Known Limitations

- Very large projects may take longer to process
- Binary files are listed but not included in content
- Some file types may require manual pattern addition
- Output file can become very large with extensive projects

## 🐛 Troubleshooting

### Extension not activating?

- Check that VS Code version is 1.74.0 or higher
- Reload VS Code window (Ctrl+Shift+P → "Developer: Reload Window")

### No file generated?

- Ensure auto-export is enabled in settings
- Check that workspace folder is open
- Verify file permissions in project directory

### Large files excluded?

- Increase maxFileSize setting if needed
- Check exclude patterns for accidental matches

### Performance issues?

- Reduce maxFileSize setting
- Add more patterns to excludePatterns
- Use minimal notification level

## 📝 Example Use Cases

Code Review Preparation:
```
"Here's my entire React project structure and code. 
Please review for best practices and potential improvements."
```

## 🤝 Contributing

We welcome contributions! Please see our [GitHub repository](https://github.com/jgpandolfi/Easy-Whole-Project-to-Single-Text-File-for-LLMs) for:

- **Bug reports** and feature requests
- **Pull requests** for improvements
- **Documentation** enhancements
- **Translation** contributions

## 📄 License

This project is licensed under the [MIT License](https://github.com/jgpandolfi/Easy-Whole-Project-to-Single-Text-File-for-LLMs/blob/main/LICENSE).

## 📞 Support

- **GitHub Issues**: [Report bugs or request features](https://github.com/jgpandolfi/Easy-Whole-Project-to-Single-Text-File-for-LLMs/issues)
- **Author**: [Jota / José Guilherme Pandolfi](https://github.com/jgpandolfi)
- **Marketplace**: [VS Code Extension Page](https://marketplace.visualstudio.com/items?itemName=jgpandolfi.easy-whole-project-to-single-text-file-for-llms)


---

⭐ **Found this extension helpful?** Please consider rating it on the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=jgpandolfi.easy-whole-project-to-single-text-file-for-llms)!
