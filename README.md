# Books CRUD Project

## Projet réalisé dans le cadre du cours de virtualisation/containerisation : [consignes du projet](https://github.com/mtbinds/ESIEA_VIRTUALISATION_CONTAINERISATION_COURSE_47/blob/main/FINAL_PROJECT/FINAL_PROJECT.md)

---

Membres du projet :

- GADIO Abdourahmane - TD 44
- GARNIER Pierre - TD 45
- GARREAU Quentin - TD 46

---

## Instructions pour tester l’application

### 1. Pré-requis

- Assurez-vous d'avoir **Docker** et **Docker Compose** installés sur votre
  machine -> [Instructions d'installation](https://github.com/mtbinds/ESIEA_VIRTUALISATION_CONTAINERISATION_COURSE_47/blob/main/DOCKER/LABS_DEMOS/LAB_00_INSTALL_DOCKER/README.md).

### 2. Étapes pour exécuter le projet

1. Clonez le projet :

   ```bash
   git clone https://github.com/AbdourahmaneGadio/Books-CRUD-Project
   cd Books-CRUD-Project
   ```

2. Remplissez les variables d´environnement :

   ```bash
   cp .env.example .env
   ```

3. Construisez les images **Docker** :

   ```bash
   docker-compose build
   ```

4. Lancez l’application :

   ```bash
   docker-compose up
   ```

---

## Instructions pour développer l’application

1. Clonez le projet :

   ```bash
   git clone https://github.com/AbdourahmaneGadio/React-CRUD-Project
   cd React-CRUD-Project
   ```

2. Installez les dépendences **node** :

   ```bash
   cd frontend
   npm i
   ```

   ```bash
   cd backend
   npm i
   ```

3. Lancez les différentes parties :

   ```bash
   cd frontend
   npm start dev
   ```

   ```bash
   cd backend
   node index.js
   ```

La partie front est accessible par défaut sur le port 3000 via [localhost:3000](http:localhost:3000).

Pour la partie back, il faut aller sur [localhost:3001](http:localhost:3001).

Une documentation API est disponible sur [localhost:3001/api-docs](localhost:3001/api-docs), et dans la partie [Endpoints](#liste-des-endpoints-de-lapi).

---

## Fonctionnalités

L'application nous permet de se créer une base de données contenant des livres.
Les informations que l'on peut rentrer dans le formulaire sont :

- L'image du livre
- L'ISBN
- Le prix en euro
- Le nom de l'oeuvre
- L'auteur
- La date de parution
- Le synopsis
- La catégorie du livre
- Le nombre de pages

---

## Structure proposée du projet

Voici la structure du projet utilisé (
source : [structure suggérée du projet](https://github.com/mtbinds/ESIEA_VIRTUALISATION_CONTAINERISATION_COURSE_47/blob/main/FINAL_PROJECT/FINAL_PROJECT.md#structure-propos%C3%A9e-du-projet)) :

```
Books-CRUD-Project/
│
├── backend/
│   ├── app/              # Code source du backend
│   ├── Dockerfile        # Conteneurisation du backend
│
├── frontend/
│   ├── src/              # Code source du frontend
│   └── Dockerfile        # Conteneurisation du frontend
│
├── database/
│   └── Dockerfile        # Conteneurisation de la base de données
│
├── docker-compose.yml    # Orchestration des services
└── README.md             # Documentation du projet
```

---

## Liste des endpoints de l’API

------------------------------------------------------------------------------------------

#### Affichage des livres disponibles dans la base de données

<details>
 <summary><code>GET</code> <code><b>/books</b></code> <code>(affiche tous les livres disponibles)</code></summary>

##### Paramètres

> Aucun

##### Réponses

> | code http     | type de contenu                   | réponse                                                             |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | `[{"id": 1, "titre": "Livre 1", ...}, {"id": 2, "titre": "Livre 2", ...}]` |
> | `500`         | `application/json`                | `{"message":"Erreur serveur"}`                                      |

##### Exemple cURL

> ```javascript
>  curl -X GET http://localhost:3001/books
> ```

</details>

#### Création d'un nouveau livre

<details>
 <summary><code>POST</code> <code><b>/books/create</b></code> <code>(crée un nouveau livre)</code></summary>

##### Paramètres

> | nom       | type     | type de données        | description                                                           |
> |-----------|----------|------------------------|-----------------------------------------------------------------------|
> | Aucun     | requis   | objet (JSON ou YAML)   | N/A  |


##### Réponses

> | code http     | type de contenu                   | réponse                                                             |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | `{"message":"Nouveau livre créé avec succès"}`                      |
> | `500`         | `application/json`                | `{"message":"Erreur serveur"}`                                      |

##### Exemple cURL

> ```javascript
>  curl -X POST -H "Content-Type: application/json" --data @nouveau_livre.json http://localhost:3001/books/create
> ```

</details>

#### Mise à jour des données d'un livre existant

<details>
  <summary><code>PUT</code> <code><b>/books/{id_livre}</b></code> <code>(met à jour les données d'un livre par son ID)</code></summary>

##### Paramètres

> | nom         | type     | type de données | description                   |
> |-------------|----------|-----------------|-------------------------------|
> | `id_livre`  | requis   | int ($int64)    | L'ID spécifique du livre      |

##### Réponses

> | code http     | type de contenu                   | réponse                                                             |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | `{"message":"Données du livre ID#<id_livre> mises à jour avec succès"}` |
> | `500`         | `application/json`                | `{"message":"Erreur serveur"}`                                      |

##### Exemple cURL

> ```javascript
>  curl -X PUT -H "Content-Type: application/json" --data @livre_maj.json http://localhost:3001/books/0
> ```

</details>

#### Suppression d'un livre spécifique

<details>
  <summary><code>DELETE</code> <code><b>/books/delete:{index}</b></code> <code>(supprime les données d'un livre spécifique)</code></summary>

##### Paramètres

> | nom         | type     | type de données | description                   |
> |-------------|----------|-----------------|-------------------------------|
> | `index`     | requis   | int ($int64)    | L'index spécifique du livre   |

##### Réponses

> | code http     | type de contenu                   | réponse                                                             |
> |---------------|-----------------------------------|---------------------------------------------------------------------|
> | `200`         | `application/json`                | `{"message":"Livre à l'index <index> supprimé avec succès"}`        |
> | `500`         | `application/json`                | `{"message":"Erreur serveur"}`                                      |

##### Exemple cURL

> ```javascript
>  curl -X DELETE http://localhost:3001/books/delete:0
> ```

</details>



------------------------------------------------------------------------------------------

