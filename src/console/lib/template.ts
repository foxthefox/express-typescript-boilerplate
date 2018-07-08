import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as mkdirp from 'mkdirp';
import * as path from 'path';

/* useful for checking but gives problems when multiple checks in one hbs-doc
handlebars.registerHelper('ifCond', (v1: any, operator: string, v2: any, options: any) => {
    console.log(v1);
    console.log(v2);
    console.log(operator);
    console.log(options);
    switch (operator) {
    case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
    case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
    case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
    case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
    case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
    case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
    case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
    default:
        return options.inverse(this);
    }
});
*/
export const loadTemplate = async (file: string, stop: boolean = false): Promise<any> => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(__dirname, `../templates/${file}`), { encoding: 'utf-8' }, (err: any, content: any) => {
            if (err) {
                console.log(err);
                if (stop) {
                    process.exit(1);
                }
                return reject(err);
            }
            resolve(content);
        });
    });
};

export const writeTemplate = async (tempFile: string, filePath: string, context: any): Promise<any> => {
    await syncFolder(filePath);
    await syncTemplate(filePath, tempFile, context);
    console.log('File created in: ' + filePath);
};

const syncFolder = (filePath: string) => {
    return new Promise((resolve, reject) => {
        mkdirp(path.dirname(filePath), (err) => {
            if (err) {
                if (stop) {
                    console.log(err);
                    process.exit(1);
                }
                return reject(err);
            }
            resolve();
        });
    });
};

const syncTemplate = async (filePath: string, tempFile: string, context: any) => {
    const template = await loadTemplate(tempFile);
    const content = handlebars.compile(template)(context);
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, content, (err: any) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            resolve();
        });

    });
};
