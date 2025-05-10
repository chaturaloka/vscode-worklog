// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { logWorkCommand, createBlogPostCommand, moveUnfinishedTasksCommand } from './commands';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "worklog" is now active!');

	let disposable = vscode.commands.registerCommand(
		'extension.logWork',
		logWorkCommand
	);

	let blogDisposable = vscode.commands.registerCommand(
		'extension.createBlogPost',
		createBlogPostCommand
	);

	let moveUnfinishedTasksDisposable = vscode.commands.registerCommand(
		'extension.moveUnfinishedTasks',
		moveUnfinishedTasksCommand
	);

	context.subscriptions.push(disposable);
	context.subscriptions.push(blogDisposable);
	context.subscriptions.push(moveUnfinishedTasksDisposable);
}

function showTemporaryWarningMessage(message: string, delay: number = 5000) {
	const warning = vscode.window.showWarningMessage(message, { modal: false });
	setTimeout(() => {
		warning.then(() => { }); // Allow the message to naturally disappear after the delay
	}, delay);
}

function getStartOfDay(date: Date): Date {
	const startOfDay = new Date(date);
	startOfDay.setHours(0, 0, 0, 0);
	return startOfDay;
}

function getNewEntryName() {
	let date_ob = new Date();
	return (
		date_ob.toISOString().slice(0, 10).replace(/-/g, '_') +
		'_' +
		date_ob.toLocaleString('en-US', {
			weekday: 'long',
		}) +
		'.md'
	);
}

function getNewBlogPostName(blogTitle: string = 'Blog_title') {
	let date_ob = new Date();
	return (
		date_ob.toISOString().slice(0, 10) +
		'-' +
		blogTitle.replace(/ /g, '-') +
		'.mdx'
	);
}

function getFileNameForDate(date: Date, timeZone: string): string {
	return `${date.toISOString().slice(0, 10).replace(/-/g, '_')}_${date.toLocaleString('en-US', { weekday: 'long', timeZone })}.md`;
}

function createMarkdownFile(
	filename: string,
	configName: string = 'WorkLog',
	propertyName: string = 'plan',
	defaultContent: string = '# Plan for the day\n\n---\n',
) {
	if (!fs.existsSync(filename)) {
		var wstream = fs.createWriteStream(filename);
		wstream.on('error', function (e) {
			console.error(e);
		});
		var content: Array<string> =
			vscode.workspace.getConfiguration(configName).get(propertyName) || [];
		if (content.length === 0) {
			wstream.write(defaultContent);
		} else {
			content.forEach(function (val) {
				console.log(val);
				wstream.write(val);
			});
		}
		wstream.end();
	}
}

// this method is called when your extension is deactivated
export function deactivate() { }
