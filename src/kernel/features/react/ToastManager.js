import AssetManager from "../assets/AssetManager";

export default class ToastManager{
    // Opens a toast with the given content and icon
    static open(content, iconIdOrName){
        // We are lazy loading!
        // So we got to dispatch the event directly instead of using the helpers.
        FluxDispatcher.dispatch({
            type: "TOAST_OPEN",
            toastProps: {
                content: content,
                icon: isNaN(iconIdOrName) ? AssetManager.getAssetIdByName(iconIdOrName) : iconIdOrName,
                // We have to declare a key, or it doesn't show up
                // If we use the same key for a toast, the toast won't change
                // So we use a random key to make sure the toast is always different
                key: Math.random()
            }
        })
    }

    // Lets you open a toast with a custom icon component
    static openWithIconComponent(content, iconComponent){
        FluxDispatcher.dispatch({type: "TOAST_OPEN", toastProps: {content: content, iconComponent: iconComponent, key: Math.random()}})
    }

    // Closes the active toast
    static close(){
        FluxDispatcher.dispatch({
            type: "TOAST_CLOSE"
        })
    }

    // Some helper functions

    static info(content){
        ToastManager.open(content, "ic_info_24px");
    }

    static warning(content){
        ToastManager.open(content, "ic_warning_24px");
    }

    static error(content){
        ToastManager.open(content, "WarningIcon")
    }
}