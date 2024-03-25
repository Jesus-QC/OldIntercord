import AssetManager from "../assets/AssetManager";
import SettingsMenuManager from "../settings/SettingsMenuManager";

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
}

window.ToastManager = ToastManager;