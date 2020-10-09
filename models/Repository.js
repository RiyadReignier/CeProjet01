
const fs = require('fs');
const { waitForDebugger } = require('inspector');
///////////////////////////////////////////////////////////////////////////
// This class provide CRUD operations on JSON objects collection text file 
// with the assumption that each object have an Id member.
// If the objectsFile does not exist it will be created on demand.
// Warning: no type and data validation is provided
///////////////////////////////////////////////////////////////////////////
module.exports = 
class Repository {
    constructor(objectsName) {
        objectsName = objectsName.toLowerCase();
        this.objectsList = [];
        this.objectsFile = `./data/${objectsName}.json`;
        this.objectMenu =
        [{
            "GET":"api/bookmarks endpoint",
            "Titre":"La liste des paramètres supportés:",
            "Option1":"? sort = name => Trier par nom",
            "Option2":"? sort = category => Trier par nom de categorie",
            "Option3":"/ id => Rechercher un bookrmark qui correspond au Id",
            "Option4":"? name = name => Rechercher un bookrmark qui correspond au Id",
            "Option5":"? name = name* => Rechercher un bookrmark qui inclut les lettres entrees",
            "Option6":"? category = category => Rechercher des bookmarks par catégorie",
        }];
        this.read();
    }
    read() {
        try{
            // Here we use the synchronus version readFile in order  
            // to avoid concurrency problems
            let rawdata = fs.readFileSync(this.objectsFile);
            // we assume here that the json data is formatted correctly
            this.objectsList = JSON.parse(rawdata);
        } catch(error) {
            if (error.code === 'ENOENT') {
                // file does not exist, it will be created on demand
                this.objectsList = [];
            }
        }
    }
    write() {
        // Here we use the synchronus version writeFile in order
        // to avoid concurrency problems  
        fs.writeFileSync(this.objectsFile, JSON.stringify(this.objectsList));
        this.read();
    }
    nextId() {
        let maxId = 0;
        for(let object of this.objectsList){
            if (object.Id > maxId) {
                maxId = object.Id;
            }
        }
        return maxId + 1;
    }
    add(object) {
        try {
            object.Id = this.nextId();
            this.objectsList.push(object);
            this.write();
            return object;
        } catch(error) {
            return null;
        }
    }
    getAll() {
        return this.objectsList;
    }
    get(id){
        for(let object of this.objectsList){
            if (object.Id === id) {
               return object;
            }
        }
        return null;
    }
    getByName(name){
        let compteur = 0;
        let tableau = [];

        for(let object of this.objectsList){
            if (object.Name === name) {
               tableau[compteur] = object;
               compteur++;
            }
        }
        return tableau;
    }
    getByCategorie(category){
        let compteur = 0;
        let tableau = [];


        for(let object of this.objectsList){
            if (object.Category === category) {
                tableau[compteur] = object;
                compteur++;
                
            }
        }
        return tableau;
    }
    remove(id) {
        let index = 0;
        for(let object of this.objectsList){
            if (object.Id === id) {
                this.objectsList.splice(index,1);
                this.write();
                return true;
            }
            index ++;
        }
        return false;
    }
    update(objectToModify) {
        let index = 0;
        for(let object of this.objectsList){
            if (object.Id === objectToModify.Id) {
                this.objectsList[index] = objectToModify;
                this.write();
                return true;
            }
            index ++;
        }
        return false;
    }

    getByPrefix(name){
        let compteur = 0;
        let tableau = [];
        name = name.replace("*","");

        for(let object of this.objectsList){
            if (object.Name.includes(name)) {
               tableau[compteur] = object;
               compteur++;
            }
        }
        return tableau;
    }
    getMenu(){
        return this.objectMenu;
    }
}