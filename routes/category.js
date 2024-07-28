const mongoose=require('mongoose');
const subCategory = require('./subCategory');

const categorySchema= mongoose.Schema({
    categoryName:String,
    subCategoryOfCat:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Subcategory'
    }]
})

module.exports=mongoose.model('category',categorySchema);
