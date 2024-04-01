import LazyModuleLoader from "../../../modules/LazyModuleLoader";
import InterPatcher from "../../../patcher/InterPatcher";
import ModuleSearcher from "../../../modules/ModuleSearcher";
import ActionSheetManager from "../../../react/ActionSheetManager";
import AssetManager from "../../../assets/AssetManager";
import CommonComponents from "../../../react/components/CommonComponents";
import ToastManager from "../../../react/ToastManager";

export default class MessageLoggerPlugin {
    constructor() {
        this.prefix = "message-logger";
        this.name = "Message Logger";
        this.description = "Allows you to see deleted messages."
        this.author = "@jesusqc"
        this.repo = ""; // TODO
        this.deletedMessages = new Map();
    }

    load(){
        this.requiresRestart = true;

        LazyModuleLoader.waitForStores((messageStore) => {
            InterPatcher.addPrefix(FluxDispatcher, "dispatch", (data) => {
                const [args] = data.args;

                if (args.type === "MESSAGE_UPDATE") this.handleMessageUpdate(messageStore, data);
                else if (args.type === "MESSAGE_DELETE") this.handleMessageDelete(messageStore, data);
                else if (args.type === "SHOW_ACTION_SHEET" && args.key === "MessageLongPressActionSheet") this.handleMessageSheet(data);
            });

            this.patchMessageRow();


        }, "MessageStore", "ChannelStore")

        LazyModuleLoader.waitForModuleByPath((module) => {
            console.log("Omnicord, chat loaded!", module)
        }, "components_native/chat/Messages.tsx");
    }

    patchMessageRow(){
        let deletedMessages = this.deletedMessages;
        function checkArgs(data){
            const [args] = data.args;
            if (args.rowType !== 1 || !args.message) return false;
            return deletedMessages.has(args.message.id);
        }

        InterPatcher.addPrefix(ModuleSearcher.findByName("RowManager").prototype, "generate", (data) => {
            if (!checkArgs(data)) return;
            data.args[0].message.editedTimestamp = this.deletedMessages.get(data.args[0].message.id).editedTimestamp;
        });

        InterPatcher.addPostfix(ModuleSearcher.findByName("RowManager").prototype, "generate", (data) => {
            if (!checkArgs(data)) return;
            data.returnValue.backgroundHighlight = { backgroundColor: 553582750, gutterColor: 553648127 };
        });
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
        deletedMessage.editedTimestamp = message.editedTimestamp;
        deletedMessage.fluxCalls.push(args)

        data.args = [{type: "MESSAGE_UPDATE", message: {...message, edited_timestamp: 0}}];
    }

    handleMessageUpdate(messageStore, data){
        // const args = data.args[0];
        // if (!args.message || args.message.type !== 0) return;
        // if (args.message.edited_timestamp === 0) return;
//
        // const oldMessage = messageStore.getMessage(args.message.channel_id, args.message.id);
    }

    handleMessageSheet(data){
        const args = data.args[0];
        if (!args.content.props.message || !this.deletedMessages.has(args.content.props.message.id)) return;

        const deletedMessages = this.deletedMessages;

        function onDelete(id){
            deletedMessages.get(id).deleted = true;
            for (const call of deletedMessages.get(id).fluxCalls){
                FluxDispatcher.dispatch(call);
            }
        }

        data.returnValue = ActionSheetManager.openActionSheet("MessageLoggerActionSheet", <MessageLoggerActionSheet onDelete={onDelete} message={args.content.props.message}/>);
        data.runOriginal = false;
    }
}

function MessageLoggerActionSheet({message, onDelete}){
    const ActionSheet = CommonComponents.getComponentByName("ActionSheet");
    const ActionSheetContentContainer = CommonComponents.getComponentByName("ActionSheetContentContainer");
    const ActionSheetRow = CommonComponents.getComponentByName("ActionSheetRow");
    const TableRowIcon = CommonComponents.getComponentByName("TableRowIcon");

    return (
        <ActionSheet>
            <ActionSheetContentContainer style={{padding: 16, marginBottom: 16}}>
                <ActionSheetRow label={"Copy Text"} onPress={() => {
                    ReactNative.Clipboard.setString(message.content);
                    ToastManager.info("Message text copied to clipboard.");
                    ActionSheetManager.closeActionSheet("MessageLoggerActionSheet");
                }} start={true} end={false} icon={<TableRowIcon source={AssetManager.getAssetIdByName("CopyIcon")} />}/>
                <ActionSheetRow label={"Delete Message"} onPress={() => {
                    onDelete(message.id)
                    ActionSheetManager.closeActionSheet("MessageLoggerActionSheet");
                }} start={false} end={false} icon={<TableRowIcon source={AssetManager.getAssetIdByName("TrashIcon")} />} />
                <ActionSheetRow label={"Copy Message ID"} onPress={() => {
                    ReactNative.Clipboard.setString(message.id);
                    ToastManager.info("Message ID copied to clipboard.");
                    ActionSheetManager.closeActionSheet("MessageLoggerActionSheet");
                }} start={false} end={true} icon={<TableRowIcon source={AssetManager.getAssetIdByName("IdIcon")} />} />
            </ActionSheetContentContainer>
        </ActionSheet>
    )
}