## What is the purpose of Lambda Badger ?

Lambda Badger is an webapplication that easily allows you to manage your notes, offline (or not) and on multiple platforms *(smartphone, touchpads, computer, ...)*.

All you need is a *modern* browser that allows to use the last technologies that can run this webapplication :
- Javascript
- IndexedDB (or WebSQL)

<p class="v-alert v-alert--outline info--text">
    <i aria-hidden="true" class="v-icon material-icons theme--dark v-alert__icon">info</i>
    <span>If you are not accepting cookies, this application cannot save the data on your browser, so it can not works.</span>
</p>

## Where are the data ?

By default, the data(base) is **only stored on your device**
(precisely, inside your web browser thanks to [IndexedDB](https://en.wikipedia.org/wiki/Indexed_Database_API) technology).

<p class="v-alert v-alert--outline warning--text">
    <i aria-hidden="true" class="v-icon material-icons theme--dark v-alert__icon">priority_high</i>
    <span>If you are cleaning you browser (like cookies), there are significant risks that your local database will be erased !</span>
</p>

Fortunatly, Lambda Badger allow you to save your data through several ways.

## Saving/Exporting your data

The whole database can be replicated (in real time) on an [CouchDB server](http://couchdb.apache.org/) (free and open-source).

This server can be installed on your network (over internet or not), or on your computer if you want to keep it simple.

There is also database as a service in the cloud like [IBM Cloudant](https://www.ibm.com/cloud/cloudant), if you are ready to store your data on a system that you do not control it.

This functionnality also allows you to use your data on multiple devices (like your smartphone **and** your desktop).

## Security

If you are exposing your database through internet, you must have to set security settings on the CouchDB interface.

If you are launching another locally webapplication which uses the same URL (http://localhost/) so it can access on your data of Lambda Badger (*we will study an option to encrypt the data in a future release*).
