# Change Log

All notable changes to the "worklog" extension will be documented in this file.

This is based on [Keep a Changelog](http://keepachangelog.com/).

## 1.5.0 - 2025-05-11

- Added a new configuration `WorkLog.includeWeekends` to allow users to include or exclude weekends in work log creation.
- Updated the `moveUnfinishedTasksCommand` to respect the `WorkLog.includeWeekends` configuration and skip weekends if the setting is disabled.

## 1.3.0 - 2025-05-10

- Refactored commands (`logWork`, `createBlogPost`, `moveUnfinishedTasks`) into separate reusable functions and moved them to a new `commands.ts` file for better modularity.
- Updated `extension.ts` to import and register commands from `commands.ts`.
- Fixed build issues by ensuring the `extension.cjs` file is properly generated and included in the package.
- Improved error handling and logging for commands.
- Added functionality to move unfinished tasks to the next day's worklog file.
- Replaced `any` type with `vscode.Uri` and `NodeJS.ErrnoException` for better type safety.
- Addressed linting issues and improved code readability.

## 1.2.8 - 2025-05-10

- Refactored commands (`logWork`, `createBlogPost`, `moveUnfinishedTasks`) into separate reusable functions and moved them to a new `commands.ts` file for better modularity.
- Updated `extension.ts` to import and register commands from `commands.ts`.
- Fixed build issues by ensuring the `extension.cjs` file is properly generated and included in the package.
- Improved error handling and logging for commands.
- Added functionality to move unfinished tasks to the next day's worklog file.

### 0.0.7 (Development)

- Updated Typescript version to the latest and fixed compilation warnings

### 0.0.6 (Development)

- Fixed empty content bug while creating the worklog by writing the content array using loops

### 0.0.5 (Development)

- Created CHANGELOG document with proper release notes that can be showed in the vscode marketplace

### 0.0.4 (Development)

- Added new configuration 'WorkLog.plan' to the extension with a default content
- Changed the extension to read from the configuration if exists and write to the newly created worklog
- Changed the extension default behavior to write simple hardcoded content if the configuration is empty
- Added appropriate error message while creating a work log if there's already an existing worklog with the same title

### 0.0.3 (Development)

- Fixed the date generation in the format: 'YYYY_MM_DD_Day.md'
- Fixed the bug in date generation format using the proper javascript api

### 0.0.2 (Development)

- Added right click menu option to create a work log
- Changed the extension to create a new markdown file with the hardcoded content at the folder in which the right click is performed
- Changed the extension to create a new markdown file with hardcoded content at the root of the workspace if command exectued using cmd + shift + p

### 0.0.1 (Development)

- Initial release
- Added the extension that creates a new markdown file with hardcoded content at the root of the workspace

---
