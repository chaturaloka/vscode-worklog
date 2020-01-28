# README

A simple extension to create a new markdown file with a pre-defined content with the filename format as 'YYYY_MM_DD_Day.md'

## Features

- Create a worklog with the filename format as 'YYYY_MM_DD_Day.md' with a boiler plate markdown(any format) content

## Requirements

So far, no external depedencies

## Extension Settings

- Plan to add the 'content' of the markdown file to a template file.

Include if your extension adds any VS Code settings through the `contributes.configuration` extension point.

For example:

This extension contributes the following settings:

- `myExtension.enable`: enable/disable this extension
- `myExtension.thing`: set to `blah` to do something

## Known Issues

N/A

## Release Notes

Users appreciate release notes as you update your extension.

### 0.0.1 (Development)

- Creates a new markdown file with hardcoded content at the root of the workspace

### 0.0.2 (Development)

- Adds right click menu option to create a work log
- Creates a new markdown file with the hardcoded content at the folder in which the right click is performed
- Creates a new markdown file with hardcoded content at the root of the workspace if command exectued using cmd + shift + p

---
