indexComponent = {
  data() {
    return {
      //defaultTitle: 'Vue title',
      title: mainModule.getDefaultTitle(),
      thumbnail: '',
      notes: '',
      saveDisabled: false,
      showDisabled: false,


    }
  },
  template:
    /*html*/
    `
  <div id="pageContent">
  <h1>MetaSnapper: Snap photos, autolocate in time and space, add context and share</h1> 
  <section id="installBanner" class="banner">
      <button id="installBtn">Install app</button>
  </section>
  <h2>Title</h2>
  <input type="text" id="title" size="30" maxlength="100" v-model="title" /> <br/>
  <h2>Notes</h2>{{defaultTitle}}
  <textarea id="notes" rows="4" cols="30" maxlength="10000" v-model="notes"> </textarea> <br/>
  <h2>Photo</h2>
  <label for="photo" class="custom-file-upload" id="photo_label">
    Add Photo
  </label>
  <input type="file" accept="image/*" capture id="photo" size="100" v-on:change="previewPhoto()">
  <div id="photo_preview">
    <img src="" id="thumbnail" height="200" alt="Image preview..." v-bind:src="thumbnail">
  </div>
  <button id="save" class="pageButton" v-on:click="processPageAndSave()" v-bind:disabled="saveDisabled">Save Snap</button><br/>
  <button id="show" class="pageButton" v-on:click="showSnapsAfterSave()" v-bind:disabled="showDisabled">Show Snaps</button><br/>
  <button id="post" class="pageButton" v-on:click="postSnapsAfterSave()">Post Snaps</button><br/>
  <button id="config" class="pageButton" v-on:click="configAppAfterSave()">Configure App</button><br/>
  

  <section class="text-container">
    <div id="loader"></div>
    <div id="message">
          <!-- message added dynamically -->
    <div>
  </section>
  </div>  
`,
  activated: async function () {
    // This is where and how to define life-cycle hooks: they are methods! alert('Show snaps component has mounted.');
    alert('Component activated'); // But this hook is not called during server side rendering...
    // II was going to use it to set the default title but in the end managed to do that enitely in the data block.
  },

  beforeCreate: async function () {
    this.title = await mainModule.getStartingTitle();
  },
  methods: {
    processPageAndSave(postSaveFunc) {

      let thisSnap = {
        title: this.title,
        notes: this.notes,
        photoasdataurl: this.thumbnail // this property is set directly in JavaScript. 

      };

      this.getLocationThenSaveSnap(thisSnap, postSaveFunc);

    },

    async getLocationThenSaveSnap(thisSnap, postSaveFunc) {
      let title = thisSnap.title;
      let notes = thisSnap.notes;
      let photoasdataurl = thisSnap.photoasdataurl;

      // The next few lines are needed as, if no photo as been added, then the src of the thumbnail is the url and the index page html becomes the "photo"
      if (photoasdataurl.substring(0, 5).toLowerCase() !== 'data:') {
        photoasdataurl = '';
      }

      let trimmedTitle = title.trim();
      // Skip save if the snap only comprises of a default title or a blank title and has no notes and no photo...
      if ((trimmedTitle.trim() === '' || trimmedTitle === mainModule.getDefaultTitle().trim()) &&
        notes.trim() === '' && photoasdataurl === '') {
        if (postSaveFunc) postSaveFunc();
        return;
      }

      this.saveDisabled = true;
      this.showDisabled = true;

      // Note the "options" object passed into the call to geolocation below:
      // GPS location can be quite slow (even more than a minute!) so geolocation defaults to
      // a setting of enableHighAccuracy: false, which is pretty useless in rural areas with no wifi
      // and poor mobile signals, as it means the app will very likely not use GPS location data at all.
      // As for the other settings, timeout (in milliseconds) is self-explanatory, and I increased that to 15 seconds
      // from 5 seconds when I increased the accuracy.
      // The final property, maximumAge (in millisceonds), is how long the app should retain a location setting before
      // trying to geolocate anew.
      let component = this;
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(async function (location) {
          mainModule.logDebug('Geolocation did the callback');
          await indexComponent.methods.saveSnap(title, notes, photoasdataurl, location, component);
          if (postSaveFunc) postSaveFunc();
        }, async function () { await indexComponent.methods.saveSnap(title, notes, photoasdataurl, null, component); if (postSaveFunc) postSaveFunc(); }, { enableHighAccuracy: true, timeout: 15000, maximumAge: 30000 }); // Second call is for no location
      } else {
        await indexComponent.methods.saveSnap(title, notes, photoasdataurl, null, component); // this isn't a callback, so this.saveSnap would also work...
        if (postSaveFunc) postSaveFunc();
      }
    },

    async saveSnap(title, notes, photoasdataurl, location, component) {
      if (!component) component = this; // allow this method to be called in  non-static ontext, i.e. without a reference to the component instance being explicitly passed in
      await mainModule.dbPromise.then(async function (db) {
        let tx = db.transaction('snaps', 'readwrite');
        let store = tx.objectStore('snaps');
        let latitude = 'Unknown';
        let longitude = 'Unknown';
        if (location) {
          latitude = location.coords.latitude;
          longitude = location.coords.longitude;
        }
        let datetime = new Date();

        try {
          var enrichedphotoasdataurl = mainModule.writeExifMetadata(title, notes, photoasdataurl, location.coords.latitude, location.coords.longitude, datetime);
        } catch (e) {
          // Error should have already been logged by the writeExifMEtadata method
          // We just need to restore the original photo metadata just in case...
          enrichedphotoasdataurl = photoasdataurl;
        }
        let items = [
          {
            title: title,
            note: notes,
            photoasdataurl: enrichedphotoasdataurl,
            datetime: datetime,
            latitude: latitude,
            longitude: longitude
          }
        ];
        return await Promise.all(items.map(async function (item) {
          mainModule.logDebug('Adding metasnap with title: ' + item.title);
          return await store.add(item);
        })
        ).then(function () {
          mainModule.logDebug('Snap added successfully!');
          component.title = mainModule.getDefaultTitle(); // This assignment causes Vue to automatically reset the DOM and the page
          component.notes = ''; // This assignment causes Vue to automatically reset the DOM and the page

          document.getElementById('photo_preview').style.display = 'none';
          component.thumbnail = ''; //  This assignment causes Vue to automatically reset the DOM and the page, clearing the image
        }).catch(function (e) {
          mainModule.handleError(e);
          window.alert('Unable to save snaps. The error is' + e);
          tx.abort();
        }).finally(function () {

          component.saveDisabled = false;
          component.showDisabled = false;
        });
      });
    },

    showSnapsAfterSave() {
      let postSaveFunc = function () {
        indexComponent.methods.showSnaps();
      };
      this.processPageAndSave(postSaveFunc);
    },

    showSnaps() {
      mountedApp.$router.push('/show-snaps');
    },

    configAppAfterSave() {
      let postSaveFunc = function () {
        mainModule.config();
      };
      //indexComponent.methods.processPageAndSave(postSaveFunc);
      this.processPageAndSave(postSaveFunc);
    },

    postSnapsAfterSave() {
      mainModule.clearText();

      mainModule.disablePostButtons();

      let postAfterSave = function () {
        mainModule.postSnaps();
      };
      this.processPageAndSave(postAfterSave);
    },

    previewPhoto() {
      let preview = document.getElementById('thumbnail');
      let previewDiv = document.getElementById('photo_preview');
      let file = document.getElementById('photo').files[0];
      let reader = new window.FileReader();
      let component = this;

      reader.addEventListener('load', function () {
        //preview.src = reader.result;
        //component.thumbnail = preview.src; // Extra line to ensure the vue binding happens.. it doesn't otherwise, perhaps becaue this value is being set in JS
        component.thumbnail = reader.result;
        //previewDiv.style.display = 'block';
        if (mainModule.getAutosave()) {
          component.processPageAndSave(); // autosave
        }
        else { // preview the photo to allow the user to decide to save, or not, manually
          preview.src = component.thumbnail;
          previewDiv.style.display = 'block';
        }
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    },
  },
}