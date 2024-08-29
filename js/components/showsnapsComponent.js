showsnapsComponent = {
    name: 'showsnapsComponent',
    data() {
        return {

            snapsInfo: {
                snapArray: [],
                totalSnapCount: -1
            },
            deleteclick: '',
            snapStartPos: 1,
            snapEndPos: 10,
            lastDisplayedSnap: 10,
            pageDownDisabled: false,
            pageUpDisabled: true,



        }
    },

    template:
        /*html*/
        `
        <div id="pageContent">
        <h1>Show Snaps</h1>
        <button id="add" class="pageButton" v-on:click="processPageAndAddSnaps()">Add Snaps</button>
        <section class="text-container">
        <div id="loader"></div>
        <div id="message"></div>
        </section>
        <button id="post" class="pageButton" v-on:click="editSnaps()">Save Edits</button><br/>
        <button id="post" class="pageButton" v-on:click="processPageAndPostSnaps()">Post Snaps</button><br/>
        <div id="pagination" v-if="snapsInfo.totalSnapCount == -1">Fetching snaps...</div>
        <div id="pagination" v-else-if="snapsInfo.totalSnapCount > 0">Showing snaps from snap number <span id="snapStartPos">{{snapStartPos}}</span> to snap number <span id="snapEndPos">{{lastDisplayedSnap}}</span></div>
        <div id="pagination" v-else>No snaps</div>
        <div id="notes">
        <template v-for="snap in snapsInfo.snapArray">

        <span class="snap" v-bind:id="snap.snapId">
        <input type="hidden" id="snapId" v-bind:value="snap.snapId">
       
        <p><input type="text" id="editableTitle" size="25" maxlength="100" v-model="snap.title"/></p>
        <p><textarea id="editableNote" rows="4" cols="30" maxlength="10000" v-model="snap.note"></textarea> </p>
       
        <p>   <img v-bind:src="snap.photoasdataurl"/></p>
        <h3> Time and Space </h3>
        <p> Time: {{snap.datetime}}</p>
        <p> Latitude: {{snap.latitude}}</p>
        <p> Longitude: {{snap.longitude}}</p>
       
        <p v-if="snap.latitude !== 'Unknown' && snap.longitude !== 'Unknown'">
        <p>  <button id="exportsnap" class="itemButton" v-on:click="exportSnap(snap.snapId)">Export Snap</button> </p>
        <a v-bind:href="'https://maps.google.com/maps/search/?api=1&query=' + snap.latitude +',' + snap.longitude"
            target="_blank"> Show Location </a></p>
        
        <p>  <button id="deletesnap" class="itemButton" v-on:click="processPageAndDeleteSnap(snap.snapId)">Delete Snap</button> </p>
        </span>

        </template>
        
        </div>



        <button id="add" class="pageButton" v-on:click="processPageAndAddSnaps()">Add Snaps</button>
        <section class="text-container">
        <div id="loader"></div>
        <div id="message"></div>
        </section>
        <button id="edit" class="pageButton" v-on:click="editSnaps()">Save Edits</button><br/>  
        <button id="post" class="pageButton" v-on:click="processPageAndPostSnaps()">Post Snaps</button><br/>
        <button id="pageUp" class="pageButton" v-bind:disabled="pageUpDisabled" v-on:click="processPageAndPageUp()">Page Up</button><br/>  
        <button id="pageDown" class="pageButton" v-bind:disabled="pageDownDisabled" v-on:click="processPageAndPageDown()">Page Down</button><br/> 
        </div>   
`,
    created: async function () {
        // This is where and how to define life-cycle hooks: they are methods! 

        this.snapsInfo = await mainModule.getSnaps(this.snapStartPos, this.snapEndPos);
        this.resetPageButtonsStates();


    },
    methods: {

        async exportSnap(id) {
            for (let i = 0; i < this.snapsInfo.snapArray.length; i++) {
                if (this.snapsInfo.snapArray[i].snapId == id) {
                    let snapRecord = {
                        title: this.snapsInfo.snapArray[i].title,
                        note: this.snapsInfo.snapArray[i].note,
                        photoasdataurl: this.snapsInfo.snapArray[i].photoasdataurl,
                        datetime: this.snapsInfo.snapArray[i].datetime,
                        latitude: this.snapsInfo.snapArray[i].latitude,
                        longitude: this.snapsInfo.snapArray[i].longitude
                    };
                    mainModule.exportSnap(snapRecord);
                }


            }

        },

        async deleteSnap(id) {
            await mainModule.dbPromise.then(function (db) {
                let tx = db.transaction('snaps', 'readwrite');
                let store = tx.objectStore('snaps');
                store.delete(id);

            }).catch(function (e) {
                handleError(e);
            });



            this.snapsInfo = await mainModule.getSnaps(this.snapStartPos, this.snapEndPos);

            if (this.snapStartPos > this.snapsInfo.totalSnapCount && this.snapStartPos > 1) {
                this.pageUp(); // force an automatic page up if we've now deleted everything on the page.
            }
            else {

                this.lastDisplayedSnap = this.snapEndPos;
                this.resetPageButtonsStates();
            }

        },

        async pageDown() {

            this.snapStartPos = this.snapEndPos + 1;
            this.snapEndPos = this.snapEndPos + 10;
            this.snapsInfo = await mainModule.getSnaps(this.snapStartPos, this.snapEndPos);
            this.lastDisplayedSnap = this.snapEndPos;
            this.resetPageButtonsStates();

        },

        async pageUp() {

            if (this.snapStartPos == 1) return; // Do nothing, we are already paged to the top
            this.snapEndPos = this.snapStartPos - 1; //If this line is reachable, and snapStartPos < 1 are never written to the page, snapStartPos must >= 2
            this.snapStartPos = this.snapStartPos - 10;
            if (this.snapStartPos < 0) this.snapStartPos = 1; // Bit of defensive coding
            this.snapsInfo = await mainModule.getSnaps(this.snapStartPos, this.snapEndPos);
            this.lastDisplayedSnap = this.snapEndPos;
            this.resetPageButtonsStates();

        },

        processPageAndPageUp() {

            let thisComponent = this;
            let actionFunc = function () {
                // As this is only a function declaration, and the function itself could be invoked in
                // any context, the "this" within the function only refers to the most basic context: the Window!
                // Therefore we have to save a reference to the the "this" of the component outside
                // the function declaration and then use that reference here.
                thisComponent.pageUp();

            };

            this.editSnaps(actionFunc);
        },

        processPageAndPageDown() {
            let thisComponent = this;
            let actionFunc = function () {
                // As this is only a function declaration, and the function itself could be invoked in
                // any context, the "this" within the function only refers to the most basic context: the Window!
                // Therefore we have to save a reference to the the "this" of the component outside
                // the function declaration and then use that reference here.
                thisComponent.pageDown();

            };

            this.editSnaps(actionFunc);
        },

        processPageAndDeleteSnap(id) {
            let thisComponent = this;
            let actionFunc = function () {
                // As this is only a function declaration, and the function itself could be invoked in
                // any context, the "this" within the function only refers to the most basic context: the Window!
                // Therefore we have to save a reference to the the "this" of the component outside
                // the function declaration and then use that reference here.
                thisComponent.deleteSnap(id);

            };

            this.editSnaps(actionFunc);
        },

        processPageAndAddSnaps() {

            let actionFunc = function () {
                mainModule.addSnap();

            };

            this.editSnaps(actionFunc);
        },


        processPageAndPostSnaps() {

            let actionFunc = function () {
                mainModule.postSnaps();

            };

            this.editSnaps(actionFunc);
        },

        resetPageButtonsStates() {

            if (this.snapEndPos >= this.snapsInfo.totalSnapCount) {
                this.pageDownDisabled = true;
                this.lastDisplayedSnap = this.snapsInfo.totalSnapCount;
            }
            else {
                this.pageDownDisabled = false;
            }

            if (this.snapStartPos <= 1) {
                this.pageUpDisabled = true;
            }
            else {
                this.pageUpDisabled = false;
            }
        },

        editSnaps(actionFunc) {
            mainModule.clearText();
            wert = this.snapsInfo;
            /* Iterate around the snaps on the page creating a map of the snaps keyed by id */
            let snapsMap = new Map();
            let snapId;
            let snapTitle;
            let snapNote;
            let s = '';
            let editsHaveErrored = false;



            for (let i = 0; i < this.snapsInfo.snapArray.length; i++) {
                snapId = this.snapsInfo.snapArray[i].snapId;

                /* This should find the relevant info from within the first element of the given id:
                at any level within the snap, so should be resistant to be being broken by any
                extra formatting */
                snapTitle = this.snapsInfo.snapArray[i].title;
                snapNote = this.snapsInfo.snapArray[i].note;
                snapsMap.set(snapId, { title: snapTitle, note: snapNote });
            }

            /* We now have the snapsMap to process, i.e. we've grabbed what we need from the current
            page... therefore we can now page up or down while the changes are saved into indexeddb in background...
            OR will that cause contention or race conditions...giving that the page up or down is going to read back data...
            mind you, it won't be displaying the current page's data any more, so not pulling back something you just changed
            shouldn't be possible... */

            if (actionFunc) actionFunc();

            /* Now we have the snap map loop around a cursor loop making any changes */

            mainModule.dbPromise.then(function (db) {
                let tx = db.transaction('snaps', 'readwrite');
                let store = tx.objectStore('snaps');
                return store.openCursor();
            }).then(async function editSnaps(cursor) {
                if (!cursor) { return; }
                const updateData = cursor.value;

                mainModule.logDebug('Cursored at:' + updateData.title);

                let thisSnap = snapsMap.get(updateData.id);
                if (thisSnap) { // if the snap in the cursor can be found in the map... it won't be if pagination has taken the snap out of range!
                    let dataChanged = false;

                    if (updateData.title !== thisSnap.title) {
                        updateData.title = thisSnap.title;
                        dataChanged = true;
                    }

                    if (updateData.note !== thisSnap.note) {
                        updateData.note = thisSnap.note;
                        dataChanged = true;
                    }

                    // If either the title or the note has changed you need to edit the exif metadata here
                    if (dataChanged) {
                        try {
                            updateData.photoasdataurl = mainModule.writeExifMetadata(thisSnap.title, thisSnap.note, updateData.photoasdataurl, updateData.latitude, updateData.longitude, updateData.datetime);
                        } catch (e) {
                            // Error should already have been logged by the writeExifMetadata method
                            // Don't update the photo data...
                        }
                    }

                    /* This function is running in background anyway, but JavaScript is single threaded.
                    I want to know when all the snap updates have finished, so I'm just going to wait for them
                    and not complicate things by pretending that each indiviudal snap update is somehow happening
                    in parallel (they aren't). */

                    if (dataChanged) {
                        await cursor.update(updateData).then(function (updateResult) {
                            mainModule.logDebug('Successfully updated a snap with id ' + updateResult + '.');
                        }).catch(function (e) {
                            editsHaveErrored = true;
                            mainModule.handleError('Error when attempting to update snaps: ' + e);
                        });
                    }
                }

                return cursor.continue().then(editSnaps);
            }).then(function () {
                if (!editsHaveErrored) {
                    s = 'Any edited snaps saved.';
                } else {
                    s = 'Some snaps edits have failed. Please see the app log.';
                }
                mainModule.showText(s);
                if (window.navigator && window.navigator.vibrate) {
                    // Vibration supported
                    window.navigator.vibrate(300); //0.3 second vibrate to confirm save
                }
            }).catch(function (e) {
                s = 'Error when attempting to save edited snaps';
                mainModule.handleError(s + ': ' + e);
                mainModule.showText(s + '.');
            });
        },


    },
}