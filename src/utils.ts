import * as vscode from 'vscode';
import * as fs from 'fs';

export class Utils {
  static showTemporaryWarningMessage(message: string, delay: number = 5000) {
    const warning = vscode.window.showWarningMessage(message, { modal: false });
    setTimeout(() => {
      warning.then(() => { }); // Allow the message to naturally disappear after the delay
    }, delay);
  }

  static getStartOfDay(): Date {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    return startOfDay;
  }

  static getFileNameForDate(date: Date, timeZone: string): string {
    return `${Utils.formatDateToISO(date).replace(/-/g, '_')}_${date.toLocaleString('en-US', { weekday: 'long', timeZone })}.md`;
  }

  static getNewEntryName(): string {
    let date_ob = new Date();
    return (
      Utils.formatDateToISO(date_ob).replace(/-/g, '_') +
      '_' +
      date_ob.toLocaleString('en-US', {
        weekday: 'long',
      }) +
      '.md'
    );
  }

  static getNewBlogPostName(blogTitle: string = 'Blog_title'): string {
    let date_ob = new Date();
    return (
      Utils.formatDateToISO(date_ob) +
      '-' +
      blogTitle.replace(/ /g, '-') +
      '.mdx'
    );
  }

  static createMarkdownFile(
    filename: string,
    configName: string = 'WorkLog',
    propertyName: string = 'plan',
    contentToAppend: string[] = [],
  ) {
    if (fs.existsSync(filename)) {
      console.log('File already exists:', filename);
      Utils.showTemporaryWarningMessage(
        `File already exists: ${filename}`,
      );
      return;
    }

    let defaultContent: string = '# Plan for the day\n\n---\n';

    var wstream = fs.createWriteStream(filename);
    wstream.on('error', function (e) {
      console.error(e);
      Utils.showTemporaryWarningMessage(
        `Error writing to file: ${filename}`,
      );
      return;
    });

    let newContent = contentToAppend.map((line) => line + '\n');

    var content: Array<string> =
      vscode.workspace.getConfiguration(configName).get(propertyName) || [];
    if (content.length === 0) {
      wstream.write(defaultContent);
      newContent.forEach(function (val) {
        console.log(val);
        wstream.write(val);
      });
      wstream.end();
      return;
    }

    const uniqueContent = Array.from(new Set([...content, ...newContent]));
    uniqueContent.forEach(function (val) {
      console.log(val);
      wstream.write(val);
    });
    if (newContent.length > 0) {
      wstream.write('\n---\n');
    }
    wstream.end();
  }

  static formatDateToISO(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
