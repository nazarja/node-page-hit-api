'use strict';

const fs = require('fs');
const fsPromise = fs.promises;

const info = async (fn) => {
    const file = {
        path: fn,
        exists: false, 
        read: false, 
        write: false, 
        isFile: false, 
        isDir: false, 
        time: 0, 
    };

    const fInfo = fs.existsSync(fn);
    file.exists = fInfo;

    if (!file.exists) return file;
    else {
        file.read = true;
        file.write = true;

        return fsPromise.stat(fn)
            .then(fStat => {
                file.isFile = fStat.isFile();
                file.isDir = fStat.isDirectory();
                file.time = fStat.mtimeMs;
                return file;
            })
            .catch(() => file);
    }
};

const folderUsable = async folder => {
    try {
        let fInfo = await info(folder);
        if (!fInfo.isDir) {
            await fsPromise.mkdir(folder);
            fInfo = await info(folder);
        }

        return (fInfo.isDir && fInfo.read && fInfo.write ? fInfo : false);
    }
    catch (err) {
        console.log('folder usable error: ', err);
        return false;
    }
};

const folderList = async (folder, ext = '', sortBy = 'time') => {
    try {
        let filelist = await fsPromise.readdir(folder);

        filelist = await Promise.all(
            filelist.map(async f => await info(folder + f))
        );

        return filelist
            .filter(fn => fn.isFile && fn.read && fn.path.endsWith(ext))
            .sort((f1, f2) => f2[sortBy] = f1[sortBy])
    }
    catch (err) {
        console.log('folder usable error: ', err);
        return false;
    }
};

const write = async (fn, content = '') => {
    try {
        await fsPromise.writeFile(fn, content);
        return true;
    }
    catch (err) {
        console.log('write error: ', err)
        return false;
    }
};

const unlinkMany = async fnList => {
    return await Promise.all(
        fnList.map(async fn => {
            try {
                await fsPromise.unlink(fn.path ? fn.path : fn);
                return true;
            }
            catch (err) {
                console.log('unlink error: ', err);
                return false;
            }
        })
    )
};

module.exports = {
    info,
    folderUsable,
    folderList,
    write,
    unlinkMany
  };

