// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "worklog" is now active!');

	let disposable = vscode.commands.registerCommand('extension.logWork', function (e) {
		var folderName = "";
		try {
			console.log("Executed from: " + e);
			if (fs.lstatSync(e.path).isDirectory()) {
				folderName = e.path;
			} else {
				folderName = path.dirname(e.path);
			}
		} catch (e) {
			console.error("Error: " + e);
			if (e.code === 'ENOENT') {
				vscode.window.showWarningMessage("No such file exists");
			} else {
				vscode.window.showWarningMessage("No Active File/Folder Chosen, Right click on the folder/file where you want to create the new work log");
			}
		}

		if (folderName === "" && vscode.workspace.workspaceFolders) {
			console.log("Path not found, creating a file in the workspace root");
			console.log(vscode.workspace.workspaceFolders);
			folderName = vscode.workspace.workspaceFolders[0].uri.fsPath;
		}

		console.log("Current path is: " + folderName);
		const newFile = folderName + "/" + getNewEntryName();
		console.log("New File Name is: " + newFile);
		createMarkdownFile(newFile);
		vscode.workspace.openTextDocument(newFile).then(doc => vscode.window.showTextDocument(doc));
		vscode.window.showInformationMessage("Create a new work log");
	});

	context.subscriptions.push(disposable);
}

function getNewEntryName() {
	let date_ob = new Date();
	return date_ob.toISOString().substr(0, 10).replace(/-/g, "_") + "_"
		+ date_ob.toLocaleString('en-US', {
			weekday: 'long'
		}) + ".md";
}

function createMarkdownFile(filename: string) {
	if (!fs.existsSync(filename)) {
		var wstream = fs.createWriteStream(filename);
		wstream.on('error', function (e) { console.error(e); });
		var content: Array<string> = vscode.workspace.getConfiguration('WorkLog').get('plan') || [];
		if (content.length === 0) {
			wstream.write("# Plan for the day\n\n");
			wstream.write("---\n");
		} else {
			content.forEach(function (val, index) {
				console.log(val);
				wstream.write(val);
			});
		}
		wstream.end();
	}
}

// this method is called when your extension is deactivated
export function deactivate() { }
