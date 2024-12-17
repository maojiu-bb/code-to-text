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

  const cleanedLines: string[] = []

  // Track if we're inside a block comment
  let inBlockComment = false

  for (let line of lines) {
    const trimmedLine = line.trim()

    // Skip completely empty lines
    if (!trimmedLine) {
      continue
    }

    // Save the original indentation
    const indentation = line.substring(0, line.length - trimmedLine.length)

    // Handle block comments (/* ... */) and remove them
    if (inBlockComment) {
      if (trimmedLine.includes('*/')) {
        inBlockComment = false
      }
      continue // Skip the entire block comment line
    }

    // Handle block comment start (/*)
    if (trimmedLine.includes('/*')) {
      inBlockComment = true
      // Remove block comment from the line, leaving content before it
      line = indentation + line.split('/*')[0].trim()
    }

    // Remove single-line comments based on the file type (also handles line-end comments)
    const singleLineCommentIndex = getSingleLineCommentStartIndex(ext, trimmedLine)
    if (singleLineCommentIndex !== -1) {
      line = indentation + line.substring(0, singleLineCommentIndex).trim() // Remove comment part
    }

    // After trimming comments, if the line is not empty, add it to the result
    const trimmedCleanedLine = line.trim()
    if (trimmedCleanedLine) {
      cleanedLines.push(line) // Push the line with its original indentation
    }
  }

  return cleanedLines.join('\n')
}

// Helper function to detect single-line comment start position
function getSingleLineCommentStartIndex(ext: string, line: string): number {
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
      return line.indexOf('//') // JavaScript, Dart, Java, C++, Go, PHP, Ruby, etc.
    case '.py':
    case '.sh':
    case '.bat':
    case '.r':
    case '.pl':
      return line.indexOf('#') // Python, Shell, Batch, R, Perl
    case '.sql':
      return line.indexOf('--') // SQL
    case '.html':
    case '.css':
    case '.scss':
    case '.vue':
      return line.indexOf('<!--') // HTML, CSS, Vue
    default:
      return -1 // No comment syntax for the language
  }
}
