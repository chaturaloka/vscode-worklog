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
		} catch (err: any) {
			console.error("Error: " + err);
			if (err.code === 'ENOENT') {
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

	let blogDisposable = vscode.commands.registerCommand('extension.createBlogPost', function (e) {
		var folderName = "";
		try {
			console.log("Executed from: " + e);
			if (fs.lstatSync(e.path).isDirectory()) {
				folderName = e.path;
			} else {
				folderName = path.dirname(e.path);
			}
		} catch (err: any) {
			console.error("Error: " + err);
			if (err.code === 'ENOENT') {
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

		vscode.window.showInputBox({
			value: 'Blog',
			prompt: `Enter title for the blog (default: Blog)`,
			ignoreFocusOut: true,
			valueSelection: [-1, -1]
		}).then((blogTitle) => {
			if (!blogTitle) return;
			try {
				const newFile = folderName + "/" + getNewBlogPostName(blogTitle);
				console.log("New File Name is: " + newFile);
				createMarkdownFile(newFile, "BlogPost", `# ${blogTitle}\n\n---\n`);
				vscode.workspace.openTextDocument(newFile).then(doc => vscode.window.showTextDocument(doc));
				vscode.window.showInformationMessage("Created a new blog post");
			} catch (err: any) {
				console.error("Error: " + err);
				vscode.window.showErrorMessage("Somthing went wrong! Please report on GitHub");
			}
		});
	});

	context.subscriptions.push(disposable);
	context.subscriptions.push(blogDisposable);
}

function getNewEntryName() {
	let date_ob = new Date();
	return date_ob.toISOString().substr(0, 10).replace(/-/g, "_") + "_"
		+ date_ob.toLocaleString('en-US', {
			weekday: 'long'
		}) + ".md";
}

function getNewBlogPostName(blogTitle: string = "Blog_title") {
	let date_ob = new Date();
	return date_ob.toISOString().substr(0, 10)
		+ "-"
		+ blogTitle.replace(/ /g, "-")
		+ ".mdx";
}


function createMarkdownFile(filename: string, configName: string = "WorkLog", defaultContent: string = "# Plan for the day\n\n---\n") {
	if (!fs.existsSync(filename)) {
		var wstream = fs.createWriteStream(filename);
		wstream.on('error', function (e) { console.error(e); });
		var content: Array<string> = vscode.workspace.getConfiguration(configName).get('template') || [];
		if (content.length === 0) {
			wstream.write(defaultContent);
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
