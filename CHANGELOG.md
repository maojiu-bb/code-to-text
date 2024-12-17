# Change Log

All notable changes to the "code-file-to-text" extension will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) and this project adheres to [Semantic Versioning](http://semver.org/).

## [1.0.0] - 2024-12-17

### Added

- Initial release of the "code-file-to-text" extension, which allows users to extract code from a folder, remove comments and empty lines, and save the cleaned code into text files.
- Support for multiple programming languages including JavaScript, Dart, Python, Java, C++, Go, Ruby, and more.
- Users can choose the output folder name and the extension will save the extracted code into `.txt` files in parts.
- Supports both single-line and multi-line comment removal.
- Generates `.txt` files with a maximum of 1000 lines per file.

### Fixed

- Fixed issues with incorrect handling of multi-line block comments.
- Ensured proper handling of empty lines and comments across different file types.

## [1.0.0] - 2024-12-17

### Fixed

- Fixed issues with line comment removed fail.

## [1.0.4] - 2024-12-17

### Fixed

- Fixed issues with line comment removed.
