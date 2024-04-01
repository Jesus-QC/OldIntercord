export default class ActionSheetManager{
    static openActionSheet(key, content){
        // We are lazy loading!
        // So we got to dispatch the event directly instead of using the helpers.
        return FluxDispatcher.dispatch({
            type: "SHOW_ACTION_SHEET",
            key: key,
            content: content,
            backdropKind: 'none'
        })
    }

    static closeActionSheet(key){
        return FluxDispatcher.dispatch({
            type: "HIDE_ACTION_SHEET",
            key: key,
        })
    }
}

window.ActionSheetManager = ActionSheetManager;