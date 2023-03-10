applogComponent = {
    name: 'applogComponent',
    data() {
        return {
            appLogRecords: [],

        }
    },
    template:
        /*html*/
        `
        <div id="pageContent">
        <h1>Application Log</h1>
        <div id="logentries">
            <template v-for="appLogRecord in appLogRecords">
                <p><b>{{appLogRecord.entryDateTime}}</b></p>
                <p>{{appLogRecord.severity}}: {{appLogRecord.message}}</p>
            </template>
            <p v-if="appLogRecords.length === 0">No results</p>
        </div>
        <button id="home" class="pageButton" onclick="mainModule.addSnap()">Add Snaps</button><br/>
        <button id="clear" class="pageButton" v-on:click="clearAppLog()">Clear App Log</button><br/>
        <div id="message"></div>
        </div>
        
      `,
    created: async function () {
        // This is where and how to define life-cycle hooks: they are methods! 

        this.appLogRecords = await mainModule.getAppLog();

    },
    methods: {
        clearAppLog() {
            let appLogComponent = this;
            mainModule.dbPromise.then(function (db) {
                let tx = db.transaction('applog', 'readwrite');
                let store = tx.objectStore('applog');
                store.clear();
            }).catch(function (e) {
                mainModule.handleError(e);
            }).then(async function () {
                appLogComponent.appLogRecords = [];
            });
        }
    },
}