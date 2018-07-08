import { AbstractMakeCommand } from './lib/AbstractMakeCommand';
/**
 * MakeResourceCommand
 * -------------------------------------
 *
 */
import { askProperties } from './lib/utils';
// import { MakeControllerCommand } from './MakeControllerCommand'; // due to option stringprimary moved to model
import { MakeModelCommand } from './MakeModelCommand';
import { MakeNotFoundErrorCommand } from './MakeNotFoundErrorCommand';
import { MakeRepoCommand } from './MakeRepoCommand';

// import { MakeServiceCommand } from './MakeServiceCommand'; // due to option stringprimary moved to model

// import { MakeRequestCommand } from './MakeRequestCommand';
// import { MakeApiTestCommand } from './MakeApiTestCommand';

export class MakeResourceCommand extends AbstractMakeCommand {

    public static command = 'make:resource';
    public static description = 'Generate a new resource';

    public type = 'Resource';
    public suffix = '';
    public prefix = '';
    public context: any;
    public properties: any[];

    public makeModelCommand: AbstractMakeCommand;
    public makeRepoCommand: AbstractMakeCommand;
    // public makeServiceCommand: AbstractMakeCommand; // due to option stringprimary moved to model
    // public makeControllerCommand: AbstractMakeCommand; // due to option stringprimary moved to model
    public makeNotFoundErrorCommand: AbstractMakeCommand;
    // public makeCreateRequestCommand: MakeRequestCommand;
    // public makeUpdateRequestCommand: MakeRequestCommand;
    // public makeApiTestCommand: MakeApiTestCommand;

    public async run(): Promise<void> {
        this.context = await this.askFileName(this.context, this.type, this.suffix, this.prefix);
        this.context.properties = await askProperties(this.context.name);
        this.context.hasProperties = true;
        this.context.isResourceTemplate = true;

        // Get commands
        this.makeModelCommand = new MakeModelCommand(this.context);
        this.makeRepoCommand = new MakeRepoCommand(this.context);
        // this.makeServiceCommand = new MakeServiceCommand(this.context); // due to option stringprimary moved to model
        // this.makeControllerCommand = new MakeControllerCommand(this.context); // due to option stringprimary moved to model
        this.makeNotFoundErrorCommand = new MakeNotFoundErrorCommand(this.context);
        // this.makeCreateRequestCommand = new MakeRequestCommand(this.context, 'Create');
        // this.makeUpdateRequestCommand = new MakeRequestCommand(this.context, 'Update');
        // this.makeApiTestCommand = new MakeApiTestCommand(this.context);

        // Ask all meta-data
        await this.makeModelCommand.run();
        await this.makeRepoCommand.run();
        // await this.makeServiceCommand.run();
        // await this.makeControllerCommand.run();
        await this.makeNotFoundErrorCommand.run();
        // await this.makeCreateRequestCommand.run();
        // await this.makeUpdateRequestCommand.run();
        // await this.makeApiTestCommand.run();
    }

    public async write(): Promise<void> {
        await this.makeModelCommand.write();
        await this.makeRepoCommand.write();
        // await this.makeServiceCommand.write(); // due to option stringprimary moved to model
        // await this.makeControllerCommand.write(); // due to option stringprimary moved to model
        await this.makeNotFoundErrorCommand.write();
        // await this.makeCreateRequestCommand.write();
        // await this.makeUpdateRequestCommand.write();
        // await this.makeApiTestCommand.write();
        console.log('');
        console.log('PLEASE check the written files for some cleanup !!!');
    }

}
