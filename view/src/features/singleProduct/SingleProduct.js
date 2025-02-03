import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { isLoadingProduct, loadProductData, selectProductData, selectProductVariants, emptyVariants } from "./singleProductSlice";
import { updateCart } from "../../utils";

export default function SingleProduct() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [ cartCount, setCartCount ] = useState(1);
    const [ quantity, setQuantity ] = useState(0);
    const [ color, setColor ] = useState(null);
    const [ currSizeIndex, setCurrSizeIndex ] = useState(null);  

    const isLoading = useSelector(isLoadingProduct);
    let product = useSelector(selectProductData);       
    const variants = useSelector(selectProductVariants);
    const {  title, price, description, image_url  } = product.data || {};
  
    useEffect(() => {
        dispatch(emptyVariants());
    },[id]);
   
    useEffect(() => {
        dispatch(loadProductData(id));
    },[dispatch, id])
   
    useEffect(() => {
        if(Object.keys(product).length > 0 && product.data.id == id){            
            if(Object.keys(variants).length > 0){
                setColor(Object.keys(variants)[0]);
                setQuantity(variants[Object.keys(variants)[0]][0]['quantity']);
            }            
        } 
    },[product])


    useEffect(() => {
        if(color && (Object.keys(variants).length > 0)) {
            setCurrSizeIndex(0);
            setQuantity(variants[color][0]['quantity']);
            setCartCount(1);
        }
    },[color]);

    useEffect(() => {
        if(color){
            setQuantity(variants[color][currSizeIndex]['quantity']);
            setCartCount(1);
        }        
    }, [currSizeIndex]);

    //Add to Cart
    const handeAddToCart = async () => {
        if(cartCount > 0){
            const status = await updateCart(variants[color][currSizeIndex]["variant_id"], cartCount);
            if(status) {
                alert('success');
            } else {
                alert('failed');
            }
        }        
    }    

    //increment count
    const incrementCount = () => {
        if(quantity > cartCount) {
            setCartCount(cartCount + 1);
        }
    }

    //decrement count
    const decrementCount = () => {
        if (cartCount > 1) {
            setCartCount(cartCount - 1);
        }
    }

    //handle input change
    const handleChange = (e) => {
        if(e.target.value == '') {
            setCartCount(1);
            
        } else {
            const val = parseInt(e.target.value);
            if(val > quantity) {
                alert(`only ${quantity} available in stock`);
                setCartCount(quantity);
            } else if(val < 1) {
                setCartCount(1);
            }  else {
                setCartCount(val);
            }
        }        
    }

    const colorList = (obj) => {
        let arr = [];
        for(const item in obj) {
            arr.push((<option value={item}>{obj[item][0].color_name}</option>));
        }
        return arr;
    }

    const handleColorChange = (e) => {
        setColor(e.target.value);
        setCurrSizeIndex(0);
    }
    
    const handleSizeChange = (e) => {
        setCurrSizeIndex(e.target.value);
    }

    if (isLoading) {
        return <p>Loading Data</p>
    }

    return(
        <div className="container">
            <div className="row mt-4 gx-5 gy-4">
                <div className="col-sm-6 col-lg-7">
                    <img className="img-fluid" alt={title} src={`/uploads/${image_url}`}/>
                </div>
                <div className="col-sm-6 col-lg-5">
                    <h1 className="display-6">{title}</h1>
                    <p className="h5 mt-4">{`$${price}`}</p>
                    <hr/>
                    {color && (Object.keys(variants).length > 0) ? 
                    <div className="row mb-2">
                        <div className="col-6">
                            <label>Color:</label>
                            <select onChange={handleColorChange} className="form-select text-capitalize" aria-label="select color">
                                {colorList(variants)}
                            </select>
                        </div>                        
                    </div>
                    : ''
                    }
                    {color && (Object.keys(variants).length > 0) ? 
                    (<div className="row">
                        <div className="col-6">
                            <label>Sizes:</label>
                            <select onChange={handleSizeChange} className="form-select text-capitalize" aria-label="select color" value={currSizeIndex}>
                                {variants[color].map((item, index) => 
                                    (<option key={index} value={index}>{item["size"]}</option>)
                                )}
                            </select>
                        </div>                        
                    </div>) : ''
                    }
                    <div className="row mb-4">
                        <div className="col">
                        {quantity > 0 ?
                            <>                              
                                <div className="row mt-5">
                                    <div className="col d-flex cart-count-parent">              
                                        <button onClick={decrementCount} className="btn btn-secondary px-auto py-0 rounded-0 text-center" >-</button>                    
                                        <input className="form-control rounded-0 px-0 text-center" type="number" value={cartCount} min="0" 
                                        max={quantity}
                                        onChange={handleChange}/>
                                        <button onClick={incrementCount} className="btn btn-secondary px-auto py-0 rounded-0 text-center">+</button>                   
                                    </div>
                                </div>
                                <div className="row mt-3">
                                    <div className="col mt-4 mb-3">
                                        <button onClick={handeAddToCart} className="btn btn-dark px-5 py-2 w-100 fs-5 rounded-0">Add to Cart</button>
                                    </div>
                                </div>  
                            </>                
                     : 
                            <p className="text-danger ">Product Out of Stock</p>
                    }
                        </div>
                    </div>                    
                    <p className="lead fs-5 fs-md-4">{description}</p>                     
                </div>
            </div>
        </div>        
    )
}