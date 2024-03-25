export default class AlertModalManager{
    static getAlertStore(){
        if (AlertModalManager.alertStore) return AlertModalManager.alertStore;
        AlertModalManager.alertStore = ModuleSearcher.findByProps("openAlert", "dismissAlert");
        return AlertModalManager.alertStore;
    }

    static openAlert(key, renderer){
        AlertModalManager.getAlertStore()?.openAlert(key, renderer);
    }

    static dismissAlert(key){
        AlertModalManager.getAlertStore()?.dismissAlert(key);
    }
}

window.AlertModalManager = AlertModalManager;