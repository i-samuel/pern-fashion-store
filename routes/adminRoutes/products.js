const express = require('express');
const { body } = require('express-validator');
const router = express.Router({mergeParams: true});
const { checkValidationResults } = require('../../middleware');
const { newProduct, getSingleProduct, editProduct, deleteProduct, deleteVariant } = require('../../controllers/products');
const { updateItems, findProductById } = require('../../model/products');
const { throwError } = require('../../utils');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './uploads')
    },
    filename: function(req, file, cb) {
        const uniqueSuffix  = Date.now() + '-' + Math.round(Math.random() *1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname)
    }
})

const upload = multer({ storage: storage, }).single('image');

//router params
router.param('productId', async (req, res, next, id) => {
    try {
        //check id is integer
        let productId = parseInt(id);
        if(isNaN(productId)){
            throwError('Product Not Found', 404);
        }
        //check if product exists
        const found = await findProductById(productId);
        
        if(found.rows.length > 0){
            req.product = found.rows[0];
            next();
        } else {
            throwError('Product Not Found', 404);
        }
    } catch(err) {
        next(err);
    }
})


//add new product
/*
router.post('/', [body('title').trim().notEmpty().escape(), 
    body('description').trim().notEmpty().escape(),
    body('imageUrl').trim().notEmpty(), 
    body('price').trim().notEmpty()], 
    checkValidationResults, 
    newProduct);*/

    /*
router.post('/sample', upload.single('image'), (req, res) => {
    console.log(req.file);
    res.send('ok');
})*/

router.post('/', function (req, res, next) {
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        throwError('Image upload failed');
        //console.log(err);
      } else if (err) {
        // An unknown error occurred when uploading.
        throwError('Image upload failed');
        //console.log('11', err);
      }
      
      return next();
      // Everything went fine.
    })
}, newProduct);

//get product by id
router.get('/:productId', getSingleProduct);


//edit product
router.put('/:productId', editProduct);

//delete produuct
router.delete('/:productId', deleteProduct);

router.delete('/:productId/:variantId', deleteVariant);

module.exports = router;