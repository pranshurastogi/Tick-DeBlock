const mongoose=require('mongoose')
//layout
const eventSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    EventName: String,
    Timings:{type:Date, default: Date.now,required:true},
    Venue: String,
    Description: String,
    Price:{type: Array,required:true},
    Address:{type: String, required:true},
    totalSupply:Number
});
module.exports=mongoose.model('Event',eventSchema);
