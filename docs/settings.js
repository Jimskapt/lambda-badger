const INITIAL_STATE = {
    contents: {
        'en-US': [
            {
                _id: 'demo-0',
                title: 'What is Lambda-Badger ?',
                content: 'You are currently using it.\n\nIt is a webapplication designed in order to manage your everyday notes.\n\nEach of this tiles are notes, generated on your first visit.\n\n*You should better not store your notes on this generated notes because they will be updated in the future ! You would better create a new note.*'
            },
            {
                _id: 'demo-1',
                title: 'Offline-first',
                content: '![](offline_logo.png)\n\nThis application is designed to work without network.\n\nYou can use it on your Smartphone without a mobile data plan (thank to the Android application, or the embedded cutting-edge PWA technology).\n\n*(just keep in mind that if your are editing the same note on multiple offline devices that will be synchronised later, you will have conflict(s) to resolve)*'
            },
            {
                _id: 'demo-2',
                title: 'Easy deployment',
                content: '![](icon_cursor_click.png)\n\nYou can download the webapp archive and simply open the `index.html` file in your browser (no need to a web server).\n\nIt should works, but keep in mind **that would have several issues about confidentiality/security**.\n\nThe optimal case is to store this (static) files on a webserver.\n\nAs usual, an HTTP**S** protocol is recommended instead of HTTP protocol for security/confidentiality purposes. Take a look to [let\'s encrypt project](https://letsencrypt.org/), or ask about `SSL certificate` to your *domain name provider*.\n\n*You can also continue to use the current URL address, but it is certainly not a long-time bet.*'
            },
            {
                _id: 'demo-3',
                title: 'Confidentiality : your data is stored locally',
                content: '![](document-save.png)\n\nThis webapp don\'t store your data on a webserver server by default. They are stored **in your browser**.\n\nThat means if you are "cleaning" your browser, you will probably loose you data.\n\nBut features like `CouchDB replication` and `manual export` will help you to save your data and synchronize them between several devices.\n\nThere is no business behind lambda-badger, it is a **side-project** of a developer passionate about the latest technologies.'
            },
            {
                _id: 'demo-4',
                title: 'Free and Open-Source',
                content: '![](open-source-initiative-keyhole.png)\n\nWe cannot assure you that we are take a look on your data if we cannot prove it to you !\n\nSo, thanks to the `MIT licence`, you can : \n- get the source-code of this software to check it\n- modify it in order to fit as your needs\n- use it as you want'
            }
        ],
        'fr-FR': [
            {
                _id: 'demo-0',
                title: 'Qu\'est-ce que Lambda-Badger ?',
                content: 'Vous êtes actuellement en train de l\'utiliser.\n\nC\'est une application web conçue pour gérer vos notes au qutodien.\n\nChacune de ces tuiles sont des notes, générées à votre première visite.\n\n*Vous ne devriez pas enregistrer vos notes sur ces notes générées car elles peuvent être mises à jour dans le futur ! Vous devriez mieux créer une nouvelle note.*'
            },
            {
                _id: 'demo-1',
                title: 'Concu pour être Hors-Ligne',
                content: '![](offline_logo.png)\n\nCette application est conçu pour foncitonner sans réseau.\n\nVous pouvez l\'utliser sur votre Ordiphone sans avoir de forfait sans données itinérantes (grâce à l\'application Android, ou la technologie dernier-cri PWA qui est embarquée).\n\n*(gardez juste à l\'esprit que si vous modifiez la même note sur plusieurs périphériques hors-ligne qui seront synchronisés plus tard, vous aurez un/des conflit(s) à résoudre)*'
            },
            {
                _id: 'demo-2',
                title: 'Déploiement facile',
                content: '![](icon_cursor_click.png)\n\nVous pouvez télécharger l\'archive de l\'application web et simplement ouvrer le fichier `index.html` dans votre navigateur (pas besoin de serveur web).\n\nCela devrait fonctionner, mais gardez à l\'esprit que **cela peut générer des problèmes de confidentialité/sécurité**.\n\nLe cas idéal est de stocker ces fichiers (statiques) sur un serveur web.\n\nComme d\'habitude, le protocole HTTP**S** est recommandé plutôt que le protocole HTTP, pour des raisons de confidentialité/sécurité. Renseignez-vous sur le [projet let\'s encrypt](https://letsencrypt.org/), ou demandez à votre *fournisseur de nom de domaine* des informations à propos d\'un `certificat SSL`.\n\n*Vous pouvez aussi continuer à utiliser l\'adresse URL actuelle, mais ce n\'est certainement pas un pari à long terme.*'
            },
            {
                _id: 'demo-3',
                title: 'Confidentialité : vos données sont stockées en local',
                content: '![](document-save.png)\n\nCette application web n\'enregistre pas vos données sur un serveur web par défaut. Elles sont enregistrées **dans notre navigateur web**.\n\nCela signifie que si vous "nettoyez" votre navigateur, vous allez surement perdre vos données.\n\nMais des fonctionnalités comme `la réplication CouchDB` et `l\'export manuel de vos données` vont vous aider à sauvegarder vos données et les synchroniser entre plusieurs appareils.\n\nIl n\'y a pas d\'argent derrière lambda-badger, c\'est un projet d\'un développeur passionné de nouvelles technologies.'
            },
            {
                _id: 'demo-4',
                title: 'Libre et Open-Source',
                content: '![](open-source-initiative-keyhole.png)\n\nNous ne pouvons pas vous assurer que nous ne regardons pas vos données si nous ne pouvons pas vous le prouver !\n\nDonc, grâce à la `licence MIT`, vous pouvez : \n- obtenir le code-source de cet application pour le vérifier\n- le modifier pour l\'adapter à vos besoins\n- l\'utiliser comme vous le souhaitez'
            }
        ],
    },
};
