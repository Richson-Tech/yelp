const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors} = require('./seedHelpers')
const campground = require('../Models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true })
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database Connected')
})
const sample =array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await campground.deleteMany({});
    for(let i =0; i < 300;i++){
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
    const camp =    new campground ({
        //YOUR USER ID
            author: '62876d1dafacafd8aa92652b',
            location : `${cities[random1000].city},${cities[random1000].state}`,
            title : `${sample(descriptors)} ${sample(places)}`,
            descriptors : 'Color nulla numquam vero facere fugiat voluptas animi voluptatibus debitis iste quia!',
            price,
            geometry: {
                type: 'Point', 
                coordinates : [
                cities[random1000].longitude,
                cities[random1000].latitude,
                ]
            },
            images: [
                {
                  url: 'https://media.istockphoto.com/photos/epic-starry-sky-from-a-modern-aframe-tiny-home-at-night-with-millions-picture-id1322234454?b=1&k=20&m=1322234454&s=170667a&w=0&h=ppOWDLLd0T1ZwRzW1BFW3jjEluRmLIpsr7c3xpXhcnc=',
                  filename: 'ytozqyuy6uqbs8mbcn57',
                },
                {
                  url: 'https://media.istockphoto.com/photos/sun-going-down-at-the-rv-park-picture-id1329937355?b=1&k=20&m=1329937355&s=170667a&w=0&h=gg0qpFNQEQKVucaey8CIdPQZ7bWQ4s-0MLbeXLUEakg=',
                  filename: 'vgqgj5iarfmmui4qpmlm',
                }
              ],
        })
        await camp.save();
    }

}
seedDB().then(()=>{
    mongoose.connection.close();
})