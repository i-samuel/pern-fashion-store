import React, { useEffect, useState } from "react";
import { fetchCategories } from "../../../utils";
import { Link, useSearchParams } from "react-router-dom";
import { isEmpty, trim } from "validator";

export default function AdminSizes() {
    const [ catList, setCatList ] = useState([]);
    const [ newCat, setNewCat ] = useState('');

    async function fetchData() {
        try{
            const response = await fetch(`/api/admin/attr/sizes`, {    
                credentials: 'include',
            });
        
            if(response.ok) {
                const jsonResponse = await response.json();
                console.log(jsonResponse);
                setCatList(jsonResponse);
            } else {
                alert('No Category Found');
            }
        } catch (e){
            console.log(e);
            alert('No Category Found');            
        }   
    }
    
    useEffect(() => {
        fetchData();
    }, [])

    //console.log(catList);
    const deleteHandler = async (id) => {
        try{
            const response = await fetch(`/api/admin/attr/sizes/${id}`, {
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
    const addNewSize = async (e) => {
        e.preventDefault();
        try{
            if(isEmpty(trim(newCat))){
              alert("Size title cannot be empty");
              return;
            }
            const response = await fetch(`/api/admin/attr/sizes`, {
                method : 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ attrName: newCat})             
            });
            if(response.ok) {
                await fetchData();
                setNewCat('');
            } else {
                alert('Add New failed');
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
                    <form onSubmit={addNewSize}>
                        <input className="me-2 py-2 rounded" type="text" value={newCat} onChange={(e) => setNewCat(e.target.value)}/>
                        <button type="submit" className="btn btn-dark" >Add New</button>
                    </form>
                        
                </div>
            </div>
            <div className="row">
                
                {catList.map((item) =>(
                <div className="col-12 py-3 px-3 mb-2 border border-dark-subtle rounded">
                    <h4>{item.name}</h4>
                    <Link className="btn btn-primary me-3" to={`/admin/attr/sizes/${item.id}`}>Edit</Link>   
                    <button onClick={() => deleteHandler(item.id)} className="btn btn-danger">Delete</button> 
                </div>
                )
                )}           
                
            </div>
        </>
    )
}