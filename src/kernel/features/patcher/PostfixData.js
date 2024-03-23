export default class PostfixData {
    constructor(args, original, value){
        this.args = args;
        this.originalMethod = original;
        this.returnValue = value;
    }
}