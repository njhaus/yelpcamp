import mongoose from "mongoose";

// Import seed data
import { cities } from "./cities.js";
import { descriptors } from "./seedhelpers.js";
import { places } from "./seedhelpers.js"
import { adjectives } from "./seedhelpers.js"
import { nouns } from "./seedhelpers.js"

// Import database model
import Campground from "../models/campground.js"

// Connect mongoose
async function main() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/campgroundsDB');
        console.log('Connection successful');
    } catch (err) {
        console.err(err);
    }
    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}
main();

function getWord(type, article) {
    const word = type[Math.floor(Math.random() * type.length)].toLowerCase();
    if (!article) {
        return word;
    }
    return /[aeiou]/.test(word.split('')[0]) ? 'an ' + word : 'a ' + word;
}

async function seedDB() {
    let campgroundsSeed = [];
    const smallCities = cities.filter(c => parseInt(c.population) < 70000);
    for (let i = 0; i < 250; i++) {
        const place = places[Math.floor(Math.random() * places.length)];
        const city = smallCities[Math.floor(Math.random() * smallCities.length)];
        const title = descriptors[Math.floor(Math.random() * descriptors.length)] + ' ' + place;
        const location = `${city.city}, ${city.state}`;
        console.log(city);
        const getGeoCode = smallCities.find(c => c.city === city.city);
        console.log(getGeoCode);
        const geoCode = {
            type: 'point',
            coordinates: [getGeoCode.longitude, getGeoCode.latitude]
        };
        const img = [{ url: `https://source.unsplash.com/random/?${place}`, filename: 'random photo' }];
        const description = `${title} is ${getWord(adjectives, 'a')} campground located in ${location}. It is situated by ${getWord(adjectives, 'a')} ${getWord(nouns)}. Throughout the campground, you will see many ${getWord(nouns, 'a')} and even ${getWord(adjectives, 'a')} ${getWord(nouns)}. At this ${getWord(adjectives)} location, you are guaranteed to have the most ${getWord(adjectives) } time of your life!`;
        campgroundsSeed.push(
          new Campground({
            title: title,
              location: location,
              geocode: geoCode,
            img: img,
            description: description,
            price: Math.floor(Math.random() * 20) + 5,
            createdBy: new mongoose.Types.ObjectId("6529635196874be5eb582c7f"),
          })
        );
        smallCities.filter(c => c !== city)
    }
    console.log(campgroundsSeed);
    try {
        await Campground.insertMany(campgroundsSeed)
            .then(res => console.log(res));
        console.log('Seeded');
    } catch (err) {
        console.log(err);
    }

}
seedDB();
