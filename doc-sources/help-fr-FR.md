## Qu'est-ce que Lambda Badger ?

Lambda Badger est une application web qui vous permet facilement de gérer vos notes, hors réseau (ou non) et multi-platformes *(intelliphone, tablettes, ordinateurs, ...)*.

Tout ce que vous avez besoin d'un navigateur *moderne* qui vous permet d'utiliser les dernières technologies qui servent à faire fonctionner cette application web :
- Javascript
- IndexedDB (ou WebSQL)

<p class="v-alert v-alert--outline info--text">
    <i aria-hidden="true" class="v-icon material-icons theme--dark v-alert__icon">info</i>
    <span>Si vous refusez les cookies, cette application ne pourra pas enregistrer les données dans votre navigateur, donc elle ne fonctionnera pas.</span>
</p>

## Où sont les données ?

Par défaut, la base de données est **stockée unique sur votre périphérique**
(plus précisément, dans votre navigateur web grâce à la technologie [IndexedDB](https://fr.wikipedia.org/wiki/Indexed_Database_API)).

<p class="v-alert v-alert--outline warning--text">
    <i aria-hidden="true" class="v-icon material-icons theme--dark v-alert__icon">priority_high</i>
    <span>Si vous nettoyez votre navigateur (comme les cookies), il y a de gros riques que votre base de données locale soit effacée !</span>
</p>

Heureusement, Lambda Badger vous permet de sauvegarder vos données de plusieures façons.

## Sauvegarder/Exporter vos données

Toute la base de donnée peut être répliquée (en temps réel) sur un [serveur CouchDB](http://couchdb.apache.org/) (libre et open-source).

Ce serveur peut être installé dans votre réseau (à travers internet ou non) - ou sur votre ordinateur si vous voulez faire simple.

Il existe aussi des services de base de données dans *l'infonuagique* (cloud) comme par exemple [IBM Cloudant](https://www.ibm.com/cloud/cloudant), si vous être prêt à héberger vos données sur un système dont vous n'avez pas le contrôle.

Cette fonctionnalité vous permet aussi d'utiliser vos données sur différents périphériques (comme par exemple votre intelliphone **et** votre ordinateur).

## Sécurité

Si vous exposez votre base de donnée sur internet, vous devriez régler la sécurité sur l'interface de CouchDB.

Si vous lancez une autre web application locale qui utilise la même URL (http://localhost/) alors elle peut accéder à vos données de Lambda Badger (*nous allons étudier une option pour chiffrer les données dans une prochaine version*).
