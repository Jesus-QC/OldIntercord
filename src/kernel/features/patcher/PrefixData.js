export default class PrefixData {
    constructor(context, args, original){
        this.context = context;
        this.args = args;
        this.originalMethod = original;
        this.returnValue = undefined;
        this.runOriginal = true;
    }
}