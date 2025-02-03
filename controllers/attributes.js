const { fetchAttrList, removeAttr, fetchSingleAttr, insertNewAttr, updateAttrVal } = require('../model/attributes');
const { getCategories } = require('../model/category');
const { fetchSizes, fetchColors } = require('../model/products');
const { throwError } = require('../utils');

exports.getAttrList = async (req, res, next) => {
    try {
        const itemList = await fetchAttrList(req.attrType);
        if(itemList.rows.length === 0){
            throwError("Not Found", 404);
        }        
        return res.status(200).json(itemList.rows);
    
    } catch(err) {
        next(err);
    }
}

exports.getAllAttr = async (req, res, next) => {
    try {
        let sizeObj = {};
        let colorObj = {};

        const sizes = await fetchSizes();
        if(sizes.rows.length > 0){
            sizes.rows.forEach(item => sizeObj[item.id] = item.name);
        }

        const colors = await fetchColors();
        if(colors.rows.length > 0){
            colors.rows.forEach(item => colorObj[item.id] = item.name);
        }

        const categories = await getCategories();        

        return res.status(200).json({ attr: {sizes: sizeObj, colors: colorObj}, cats: categories.rows });
    } catch(err) {
        next(err);
    }
}

exports.getSingleAttr = async (req, res, next) => {
    try {
        const { attrId } = req.params;
        if(isNaN(parseInt(attrId))){
            throwError('Bad Request', 400);
        }
        const item = await fetchSingleAttr(req.attrType, parseInt(attrId));
        if(item.rows.length === 0){
            throwError("Not Found", 404);
        }        
        return res.status(200).json(item.rows[0]);
    
    } catch(err) {
        next(err);
    }
}

exports.addNewAttr = async (req, res, next) => {
    try {
        const added = await insertNewAttr(req.attrType, req.body.attrName);
        if(added.rows.length === 0){
            throwError("Not Found", 404);
        } 
        return res.status(200).send();

    } catch(err) {
        next(err);
    }
}

exports.editSingleAttr = async (req, res, next) => {
    try {
        const { attrId } = req.params;
        if(isNaN(parseInt(attrId))){
            throwError('Bad Request', 400);
        }
        const added = await updateAttrVal(req.attrType, attrId, req.body.attrName);
        if(added.rows.length === 0){
            throwError("Not Found", 404);
        } 
        return res.status(201).send();

    } catch(err) {
        next(err);
    }
}


exports.deleteAttr = async (req, res, next) => {
    try {
        const { attrId } = req.params;
        if(isNaN(parseInt(attrId))){
            throwError('Bad Request', 400);
        }
        const deleted = await removeAttr(req.attrType, parseInt(attrId));
        if(deleted.rows.length === 0){
            throwError("Not Found", 404);
        }        
        return res.status(204).send();
    
    } catch(err) {
        next(err);
    }
}