const express = require('express');
const router = express.Router({mergeParams: true});
const { isLoggedIn, isAdmin } = require('../../middleware');
const { getAllProducts } = require('../../controllers/products');
const productRouter = require('./products');
const attrRouter = require('./attributes');

router.use('/', isLoggedIn, isAdmin);

router.use('/products', productRouter);

router.use('/attr', attrRouter);

router.get('/', (req, res) => {
    
})



module.exports = router;