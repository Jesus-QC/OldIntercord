import LazyModuleLoader from "../../../modules/LazyModuleLoader";
import InterPatcher from "../../../patcher/InterPatcher";
import ActionSheetManager from "../../../react/ActionSheetManager";
import AssetManager from "../../../assets/AssetManager";
import CommonComponents from "../../../react/components/CommonComponents";

export default class MessageLoggerPluginR {
    constructor() {
        this.prefix = "message-logger";
        this.name = "Message Logger";
        this.description = "Allows you to see deleted messages."
        this.author = "@jesusqc"
        this.repo = ""; // TODO
        this.deletedMessages = new Map();
        this.editedMessages = new Map();
    }

    load(){
        this.requiresRestart = true;
        
        LazyModuleLoader.waitForModuleByProps((channelCache) => {
            LazyModuleLoader.waitForStores((messageStore) => {
                this.handleFluxDispatch(messageStore, channelCache)
            }, "MessageStore")
        }, "getOrCreate", "commit");
  
        LazyModuleLoader.waitForModuleByProps((module) => {
            this.patchRowRenderer(module);
        }, "MockChatManager");
    }

    handleFluxDispatch(messageStore, channelCache){
        InterPatcher.addPrefix(FluxDispatcher, "dispatch", (data) => {
            const [args] = data.args;
            
            if (args.type === "MESSAGE_UPDATE") this.handleMessageUpdate(messageStore, channelCache, data);
            else if (args.type === "MESSAGE_DELETE") this.handleMessageDelete(messageStore, channelCache, data);
        });
    }

    handleMessageUpdate(messageStore, channelCache, data){
        const args = data.args[0];
        console.log("intercord 1", JSON.stringify(args.message));
        console.log("intercord 2", JSON.stringify(channelCache.get(args.message.channel_id.toString())?.get(args.message.id.toString())));
        
        let message = ModuleSearcher.findByStore("MessageStore").getMessage(args.message.channel_id.toString(), args.message.id.toString())
        if (!message) return;
        message = ModuleSearcher.findByProps("createMessageRecord").createMessageRecord(message);
        
        const timestamp = args.message.edited_timestamp;
        if (!timestamp) return;
        
        if (message.editedTimestamp === timestamp || timestamp === 1) return;

        if (!this.editedMessages.has(args.message.id)) {
            this.editedMessages.set(args.message.id, []);
        }
        
        this.editedMessages.get(args.message.id).push(message);
    }

    handleMessageDelete(messageStore, channelCache, data){
        const args = data.args[0];

        console.log("intercord 3", JSON.stringify(args));


        let message = ModuleSearcher.findByStore("MessageStore").getMessage(args.channelId.toString(), args.id.toString());
        if (!message) return;
        message = ModuleSearcher.findByProps("createMessageRecord").createMessageRecord(message);

        if (this.deletedMessages.has(args.id)) {
            if (this.deletedMessages.get(args.id).deleted) return;
        } else{
            this.deletedMessages.set(args.id, {fluxCalls:[]});
        }

        const deletedMessage = this.deletedMessages.get(args.id);
        if (deletedMessage.edited === undefined) deletedMessage.edited = message.editedTimestamp !== null;
        deletedMessage.fluxCalls.push(args)
        
        data.args = [{ type: "MESSAGE_UPDATE", message: { ...message, edited_timestamp: 0 } }];
    }

    patchRowRenderer(module){
        function getEdit(data, content, firstMsg = false){
            return [{
                ...data.args[0],
                message: {
                    ...data.args[0].message,
                    ...content,
                },
                backgroundHighlight: { backgroundColor: 545818760 }
            }]
        }

        // Handles removed messages
        InterPatcher.addPrefix(module.default.prototype, "createRow", (data) => {
            const [args] = data.args;

            if (args.type !== 1 || !args.message) return;

            if (this.editedMessages.has(args.message.id) && this.editedMessages.get(args.message.id).length > 0)
            {
                args.message._avatarUrl = args.message.avatarUrl; args.message._timestamp = args.message.timestamp; args.message._timestampColor = args.message.timestampColor;
                args.message.avatarUrl = args.message.timestamp = args.message.timestampColor = undefined;
            }

            if (!this.deletedMessages.has(args.message.id)) return;

            args.backgroundHighlight = { backgroundColor: 553582668 };
            if (!this.deletedMessages.get(args.message.id).edited) args.message.edited = "";
        });

        // Handles edited messages
        InterPatcher.addPostfix(module.default.prototype, "createRow", (data) => {
            if (data.args[0].type !== 1 || !data.args[0].message) return;
            window.lll = data;
            if (!this.editedMessages.has(data.args[0].message.id)) return;

            const editedMessages = this.editedMessages.get(data.args[0].message.id);

            // Just in case, safety check
            if (editedMessages.length === 0) return;
            for (let i = editedMessages.length - 1; i >= 0; i--) {
                data.originalMethod.apply(data.context, getEdit(data, editedMessages[i], i === 0));
            }
        });
    }
}
