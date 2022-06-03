const { string } = require('joi');
const mongoose = require ('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

// https://res.cloudinary.com/dlno5s9jj/image/upload/v1653383093/ytozqyuy6uqbs8mbcn57.jpg
const ImageSchema = new Schema({
 
        url:String,
        filename:String
   
});
ImageSchema.virtual('thumbnail').get(function(){
  return this.url.replace('/upload', '/upload/w_200');
}); 
const opts = {toJSON:{virtuals:true}};
const CampgroundSchema = new Schema({
    title : String,
    images : [ImageSchema ],
    geometry: {
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates : {
            type:[Number],
            required:true
        }
    },
    price: Number,
    descriptors:String,
    location:String,
    author : {
        type: Schema.Types.ObjectId,
        ref:'User'
    },
    reviews : [
        {
            type:Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
},opts);
CampgroundSchema.virtual('properties.popUpMarkup').get(function(){
    return `
    <stong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.descriptors.substring(0, 20)}...</p>`;
  }); 

CampgroundSchema.post('findOneAndDelete',async function (doc){
    if(doc){
        await Review.deleteMany({
            _id:{
                $in:doc.reviews
            }
        })
    }
})
module.exports = mongoose.model('Campground',CampgroundSchema);