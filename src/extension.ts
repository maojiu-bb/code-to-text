// Import modules
import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

// Extension activation
export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('code-file-to-text.extractCode', async () => {
    const folderPath = await vscode.window.showOpenDialog({
      canSelectFiles: false,
      canSelectFolders: true,
      title: 'Select A Folder To Extract Code To TXT Files'
    })

    if (!folderPath || folderPath.length === 0) {
      vscode.window.showErrorMessage('No folder selected!')
      return
    }

    const workSpaceFolder = folderPath[0].fsPath

    const outputFolderName = await vscode.window.showInputBox({
      placeHolder: 'Enter the name of the output folder (default: output)',
      value: 'output'
    })

    if (!outputFolderName) {
      vscode.window.showErrorMessage('No output folder name!')
      return
    }

    const root = vscode.workspace.workspaceFolders![0].uri.fsPath
    const outputFolder = path.join(root, outputFolderName)

    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder)
    }

    const extensions = [
      'vue',
      'dart',
      'js',
      'jsx',
      'ts',
      'tsx',
      'py',
      'java',
      'c',
      'cpp',
      'h',
      'cc',
      'm',
      'cs',
      'go',
      'rb',
      'rs',
      'php',
      'swift',
      'kt',
      'kts',
      'html',
      'css',
      'scss',
      'sass',
      'less',
      'sh',
      'bat',
      'xml',
      'lua',
      'sql',
      'pl',
      'r',
      'scala',
      'erl',
      'ex',
      'exs'
    ]

    const pattern = `**/*.{${extensions.join(',')}}`
    const files = await vscode.workspace.findFiles(new vscode.RelativePattern(workSpaceFolder, pattern), `**/node_modules/**,**/build/**,**/dist/**,**/.git/**,**/logs/**`)

    let allCode: string[] = []

    for (const file of files) {
      const content = fs.readFileSync(file.fsPath, 'utf-8')
      const cleanedContent = removeCommentsAndEmptyLines(content, file.fsPath)
      allCode = allCode.concat(cleanedContent.split('\n'))
    }

    let fileIndex = 1
    while (allCode.length > 0) {
      const chunk = allCode.splice(0, 1000).join('\n')
      const outputPath = path.join(outputFolder, `code_part_${fileIndex}.txt`)
      fs.writeFileSync(outputPath, chunk, 'utf-8')
      fileIndex++
    }

    vscode.window.showInformationMessage(`Extracted code to TXT files in the ${outputFolderName} folder.`)
  })

  context.subscriptions.push(disposable)
}

// Remove comments and empty lines
function removeCommentsAndEmptyLines(content: string, filePath: string): string {
  const ext = path.extname(filePath).toLowerCase()
  const lines = content.split('\n')

  const cleanedLines = lines.filter(line => {
    const trimmed = line.trim()

    if (!trimmed) {
      return false
    }

    let cleanedLine = line

    const singleLineCommentIndex = cleanedLine.indexOf('//')
    const blockCommentStartIndex = cleanedLine.indexOf('/*')
    const blockCommentEndIndex = cleanedLine.indexOf('*/')

    if (singleLineCommentIndex !== -1) {
      cleanedLine = cleanedLine.substring(0, singleLineCommentIndex).trim()
    } else if (blockCommentStartIndex !== -1 && blockCommentEndIndex !== -1) {
      cleanedLine = cleanedLine.substring(0, blockCommentStartIndex).trim()
    }

    const trimmedCleanedLine = cleanedLine.trim()
    if (!trimmedCleanedLine) {
      return false
    }

    switch (ext) {
      case '.js':
      case '.dart':
      case '.jsx':
      case '.ts':
      case '.tsx':
      case '.java':
      case '.c':
      case '.cpp':
      case '.cs':
      case '.go':
      case '.php':
      case '.rb':
      case '.swift':
      case '.kt':
      case '.kts':
      case '.scala':
      case '.lua':
      case '.erl':
      case '.ex':
      case '.exs':
        if (trimmedCleanedLine.startsWith('/*') || trimmedCleanedLine.endsWith('*/')) {
          return false
        }
        break
      case '.py':
      case '.sh':
      case '.bat':
      case '.r':
      case '.pl':
        if (trimmedCleanedLine.startsWith('#')) {
          return false
        }
        break
      case '.html':
      case '.css':
      case '.scss':
      case '.vue':
        if (trimmedCleanedLine.startsWith('<!--') || trimmedCleanedLine.startsWith('/*') || trimmedCleanedLine.endsWith('-->') || trimmedCleanedLine.endsWith('*/')) {
          return false
        }
        break
      case '.sql':
        if (trimmedCleanedLine.startsWith('--')) {
          return false
        }
        break
      case '.xml':
        if (trimmedCleanedLine.startsWith('<!--') || trimmedCleanedLine.endsWith('-->')) {
          return false
        }
        break
      default:
        break
    }

    return true
  })

  return cleanedLines.join('\n')
}
