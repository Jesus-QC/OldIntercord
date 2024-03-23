export default class PrefixData {
    constructor(args, original){
        this.args = args;
        this.originalMethod = original;
        this.returnValue = undefined;
        this.runOriginal = true;
    }
}