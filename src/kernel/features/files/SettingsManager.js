import FileManager from "./FileManager";

export default class SettingsManager{
    static get(prefix, key, callback){
        const path = `intercord/settings/${prefix}.json`;
        FileManager.cacheFileExists(path, (exists) => {
            if (!exists) callback(undefined);
            FileManager.readCacheFile(path, (data) => {
                const settings = JSON.parse(data);
                callback(settings[key]);
            });
        });
    }

    static set(prefix, key, value){
        const path = `intercord/settings/${prefix}.json`;
        FileManager.cacheFileExists(path, (exists) => {
            if (!exists){
                const data = {};
                data[key] = value;
                FileManager.writeCacheFile(path, JSON.stringify(data));
                return;
            }

            FileManager.readCacheFile(path, (data) => {
                const settings = JSON.parse(data);
                settings[key] = value;
                FileManager.writeCacheFile(path, JSON.stringify(settings));
            });
        });
    }
}