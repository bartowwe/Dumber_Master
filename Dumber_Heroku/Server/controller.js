const Dictionary = require("oxford-dictionary");

const https = require('https');

const dict1 = new Dictionary(config);
const dict2 = new Dictionary(config2);
const dict3 = new Dictionary(config3);
const dicts = [dict1, dict2, dict3];

let d = 0;

const dictionaryController = {
    //this api is only using the get functions so we will ignore the rest of CRUD
    get: (req,res) =>{
        if (d >= 2){d = 0}
        else {d = d + 1}

        let word = req.query.word;
        if (word.substring(word.length - 1) === '.' || word.substring(word.length - 1) === ',' || word.substring(word.length - 1) === ';' || 
            word.substring(word.length - 1) === ':' || word.substring(word.length - 1) === ')' || word.substring(word.length - 1) === '!'){ 
            word = word.substring(0,word.length - 1)}

        let lookup = dicts[d].find(word);  
        lookup.then(resolution => {
            console.log('oxford dictionary search succesful', resolution.results[0].lexicalEntries[0].entries[0].senses[0].definitions);
            if (resolution.results[0].lexicalEntries[0].entries[0].senses[0].definitions)
            {
                console.log('check 1');
                res.status(200).send(resolution.results[0].lexicalEntries[0].entries[0].senses[0].definitions[0]);
            }
            else if (resolution.results[0].lexicalEntries[0].entries[0].senses[0].crossReferenceMarkers){
                console.log('check 2'); 
                res.status(200).send(resolution.results[0].lexicalEntries[0].entries[0].senses[0].crossReferenceMarkers[0]); 
            }

            else 
            {
                console.log('oxford dictionary search failed, commencing wordnik search');
                console.error(err);
                //http request *****************************************
                https.get(`https://api.wordnik.com/v4/word.json/${req.query.word}/definitions?limit=200&includeRelated=false&useCanonical=false&includeTags=false&api_key=${wordnik}`, (resp) => {
                let data = '';
        
                // A chunk of data has been recieved.
                resp.on('data', (chunk) => {
                    data += chunk;
                });
        
                // The whole response has been received. Print out the result.
                resp.on('end', () => {
                    // console.log(JSON.parse(data));
                    console.log('wordnik search ended succesfully?', JSON.parse(data)); 
                    res.status(200).send(JSON.parse(data)[0].text);
                });
        
                }).on("error", (err) => {
                    console.log('wordnik search failed');
                    console.log("Error: " + err.message);
                    res.status(400).send({});
                });
                //end http request ********************************************
            }
            // res.status(200).send(resolution);

        },
        err => {
            console.log('oxford dictionary search failed, commencing wordnik search');
            console.error(err);
            //http request *****************************************
            https.get(`https://api.wordnik.com/v4/word.json/${req.query.word}/definitions?limit=200&includeRelated=false&useCanonical=false&includeTags=false&api_key=353735f491168bf3bc6557189d007f199323e1cc5cabe6ac4`, (resp) => {
            let data = '';
    
            // A chunk of data has been recieved.
            resp.on('data', (chunk) => {
                data += chunk;
            });
    
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                // console.log(JSON.parse(data));
                console.log('wordnik search ended succesfully?', JSON.parse(data)); 
                res.status(200).send(JSON.parse(data)[0].text);
            });
    
            }).on("error", (err) => {
                console.log('wordnik search failed');
                console.log("Error: " + err.message);
                res.status(400).send({});
            });
            //end http request ********************************************
        });

    },
};

module.exports = { dictionaryController };