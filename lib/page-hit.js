const path = require('path');
const fileUtil = require('./file-util');
const httpReferrer = require('./http-referrer');
const dataFolder = path.resolve('./data') + path.sep;

const saveFrequency = 1000;


module.exports = class {
    constructor() {
        this.counter = {};

        (async () => {
            this.folder = await fileUtil.folderUsable(dataFolder);
            if (!this.folder) return;

            this.saved = await fileUtil.folderList(this.folder.path, '.json');

            if (this.saved.length) {
                Object.assign(this.counter, require(this.saved[0].path))
            }
        })();
    };

    async save() {
        if (!this.folder) return;
        let fn = `${this.folder.path}hits-${+ new Date()}.json`;
        
        if (await fileUtil.write(fn, JSON.stringify(this.counter))) {
            console.log(`page hits stored: ${fn}`);

            fileUtil.unlinkMany(this.saved);
            this.saved = [{ path: fn }];
        }

        this.saveTimer = null;
    }

    count(req) {
        const hash = httpReferrer(req);
        if (!hash) return null;

        this.counter[hash] = this.counter[hash] || 0;

        this.saveTimer = this.saveTimer || setTimeout(this.save.bind(this), saveFrequency)

        return ++this.counter[hash];
    };
}