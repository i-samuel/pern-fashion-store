import React from "react";
import { Link } from "react-router-dom";
import './productCard.css';

export default function ProductCard({ product }) {
    const { id, title, price, image_url } = product;
    
    return(
        <div className="col-6 col-lg-4 product-card px-4 py-3">
            <div className="card border-0 text-start">
                <div className="product-card-img text-center justify-content-center">
                    <Link to={`/product/${id}/${title.replaceAll(" ", "-")}`}>
                        <img className="card-img-top" alt="title" src={`/uploads/${image_url}`}/>
                    </Link> 
                </div>
                <div className="product-card-content mt-3">             
                    <h3 className="card-title product-card fs-6 fs-md-5">
                        <Link to={`/product/${id}/${title.replaceAll(" ", "-")}`}>
                            {title}
                        </Link>
                    </h3>
                    </div>  
                <span className="fs-6">{`$${price}`}</span>                
            </div>
        </div>        
    );
}