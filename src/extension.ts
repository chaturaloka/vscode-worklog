// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import {
  logWorkCommand,
  createBlogPostCommand,
  moveUnfinishedTasksCommand,
} from './commands';

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "worklog" is now active!');

  let disposable = vscode.commands.registerCommand(
    'extension.logWork',
    logWorkCommand,
  );

  let blogDisposable = vscode.commands.registerCommand(
    'extension.createBlogPost',
    createBlogPostCommand,
  );

  let moveUnfinishedTasksDisposable = vscode.commands.registerCommand(
    'extension.moveUnfinishedTasks',
    moveUnfinishedTasksCommand,
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(blogDisposable);
  context.subscriptions.push(moveUnfinishedTasksDisposable);
}

export function deactivate() {}
