# dhypach_P7

Lancement du frontend :

Créer un dossier .eslintrc.js dans le dossier frontend et le renseigner avec ceci :
module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}

cd frontend

npm install

npm run serve

Pour utiliser l'application, créer une BDD MySQL et renseigner le fichier db.js dans le dossier config du dossier backend avec vos identifiants.

Lancement du backend :

cd backend

npm install

node server.js ou nodemon.serve

Lancement de l'application :
http:/localhost/8080
