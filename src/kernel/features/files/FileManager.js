export default class FileManager {
    static cacheFileExists(relativePath, callback){
        ReactNative.NativeModules.RTNFileManager.fileExists(`${ReactNative.NativeModules.RTNFileManager.CacheDirPath}/${relativePath}`).then(callback);
    }

    static persistentFileExists(relativePath, callback){
        ReactNative.NativeModules.RTNFileManager.fileExists(`${ReactNative.NativeModules.RTNFileManager.DocumentsDirPath}/${relativePath}`).then(callback);
    }

    static writeCacheFile(relativePath, data){
        ReactNative.NativeModules.RTNFileManager.writeFile("cache", relativePath, data, "utf8").then((_) => {});
    }

    static writePersistentFile(relativePath, data){
        ReactNative.NativeModules.RTNFileManager.writeFile("files", relativePath, data, "utf8").then((_) => {});
    }

    static readCacheFile(relativePath, callback){
        ReactNative.NativeModules.RTNFileManager.readFile(`${ReactNative.NativeModules.RTNFileManager.CacheDirPath}/${relativePath}`, "utf8").then(callback);
    }

    static readPersistentFile(relativePath, callback){
        ReactNative.NativeModules.RTNFileManager.readFile(`${ReactNative.NativeModules.RTNFileManager.DocumentsDirPath}/${relativePath}`, "utf8").then(callback);
    }
}

window.FileManager = FileManager;