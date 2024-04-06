import CommonComponents from "./CommonComponents";

export default function RestartNeededAlertModal({onRestarting}){
    const AlertModal = CommonComponents.getComponent("AlertModal");
    const AlertActionButton = CommonComponents.getComponent("AlertActionButton");

    return (
        <AlertModal
            title={"Restart to apply"}
            content={"The app needs to be restarted to apply the changes."}
            actions={[
                <AlertActionButton text={"Restart"} variant={"destructive"} onPress={() => {
                    if (onRestarting) onRestarting();
                    ReactNative.NativeModules.BundleUpdaterManager.reload();
                }} />,
                <AlertActionButton text={"Cancel"} variant={"secondary"}/>
            ]}
        />
    )
}