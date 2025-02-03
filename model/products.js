const pool = require('./database');

//get all products
const fetchAllProducts = () => {    
    return pool.query('SELECT * FROM products')
};

//get products by keyword
const fetchProductSearch = (keyword) => {
    return pool.query("SELECT * FROM products WHERE title ILIKE $1", [`%${keyword}%`]);
};

//get single product row
const findProductById = (id) => pool.query('SELECT * FROM products WHERE id=$1', [id]);

const findVariantById = (id) => pool.query('SELECT * FROM product_variants WHERE id=$1', [id]);

//add new product
const addNewProduct = ({title, description, price, image_url, quantity, variantArr}) => {
    const query = 'INSERT INTO products (title, description, price, image_url, quantity) VALUES ($1, $2, $3, $4, $5) RETURNING *';
    const values = [title, description, price, image_url, quantity];

    return pool.query(query, values);
}

//add new product with variants
const addNewItems = async ({title, description, price, image_url, variantArr, categories }) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const product = await client.query('INSERT INTO products (title, description, price, image_url) VALUES ($1, $2, $3, $4) RETURNING id', [title, description, price, image_url]);

        /*
        if(product.rows.length === 0) {
            throw new Error('Request failed');
        }*/

        //add variants
        if(variantArr.length > 0){
            let rowStr = 'INSERT INTO product_variants (product_id, size_id, color_id, quantity) VALUES ';
            variantArr.forEach((obj) => {
                rowStr += `(${product.rows[0].id}, ${obj.size_id}, ${obj.color_id}, ${obj.quantity}), `;
            })
    
            rowStr =  rowStr.slice(0, -2) + ' RETURNING id';
            
            const addedVars = await client.query(rowStr);

            if(addedVars.rows.length != variantArr.length){
                throw new Error("Add new product failed");
            }
        }        

        //update product categories
        if(categories.length > 0){
            let rowCatStr = 'INSERT INTO products_category (category_id, product_id) VALUES ';;
            categories.forEach((item) => {
                rowCatStr += `(${item}, ${product.rows[0].id}), `;
            });

            rowCatStr =  rowCatStr.slice(0, -2) + ' RETURNING id';

            const productCats = await client.query(rowCatStr);

            if(productCats.rows.length != categories.length){
                throw new Error("Add new product failed");
            }

        }
        
        if(product.rows.length === 0){
            throw new Error("Add new product failed");
        }
        await client.query('COMMIT');

        return product;

    } catch(e) {
        await client.query('ROLLBACK');
        throw e;

    } finally {
        client.release();
    }
}

//update variants
const updateItems = async ({ product_id, title, description, price, variantArr, categories }) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const productUpdate = await client.query('UPDATE products SET title = $1, description = $2, price = $3 WHERE id = $4 RETURNING id', [title, description, price, product_id]);
        
        //remove current variants and add updated ones
        const removeVariants = await client.query('DELETE FROM product_variants WHERE product_id = $1', [product_id]);

        if(variantArr.length > 0){
            let rowStr = '';
            variantArr.forEach((obj) => {
                rowStr += `(${product_id}, ${obj.size_id}, ${obj.color_id}, ${obj.quantity}), `;
            })

            rowStr = 'INSERT INTO product_variants (product_id, size_id, color_id, quantity) VALUES ' + rowStr;
            rowStr = rowStr.slice(0, -2) + ' RETURNING id';

            const addedVars = await client.query(rowStr);

            if(addedVars.rows.length != variantArr.length){
                throw new Error("Database update failed");
            }
        }        

        //remove current categories and add updated ones
        await client.query('DELETE FROM products_category WHERE product_id = $1', [product_id]);

        if(categories.length > 0) {
            let rowCatStr = 'INSERT INTO products_category (category_id, product_id) VALUES ';
            categories.forEach((item) => {
                rowCatStr += `(${item}, ${product_id}), `;
            });

            rowCatStr = rowCatStr.slice(0, -2) + ' RETURNING id';

            const productCats = await client.query(rowCatStr);

            if(productCats.rows.length != categories.length) {
                throw new Error("Database update failed");
            }
        }        

        if(productUpdate.rows.length === 0) {
            throw new Error("Database update failed");
        }

        await client.query('COMMIT');

        return true;
    } catch(e) {
        await client.query('ROLLBACK');
        throw e;
    }finally {
        client.release();
    }
}


//delete product and it's variants
const deleteItems = async (productId) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const removeProdduct = await client.query('DELETE FROM products WHERE id = $1 RETURNING id', [productId]);

        const removeVariants = await client.query('DELETE FROM product_variants WHERE product_id = $1', [productId]);

        if(removeProdduct.lenght === 0) {
            throw new Error("Database update failed");
        }

        await client.query('COMMIT');

        return true;
    } catch(e) {
        await client.query('ROLLBACK');
        throw e;
    } finally {
        client.release();
    }
}


//delete single variant
const removeVariant = (productId, variantId) => pool.query('DELETE FROM product_variants WHERE id = $1 AND product_id = $2 RETURNING *', [variantId, productId]);

//update product
/*
const updateProduct = ({id, title, description, price, image_url, quantity}) => {
    return pool.query('UPDATE products SET title = $1, description = $2, price = $3, image_url = $4, quantity = $5 WHERE id = $6 RETURNING *', [title, description, price, image_url, quantity, id]);
}*/

//remove product 
const deleteSingleProduct = (id) => pool.query('DELETE FROM products WHERE id=$1 RETURNING *', [id]);

//get product details by id
const getProductVariants = (id) => {
    
    const query = "SELECT product_variants.id AS variant_id, product_variants.size_id, sizes.name AS size, product_variants.color_id, colors.name AS color_name, product_variants.quantity FROM product_variants INNER JOIN sizes ON product_variants.size_id = sizes.id INNER JOIN colors ON product_variants.color_id = colors.id WHERE product_variants.product_id = $1";
    
    return pool.query(query , [id]);
}

const fetchProductCats = (id) => {
    return pool.query('SELECT category.id, category.name FROM products_category JOIN category ON products_category.category_id = category.id WHERE products_category.product_id = $1', [id]);
}

const fetchSizes = () => pool.query("SELECT * FROM sizes");
const fetchColors = () => pool.query("SELECT * FROM colors");



module.exports = { fetchAllProducts, addNewProduct, findProductById, deleteSingleProduct, deleteItems, removeVariant, fetchProductSearch, getProductVariants, findVariantById, fetchSizes, fetchColors, addNewItems, updateItems, fetchProductCats };