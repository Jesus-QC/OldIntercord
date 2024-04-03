import FileManager from "./FileManager";

export default class SettingsManager{
    static get(prefix, key, callback){
        const path = `intercord/settings/${prefix}.json`;
        FileManager.persistentFileExists(path, (exists) => {
            if (!exists) callback(undefined);
            FileManager.readPersistentFile(path, (data) => {
                const settings = JSON.parse(data);
                callback(settings[key]);
            });
        });
    }

    static set(prefix, key, value){
        const path = `intercord/settings/${prefix}.json`;
        FileManager.persistentFileExists(path, (exists) => {
            if (!exists){
                const data = {};
                data[key] = value;
                FileManager.writePersistentFile(path, JSON.stringify(data));
                return;
            }

            FileManager.readPersistentFile(path, (data) => {
                const settings = JSON.parse(data);
                settings[key] = value;
                FileManager.writePersistentFile(path, JSON.stringify(settings));
            });
        });
    }
}

window.SettingsManager = SettingsManager;