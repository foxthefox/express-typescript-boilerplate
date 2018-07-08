import * as fs from 'fs';
import * as inquirer from 'inquirer';
import * as _ from 'lodash';
import * as path from 'path';

export const parseName = (name: string, suffix: string) => ({
    camelCase: _.camelCase(removeSufix(suffix, name)),
    snakeCase: _.snakeCase(removeSufix(suffix, name)),
    capitalize: _.upperFirst(_.camelCase(removeSufix(suffix, name))),
    lowerCase: _.lowerCase(removeSufix(suffix, name)),
    kebabCase: _.kebabCase(removeSufix(suffix, name)),
    normal: name,
});

export const removeSufix = (suffix: string, value: string) => {
    return value.replace(suffix, '');
};

export const filterInput = (suffix: string, prefix = '') => (value: string) => {
    if (value.indexOf('/') < 0) {
        return value;
    }
    let vs = value.split('/');
    vs = vs.map((v) => _.camelCase(v));
    vs[vs.length - 1] = _.capitalize(vs[vs.length - 1]);
    return (vs.join('/')) + prefix + suffix;
};

export const buildFilePath = (targetPath: string, fileName: string, isTest = false, extension = '.ts') => {
    if (isTest) {
        return path.join(__dirname, `/../../../test/${targetPath}`, `${fileName}.test${extension}`);
    } else {
        return path.join(__dirname, `/../../${targetPath}`, `${fileName}${extension}`);
    }
};

export const inputIsRequired = (value: any) => !!value;

export const existsFile = async (filePath: string, stop: boolean = false, isTest = false) => {
    const prompt = inquirer.createPromptModule();
    return new Promise((resolve, reject) => {
        fs.exists(filePath, async (exists) => {

            if (exists) {
                let fileName = filePath.split(path.normalize('/src/'))[1];
                if (isTest) {
                    fileName = filePath.split(path.normalize('/test/'))[1];
                }
                const answer = await prompt([
                    {
                        type: 'confirm',
                        name: 'override',
                        message: `Override "${path.join(isTest ? 'test' : 'src', fileName)}"?`,
                        default: true,
                    },
                ]);
                if (answer.override) {
                    return resolve(exists);
                }
            } else {
                return resolve(exists);
            }

            if (stop) {
                process.exit(0);
            }
            reject();
        });
    });
};

/* tslint:disable:no-string-literal */
export const askProperties = async (name: string): Promise<any[]> => {
    console.log('');
    console.log(`An id is always part of the properties and needs no input now.`);
    console.log(`Let\'s add some ${name} properties now.`);
    console.log(`Enter an empty property name when done.`);
    console.log('');

    let askAgain = true;
    const fieldPrompt = inquirer.createPromptModule();
    const properties: any[] = [];
    while (askAgain) {
        const property = await fieldPrompt([
            {
                type: 'input',
                name: 'name',
                message: 'Property name:',
                filter: (value: any) => _.camelCase(value),
            }, {
                type: 'list',
                name: 'type',
                message: 'Property type:',
                when: (res: any) => {
                    askAgain = !!res['name'];
                    return askAgain;
                },
                choices: [
                    'varchar (string) GraphQLString',
                    'text (string) GraphQLString',

                    'boolean (boolean) GraphQLBoolean',

                    'int (number) GraphQLInt',
                    'bigint (number) GraphQLInt',
                    'float (number) GraphQLFloat',
                    'decimal (number) GraphQLFloat',

                    'date (Date) GraphQLInt',
                    'timestamp (Date) GraphQLInt',
                    'datetime (Date) GraphQLInt',
                ],
            }, {
                type: 'confirm',
                name: 'nullable',
                message: 'Property is nullable:',
                when: (res: any) => {
                    askAgain = !!res['name'];
                    return askAgain;
                },
                default: true,
            }, {
                type: 'confirm',
                name: 'primary',
                message: 'Property is primary:',
                when: (res: any) => {
                    askAgain = !!res['name'];
                    return askAgain;
                },
                default: false,
            },  {
                type: 'input',
                name: 'gqltext',
                message: 'Property descriptive text for graphql :',
                when: (res: any) => {
                    askAgain = !!res['name'];
                    return askAgain;
                },
            },
        ]);
        if (askAgain) {
            console.log('');
            property.name = parseName(property.name, '');
            properties.push(property);
        }
    }
    properties.map(p => {
        const types = p.type.replace(/[()]/g, '').split(' ');
        p.type = {
            gqltyp: types [2],
            script: types[1],
            database: types[0],
        };
        return p;
    });
    console.log('');
    return properties;
};
/* tslint:enable:no-string-literal */
