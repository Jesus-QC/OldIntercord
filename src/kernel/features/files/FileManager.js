export default class FileManager {
    static getFS() {
        if (FileManager.fs) return FileManager.fs;
        FileManager.fs = ModuleSearcher.findByProps("readFile", "writeFile");
        return FileManager.fs;
    }

    static cacheFileExists(relativePath, callback){
        FileManager.getFS()?.fileExists(`${FileManager.fs.CacheDirPath}/${relativePath}`).then(callback);
    }

    static persistentFileExists(relativePath, callback){
        FileManager.getFS()?.fileExists(`${FileManager.fs.DocumentsDirPath}/${relativePath}`).then(callback);
    }

    static writeCacheFile(relativePath, data){
        FileManager.getFS()?.writeFile("cache", relativePath, data, "utf8").then((_) => {});
    }

    static writePersistentFile(relativePath, data){
        FileManager.getFS()?.writeFile("files", relativePath, data, "utf8").then((_) => {});
    }

    static readCacheFile(relativePath, callback){
        FileManager.getFS()?.readFile(`${FileManager.fs.CacheDirPath}/${relativePath}`, "utf8").then(callback);
    }

    static readPersistentFile(relativePath, callback){
        FileManager.getFS()?.readFile(`${FileManager.fs.DocumentsDirPath}/${relativePath}`, "utf8").then(callback);
    }
}

window.FileManager = FileManager;