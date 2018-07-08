import * as inquirer from 'inquirer';
/**
 * MakeModelCommand
 * -------------------------------------
 *
 */
import * as _ from 'lodash';

import { AbstractMakeCommand } from './lib/AbstractMakeCommand';
import { writeTemplate } from './lib/template';
import { askProperties, buildFilePath, existsFile } from './lib/utils';
import { MakeMigrationCommand } from './MakeMigrationCommand';

console.log('make model');

export class MakeModelCommand extends AbstractMakeCommand {

    public static command = 'make:model';
    public static description = 'Generate new model';

    public type = 'Model';
    public suffix = '';
    public template = 'model.hbs';
    public target = 'api/models';
    public makeMigrationCommand: MakeMigrationCommand;

    public async run(): Promise<void> {
        await super.run();
        const metaData = await this.askMetaData(this.context);
        this.context = { ...(this.context || {}), ...metaData };

        if (this.context.hasProperties && !this.context.properties) {
            this.context.properties = await askProperties(this.context);
        }

        if (this.context.hasMigration) {
            this.makeMigrationCommand = new MakeMigrationCommand(this.context);
            await this.makeMigrationCommand.run();
        }
    }

    public async write(): Promise<void> {
        // Create migration file
        if (this.context.hasMigration) {
            await this.makeMigrationCommand.write();
        }

        // Create model
        await super.write();

        // Create interface for this resource object
        const filePath = buildFilePath('types/resources', this.context.name.camelCase, false, '.d.ts');
        await existsFile(filePath, true);
        await writeTemplate('resource.hbs', filePath, this.context);

        // Create types for this resource object
        const filePath2 = buildFilePath('api/types', _.capitalize(this.context.name.camelCase) + 'Type', false, '.ts');
        await existsFile(filePath2, true);
        await writeTemplate('type.hbs', filePath2, this.context);

        // Create graphql query for this resource object
        const filePath3 = buildFilePath('api/queries', 'Get' + _.capitalize(this.context.name.camelCase) + 'Query', false, '.ts');
        await existsFile(filePath3, true);
        await writeTemplate('query.hbs', filePath3, this.context);

        this.context.namelow = _.lowerCase(this.context.name.camelCase);
        this.context.namecap = _.capitalize(this.context.name.camelCase);

        // Create controller for this resource object, here because of stringprimary option
        const filePath4 = buildFilePath('api/controllers', _.capitalize(this.context.name.camelCase) + 'Controller', false, '.ts');
        await existsFile(filePath4, true);
        await writeTemplate('controller_opt.hbs', filePath4, this.context);

        // Create service for this resource object, here because of stringprimary option
        const filePath5 = buildFilePath('api/services', _.capitalize(this.context.name.camelCase) + 'Service', false, '.ts');
        await existsFile(filePath5, true);
        await writeTemplate('service_opt.hbs', filePath5, this.context);
    }

    private async askMetaData(context: any): Promise<any> {
        const prompt = inquirer.createPromptModule();
        const prompts = await prompt([
            {
                type: 'input',
                name: 'tableName',
                message: 'Enter the table-name (same as the resource):',
                filter: (value: any) => _.snakeCase(value),
                validate: (value: any) => !!value,
            }, {
                type: 'confirm',
                name: 'stringprimary',
                message: 'Primary is String (Y) or integer (n) ?',
                default: true,
            }, {
                type: 'confirm',
                name: 'hasTimestamps',
                message: 'Has timestamps?',
                default: true,
            }, {
                type: 'confirm',
                name: 'hasMigration',
                message: 'Add migration?',
                default: true,
            },
        ]);
        return _.assign(context, prompts);
    }

}
