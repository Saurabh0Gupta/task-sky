const mongoose=require('mongoose');

const productSchema= mongoose.Schema({
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"category"
  },
  subCategory:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"subCategory"
  },
  Name:String,
  mrp:Number,
  price:Number,
  description:String
})

module.exports=mongoose.model('product',productSchema);
