import React, { useEffect } from "react";
import '../admin.css';
import { useDispatch, useSelector } from "react-redux";
import { isLoadingProducts, loadProducts, selectAllProducts } from "../../../features/productsList/productsListSlice";
import { Link } from "react-router-dom";

export default function AdminProducts(){
    const dispatch = useDispatch();
    const isLoading = useSelector(isLoadingProducts);
    const products = useSelector(selectAllProducts);
    
    useEffect(() => {
        dispatch(loadProducts({type: 'default'}));
    },[dispatch]);

    const deleteHandler = async (id) => {
        try{
            const response = await fetch(`/api/admin/products/${id}`, {
                method : 'DELETE',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },             
            });
        
            if(response.ok) {
                dispatch(loadProducts({type: 'default'}));
                return true;

            } else {
                return false;
            }
        } catch (e){
            console.log(e);
            return false;
        }
    }

    return(
        <>
        <h1 class="fs-3 my-5">All Products</h1>
        {products ?
    
            products.map(item => 
                (
                    <div className="card mb-3">
                    <div className="row g-0">
                        <div className="col-md-4">
                        <img src={`/uploads/${item.image_url}`} className="img-admin-card rounded-start" alt="..."/>
                        </div>
                        <div className="col-md-8">
                        <div className="card-body">
                            <h5 className="card-title">{item.title}</h5>
                            <p className="card-text"></p>
                            <p className="card-text"><small className="text-body-secondary">${item.price}</small></p>
                            <Link to={`/admin/edit-product/${item.id}`} className="btn btn-primary me-3">Edit Product</Link>
                            <button onClick={() => deleteHandler(item.id)} className="btn btn-danger">Delete </button>
                        </div>
                        </div>
                    </div>
                    </div>
                )
            )
            
            :
            ''
        }
        </>
    )

}