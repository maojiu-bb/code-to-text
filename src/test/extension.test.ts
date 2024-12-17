import * as assert from 'assert'
import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

suite('Extension Test Suite', function () {
  this.timeout(5000) // Increase the timeout to 5000ms

  let workspaceFolder: string
  let outputFolder: string

  suiteSetup(async () => {
    // Create a temporary workspace folder for testing
    const workspaceUri = vscode.Uri.file(path.join(__dirname, 'testWorkspace'))
    workspaceFolder = workspaceUri.fsPath

    if (!fs.existsSync(workspaceFolder)) {
      fs.mkdirSync(workspaceFolder)
    }

    // Add the workspace folder to VSCode workspace
    await vscode.workspace.updateWorkspaceFolders(0, null, { uri: workspaceUri })

    outputFolder = path.join(workspaceFolder, 'output')
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder)
    }

    // Create some sample code files to test
    const sampleFolder = path.join(workspaceFolder, 'src')
    if (!fs.existsSync(sampleFolder)) {
      fs.mkdirSync(sampleFolder)
    }

    // Create a sample .js file
    fs.writeFileSync(path.join(sampleFolder, 'sample1.js'), `console.log('Hello World');`)
    fs.writeFileSync(path.join(sampleFolder, 'sample2.js'), `// Sample JS\nconsole.log('Another Hello');`)
  })

  suiteTeardown(async () => {
    // Clean up: Remove the workspace and generated files after tests
    if (fs.existsSync(workspaceFolder)) {
      fs.rmdirSync(workspaceFolder, { recursive: true })
    }
  })

  test('Extract code to TXT files', async () => {
    // Trigger the 'extractCode' command. This automatically activates the extension if not already activated.
    await vscode.commands.executeCommand('code-file-to-text.extractCode')

    // Check if output files are created in the output folder
    const outputFiles = fs.readdirSync(outputFolder)
    assert.strictEqual(outputFiles.length > 0, true, 'Output files should be created')

    // Check if the files have content
    const firstOutputFilePath = path.join(outputFolder, outputFiles[0])
    const fileContent = fs.readFileSync(firstOutputFilePath, 'utf-8')
    assert.strictEqual(fileContent.length > 0, true, 'File content should not be empty')

    // Check if the content is correct (e.g., check if we cleaned comments)
    assert.strictEqual(fileContent.includes('// Sample JS'), false, 'Comments should be removed')
    assert.strictEqual(fileContent.includes("console.log('Hello World');"), true, 'Valid code should be included')
  })
})
