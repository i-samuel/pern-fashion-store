import React from "react";
import ProductCard from "../ProductCard/ProductCard";

export default function ProductsList({itemArr, limit}) {
    console.log('items', itemArr);
    return(
        <div className="row gx-5 gy-5">
            {itemArr.map((item, index) =>
                <ProductCard key={index} product={item}/>
            )}
        </div> 
    )
}