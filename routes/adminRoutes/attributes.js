const express = require('express');
const { getAttrList, deleteAttr, getSingleAttr, addNewAttr, editSingleAttr, getAllAttr } = require('../../controllers/attributes');
const { body } = require('express-validator');
const { checkValidationResults, isAdmin } = require('../../middleware');
const router = express.Router({mergeParams: true});

//router params
router.param('attrType', async (req, res, next, attrName) => {
    try {

        const attrArray = ['sizes', 'colors'];
        //check id is intege
        if(!attrArray.includes(attrName)){
            throwError('Bad Request', 404);
        }
        
        req.attrType = attrName;
        next();
        
    } catch(err) {
        next(err);
    }
})

router.get('/all', isAdmin, getAllAttr);

router.get('/:attrType', getAttrList);

router.post('/:attrType', isAdmin, [body('attrName').trim().notEmpty().escape()], 
    checkValidationResults, 
    addNewAttr);

router.get('/:attrType/:attrId', isAdmin, getSingleAttr);

router.put('/:attrType/:attrId', isAdmin, [body('attrName').trim().notEmpty().escape()], 
checkValidationResults,
editSingleAttr);

router.delete('/:attrType/:attrId', isAdmin, deleteAttr);

module.exports = router;