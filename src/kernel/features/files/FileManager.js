export default class FileManager {
    static initialize(){
        if (FileManager.initialized) return;
        FileManager.fs = ModuleSearcher.findByProps("readFile", "writeFile");
        FileManager.initialized = true;
    }

    static cacheFileExists(relativePath, callback){
        FileManager.initialize();
        FileManager.fs.fileExists(`${FileManager.fs.CacheDirPath}/${relativePath}`).then(callback);
    }

    static persistentFileExists(relativePath, callback){
        FileManager.initialize();
        FileManager.fs.fileExists(`${FileManager.fs.DocumentsDirPath}/${relativePath}`).then(callback);
    }

    static writeCacheFile(relativePath, data){
        FileManager.initialize();
        FileManager.fs.writeFile("cache", relativePath, data, "utf8").then((_) => {});
    }

    static writePersistentFile(relativePath, data){
        FileManager.initialize();
        FileManager.fs.writeFile("files", relativePath, data, "utf8").then((_) => {});
    }

    static readCacheFile(relativePath, callback){
        FileManager.initialize();
        FileManager.fs.readFile(`${FileManager.fs.CacheDirPath}/${relativePath}`, "utf8").then(callback);
    }

    static readPersistentFile(relativePath, callback){
        FileManager.initialize();
        FileManager.fs.readFile(`${FileManager.fs.DocumentsDirPath}/${relativePath}`, "utf8").then(callback);
    }
}