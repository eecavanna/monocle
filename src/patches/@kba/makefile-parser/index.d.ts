/**
 * This file contains "minimal" type information for the `@kba/makefile-parser` module;
 * enough to resolve the following error, plus any additional type information I found
 * quick and easy to infer from the module's JavaScript code.
 *
 * > TS2307: Cannot find module '@kba/makefile-parser' or its corresponding type declarations.
 */

declare module '@kba/makefile-parser' {
    type Options = { strict: boolean; unhandled: boolean; };
    type Context = {
        PHONY: [], // TODO: Add information
        ast: [], // TODO: Add information
        unhandled: Array<string>;
    };

    const parseMakefile: (makefileContent: string, options: Options) => Context;
    export default parseMakefile;
}