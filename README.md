# README

A simple extension to create a new file with a pre-defined content & filename format for logging work or creating blog

![Build Status](https://dev.azure.com/chaturaloka/VSCode-worklog/_apis/build/status/chaturaloka.vscode-worklog?branchName=main)

## Features

![Menu Screenshot](https://raw.githubusercontent.com/chaturaloka/vscode-worklog/main/Extension_Menu_Shortcut.png)

- Create a file for planning and logging work with the filename format as 'YYYY_MM_DD_Day.md' with a boiler plate content (configurable)

  ![Creates New Worklog](https://raw.githubusercontent.com/chaturaloka/vscode-worklog/main/recordings/create-new-worklog.gif)

- Create a file for blogging with the given filename format as 'YYYY-MM-DD-Blog_title.mdx' with a boiler plate content (configurable)

  ![Creates New Blog](https://raw.githubusercontent.com/chaturaloka/vscode-worklog/main/recordings/Create-new-blog.gif)

## Requirements

So far, No external depedencies

## Extension Settings

This extension contributes the following settings:

- `WorkLog.plan`: boiler plate content that will be written to the newly created worklog
- `BlogPost.template`: boiler plate content that will be written to the newly created blog post

## Known Issues

N/A

## Contribution Guidelines

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Commit your changes with clear messages.
4. Submit a pull request.

## Testing

Run the following commands to test the extension:

```bash
npm run lint
npm run test
```

## Localization

To add localization support, use the `vscode-nls` package.
