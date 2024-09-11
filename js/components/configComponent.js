configComponent = {
    name: 'configComponent',
    data() {
        return {

            appConfig: {
                appLogLevel: 1,
                defaultTitle: "",
                batchSize: 10,
                mailTo: [{ email: "", index: 0 }],
                autosave: false,
            },
            saveDisabled: false,
            message: "",


        }
    },
    template:
        /*html*/
        `
        <div id="pageContent">
        <div id="version">MetaSnapper Version 2.4</div>
        <h1>App Configuration</h1>
        <div id="emails">
        <h2>Send Snaps to Email Address:</h2>
        <span id="addressList">
        <template v-for="emailAddress in appConfig.mailTo">
        <div id=anEmail>
        <input type="email" v-bind:id="'mailTo' + emailAddress.index"  size="44" maxlength="320" v-model="emailAddress.email"/>
        <button v-if="emailAddress.index > 0" class="itemButton" v-on:click="removeEmail(emailAddress.index)">Remove</button>
        </div> 
        </template>
        </span>
      </div>
      <button id="home" class="itemButton" v-on:click="addEmail()">Add Another Email Address</button><br/>
      <div id="miscdefaults">
        <h2>Default Title</h2>
        <input type="text" id="defaultTitle" size="30" maxlength="100" v-model="appConfig.defaultTitle"/>
        <h2>Autosave Snaps?</h2>
        <input type="checkbox" id="autosave"  v-model="appConfig.autosave"/>
      </div><br/>
      <div id="diagnostics">
      <h2>Configure App Diagnostics</h2>
      <label for="appLogLevel">Set an App Logging Level:</label>
      
      <select name="appLogLevel" id="appLogLevel" v-model="appConfig.appLogLevel">
        <option value=0>DEBUG</option>
        <option value=1>INFO</option>
        <option value=2>WARN</option>
        <option value=3>ERROR</option>
      </select> 
      </div>
      <div id="advanced">
        <h2>Advanced Settings</h2>
        <label for="batchSize">Post Snaps in Batches of:</label>
        
        <select name="batchSize" id="batchSize" v-model="appConfig.batchSize">
          <option value=1>1</option>
          <option value=2>2</option>
          <option value=5>5</option>
          <option value=10>10</option>
          <option value=20>20</option>
        </select> 
        </div>
      <br/><br/>
        <button id="save" class="pageButton" v-on:click="processThenSaveConfig()" v-bind:disabled="saveDisabled">Save</button><br/>
        <button id="config" class="pageButton" v-on:click="applogAfterSave()">Show App Log</button><br/>
        <button id="home" class="pageButton" onclick="mainModule.addSnap()">Add Snaps</button><br/>
      <div id="message">{{message}}</div>
      </div>
      `,
    created: async function () {
        // This is where and how to define life-cycle hooks: they are methods! 

        this.appConfig.defaultTitle = mainModule.getDefaultTitle(); // Get the preconfigured default title: this will be overwitten if a new starting title has been saved in the config.

        configRecords = await mainModule.getConfigRecords();
        for (let i = 0; i < configRecords.length; i++) {
            this.appConfig[configRecords[i].fieldName] = configRecords[i].value; // bind the config record name value pairs into specific properties of the appConfig object.
        }

        this.message = "";


    },
    methods: {

        addEmail() {
            this.appConfig.mailTo.push({ email: "", index: this.appConfig.mailTo.length });
        },

        removeEmail(idx) {
            // Unfortunately vue doesn't entirely re-render the vue and therefore the index numbers when
            // elements are removed from the array
            // Therefore we have to the following, as the passed in index won't necessarily match the 
            // element's current position in the array!
            for (let i = 0; i < this.appConfig.mailTo.length; i++) {
                if (this.appConfig.mailTo[i].index === idx) {
                    this.appConfig.mailTo.splice(i, 1);
                }
            }
        },

        applogAfterSave() {
            let postSaveFunc = function () {
                configComponent.methods.applog();
            };
            this.processThenSaveConfig(postSaveFunc);
        },

        applog() {
            mountedApp.$router.push('/applog');
        },


        getAddressList() {
            let addressList = '';

            for (let i = 0; i < this.appConfig.mailTo.length; i++) {
                if (this.appConfig.mailTo[i].email === '') continue; // Ignore any blank addresses
                if (addressList === '') {
                    addressList += this.appConfig.mailTo[i].email;
                } else { addressList += ';' + this.appConfig.mailTo[i].email }
            }
            mainModule.logDebug('Email address list: ' + addressList);
            return addressList;
        },

        async processThenSaveConfig(postSaveFunc) {
            mainModule.clearText();

            let mailTo = this.getAddressList(); // Though there is a bit of special processing around email addresses.

            let config = [
                {
                    name: 'mailTo',
                    value: mailTo
                },
                {
                    name: 'appLogLevel',
                    value: this.appConfig.appLogLevel
                },
                {
                    name: 'defaultTitle',
                    value: this.appConfig.defaultTitle
                },
                {
                    name: 'batchSize',
                    value: this.appConfig.batchSize
                },
                {
                    name: 'autosave',
                    value: this.appConfig.autosave
                },
            ];

            this.saveDisabled = true;

            await this.saveConfig(config);

            if (postSaveFunc) postSaveFunc();
        },

        async saveConfig(config) {
            let configComponent = this; // preserve this component instance as the "this" context for the callback functions
            mainModule.dbPromise.then(function (db) {
                let tx = db.transaction('config', 'readwrite');
                let store = tx.objectStore('config');


                // It needs to be an update... not just adding things to a stack...
                // The config is just a JSON object, with each record comprising of name-value pairs...
                /* Config has the following structure
                var config = [
                  {
                    name: 'the name of the config item, e.g. mailTo',
                    value: 'the value of the config ite,, e.g. myemail@mywebmail.com'
                  }
                ]; */

                // Each config record is just a name-value pair.
                return Promise.all(config.map(function (configRecord) {

                    mainModule.logDebug('Adding config record for setting: ' + configRecord.name);
                    if (configRecord.name === 'appLogLevel') {
                        // Instantly set the value "in memory", so the app can use without having to retrieve from indexeddb.
                        mainModule.setAppLogLevel(configRecord.value);
                    }
                    if (configRecord.name === 'defaultTitle') {
                        // Instantly set the value "in memory", so the app can use without having to retrieve from indexeddb.
                        mainModule.setDefaultTitle(configRecord.value);
                    }
                    if (configRecord.name === 'autosave') {
                        // Instantly set the value "in memory", so the app can use without having to retrieve from indexeddb.
                        mainModule.setAutosave(configRecord.value);
                    }
                    return store.put(configRecord); // This should update using the name of the config field as a key, or add if the config field is not yet in the object store.
                })
                ).catch(function (e) {
                    configComponent.saveDisabled = false;
                    tx.abort();
                    mainModule.handleError(e);
                }).then(function () {
                    configComponent.saveDisabled = false;
                    mainModule.logDebug('Config saved successfully!');
                    configComponent.message = 'Config saved successfully';
                });
            });
        }
    },
}