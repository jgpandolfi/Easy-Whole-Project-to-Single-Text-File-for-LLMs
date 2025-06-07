# Easy Whole Project to Single Text File for LLMs

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/jgpandolfi.easy-whole-project-to-single-text-file-for-llms)](https://marketplace.visualstudio.com/items?itemName=jgpandolfi.easy-whole-project-to-single-text-file-for-llms)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/jgpandolfi.easy-whole-project-to-single-text-file-for-llms)](https://marketplace.visualstudio.com/items?itemName=jgpandolfi.easy-whole-project-to-single-text-file-for-llms)
[![GitHub](https://img.shields.io/github/license/jgpandolfi/Easy-Whole-Project-to-Single-Text-File-for-LLMs)](https://github.com/jgpandolfi/Easy-Whole-Project-to-Single-Text-File-for-LLMs/blob/main/LICENSE)

## English

### Overview

**Easy Whole Project to Single Text File for LLMs** is a powerful Visual Studio Code extension that automatically generates a comprehensive text file containing your entire project structure and code content. This extension is specifically designed to help developers easily share their complete project context with AI tools and Large Language Models (LLMs) like GPT, Claude, Gemini, and others.

### Features

- ✅ **Automatic Export on Save**: Generates the text file every time you save any file in your project
- 📁 **Complete Project Structure**: Creates a visual tree representation of your project directory
- 📄 **Full Code Content**: Includes the complete source code of all text-based files
- 🌍 **Multi-language Support**: Available in English and Portuguese (Brazil)
- ⚙️ **Highly Configurable**: Customize file patterns, size limits, and exclusion rules
- 🚫 **Smart Exclusions**: Automatically excludes common non-essential files (node_modules, .git, etc.)
- 📊 **Binary File Listing**: Lists binary files that couldn't be included as text
- 🔧 **Manual Export Option**: Export your project on-demand via command palette or context menu

### How It Works

1. **Automatic Trigger**: Every time you save a file (Ctrl+S), the extension automatically generates the export
2. **File Analysis**: Scans your entire project directory structure
3. **Content Generation**: Creates a single text file with:
   - Project metadata (name, generation date, timezone)
   - Complete directory tree structure
   - Full source code content for all supported file types
   - List of binary/excluded files
4. **Save Location**: Saves the file in your project root with the format: `<PROJECT-NAME>-ESTRUTURA-E-ARQUIVOS-DO-PROJETO.txt`

### Supported File Extensions

The extension supports over 50 text-based file formats including:

```
.html, .htm, .css, .js, .jsx, .ts, .tsx, .json, .xml, .txt, .md, .yml, .yaml,
.php, .py, .cs, .java, .cpp, .c, .h, .sql, .ps1, .bat, .cmd, .sh, .vue,
.svelte, .scss, .sass, .less, .ini, .conf, .config, .log, .gitignore, .env,
.dockerfile, .go, .rs, .rb, .swift, .kt, .scala, .r, .lua, .vb, .asm, and more...
```

### Installation

1. Open Visual Studio Code
2. Go to Extensions (Ctrl+Shift+X)
3. Search for "Easy Whole Project to Single Text File for LLMs"
4. Click Install
5. Reload VS Code if necessary

### Configuration

Access the extension settings via `File > Preferences > Settings` and search for "Easy Project Export":

| Setting | Description | Default |
|---------|-------------|---------|
| `easyProjectExport.language` | Interface language (en/pt-BR) | `en` |
| `easyProjectExport.enableOnSave` | Enable auto-export on save | `true` |
| `easyProjectExport.includeHiddenFiles` | Include hidden files/folders | `false` |
| `easyProjectExport.maxFileSize` | Max file size in bytes | `1048576` (1MB) |
| `easyProjectExport.excludePatterns` | Patterns to exclude | `["node_modules/**", ".git/**", ...]` |

### Commands

- `Easy Project Export: Export Project to Text File` - Manually export your project
- `Easy Project Export: Toggle Auto Export` - Enable/disable automatic export on save

### Usage Examples

#### For AI Development
Perfect for sharing your entire codebase context with AI assistants:
- Copy the generated text file content
- Paste into ChatGPT, Claude, or other LLMs
- Get comprehensive code review, debugging help, or feature suggestions

#### For Code Documentation
- Generate instant project documentation
- Share complete project structure with team members
- Create snapshots of project state for version control

#### For Learning and Teaching
- Share complete projects for educational purposes
- Provide full context for code reviews
- Create comprehensive examples for tutorials

### Example Output Structure

```
================================================================================
PROJECT EXPORT FOR LLMs
================================================================================

Project Name: my-awesome-project
Generated on: 2024-06-06 23:22:15 (America/Sao_Paulo / GMT-03:00)
Total Files Processed: 42
Export Tool: Easy Whole Project to Single Text File for LLMs v1.0.0
Author: Jota / José Guilherme Pandolfi

================================================================================
PROJECT STRUCTURE
================================================================================
├── 📁 src/
│   ├── 📄 index.ts (2.5 KB)
│   ├── 📁 components/
│   │   └── 📄 Button.tsx (1.2 KB)
│   └── 📁 utils/
│       └── 📄 helpers.ts (856 B)
├── 📄 package.json (1.8 KB)
├── 📄 README.md (3.2 KB)
└── 📄 tsconfig.json (542 B)

================================================================================
FILE CONTENTS
================================================================================

================================================================================
FILE: src/index.ts
================================================================================
// Your complete file content here...
```

### Troubleshooting

**Extension not working after installation:**
- Reload VS Code window (Ctrl+Shift+P > "Developer: Reload Window")
- Check if you have a workspace folder open

**Files not being included:**
- Check the `excludePatterns` setting
- Verify file size doesn't exceed `maxFileSize` limit
- Ensure file extension is in the supported list

**Performance issues with large projects:**
- Increase exclusion patterns for large directories
- Reduce `maxFileSize` setting
- Disable `includeHiddenFiles` if not needed

### Contributing

Contributions are welcome! Please visit our [GitHub repository](https://github.com/jgpandolfi/Easy-Whole-Project-to-Single-Text-File-for-LLMs) to:
- Report bugs
- Request features
- Submit pull requests

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Author

**Jota / José Guilherme Pandolfi**
- GitHub: [@jgpandolfi](https://github.com/jgpandolfi)
- Extension Repository: [Easy-Whole-Project-to-Single-Text-File-for-LLMs](https://github.com/jgpandolfi/Easy-Whole-Project-to-Single-Text-File-for-LLMs)

---

## Português (Brasil)

### Visão Geral

**Easy Whole Project to Single Text File for LLMs** é uma extensão poderosa do Visual Studio Code que gera automaticamente um arquivo de texto abrangente contendo toda a estrutura e conteúdo do código do seu projeto. Esta extensão foi especificamente projetada para ajudar desenvolvedores a compartilhar facilmente o contexto completo de seus projetos com ferramentas de IA e Grandes Modelos de Linguagem (LLMs) como GPT, Claude, Gemini e outros.

### Funcionalidades

- ✅ **Exportação Automática ao Salvar**: Gera o arquivo de texto toda vez que você salva qualquer arquivo no seu projeto
- 📁 **Estrutura Completa do Projeto**: Cria uma representação visual em árvore do diretório do projeto
- 📄 **Conteúdo Completo do Código**: Inclui o código-fonte completo de todos os arquivos baseados em texto
- 🌍 **Suporte Multi-idioma**: Disponível em inglês e português (Brasil)
- ⚙️ **Altamente Configurável**: Personalize padrões de arquivo, limites de tamanho e regras de exclusão
- 🚫 **Exclusões Inteligentes**: Exclui automaticamente arquivos não essenciais comuns (node_modules, .git, etc.)
- 📊 **Listagem de Arquivos Binários**: Lista arquivos binários que não puderam ser incluídos como texto
- 🔧 **Opção de Exportação Manual**: Exporte seu projeto sob demanda via paleta de comandos ou menu de contexto

### Como Funciona

1. **Ativação Automática**: Toda vez que você salva um arquivo (Ctrl+S), a extensão gera automaticamente a exportação
2. **Análise de Arquivos**: Escaneia toda a estrutura de diretórios do seu projeto
3. **Geração de Conteúdo**: Cria um único arquivo de texto com:
   - Metadados do projeto (nome, data de geração, fuso horário)
   - Estrutura completa da árvore de diretórios
   - Conteúdo completo do código-fonte para todos os tipos de arquivo suportados
   - Lista de arquivos binários/excluídos
4. **Local de Salvamento**: Salva o arquivo na raiz do projeto com o formato: `<NOME-DO-PROJETO>-ESTRUTURA-E-ARQUIVOS-DO-PROJETO.txt`

### Extensões de Arquivo Suportadas

A extensão suporta mais de 50 formatos de arquivo baseados em texto, incluindo:

```
.html, .htm, .css, .js, .jsx, .ts, .tsx, .json, .xml, .txt, .md, .yml, .yaml,
.php, .py, .cs, .java, .cpp, .c, .h, .sql, .ps1, .bat, .cmd, .sh, .vue,
.svelte, .scss, .sass, .less, .ini, .conf, .config, .log, .gitignore, .env,
.dockerfile, .go, .rs, .rb, .swift, .kt, .scala, .r, .lua, .vb, .asm, e mais...
```

### Instalação

1. Abra o Visual Studio Code
2. Vá para Extensões (Ctrl+Shift+X)
3. Pesquise por "Easy Whole Project to Single Text File for LLMs"
4. Clique em Instalar
5. Recarregue o VS Code se necessário

### Configuração

Acesse as configurações da extensão via `Arquivo > Preferências > Configurações` e pesquise por "Easy Project Export":

| Configuração | Descrição | Padrão |
|--------------|-----------|--------|
| `easyProjectExport.language` | Idioma da interface (en/pt-BR) | `en` |
| `easyProjectExport.enableOnSave` | Habilitar exportação automática ao salvar | `true` |
| `easyProjectExport.includeHiddenFiles` | Incluir arquivos/pastas ocultos | `false` |
| `easyProjectExport.maxFileSize` | Tamanho máx. do arquivo em bytes | `1048576` (1MB) |
| `easyProjectExport.excludePatterns` | Padrões para excluir | `["node_modules/**", ".git/**", ...]` |

### Comandos

- `Easy Project Export: Export Project to Text File` - Exportar projeto manualmente
- `Easy Project Export: Toggle Auto Export` - Habilitar/desabilitar exportação automática ao salvar

### Exemplos de Uso

#### Para Desenvolvimento com IA
Perfeito para compartilhar o contexto completo da sua base de código com assistentes de IA:
- Copie o conteúdo do arquivo de texto gerado
- Cole no ChatGPT, Claude ou outros LLMs
- Obtenha revisão abrangente de código, ajuda com debugging ou sugestões de funcionalidades

#### Para Documentação de Código
- Gere documentação instantânea do projeto
- Compartilhe estrutura completa do projeto com membros da equipe
- Crie snapshots do estado do projeto para controle de versão

#### Para Aprendizado e Ensino
- Compartilhe projetos completos para fins educacionais
- Forneça contexto completo para revisões de código
- Crie exemplos abrangentes para tutoriais

### Exemplo de Estrutura de Saída

```
================================================================================
PROJECT EXPORT FOR LLMs
================================================================================

Project Name: meu-projeto-incrivel
Generated on: 2024-06-06 23:22:15 (America/Sao_Paulo / GMT-03:00)
Total Files Processed: 42
Export Tool: Easy Whole Project to Single Text File for LLMs v1.0.0
Author: Jota / José Guilherme Pandolfi

================================================================================
PROJECT STRUCTURE
================================================================================
├── 📁 src/
│   ├── 📄 index.ts (2.5 KB)
│   ├── 📁 components/
│   │   └── 📄 Button.tsx (1.2 KB)
│   └── 📁 utils/
│       └── 📄 helpers.ts (856 B)
├── 📄 package.json (1.8 KB)
├── 📄 README.md (3.2 KB)
└── 📄 tsconfig.json (542 B)

================================================================================
FILE CONTENTS
================================================================================

================================================================================
FILE: src/index.ts
================================================================================
// Seu conteúdo completo do arquivo aqui...
```

### Solução de Problemas

**Extensão não funciona após instalação:**
- Recarregue a janela do VS Code (Ctrl+Shift+P > "Developer: Reload Window")
- Verifique se você tem uma pasta de workspace aberta

**Arquivos não estão sendo incluídos:**
- Verifique a configuração `excludePatterns`
- Verifique se o tamanho do arquivo não excede o limite `maxFileSize`
- Certifique-se de que a extensão do arquivo está na lista suportada

**Problemas de performance com projetos grandes:**
- Aumente os padrões de exclusão para diretórios grandes
- Reduza a configuração `maxFileSize`
- Desabilite `includeHiddenFiles` se não necessário

### Contribuindo

Contribuições são bem-vindas! Visite nosso [repositório no GitHub](https://github.com/jgpandolfi/Easy-Whole-Project-to-Single-Text-File-for-LLMs) para:
- Reportar bugs
- Solicitar funcionalidades
- Enviar pull requests

### Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

### Autor

**Jota / José Guilherme Pandolfi**
- GitHub: [@jgpandolfi](https://github.com/jgpandolfi)
- Repositório da Extensão: [Easy-Whole-Project-to-Single-Text-File-for-LLMs](https://github.com/jgpandolfi/Easy-Whole-Project-to-Single-Text-File-for-LLMs)