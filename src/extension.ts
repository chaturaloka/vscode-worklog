// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "worklog" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.logWork', () => {
		// The code you place here will be executed every time your command is executed
		if (vscode.workspace.workspaceFolders) {
			console.log(vscode.workspace.workspaceFolders);
			let folderName = vscode.workspace.workspaceFolders[0].uri.fsPath;
			console.log("Current path is: " + folderName);
			const newFile = folderName + "/" + getNewEntryName();
			console.log("New File Name is: " + newFile);
			createMarkdownFile(newFile);
			vscode.workspace.openTextDocument(newFile).then(doc => vscode.window.showTextDocument(doc));
			vscode.window.showInformationMessage("Create a new work log");
		} else {
			vscode.window.showWarningMessage("No Active Window, Open a pre-existing work log");
		}
	});

	context.subscriptions.push(disposable);
}

function getNewEntryName() {
	let date_ob = new Date();
	return date_ob.getFullYear() + "_"
		+ date_ob.getMonth() + 1 + "_"
		+ date_ob.getDate() + "_"
		+ date_ob.toLocaleString('en-US', {
			weekday: 'long'
		}) + ".md";
}

function createMarkdownFile(filename: string) {
	if (!fs.existsSync(filename)) {
		var wstream = fs.createWriteStream(filename);
		wstream.on('error', function (e) { console.error(e); });
		wstream.write("# Plan for the day\n\n");
		wstream.write("[ ] Misc\n\n");
		wstream.write("---\n\n");
		wstream.write("## Misc\n\n");
		wstream.write("---\n");
		wstream.end();
	}
}

// this method is called when your extension is deactivated
export function deactivate() { }
