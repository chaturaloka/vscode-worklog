import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export function logWorkCommand(e: any) {
    var folderName = '';
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
            if ((err as any).code === 'ENOENT') {
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

    if (folderName === '' && vscode.workspace.workspaceFolders) {
        console.log('Path not found, creating a file in the workspace root');
        console.log(vscode.workspace.workspaceFolders);
        folderName = vscode.workspace.workspaceFolders[0].uri.fsPath;
    }

    console.log('Current path is: ' + folderName);
    const newFile = folderName + '/' + getNewEntryName();
    console.log('New File Name is: ' + newFile);
    createMarkdownFile(newFile);
    vscode.workspace
        .openTextDocument(newFile)
        .then((doc) => vscode.window.showTextDocument(doc));
    vscode.window.showInformationMessage('Create a new work log');
}

export function createBlogPostCommand(e: any) {
    var folderName = '';
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
            if ((err as any).code === 'ENOENT') {
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

    if (folderName === '' && vscode.workspace.workspaceFolders) {
        console.log('Path not found, creating a file in the workspace root');
        console.log(vscode.workspace.workspaceFolders);
        folderName = vscode.workspace.workspaceFolders[0].uri.fsPath;
    }

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
                const newFile = folderName + '/' + getNewBlogPostName(blogTitle);
                console.log('New File Name is: ' + newFile);
                createMarkdownFile(
                    newFile,
                    'BlogPost',
                    'template',
                    `# ${blogTitle}\n\n---\n`,
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

export function moveUnfinishedTasksCommand(e: any) {
    const folderName =
        e?.path || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!folderName) {
        vscode.window.showErrorMessage('No folder selected or workspace open.');
        return;
    }

    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const now = new Date();
    const today = getStartOfDay(now);
    const tomorrow = new Date(today.getTime() + 86400000);

    const todayFileName = getFileNameForDate(today, userTimeZone);
    const tomorrowFileName = getFileNameForDate(tomorrow, userTimeZone);

    const todayFile = path.join(folderName, todayFileName);
    const tomorrowFile = path.join(folderName, tomorrowFileName);

    if (!fs.existsSync(todayFile)) {
        showTemporaryWarningMessage(
            `No tasks file found for today: ${todayFileName}`,
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

    console.log('Tomorrow file name:', tomorrowFileName);
    if (!fs.existsSync(tomorrowFile)) {
        createMarkdownFile(tomorrowFile);
    } else {
        console.log('Tomorrow file already exists:', tomorrowFileName);
        showTemporaryWarningMessage(
            `Tomorrow's tasks file already exists: ${tomorrowFileName}`,
        );
    }

    let existingTasks: string[] = [];
    if (fs.existsSync(tomorrowFile)) {
        existingTasks = fs
            .readFileSync(tomorrowFile, 'utf-8')
            .split('\n')
            .filter((line) => line.trim().startsWith('- [ ]'));
        console.log('Existing tasks:', existingTasks);
    }

    const uniqueTasks = unfinishedTasks.filter(
        (task) => !existingTasks.includes(task),
    );

    if (uniqueTasks.length === 0) {
        vscode.window.showInformationMessage(
            'No new unfinished tasks to move.',
        );
        return;
    }

    const tomorrowContent = uniqueTasks.join('\n') + '\n';
    fs.appendFileSync(tomorrowFile, tomorrowContent);
    vscode.window.showInformationMessage(
        `Unfinished tasks moved to ${tomorrowFileName}`,
    );
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

function getFileNameForDate(date: Date, timeZone: string): string {
    return `${date.toISOString().slice(0, 10).replace(/-/g, '_')}_${date.toLocaleString('en-US', { weekday: 'long', timeZone })}.md`;
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