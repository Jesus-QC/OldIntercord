import LazyModuleLoader from "../../../modules/LazyModuleLoader";
import InterPatcher from "../../../patcher/InterPatcher";
import ActionSheetManager from "../../../react/ActionSheetManager";
import AssetManager from "../../../assets/AssetManager";
import CommonComponents from "../../../react/components/CommonComponents";

export default class MessageLoggerPlugin {
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

        LazyModuleLoader.waitForStores((messageStore) => {
            this.handleFluxDispatch(messageStore)
        }, "MessageStore")

        LazyModuleLoader.waitForModuleByProps((module) => {
            this.patchRowRenderer(module);
        }, "MockChatManager");

        LazyModuleLoader.waitForModuleByPath((module) => {
            this.patchMessageSheet(module);
        }, "modules/action_sheet/native/components/LongPressMessageActionSheet.tsx");
    }

    handleFluxDispatch(messageStore){
        InterPatcher.addPrefix(FluxDispatcher, "dispatch", (data) => {
            const [args] = data.args;

            if (args.type === "MESSAGE_UPDATE") this.handleMessageUpdate(messageStore, data);
            else if (args.type === "MESSAGE_DELETE") this.handleMessageDelete(messageStore, data);
        });
    }

    handleMessageUpdate(messageStore, data){
        const args = data.args[0];
        const message = messageStore.getMessage(args.message.channel_id, args.message.id);

        if (!message || args.message.edited_timestamp === undefined) return;

        if (message.editedTimestamp === args.message.edited_timestamp) return;

        if (!this.editedMessages.has(args.message.id)) this.editedMessages.set(args.message.id, []);

        this.editedMessages.get(args.message.id).push(message.content);
    }

    handleMessageDelete(messageStore, data){
        const args = data.args[0];

        if (this.deletedMessages.has(args.id)) {
            if (this.deletedMessages.get(args.id).deleted) return;
        } else{
            this.deletedMessages.set(args.id, {fluxCalls:[]});
        }

        const message = messageStore.getMessage(args.channelId, args.id);
        if (!message) return;

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
                    content: [{type: "text", content: content}],
                    textColor: -8289135,
                    avatarUrl: !firstMsg ? undefined : data.args[0].message._avatarUrl,
                    timestamp: !firstMsg ? undefined : data.args[0].message._timestamp,
                    timestampColor: !firstMsg ? undefined : data.args[0].message._timestampColor,
                    edited: firstMsg ? "" : data.args[0].message.edited
                }
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
            if (!this.editedMessages.has(data.args[0].message.id)) return;

            const editedMessages = this.editedMessages.get(data.args[0].message.id);

            // Just in case, safety check
            if (editedMessages.length === 0) return;
            for (let i = editedMessages.length - 1; i >= 0; i--) {
                data.originalMethod.apply(data.context, getEdit(data, editedMessages[i], i === 0));
            }
        });
    }

    patchMessageSheet(module){
        InterPatcher.addPrefix(module, "default", (data) => {
            const [args] = data.args;
            if (!args.message || !this.deletedMessages.has(args.message.id)) return;
            args.canAddNewReactions = false;
        });

        InterPatcher.addPostfix(module, "default", (data) => {
            const [args] = data.args;
            if (!args.message) return;
            if (this.deletedMessages.has(args.message.id)) this.patchDeletedMessageSheet(data);
            if (this.editedMessages.has(args.message.id)) this.patchEditedMessageSheet(data);
        });
    }

    patchEditedMessageSheet(data){
        const editedMessages = this.editedMessages;
        const actionRows =  data.returnValue.props.children.props.children.props.children;

        function onEdit(message){
            editedMessages.delete(message.id);
            FluxDispatcher.dispatch({ type: "MESSAGE_UPDATE", message: { ...message, edited_timestamp: 1 } });
            ActionSheetManager.closeActionSheet("MessageLongPressActionSheet");
        }

        actionRows.unshift(<CustomMessageRow label={"Remove Edit History"} onPress={() => onEdit(data.args[0].message)} variant={"danger"} icon={"TrashIcon"} />);
    }

    patchDeletedMessageSheet(data){
        const deletedMessages = this.deletedMessages;
        const editedMessages = this.editedMessages;
        const actionRows =  data.returnValue.props.children.props.children.props.children;

        function onDelete(messageId){
            deletedMessages.get(messageId).deleted = true;
            deletedMessages.get(messageId).fluxCalls.forEach(call => FluxDispatcher.dispatch(call));
            deletedMessages.delete(messageId);
            editedMessages.delete(messageId);
            ActionSheetManager.closeActionSheet("MessageLongPressActionSheet");
        }

        const whitelist = [TranslatedMessages.COPY_TEXT, TranslatedMessages.DELETE_MESSAGE, TranslatedMessages.COPY_MESSAGE_LINK, TranslatedMessages.COPY_ID_MESSAGE];
        let foundDelete = false;

        for (let i = 0; i < actionRows.length; i++){
            const child = actionRows[i];
            if (!whitelist.includes(child.props.message)) actionRows.splice(i--, 1);
            else if (child.props.message === TranslatedMessages.DELETE_MESSAGE){
                child.props.onPressRow = () => onDelete(data.args[0].message.id);
                foundDelete = true; // For non-own messages
            }
        }

        if (!foundDelete) {
            actionRows.unshift(actionRows[0]);
            actionRows[1] = <CustomMessageRow label={TranslatedMessages.DELETE_MESSAGE} onPress={() => onDelete(data.args[0].message.id)} icon={"TrashIcon"} />;
        }
    }
}

function CustomMessageRow({label, onPress, variant, icon}){
    const ActionSheetRow = CommonComponents.getComponent("ActionSheetRow");
    const TableRowIcon = CommonComponents.getComponent("TableRowIcon");

    return (
        <ActionSheetRow variant={variant} label={label} onPress={onPress} icon={<TableRowIcon variant={variant} source={AssetManager.getAssetIdByName(icon)} />} />
    )
}