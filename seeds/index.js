const mongoose = require('mongoose');
const loremIpsum = require("lorem-ipsum").LoremIpsum;
const ServiceRequest = require('../models/serviceRequest');
const locationData = require('./locationData');
const names = require('./names');
const petsType = require('./petsType');
const petNames = require('./petNames');
const services = require('./services');

mongoose.connect('mongodb://localhost:27017/peti', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", ()=>{
    console.log("Database Connected");
});

var distritos = [];
var conselhos = []; 
var freguesias = [];

const organizeData = () =>{

    for(let i = 0; i < locationData.length; i++){
        if(locationData[i].level == 1) {
            distritos.push(locationData[i].name)
        }
        else if(locationData[i].level == 2) {
            conselhos.push(locationData[i].name)
        }
        else if(locationData[i].level == 3) {
            freguesias.push(locationData[i].name)
        }
    }
}

organizeData();

const seedDB = async() => {
    
    const lorem = new loremIpsum({
        sentencesPerParagraph: {
          max: 8,
          min: 4
        },
        wordsPerSentence: {
          max: 16,
          min: 4
        }
      });
      
    await ServiceRequest.deleteMany({});
    for(let i = 0; i < 50; i++){
        const randomName = Math.floor(Math.random() * names.length)
        const randomDistrito = Math.floor(Math.random() * distritos.length)
        const randompetName = Math.floor(Math.random() * petNames.length)
        const randompetType = Math.floor(Math.random() * petsType.length)
        const randomService = Math.floor(Math.random() * services.length)
        
        const request = new ServiceRequest({
            //username: `${names[randomName].name}`,
            location: `${distritos[randomDistrito]}`,
            petname: `${petNames[randompetName]}`,
            pettype: `${petsType[randompetType]}`,
            description: lorem.generateSentences(3),
            service: `${services[randomService]}`,
            author:'60943ff4701e98345c215ba1',
            images: [
                {
                url: 'https://res.cloudinary.com/drg2ftveg/image/upload/v1620298614/PeTi/r2lw9ltxpotkugyxt9y1.jpg',
                filename: 'PeTi/r2lw9ltxpotkugyxt9y1'
                }
            ],
            geometry: {
                type:"Point",
                coordinates: [38.7223, 9.1393]
            }
        })
        await request.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})