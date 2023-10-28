/**
 * This file contains TypeScript type information for the `@kba/makefile-parser` package, which doesn't include any.
 * This specific type information was inferred by me from the package's source code and documentation,
 * as of version `0.0.6` of the package, which was published to NPM in 2021.
 */

declare module '@kba/makefile-parser' {
    type Options = { strict: boolean; unhandled: boolean; };
    export type VariableDescriptorNode = {
        variable: string;
        value: string;
        comment: Array<string>;
    };
    export type TargetDescriptorNode = {
      target: string;
      deps: Array<string>;
      recipe: Array<string>;
      comment: Array<string>;
    };
    type ASTNode = VariableDescriptorNode|TargetDescriptorNode;
    type Context = {
        PHONY: Array<string>;
        ast: Array<ASTNode>;
        unhandled: Array<string>;
    };

    const parseMakefile: (makefileContent: string, options?: Options) => Context;
    export default parseMakefile;
}