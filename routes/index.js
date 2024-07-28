var express = require('express');
const passport=require('passport')
const userModel=require('./users')
const categoryModel=require('./category')
const subModel=require('./subCategory')
const productModel=require('./product')
const localStrategy=require('passport-local');
passport.use(new localStrategy(userModel.authenticate()))
var router = express.Router();
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('register', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Express' });
});
router.post('/register',function(req, res, next) {
  console.log("hello 51")
  const user=new userModel({
    name :req.body.name,
    username:req.body.username,
   })
   userModel.register(user,req.body.password)
   .then(function(){
     passport.authenticate('local')(req,res,function(){
    })
    console.log("hello 62")
    res.redirect('/showCategory');
  })

});

router.post('/login',passport.authenticate("local",{
successRedirect:"/showCategory",
failureRedirect:"/login"
}),(req,res)=>{
})
function isLoggedIn(req,res,next){
if(req.isAuthenticated())return next();
res.redirect("/login");
}



// router.get('/showsub/:id',async function(req, res, next) {
  
//   console.log(subCate);
//   res.render('showSub',{subCate});
// });

// ----------
router.get('/show',async function(req, res, next) {
  const allCategories=await categoryModel.find()
  res.render('show', { allCategories });
});
router.get('/getCategories', async (req, res) => {
  try {
    const categories = await categoryModel.find({});
    res.json({ categories });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// router.get('/getSubCate',async (req,res)=>{
//   const parentCate=await categoryModel.findOne({_id:req.body.cate})
//   console.log(parentCate)
// })

router.get('/getSubcategories/:categoryId', async (req, res) => {
  try {
    const categoryId = req.params.categoryId;
    const category = await categoryModel.findById(categoryId).populate('subCategoryOfCat');
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    const subcategories = category.subCategoryOfCat;
    console.log("Subcategories: ", subcategories);
    res.json({ subcategories });
  } catch (err) {
    console.error("Error fetching subcategories:", err.message);
    res.status(500).json({ error: err.message });
  }
});

// ------------Show category page
router.get('/showCategory',async function(req, res, next) {
  const allCategorys=await categoryModel.find();
  res.render('showCategory', {allCategorys});
});

router.post('/createCategory',async function(req, res, next) {
  const category=await categoryModel.create({
    categoryName:req.body.category
  })
  console.log(category)
  res.redirect("/showCategory");
});

router.get('/update/:id',async (req,res)=>{
  const cate=await categoryModel.findOne({_id:req.params.id})
  res.render('updateCate',{cate})
})
router.get('/subUpdate/:id/:pid',async (req,res)=>{
  const subCate=await subModel.findOne({_id:req.params.id})
  const parentCate=req.params.pid
  res.render('updateSub',{subCate,parentCate})
})
router.post('/subUpdated/:id/:pid',async (req,res)=>{
  const subCate=await subModel.findOneAndUpdate({_id:req.params.id},{subCategoryName:req.body.subcategory},{new:true});
  const pid=req.params.pid
  console.log('updated')
  res.redirect('/addSub/'+pid);
})
router.post('/updated/:id',async (req,res)=>{
  const cate=await categoryModel.findOneAndUpdate({_id:req.params.id},{categoryName:req.body.category},{new:true});
  res.redirect('/showCategory')
})
router.get('/delete/:id',async (req,res)=>{
  const cate=await categoryModel.findOneAndDelete({_id:req.params.id})
  res.redirect('/showCategory')
})
router.get('/subDelete/:id/:pid',async (req,res)=>{
  const cate=await subModel.findOneAndDelete({_id:req.params.id})
  const parentCate=await categoryModel.findOne({_id:req.params.pid})
  const index=parentCate.subCategoryOfCat.indexOf(cate._id);
  if(index!==-1){
    parentCate.subCategoryOfCat.splice(index,1);
    console.log("deleted")
  }
  res.redirect('/addSub/'+parentCate.id)
})
router.get('/addSub/:id', async function(req, res, next) {
  try {
    const parentCate = await categoryModel.findOne({ _id: req.params.id }).populate('subCategoryOfCat');
    console.log(parentCate);
    res.render('showSub', { parentCate });
  } catch (err) {
    next(err);
  }
});
// ----sub-cate----
router.post('/addSub/:id',async function(req, res, next) {
  const parentCate=await categoryModel.findOne({_id:req.params.id})
  const parentCateId=parentCate._id
  const subCategory=await subModel.create({
    subCategoryName:req.body.subcategory
  })
  console.log(parentCate,subCategory)
  parentCate.subCategoryOfCat.push(subCategory._id)
  await parentCate.save();
  res.redirect("/addSub/"+parentCateId);
});

// ------product--------

router.post('/submitProduct',async (req,res)=>{
  const newProduct=await productModel.create({
    category:req.body.category,
    subCategory:req.body.subcategory,
    Name:req.body.productName,
    mrp:Number(req.body.mrp),
    price:Number(req.body.price),
    description:req.body.description
  })
  console.log(newProduct)
  res.redirect("/allProduct")
})

router.get('/allProduct',async (req,res)=>{
  const allProduct=await productModel.find();
  res.render('allProduct',{allProduct})
})

router.get('/delete/:id',async(req,res)=>{
  const product=await productModel.findOneAndDelete({_id:req.params.id})
  res.redirect('/allProduct');
})
router.get('/editProduct/:id',async(req,res)=>{
  const product=await productModel.findOne({_id:req.params.id})
  res.render('updateProduct',{product});
})
router.post('/updateProduct/:id',async(req,res)=>{
  const product=await productModel.findOneAndUpdate({_id:req.params.id},{name:req.body.productName,mrp:req.body.mrp,price:req.body.price, description:req.body.description},{new:true})
  res.redirect('/allProduct');
})
module.exports = router;
