import * as assert from 'assert'
import * as vscode from 'vscode'
import * as fs from 'fs'
import * as path from 'path'

suite('Extension Test Suite', function () {
  this.timeout(5000)

  let workspaceFolder: string
  let outputFolder: string
  let sampleFolder: string

  suiteSetup(async () => {
    const workspaceUri = vscode.Uri.file(path.join(__dirname, 'testWorkspace'))
    workspaceFolder = workspaceUri.fsPath

    if (!fs.existsSync(workspaceFolder)) {
      fs.mkdirSync(workspaceFolder)
    }

    await vscode.workspace.updateWorkspaceFolders(0, null, { uri: workspaceUri })

    outputFolder = path.join(workspaceFolder, 'output')
    if (!fs.existsSync(outputFolder)) {
      fs.mkdirSync(outputFolder)
    }

    sampleFolder = path.join(workspaceFolder, 'src')
    if (!fs.existsSync(sampleFolder)) {
      fs.mkdirSync(sampleFolder)
    }

    // Create various sample files for comprehensive testing
    fs.writeFileSync(path.join(sampleFolder, 'sample.js'), `// Single-line comment\nconsole.log('JS'); /* Multi-line\ncomment */ console.log('JS2');`)
    fs.writeFileSync(path.join(sampleFolder, 'sample.py'), `# Python comment\nprint("Python")`)
    fs.writeFileSync(path.join(sampleFolder, 'sample.sql'), `-- SQL comment\nSELECT * FROM table;`)
    fs.writeFileSync(path.join(sampleFolder, 'sample.html'), `<html></html>`)
    fs.writeFileSync(path.join(sampleFolder, 'sample.css'), `/* CSS comment */ body { color: red; }`)
    fs.writeFileSync(path.join(sampleFolder, 'sample.vue'), `<template><div></div></template>`)
    fs.writeFileSync(path.join(sampleFolder, 'sample.c'), `//c comment\n/* c multi line\ncomment */ int a = 1;`)
    fs.writeFileSync(path.join(sampleFolder, 'sample.sh'), `# shell comment\nls -l`)
    fs.writeFileSync(path.join(sampleFolder, 'sample.bat'), `@echo off\nREM batch comment\ndir`)
  })

  suiteTeardown(async () => {
    if (fs.existsSync(workspaceFolder)) {
      fs.rmdirSync(workspaceFolder, { recursive: true })
    }
  })

  test('Extract code to TXT files with correct comment removal', async () => {
    await vscode.commands.executeCommand('code-file-to-text.extractCode')

    const outputFiles = fs.readdirSync(outputFolder)
    assert.strictEqual(outputFiles.length > 0, true, 'Output files should be created')

    const firstOutputFilePath = path.join(outputFolder, outputFiles[0])
    const fileContent = fs.readFileSync(firstOutputFilePath, 'utf-8')

    assert.strictEqual(fileContent.includes('// Single-line comment'), false, 'JS single-line comment should be removed')
    assert.strictEqual(fileContent.includes('/* Multi-line'), false, 'JS multi-line comment should be removed')
    assert.strictEqual(fileContent.includes("console.log('JS');"), true, 'JS code should be included')
    assert.strictEqual(fileContent.includes("console.log('JS2');"), true, 'JS code should be included')

    assert.strictEqual(fileContent.includes('# Python comment'), false, 'Python comment should be removed')
    assert.strictEqual(fileContent.includes('print("Python")'), true, 'Python code should be included')

    assert.strictEqual(fileContent.includes('-- SQL comment'), false, 'SQL comment should be removed')
    assert.strictEqual(fileContent.includes('SELECT * FROM table;'), true, 'SQL code should be included')

    assert.strictEqual(fileContent.includes(''), false, 'HTML comment should be removed')
    assert.strictEqual(fileContent.includes('<html></html>'), true, 'HTML code should be included')

    assert.strictEqual(fileContent.includes('/* CSS comment */'), false, 'CSS comment should be removed')
    assert.strictEqual(fileContent.includes('body { color: red; }'), true, 'CSS code should be included')

    assert.strictEqual(fileContent.includes(''), false, 'Vue comment should be removed')
    assert.strictEqual(fileContent.includes('<template><div></div></template>'), true, 'Vue code should be included')

    assert.strictEqual(fileContent.includes('//c comment'), false, 'c single-line comment should be removed')
    assert.strictEqual(fileContent.includes('/* c multi line'), false, 'c multi-line comment should be removed')
    assert.strictEqual(fileContent.includes('int a = 1;'), true, 'c code should be included')

    assert.strictEqual(fileContent.includes('# shell comment'), false, 'shell comment should be removed')
    assert.strictEqual(fileContent.includes('ls -l'), true, 'shell code should be included')

    assert.strictEqual(fileContent.includes('REM batch comment'), false, 'batch comment should be removed')
    assert.strictEqual(fileContent.includes('dir'), true, 'batch code should be included')
  })
})
