/**
 * MakeNotFoundErrorCommand
 * -------------------------------------
 *
 */
import { AbstractMakeCommand } from './lib/AbstractMakeCommand';

export class MakeNotFoundErrorCommand extends AbstractMakeCommand {

    public static command = 'make:notfounderror';
    public static description = 'Generate new NotFoundError message';

    public type = 'NotFoundError';
    public suffix = 'NotFoundError';
    public template = 'notfounderror.hbs';
    public target = 'api/errors';

}
