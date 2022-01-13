# Compte rendu MongoDB Personnel, Thibault BAZIN

---

## Contexte
Une chaine de restaurant souhaite récupérer des données clients afin de capitaliser sur un flux de personnes sans cesse grandissant (plusieurs dizaines de milliers de clients par semaine dans toute la France).

Nous devons fournir un projet d'application centré sur un stockage des données avec MongoDB.

Le projet dans son ensemble ne sera pas forcément terminé cete semaine, en revanche, toutes les intéractions, avec la base de données doivent être documentées et testées. Et toutes les questions posées devront être traitées.

---

## Pourquoi utiliser MongoDB ? Quels choix technologiques et d'installation avons nous choisit ?
(Discutez de la documentation disponible en fonction de vos choix technologiques et de vos choix d’installation)

MongoDB possède une capacité de requête approfondie. MongoDB prend en charge les requêtes dynamiques sur des documents à l'aide d'un langage de requête basé sur des documents presque aussi puissant que SQL.
Aucune migration de schéma. Étant donné que MongoDB est sans schéma, notre code définit les schéma.

Il y a aussi d'autres avantages qui apparaîtront à long terme, comme une meilleure scallabilité et une meilleure vitesse.

Nous utilisons MongoDB car c'est du NoSQL. Le fait que ce soit du NoSQL, nous permet de modifier, étendre les documents et collections à souhait, le tout très facilement.
De plus MongoDB permet de scale up très rapidement et facilement.

On a choisit Atlas car personnellement je l'ai déjà utilisé par le passé, et permet un setup simple, rapide, gratuit et efficace.

---

## Structuration de la base de données

Nous avons créé 4 collections :
- RESTAURANTS : La collection "RESTAURANTS" est alimentée par les restaurants de l'entreprise.
- PRODUITS : Cette collection est alimentée en produits que les restaurants vendent
- CLIENTS : La collection contient les informations des clients
- COMMANDES : Les commandes passées par les clients

![image](https://user-images.githubusercontent.com/58698088/149316357-efb7a356-dd06-471f-ac14-1bb5e4b21929.png)

---

## Pouvons-nous accélerer le traitement des requêtes grace aux index ?
(Prouver l'efficacité des index)

Grace à la fonction explain, nous allons pouvoir comparer le temps d'execution des requêtes. Le temps d'execution est retourné dans le champ "executionTimeMillis" en millisecondes. Nous allons utiliser la collection "CLIENTS" contenant 1 million de clients.

![image](https://user-images.githubusercontent.com/58698088/148981851-af133a9a-264a-4cc9-af70-6fbde32ed531.png)

Nous allons sélectionner tous les clients ayant le sexe masculin "H".

```
db.CLIENTS.find({SEXE: "H"}).explain("executionStats")
```

Voici le temps d'execution sans index sur le champ "SEXE"

![image](https://user-images.githubusercontent.com/58698088/149315926-88f9c847-b39b-4844-a214-0cf918716b84.png)

Nous allons créer un index pour voir si le traitement de la requête est plus rapide avec le code suivant :
```
db.CLIENTS.createIndex( { SEXE : 1 } )
```

En exécutant la même requête, la requête mit ce temps pour être exécutée.

![image](https://user-images.githubusercontent.com/58698088/149316180-ea1584ab-0083-454b-9188-443a42ebee79.png)

En créant un index, la requête s'est exécutée 119ms plus rapidement.

---

### Est-ce que les index peuvent ralentir une requête ?

Oui.

- Un index peut ralentir les opérations INSERT car l'index doit être mis à jour pour chaque ligne insérée.
- Il peut ralentir les opérations UPDATE où la colonne indexée est mise à jour.
- Il peut ralentir les opérations DELETE car l'index doit être mis à jour pour chaque ligne supprimée.
- Il peut ou non accélérer les opérations SELECT, en fonction des attributs de la requête par rapport à la définition de l'index et du plan d'exécution choisi par l'optimiseur.

---

### Quelle est la différencee entre une clé primaire MySQL et MongoDB ?

Les collections MongoDB sont indexées par défaut et elles sont toutes créées au-dessus des fichiers mappés en mémoire, contrairement aux SGBDR normaux où les index sont créés au fur et à mesure des besoins sur le tas ou les clusters. Néanmoins, le concept sous-jacent de l'indexation est similaire à une structure B-Tree.

Une autre distinction réside dans le fait qu'une collection MongoDB peut avoir un maximum de 64 index alors qu'un SGBDR comme Oracle 11g peut autoriser un maximum de 1000 colonnes dans une table et donc 1000 index par table.

De même, un index composé dans MongoDB ne peut pas contenir plus de 32 champs, ce qui est le cas dans un SGBDR comme Oracle 11g.

Il convient de noter que la distinction sera différente selon les bases de données.

Source : https://www.quora.com/How-is-the-MongoDB-index-different-from-a-regular-RDBMS-index

---

### Dans quels domaine l'utilisation de MongoDB est adapté et utilisé ?

On pourrait utiliser mongodb dans le domaine du bigdata, par exemple. Un domaine dans lequel on a besoin de rajouter constamment de nouvelles données, nouvelles tables et colonnes.
Mongodb est adapté, car les schema sont flexible, facile à maintenir, modifier et d'utilisation et mongodb est fait pour scaleup rapidement.

---

### Qu'est-ce que la fonction explain ?

L'opérateur $explain fournit des informations sur le plan de la requête. Il renvoie un document qui décrit le processus et les index utilisés pour renvoyer la requête. Cela peut fournir des informations utiles lorsque l'on tente d'optimiser une requête. Pour plus de détails sur la sortie, voir cursor.explain().

Source : https://docs.mongodb.com/manual/reference/operator/meta/explain/

---

### Donner un exemple de fonction insert, update, delete, find et find pretty
#### INSERT
Permet d'insérer une ligne.
Il existe aussi insertMany pour insérer plusieurs lignes d'un coup.
```
db.RESTAURANTS.insert({NOM:"jean",ADRESSE:{LIBELLE:"1056 Rue de la République", VILLE:"Sathonay-Camp", CP:"69580"}})
```
![image](https://user-images.githubusercontent.com/58698088/148983421-47318614-8772-443f-9fd3-a54f2e2659d3.png)

![image](https://user-images.githubusercontent.com/58698088/148982703-cdc8497f-c05f-4b7e-ae60-9813ba4ab535.png)

---

#### UPDATE
Permet de modifier les lignes correspondant au premier argument.
```
db.RESTAURANTS.updateOne({NOM:"jean"}, { $set: {NOM:"Michel"}})
```

![image](https://user-images.githubusercontent.com/58698088/148983187-98ea3353-9d7b-487e-b14b-f19ab075a833.png)

![image](https://user-images.githubusercontent.com/58698088/148983205-16f6716c-ea3b-444a-a5eb-219aa49627df.png)

---

#### DELETE
Supprime les lignes contenant ce que l'on souhaite.
```
db.RESTAURANTS.remove({NOM:"Michel"})
```
![image](https://user-images.githubusercontent.com/58698088/148983710-d25577c0-7d9c-4795-a248-61f8783db2bb.png)

---

#### FIND
Rechercher des données
```
db.RESTAURANTS.find({NOM:"test"})
```
![image](https://user-images.githubusercontent.com/58698088/148984053-c8b7c39c-d821-4551-9de7-925d99db26ff.png)

---

#### FIND pretty
```
db.RESTAURANTS.find({NOM:"test"}).pretty()
```
Je ne vois pas de différence avec la fonction pretty

![image](https://user-images.githubusercontent.com/58698088/148984172-535c8b13-2999-41cb-9e59-a042ca6e87c2.png)

---

### Est-ce que l'on peut enregistrer des fichiers/images dans MongoDB ?

On peut utiliser GridFS pour enregistrer des fichiers de plus de 100Mo.
Ainsi que BSON, cependant bson enregistre les fichiers dans des chunks de 4Mo.
Il est aussi possible d'enregistrer les fichiers en base64.

https://docs.mongodb.com/manual/core/gridfs/

Il est aussi possible d'enregistrer les fichiers en BINARY ou en BASE64.

---

### Quels types de données peut-on stocker dans MongoDB ?
On peut stocker des strings, floats, données géospatiales, devises, transactions, documents...

---

### Est-ce que les sous-objets permettent d'éviter les jointures ?
Oui ! Cela permet d'éviter les jointures.
Par exemple on peut faire une array contenant rue, nom voie, numero, appartement, batiment, code postal, commune... dans un sous-objet.
Ca évite de créer une autre table pour accéder à des informations pértinentes liées à la table dans laquelle on est actuellement.

Cependant je ne pense pas que ce soit judicieux de stocker les commandes d'un utilisateur dans un sous objet. Il faut faire une ligne par commande.

---

### Quel domaine se spécialise dans la gestion d’énormes quantités de données ? MongoDB fait-il parti des SGBDs adaptés ? Citez une alternative (outre SGBD NoSQL) et présentez-la brièvement ?

Le Big Data est le domaine de prédilection qui se spécialise dans la gestion d'énormes quantités de données; exemple: Google.
MongoDB est adapté, car vu que c'est du NoSQL, cela permet de scale up rapidement.

MySQL est un SGBD alternatif. C'est un système de gestion de base de données relationnelle développé par Oracle et basé sur le Structured Query Language (SQL).

Une base de données est une collection structurée de données. Il peut s'agir de n'importe quoi, d'une simple liste de courses à une galerie de photos, en passant par un endroit où stocker des informations de clients.

---

### Utilisation de GeoJSON et la géospatialisation.

Dans l'objectif de fidélisation des clients, nous sommes en mesure de leur proposer des promotions dans les restaurants aux alentours de chez eux grace à geoJson, et les requêtes de géospatialisation.

Avec la requête ci-dessous, nous pouvons récupérer les villes aux alentours du client.

```
var position_client = { type: "Position du client", coordinates: [ 48.856614, 2.3522219 ]};

db.restaurants.find({
  "localisation": {
    $nearSphere: {
      $geometry: position_client
    }
  }
})
```

---

## Questionnaire
### 1.	Ecrivez une requête MongoDB pour afficher tous les documents dans les restaurants de la collection
« find » suffit à récupérer toutes les données. On affine le résultat des recherches en détaillant la requête.
```
[]
```

---

### 2.	Ecrivez une requête MongoDB pour afficher les champs restaurant_id, name, borough et cuisine pour tous les documents de la collection restaurant.
```
[
  {
    '$project': {
      'restaurant_id': 1, 
      'name': 1, 
      'borough': 1, 
      'cuisine': 1
    }
  }
]
```

---

### 3. Ecrivez une requête MongoDB pour afficher les champs restaurant_id, name, borough et cuisine, mais exclure le champ _id pour tous les documents de la collection restaurant.
```
[
  {
    '$project': {
      'restaurant_id': 1, 
      'name': 1, 
      'borough': 1, 
      'cuisine': 1, 
      '_id': 0
    }
  }
]

```

---

### 4. Ecrivez une requête MongoDB pour afficher les champs restaurant_id, nom, arrondissement et code postal, mais excluez le champ _id pour tous les documents de la collection restaurant.
```
[
  {
    '$project': {
      'restaurant_id': 1, 
      'nom': 1, 
      'borough': 1, 
      'address.zipcode': 1, 
      '_id': 0
    }
  }
]
```

---

### 5. Ecrivez une requête MongoDB pour afficher tous les restaurants qui sont dans l'arrondissement du Bronx.
```
[
  {
    '$project': {
      'borough': 'Bronx'
    }
  }
]
```

---

### 6. Ecrivez une requête MongoDB pour afficher les 5 premiers restaurants qui se trouvent dans le quartier du Bronx. Aller à l'éditeur
```
[
  {
    '$project': {
      'borough': 'Bronx'
    }
  }, {
    '$limit': 5
  }
]
```

---

### 7. Ecrivez une requête MongoDB pour afficher les 5 restaurants suivants après avoir sauté les 5 premiers qui sont dans le quartier du Bronx.
```
[
  {
    '$project': {
      'borough': 'Bronx'
    }
  }, {
    '$skip': 5
  }, {
    '$limit': 5
  }
]
```

---

### 8. Ecrivez une requête MongoDB pour trouver les restaurants qui ont obtenu un score supérieur à 90.
```
db.restaurants.find({ "grades.score": { $gte: 90 }})
```

---

### 9. Ecrivez une requête MongoDB pour trouver les restaurants qui ont obtenu un score supérieur à 80 mais inférieur à 100
```
db.restaurants.find({ "grades.score": { $gte: 90 }, "grades.score": { $lte: 100 }})
```

---

### 10. Ecrivez une requête MongoDB pour trouver les restaurants qui se situent dans une latitude inférieure à -95,754168.
```
db.restaurants.find({ "address.coord.0": { $gte: -95.754168 }})
```

---
