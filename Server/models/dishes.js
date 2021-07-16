const mongoose= require('mongoose');
const Schema= mongoose.Schema;
require('mongoose-currency').loadType(mongoose); //this will load this new currency type into mongoose
const Currency= mongoose.Types.Currency;



const dishSchema= new Schema({
    name:{
        type: String,
        required: true, //name field is required for all documents
        unique: true //name for every document must be unique
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: Currency,
        required: true,
        min: 0
    },
    featured: {
        type: Boolean,
        default:false      
    },
    description: {
        type: String,
        required: true
    }
},{
    timestamps: true //will automatically add createdAt and updatedAt time stamps in our document
});

var Dishes= mongoose.model('Dish', dishSchema);

module.exports= Dishes;