import React, { useEffect, useState } from "react";
import { fetchCategories } from "../../../utils";
import { Link, useSearchParams } from "react-router-dom";
import { isEmpty, trim } from "validator";

export default function AdminCategories() {
    const [ catList, setCatList ] = useState([]);
    const [ newCat, setNewCat ] = useState('');

    async function fetchData() {
        const response = await fetchCategories();
        console.log('res', response);
        if(response){
            setCatList(response);
        }      
    }
    
    useEffect(() => {
        fetchData();
    }, [])

    //console.log(catList);
    const deleteHandler = async (id) => {
        try{
            const response = await fetch(`/api/category/${id}`, {
                method : 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },             
            });
        
            if(response.ok) {
                setCatList(prev => prev.filter(item => item.id !== id));
                
            } else {
                alert('Delete failed');
            }
        } catch (e){
            console.log(e);
            alert('Delete failed');
            
        }
    }

    //add new category
    const addNewCategory = async (e) => {
        e.preventDefault();
        try{
            if(isEmpty(trim(newCat))){
              alert("Category title cannot be empty");
              return;
            }
            const response = await fetch(`/api/category`, {
                method : 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ category: newCat})             
            });
            if(response.ok) {
                await fetchData();
                setNewCat('');
            } else {
                alert('Add New 3 failed');
            }

        } catch(e){
            console.log(e);
            alert('Add New failed');
        }
    }

    return(
        <>
            <div className="row mb-4">
                <div className="col-12">
                    <form onSubmit={addNewCategory}>
                        <input className="me-2 py-2 rounded" type="text" value={newCat} onChange={(e) => setNewCat(e.target.value)}/>
                        <button type="submit" className="btn btn-dark" >Add New</button>
                    </form>
                    
                </div>
            </div>
            <div className="row">
                
                {catList.map((item) =>(
                <div className="col-12 py-3 px-3 mb-2 border border-dark-subtle rounded">
                    <h4>{item.name}</h4>
                    <Link className="btn btn-primary me-3" to={`/admin/categories/${item.id}`}>Edit</Link>   
                    <button onClick={() => deleteHandler(item.id)} className="btn btn-danger">Delete</button> 
                </div>
                )
                )}           
                
            </div>
        </>
    )
}