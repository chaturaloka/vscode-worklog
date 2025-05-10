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
				createMarkdownFile(newFile, "BlogPost", "template", `# ${blogTitle}\n\n---\n`);
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

	vscode.commands.registerCommand('extension.generateWeeklySummary', (e) => {
		const folderPath = e?.path || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
		if (!folderPath) {
			vscode.window.showErrorMessage('No folder selected or workspace found.');
			return;
		}

		try {
			const summaryFilePath = generateWeeklySummary(folderPath);
			vscode.workspace.openTextDocument(summaryFilePath).then(doc => vscode.window.showTextDocument(doc));
			vscode.window.showInformationMessage('Weekly summary generated successfully!');
		} catch (error) {
			vscode.window.showErrorMessage('Failed to generate weekly summary.');
			console.error(error);
		}
	});
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


function createMarkdownFile(filename: string, configName: string = "WorkLog", propertyName: string = "plan", defaultContent: string = "# Plan for the day\n\n---\n") {
	if (!fs.existsSync(filename)) {
		var wstream = fs.createWriteStream(filename);
		wstream.on('error', function (e) { console.error(e); });
		var content: Array<string> = vscode.workspace.getConfiguration(configName).get(propertyName) || [];
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

function generateWeeklySummary(folderPath: string) {
	const currentDate = new Date('2025-05-09'); // Replace with dynamic date in production
	const startOfWeek = new Date(currentDate);
	startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
	const endOfWeek = new Date(startOfWeek);
	endOfWeek.setDate(startOfWeek.getDate() + 6);

	const files = fs.readdirSync(folderPath);
	const weeklyFiles = files.filter(file => {
		const match = file.match(/(\d{4})_(\d{2})_(\d{2})/);
		if (match) {
			const fileDate = new Date(`${match[1]}-${match[2]}-${match[3]}`);
			return fileDate >= startOfWeek && fileDate <= endOfWeek;
		}
		return false;
	});

	let summaryContent = `# Weekly Summary (${startOfWeek.toDateString()} - ${endOfWeek.toDateString()})\n\n`;
	let completedTasks = '';
	let pendingTasks = '';
	let notes = '';

	weeklyFiles.forEach(file => {
		const filePath = path.join(folderPath, file);
		const content = fs.readFileSync(filePath, 'utf-8');
		const lines = content.split('\n');

		lines.forEach(line => {
			if (line.startsWith('- [x]')) {
				completedTasks += `${line} (${file})\n`;
			} else if (line.startsWith('- [ ]')) {
				pendingTasks += `${line} (${file})\n`;
			} else {
				notes += `${line} (${file})\n`;
			}
		});
	});

	summaryContent += `## Completed Tasks:\n${completedTasks || 'None'}\n\n`;
	summaryContent += `## Pending Tasks:\n${pendingTasks || 'None'}\n\n`;
	summaryContent += `## Notes:\n${notes || 'None'}\n`;

	const summaryFileName = `${startOfWeek.toISOString().split('T')[0].replace(/-/g, '_')}_to_${endOfWeek.toISOString().split('T')[0].replace(/-/g, '_')}_Summary.md`;
	const summaryFilePath = path.join(folderPath, summaryFileName);

	fs.writeFileSync(summaryFilePath, summaryContent);
	return summaryFilePath;
}

// this method is called when your extension is deactivated
export function deactivate() { }
