# README

A simple extension to create a new markdown file with a pre-defined content with the filename format as 'YYYY_MM_DD_Day.md'

## Features

- Create a worklog with the filename format as 'YYYY_MM_DD_Day.md' with a boiler plate markdown(any format) content

## Requirements

So far, No external depedencies

## Extension Settings

This extension contributes the following settings:

- `WorkLog.plan`: boiler plate content that will be written to the newly created worklog

## Known Issues

N/A

## Release Notes

### 0.0.4 (Development)

- Adds new configuration 'WorkLog.plan' to the extension with a default content
- Reads from the configuration if exists and writes to the newly created worklog
- Writes simple hardcoded content if the configuration is empty
- Shows appropriate error message while creating a work log if there's already an existing worklog with the same title

### 0.0.3 (Development)

- Fixes the date generation in the format: 'YYYY_MM_DD_Day.md', Fixes the bug in date generation format using the proper javascript api

### 0.0.2 (Development)

- Adds right click menu option to create a work log
- Creates a new markdown file with the hardcoded content at the folder in which the right click is performed
- Creates a new markdown file with hardcoded content at the root of the workspace if command exectued using cmd + shift + p

### 0.0.1 (Development)

- Creates a new markdown file with hardcoded content at the root of the workspace

---
