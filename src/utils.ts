import * as vscode from 'vscode';
import * as fs from 'fs';

export class Utils {
  static showTemporaryWarningMessage(message: string, delay: number = 5000) {
    const warning = vscode.window.showWarningMessage(message, { modal: false });
    setTimeout(() => {
      warning.then(() => {}); // Allow the message to naturally disappear after the delay
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

  static formatDateToISO(date: Date): string {
    return date.toISOString().slice(0, 10);
  }
}
