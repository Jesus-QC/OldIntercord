export default class PostfixData {
    constructor(context, args, original, value){
        this.context = context;
        this.args = args;
        this.originalMethod = original;
        this.returnValue = value;
    }
}