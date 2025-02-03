import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { isEmpty, trim } from "validator";

export default function EditCategory() {
    const { id } = useParams();
    const [ name, setName ] = useState('');

    async function fetchData() {
        try{
            const response = await fetch(`/api/category/${id}`, {    
                credentials: 'include',
            });
        
            if(response.ok) {
                const jsonResponse = await response.json();
                setName(jsonResponse.name);
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


    const editOnClick = async () => {
        try{
            if(isEmpty(trim(name))){
                alert("Name cannot be empty")
                return; 
            }
            console.log('here');
            const response = await fetch(`/api/category/${id}`, {
                method: 'PUT',    
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ category: name})        
            });
        
            if(response.ok) {
                alert("Successfully updated")
                
            } else {
                alert('Update failed');
                await fetchData();
            }
        } catch (e){
            console.log(e);
            alert('Update failed');            
        }   
    }

    return(
        <>
            <Link className="fs-5" to="/admin/categories">{`<< Back to Categories`}</Link>
            <div className="container ps-4 pt-5">
                <input className="py-2 px-3 fs-5 rounded" value={name} onChange={(e) =>setName(e.target.value)}/>
                <button className="btn d-block mt-3 btn-primary" onClick={editOnClick}>Update</button>
            </div>
        </>
    )
}