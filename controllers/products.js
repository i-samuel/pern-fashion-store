const { throwError } = require('../utils');
const { fetchProductSearch, fetchAllProducts, addNewProduct, deleteSingleProduct, updateProduct, getProductVariants, fetchSizes, fetchColors, addNewItems, updateItems, removeVariant, deleteItems, fetchProductCats }  = require('../model/products');
//const { trim, isEmpty, escape } = require('validator');

//get all products
exports.getAllProducts = async (req, res, next) => {

    try {
        const products = await fetchAllProducts();
        if(products.rows.length === 0){
            throwError("No Products Found", 404);
        }        
        return res.status(200).json({ products: products.rows });
    
    } catch(err) {
        next(err);
    }
}

//search products
exports.searchProducts = async (req, res, next) => {
    try {
        let { searchTerm } = req.query;    
        const results = await fetchProductSearch(searchTerm);        

        return res.status(200).json({ products: results.rows });
    } catch(err){
        next(err);
    }
}

//add new product
exports.newProduct = async (req, res, next) => {

    const {title, description, price, variantArr, catsArr } = req.body;
    const priceTo = parseFloat(price);
    const variants = JSON.parse(variantArr);
    const cats = JSON.parse(catsArr)
    try{
        
        if(isNaN(priceTo) || priceTo <= 0) {            
            throwError('Enter Valid Data', 400);
        }

        if(variants.length === 0){
            throwError("Variants cannot be empty");
        }
        
        let quantAt;
        variants.forEach((item, index) => {
            quantAt = parseFloat(item.quantity);
            if(isNaN(quantAt) || (quantAt % 1 !== 0) || (quantAt < 0)){
                throwError('Enter Valid Data', 400);
            }
            variants[index].quantity = quantAt;
        })

        let categories = [];
        cats.forEach((item) => {
            if(isNaN(parseInt(item))){
                throwError('Enter Valid Data', 400);
            }
            categories.push(parseInt(item));
        })

        const product = await addNewItems({
            title,
            description,
            image_url: req.file.filename,
            price: priceTo.toFixed(2),
            variantArr: variants,
            categories
        });

        if(product.rows.length === 0){
            throwError("Database Connection Error", 500);
        }
        
        return res.status(200).json(product.rows[0]);    

    } catch(err) {
        next(err);
    }
}

//get single poduct
exports.getSingleProduct = async (req, res) => {

    const variants = await getProductVariants(req.product.id);
    let colorVariants = {};

    if(variants.rows.length > 0){
        //console.log("here");
        variants.rows.forEach(item => {
            //colorVariants[item.color_id].push(item);
            if(!(item.color_id in colorVariants)){
                colorVariants[item.color_id] = [item];
            } else{
                colorVariants[item.color_id] = [...colorVariants[item.color_id], item];
            }
            //colorVariants[item.color_id] = [...colorVariants[item.color_id], item];
        });
    }

    const cats = await fetchProductCats(req.product.id);

    return res.json({
        product: req.product,
        variants: colorVariants,
        categories: cats.rows
    });
}

//edit a product
exports.editProduct = async (req, res, next) => {

    const {title, description, price, variantArr, catsArr} = req.body;
    const priceTo = parseFloat(price);
    //const quantityTo = parseFloat(quantity);

    try{  

        if(isNaN(priceTo) || priceTo <= 0) {
            throwError('Enter Valid Data', 400);
        }

        if(variantArr.length === 0){
            throwError("Variants cannot be empty");
        }

        let quantAt;
        variantArr.forEach((item, index) => {
            quantAt = parseFloat(item.quantity);
            if(isNaN(quantAt) || (quantAt % 1 !== 0) || (quantAt < 0)){
                throwError('Enter Valid Data too', 400);
            }
            variantArr[index].quantity = quantAt;
        })

        let categories = [];
        catsArr.forEach((item) => {
            if(isNaN(parseInt(item))){
                throwError('Enter Valid Data', 400);
            }
            categories.push(parseInt(item));
        })

        const updated = await updateItems({
           product_id: req.product.id,
           title,
           description,
           price: priceTo.toFixed(2),
           variantArr,
           categories
        });

        if(!updated) {
            throwError("Database Connection Error", 500);
        }
        return res.status(201).send(`Product with id ${req.product.id} updated`);    
   
    } catch(err) {
        next(err);
    }
}

//delete a product
exports.deleteProduct = async (req, res, next) => {
    try{
        const deleted = await deleteItems(req.product.id);
        if(!deleted) {
            throwError("Database Connection Error", 500);
        }
        return res.status(204).send();
    } catch(err) {
        next(err);
    }
}

exports.deleteVariant = async (req, res, next) => {
    try{
        const variantId = parseFloat(req.params.variantId);
        
        if(isNaN(variantId) || (variantId % 1 !== 0)){
            throwError('Bad Request', 400);
        }

        const deleted = await removeVariant(req.product.id, variantId);
        if(deleted.rows.length === 0){
            //console.log(deleted.rows);
            throwError('Bad Request', 400);
        }
        return res.status(204).send();
    } catch(err) {
        next(err);
    }
}

exports.getSizesColors = async (req, res, next) => {
    try {
        const sizes = await fetchSizes();
        let sizeObj = {};
        let colorObj = {};
        if(sizes.rows.length > 0){
            sizes.rows.forEach(item => sizeObj[item.id] = item.name);
        }           
        const colors = await fetchColors();
        if(colors.rows.length > 0){
            colors.rows.forEach(item => colorObj[item.id] = item.name);
        }

        return res.status(200).json({ sizes: sizeObj, colors: colorObj });
    } catch(err) {
        next(err);
    }
}