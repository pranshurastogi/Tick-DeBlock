const mongoose=require('mongoose')
//layout
const eventSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    
});
module.exports=mongoose.model('Event',eventSchema);
