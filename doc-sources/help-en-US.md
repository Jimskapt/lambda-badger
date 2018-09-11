## What is the purpose of Lambda Badger ?

Lambda Badger is an webapplication that easily allows you to use notes, offline (or not) and on every platform *(smartphone, touchpads, computer, ...)*.

All you need is a *modern* browser that allows to use the last technologies that can run this webapplication :
- Javascript
- IndexedDB (or WebSQL)

## Where are the data ?

By default, the data(base) is **only stored on your computer**.

Precisely, inside your web browser thanks to [IndexedDB](https://en.wikipedia.org/wiki/Indexed_Database_API) technology (via [PouchDB](https://pouchdb.com/)).

<p class="v-alert v-alert--outline info--text">
    <i aria-hidden="true" class="v-icon material-icons theme--dark v-alert__icon">info</i>
    <span>If you are not accepting cookies, this application cannot save the data on your browser, so it can not works.</span>
</p>

<p class="v-alert v-alert--outline warning--text">
    <i aria-hidden="true" class="v-icon material-icons theme--dark v-alert__icon">priority_high</i>
    <span>If you are cleaning you browser (like cookies) there are significant risks that your local database will be erased !</span>
</p>

Fortunatly, Lambda Badger has several ways to save your data.

## Saving/Exporting your data

All this data can be replicated (in real time) on an free and open-source [CouchDB server](http://couchdb.apache.org/), which can be installed on your network (over internet or not).

## Security

If you are exposing your database through internet, you must have to set security settings on the CouchDB interface.

If you are launching another application locale which uses the same URL (http://localhost/) so it can access on your data. (*we will study an option to encrypt the data in a future release*).
