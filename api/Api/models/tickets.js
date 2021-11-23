const mongoose=require('mongoose')
//layout
const ticketSchema=mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    ticket:{type:mongoose.Schema.Types.ObjectId,ref:'Event' },
    quantity:{type: Number, default:1}

});
module.exports=mongoose.model('Ticket',ticketSchema);
