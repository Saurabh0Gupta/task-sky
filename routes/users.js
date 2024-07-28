const mongoose=require('mongoose')
const plm = require('passport-local-mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/Sky')
const userSchema= mongoose.Schema({
  name:String,
  username:String,
  password:String
})
userSchema.plugin(plm)
module.exports=mongoose.model('user',userSchema);
