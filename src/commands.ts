import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Utils } from './utils';

export function logWorkCommand(e: vscode.Uri) {
    var folderName = getFolderName(e);
    const newFile = folderName + '/' + Utils.getNewEntryName();
    console.log('Worklog Name is: ' + newFile);
    Utils.createMarkdownFile(newFile);
    vscode.workspace
        .openTextDocument(newFile)
        .then((doc) => vscode.window.showTextDocument(doc));
    vscode.window.showInformationMessage('Created a new work log');
}

export function moveUnfinishedTasksCommand(e: vscode.Uri) {
    console.log('Move unfinished tasks command executed');
    const folderName = getFolderName(e);
    if (!folderName) {
        vscode.window.showErrorMessage('No folder selected or workspace open.');
        return;
    }

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const today = Utils.getStartOfDay();
    const includeWeekends = vscode.workspace.getConfiguration('WorkLog').get('includeWeekends', false);

    const isWeekend = (date: Date) => {
        const day = date.getDay();
        return day === 0 || day === 6; // Sunday (0) or Saturday (6)
    };

    const tomorrow = new Date(today.getTime() + 86400000);
    if (!includeWeekends && isWeekend(tomorrow)) {
        tomorrow.setDate(tomorrow.getDate() + (tomorrow.getDay() === 6 ? 2 : 1));
    }

    const todayFileName = Utils.getFileNameForDate(today, userTimeZone);
    const tomorrowFileName = Utils.getFileNameForDate(tomorrow, userTimeZone);

    const todayFile = path.join(folderName, todayFileName);
    const tomorrowFile = path.join(folderName, tomorrowFileName);

    if (!fs.existsSync(todayFile)) {
        Utils.showTemporaryWarningMessage(
            `No worklog found for today: ${todayFileName}`,
        );
        return;
    }

    const unfinishedTasks = fs
        .readFileSync(todayFile, 'utf-8')
        .split('\n')
        .filter((line) => line.trim().startsWith('- [ ]'));

    if (unfinishedTasks.length === 0) {
        vscode.window.showInformationMessage('No unfinished tasks to move.');
        return;
    }

    console.log('Unfinished tasks:', unfinishedTasks);

    if (!fs.existsSync(tomorrowFile)) {
        Utils.createMarkdownFile(tomorrowFile, 'WorkLog', 'plan', unfinishedTasks);
    } else {
        console.log('Tomorrow file already exists:', tomorrowFileName);
        Utils.showTemporaryWarningMessage(
            `Tomorrow's tasks file already exists: ${tomorrowFileName}`,
        );
    }

    vscode.window.showInformationMessage(
        `Unfinished tasks moved to ${tomorrowFileName}`,
    );
}

export function createBlogPostCommand(e: vscode.Uri) {
    var folderName = getFolderName(e);
    console.log('Current path is: ' + folderName);
    vscode.window
        .showInputBox({
            value: 'Blog',
            prompt: `Enter title for the blog (default: Blog)`,
            ignoreFocusOut: true,
            valueSelection: [-1, -1],
        })
        .then((blogTitle) => {
            if (!blogTitle) return;
            try {
                const newFile = folderName + '/' + Utils.getNewBlogPostName(blogTitle);
                console.log('New File Name is: ' + newFile);
                Utils.createMarkdownFile(
                    newFile,
                    'BlogPost',
                    'template',
                    [`# ${blogTitle}\n\n---\n`],
                );
                vscode.workspace
                    .openTextDocument(newFile)
                    .then((doc) => vscode.window.showTextDocument(doc));
                vscode.window.showInformationMessage('Created a new blog post');
            } catch (err: unknown) {
                if (err instanceof Error) {
                    console.error('Error: ' + err.message);
                    vscode.window.showErrorMessage(
                        'Something went wrong! Please report on GitHub',
                    );
                } else {
                    console.error('Unknown error occurred');
                }
            }
        });
}

export function getFolderName(e: vscode.Uri): string {
    let folderName = '';
    try {
        console.log('Executed from: ' + e);
        if (fs.lstatSync(e.path).isDirectory()) {
            folderName = e.path;
        } else {
            folderName = path.dirname(e.path);
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error('Error: ' + err.message);
            if ((err as NodeJS.ErrnoException).code === 'ENOENT') {
                vscode.window.showWarningMessage('No such file exists');
            } else {
                vscode.window.showWarningMessage(
                    'No Active File/Folder Chosen, Right click on the folder/file where you want to create the new work log',
                );
            }
        } else {
            console.error('Unknown error occurred');
        }
    }

    let workspaceRoot = vscode.workspace.workspaceFolders;
    if (folderName === '' && workspaceRoot) {
        console.log(
            `Path not found, creating a file in the workspace root: ${workspaceRoot}`,
        );
        folderName = workspaceRoot[0].uri.fsPath;
    }

    return folderName;
}
