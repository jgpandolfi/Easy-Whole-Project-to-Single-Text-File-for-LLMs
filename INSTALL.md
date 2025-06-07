# Instruções de Instalação e Desenvolvimento

## Para Desenvolvedores

### Pré-requisitos
- Node.js (versão 16 ou superior)
- npm ou yarn
- Visual Studio Code (versão 1.74.0 ou superior)
- Git

### Configuração do Ambiente de Desenvolvimento

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/jgpandolfi/Easy-Whole-Project-to-Single-Text-File-for-LLMs.git
   cd Easy-Whole-Project-to-Single-Text-File-for-LLMs
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Compile o TypeScript:**
   ```bash
   npm run compile
   ```

4. **Execute o linting:**
   ```bash
   npm run lint
   ```

### Testando a Extensão

1. **Abra o projeto no VS Code:**
   ```bash
   code .
   ```

2. **Pressione F5** para abrir uma nova janela do VS Code com a extensão carregada

3. **Abra um projeto de teste** na nova janela

4. **Teste as funcionalidades:**
   - Salve um arquivo (Ctrl+S) para testar exportação automática
   - Use Ctrl+Shift+P → "Export Project to Text File" para teste manual
   - Verifique se o arquivo foi gerado na raiz do projeto

### Empacotamento para Distribuição

1. **Instale o VSCE (VS Code Extension Manager):**
   ```bash
   npm install -g vsce
   ```

2. **Empacote a extensão:**
   ```bash
   vsce package
   ```

3. **Publique no Marketplace (se autorizado):**
   ```bash
   vsce publish
   ```

### Estrutura de Desenvolvimento

```
Easy-Whole-Project-to-Single-Text-File-for-LLMs/
├── src/
│   └── extension.ts          # Código principal
├── .vscode/
│   ├── launch.json           # Config de debug
│   └── tasks.json            # Tarefas de build
├── package.json              # Manifest da extensão
├── package.nls.json          # Localização (inglês)
├── package.nls.pt-BR.json    # Localização (português)
├── tsconfig.json             # Config TypeScript
├── .eslintrc.json            # Config ESLint
├── README.md                 # Documentação
├── LICENSE                   # Licença MIT
├── CHANGELOG.md              # Histórico de versões
├── .gitignore                # Arquivos ignorados pelo Git
└── .vscodeignore             # Arquivos ignorados no empacotamento
```

## Para Usuários Finais

### Instalação via Marketplace
1. Abra o Visual Studio Code
2. Vá para Extensões (Ctrl+Shift+X)
3. Pesquise "Easy Whole Project to Single Text File for LLMs"
4. Clique em "Instalar"
5. Recarregue o VS Code se necessário

### Instalação Manual (VSIX)
1. Baixe o arquivo `.vsix` da extensão
2. Abra o VS Code
3. Vá para Extensões (Ctrl+Shift+X)
4. Clique nos três pontos (...) → "Install from VSIX..."
5. Selecione o arquivo baixado

### Configuração Inicial
1. Vá para Configurações (Ctrl+,)
2. Pesquise "Easy Project Export"
3. Configure as opções conforme necessário:
   - Idioma da interface
   - Habilitação da exportação automática
   - Padrões de exclusão
   - Tamanho máximo de arquivo

### Uso Básico
1. Abra um projeto no VS Code
2. Salve qualquer arquivo (Ctrl+S)
3. Verifique o arquivo gerado na raiz do projeto
4. Use o arquivo com ferramentas de IA como ChatGPT, Claude, etc.
