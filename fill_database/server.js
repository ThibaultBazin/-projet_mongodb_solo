const { MongoClient } = require("mongodb");
const crypto = require("crypto");

const NOM = require("./json/NOM.json");
const PRENOM = require("./json/PRENOM.json");
const MAIL = require("./json/MAIL.json");
const VILLES = require("./json/VILLES.json");
const VILLES_LAT = require("./json/VILLES_LAT.json");
const VILLES_LNG = require("./json/VILLES_LNG.json");


const uri = "mongodb+srv://isitech:isitech@cluster0.ziyn3.mongodb.net/test";
const client = new MongoClient(uri);

async function run() {
  try {
    await client.connect();
    const database = client.db('database_tp');
    const clients = database.collection('CLIENTS');

    let array1 = [];

    let i = 0;

    for (i; i <= 1000000; i++) {
      const _nom = NOM[getRandomInt(NOM.length)].toLowerCase();
      const _prenom = PRENOM[getRandomInt(PRENOM.length)].toLowerCase();
      const _mail = MAIL[getRandomInt(MAIL.length)];
      const _r_ville = getRandomInt(VILLES.length);
      const _ville = VILLES[_r_ville];
      const _ville_lat = VILLES_LAT[_r_ville];
      const _ville_lng = VILLES_LNG[_r_ville];

      const _number = getRandomInt(999);
      const _num_rue = getRandomInt(2000);
      const _tel = `06`+getRandomTel(99999999);

      const _date_naissance = new Date(randomDate('01/01/1950', '01/01/2004'));
      const _cp = getRandomInt(98000);
      const _password = "password";
      const mail = `${_prenom}.${_nom}${_number}@${_mail}`;
      const _sexes = ["H", "F"];
      const _sexe = _sexes[getRandomInt(_sexes.length)];

      const data = {
        NOM: _nom,
        PRENOM: _prenom,
        DATE_NAISSANCE: _date_naissance,
        ADRESSE: {
          LIBELLE: "",
          VILLE: _ville,
          CP: _cp
        },
        TEL: _tel,
        MAIL: mail,
        PASSWORD: _password,
        SEXE: _sexe
      };

      array1.push(data);    
    } 
    console.log("Fini");

    const req = await clients.insertMany(array1);

  } finally {
    await client.close();
  }
}

run().catch(console.dir);

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function getRandomTel(max) {
  return Math.floor(10000000 + Math.random() * 90000000);
}

function randomDate(date1, date2){
    function randomValueBetween(min, max) {
      return Math.random() * (max - min) + min;
    }
    var date1 = date1 || '01-01-1970'
    var date2 = date2 || new Date().toLocaleDateString()
    date1 = new Date(date1).getTime()
    date2 = new Date(date2).getTime()
    if( date1>date2){
        return new Date(randomValueBetween(date2,date1)).toLocaleDateString()   
    } else{
        return new Date(randomValueBetween(date1, date2)).toLocaleDateString()  

    }
}
