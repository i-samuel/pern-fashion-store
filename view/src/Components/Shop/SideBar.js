import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SideBar() {

    const [ cats, setCats ] = useState([]);

    useEffect(() => {
        fetchData();
    }, [])
    console.log(cats);
    async function fetchData () {
        try{
            const response = await fetch(`/api/category`, {    
                credentials: 'include',
            });
        
            if(response.ok) {
                const jsonResponse = await response.json();
                console.log(jsonResponse);
                setCats(jsonResponse.categories);
            } else {
                alert('No Category Found');
            }
        } catch (e){
            console.log(e);
            alert('No Category Found');            
        }   
    }
    
    return(
        <div className="col-12 py-5 px-3">
            <h3 className="mb-4">Categories</h3>
            <div className="row ps-3">
            {cats.map((item, index) => (
                <div className="py-2 px-2 fs-5" key={index}><Link to={`/shop/category/${item.id}/${item.name}`}>{item.name}</Link></div>
            ))}
            </div>
        </div>
    )
}