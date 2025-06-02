# Code File to Text Extension

## Overview

The Code File to Text extension for VS Code allows you to extract source code files from a selected folder in your workspace, clean them by removing comments and empty lines, and save the cleaned content to separate .txt files. The extension supports a wide range of programming languages and can output the extracted code in manageable parts.

## Features

- Extract Code: Allows you to select a folder and extract code files from it.
- Comment Removal: Removes comments from the code (both single-line and multi-line).
- Empty Line Removal: Strips out any empty lines from the code.
- Batch File Processing: Splits large code outputs into multiple .txt files, each with up to 1000 lines.
- Customizable Output Folder: Choose the name of the folder where the .txt files will be saved.
- Multi-language Support: Supports a variety of languages including JavaScript, Dart, Python, Java, C++, Go, and more.

## Installation

1. Open VS Code.
2. Navigate to the Extensions view by clicking on the Extensions icon in the Activity Bar on the side of the window.
3. Search for Code File to Text and click Install.

## Usage

### Step 1: Activate the Command

To start the extraction process, use the Code File to Text: Extract Code command. You can activate it via the Command Palette:

- Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux).
- Search for Extract Code and select the command.

![command]('https://github.com/maojiu-bb/code-to-text/blob/main/image/command.png?raw=true')

### Step 2: Select the Folder

A dialog will appear asking you to select a folder containing the code you want to extract.

![command]('https://github.com/maojiu-bb/code-to-text/blob/main/image/selectedFolder.png?raw=true')

### Step 3: Choose Output Folder Name

Next, you’ll be prompted to enter the name of the output folder where the extracted .txt files will be saved. The default is output.

![command]('https://github.com/maojiu-bb/code-to-text/blob/main/image/outputFolder.png?raw=true')

### Step 4: Extraction Process

The extension will scan the selected folder for supported code files, remove comments and empty lines, and write the cleaned code into separate .txt files in the specified output folder.

### Step 5: Completion

Once the extraction process is complete, a notification will inform you that the code has been successfully extracted.

![command]('https://github.com/maojiu-bb/code-to-text/blob/main/image/output.png?raw=true')

## Supported File Extensions

The following file extensions are supported by this extension:

- JavaScript: .js, .jsx, .ts, .tsx
- Python: .py
- Java: .java
- C/C++: .c, .cpp, .h, .cc
- Go: .go
- Ruby: .rb
- PHP: .php
- Swift: .swift
- Kotlin: .kt, .kts
- HTML/CSS: .html, .css, .scss, .vue
- SQL: .sql
- XML: .xml
- Others: .dart, .lua, .r, .scala, .ex, .exs

## How It Works

### Comment Removal Logic

The extension works by stripping out comments from source code. Here is a summary of how it handles comments:

- Single-line Comments:
  - JavaScript, TypeScript, Dart, Go, Java, C, C++, etc. comments starting with // are removed.
  - Python, Shell scripts, and others starting with # are also removed.
- Block Comments:
  - Multi-line block comments (e.g., /_ ... _/) are removed in supported languages such as JavaScript, Java, and others.
- HTML/XML Comments:
  - Comments within HTML and XML files, starting with <!-- and ending with -->, are also stripped out.

### Empty Line Removal

The extension removes any blank or empty lines in the code, ensuring that the output is concise and free of unnecessary spacing.

## Limitations

- The extension only processes files with supported extensions. Files with other extensions will be ignored.
- Multi-line block comments that are not properly closed may cause issues during processing.
- The extraction process splits large files into chunks of 1000 lines. If the code exceeds this number, multiple .txt files will be created.

## Contributing

We welcome contributions to improve this extension! To contribute:

1. Fork the repository.
2. Clone your fork to your local machine.
3. Make changes and commit them.
4. Open a pull request.

## License

This extension is open-source and available under the MIT License. See the [LICENSE](https://github.com/maojiu-bb/code-file-to-text/LICENSE) file for more details.

## Contact

If you have any questions or feedback, feel free to contact us at:

- Email: maojiu.king@gmail.com
- GitHub: https://github.com/maojiu-bb/code-file-to-text
