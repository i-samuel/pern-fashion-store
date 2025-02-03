const pool = require("./database");


const fetchAttrList = (type) => pool.query(`SELECT * FROM ${type}`);

const fetchSingleAttr = (type, id) => pool.query(`SELECT * FROM ${type} WHERE id = $1`, [id]);

const insertNewAttr = (type, name) => pool.query(`INSERT INTO ${type} (name) VALUES ($1) RETURNING *`, [name]);

const updateAttrVal = (type, id, name) => pool.query(`UPDATE ${type} SET name = $1 WHERE id = $2 RETURNING *`, [name, id]);

const removeAttr = (type, id) => pool.query(`DELETE FROM ${type} WHERE id= $1 RETURNING *`, [id]);


module.exports = { fetchAttrList, removeAttr, fetchSingleAttr, insertNewAttr, updateAttrVal };