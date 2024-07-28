const mongoose=require('mongoose')
const subCategorySchema= mongoose.Schema({
  subCategoryName:String,
})

module.exports=mongoose.model('Subcategory',subCategorySchema);
