const express = require('express');
const router = express.Router();
const { throwError } = require('../utils');
const { findCategoryById } = require('../model/category');
const validator = require('validator');
const {  body } = require('express-validator');
const { getAllCategories, getByCategory, editCategory, deleteCategory, addNewCategory } = require('../controllers/category');
const { checkValidationResults, isAdmin } = require('../middleware');


router.param('categoryId', async (req, res, next, id) => {
    try {
        //check id is integer
        let catId = parseInt(id);
        if(isNaN(catId)){
            throwError('Bad request', 404);
        }
        
        //check if category exists
        const found = await findCategoryById(catId);
        if(found.rows.length > 0){
            req.categoryId = catId;
            req.category = found.rows[0];
            next();
        } else {
            throwError('Category Not Found', 404);
        }
    } catch(err) {
        next(err);
    }
})

//get all categories
router.get('/', getAllCategories);

//add new category
router.post('/', isAdmin, [body('category').trim().notEmpty().escape(),], checkValidationResults, addNewCategory);


router.get('/:categoryId', (req, res, next) => {
    return res.status(200).json(req.category);
});

//get products by category
router.get('/:categoryId/products', getByCategory);

//edit category
router.put('/:categoryId', isAdmin, [body('category').trim().notEmpty().escape(),], checkValidationResults, editCategory);

//delete category
router.delete('/:categoryId', isAdmin, deleteCategory);

module.exports = router;