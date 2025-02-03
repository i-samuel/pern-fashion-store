import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { fetchAttrCats, fetchAttributes } from "../../../utils";
import { isEmpty, escape, trim } from "validator";
import { Link, useNavigate } from "react-router-dom";

export default function AddNewProduct() {
    const navigate = useNavigate();
    const [ attributes, setAttributes] = useState(null);
    const [ cats, setCats ] = useState([]);
    const [ variants, setVariants ] = useState({});

    const [varList, setVarList ] = useState([]);

    const [ product, setProduct ] = useState({ 
        title: '',
        description: '',
        price: 0,
        image: '',
    });

    const[ productCats, setProductCats ] = useState([]);

    const [ newVariant, setNewVariant ] = useState({
        color: null,
        size: null,
        quantity: 1
    })


    useEffect(() => {
        async function fetchData() {
            const response = await fetchAttrCats();
            
            return response;
        }
        fetchData().then((res)=>{
            setAttributes(res.attr);
            setCats(res.cats);
        }).catch((e)=>{
            console.log(e);
        })
    }, []);

    useEffect(() => {
        if(attributes){
            const colIds = Object.keys(attributes['colors']);
            const sizeIds = Object.keys(attributes['sizes']);
            setNewVariant({
                color: colIds.length > 0 ? colIds[0] : null,
                size: sizeIds.length > 0 ? sizeIds[0] : null,
                quantity: 1
            });
        }
    },[attributes])
   
    useEffect(() => {
        
        if(attributes && variants){
            setVarList(variantList(variants));
        }
        
    }, [variants, attributes]);

  
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevObj) => ({...prevObj, [name] : value}));
    };
 
    const handleFileChange = (e) => {
        const [file] = e.target.files;
        setProduct((prev) => ({...prev, image: file}));
    }

    const handleCatCheck = (e) => {
        console.log(e.target.checked);
        /*if(e.target.checked === true){
            setProductCats(prev => [...prev, e.target.value]);
        } else {
            setProductCats(prev => prev.filter((id) => id !== e.target.value));
        }*/
        if(productCats.includes(parseInt(e.target.value))){
            setProductCats(prev => prev.filter((id) => id !== parseInt(e.target.value)));
        } else {
            setProductCats(prev => [...prev, parseInt(e.target.value)]);
        }
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if(isEmpty(trim(product['title']))){
            alert('Title cannot be empty');
            return;
        } 
        if(parseFloat(product['price']) <= 0){
            alert('Price must be greater than 0');
            return;
        }
        const formData = new FormData();
        for(const key in product){
            formData.append(key, product[key]);
        }
        
        const variantArr = [];
        for(let color in variants){
            for(let size in variants[color]){
                if(parseInt(variants[color][size]) < 0){
                    alert(`Color: ${attributes['colors'][color]}, Size: ${attributes['sizes'][size]} quantity must be greater than 0`);
                    return;
                }
                variantArr.push({
                    size_id: parseInt(size),
                    color_id: parseInt(color),
                    quantity: parseInt(variants[color][size])
                })
            }
        }

        formData.append('variantArr', JSON.stringify(variantArr));
        formData.append('catsArr', JSON.stringify(productCats));

        const response = await fetch('/api/admin/products/', {
            method : 'POST',
            credentials: 'include',
            body: formData
        });

        if(response.ok){
            const jsonResponse = await response.json();
            alert('Added New Product succesfully');
            navigate(`/admin/edit-product/${jsonResponse.id}`)
        } else {
            alert('Failed!!! Please check details and try again');
        }
        
    }
    
    //variant quantity count input handler
    const handleVarCountChange = (color, size, quantity) => {
        setVariants((prev) => ({...prev, 
            [color]: {...prev[color], [size]: quantity}}));
    }

    //remove variant
    const removeVariant = (color, size) => {
        const newObj = variants;
        console.log('old', newObj);
        delete newObj[color][size];
        console.log('new', newObj);
        setVariants(newObj);
        setVarList(variantList(variants));
    }

    const variantList = (obj) => {
        let arr = [];
        for(let colorId in obj) {
            for(let sizeId in obj[colorId]){
                arr.push(
                    (<div id={colorId}>
                        <input class="col-3 me-3" type="text" value={attributes['colors'][colorId]} readOnly={true}/>
                        <input class="col-3 me-3" type="text" value={attributes['sizes'][sizeId]}  readOnly={true}/>
                        <input class="col-2 me-3" type="number" value={obj[colorId][sizeId]} onChange={(e) => handleVarCountChange(colorId, sizeId, e.target.value)}/>
                        <button class="btn btn-danger fs-6" onClick={()=> removeVariant(colorId, sizeId)}>X</button>
                    </div>)
                )
            }
        }
        return arr;
    }

    const attrList = (obj) => {
        let arr = [];
        for(const item in obj) {
            arr.push((<option value={item}>{obj[item]}</option>));
        }
        return arr;
    }
    
    const handleNewVariant = (key, value) => {
        setNewVariant(prev => ({...prev, [key]: value}));
    }
    console.log(newVariant);

    const submitNewVariant = () => {
        if(newVariant['color'] && newVariant['size'] && newVariant['quantity'] > 0){
            setVariants(prev => ({...prev, [newVariant['color']]: {
                ...prev[newVariant['color']], [newVariant['size']]: newVariant['quantity']
            }}));
        }
    }

    return (
        <>
            <Link className="fs-5" to="/admin/products">{`<< Back to Products`}</Link>
            <h1 class="fs-3 my-5">Add New Product</h1>
            <div className="row g-3">
                <div className="col-12">
                    <label for="title" className="form-label">Title</label>
                    <input type="text" name="title" className="form-control" onChange={handleInputChange} id="title" value={product.title} placeholder="Enter Title" required/>
                </div>
                <div className="col-12">
                    <label for="price" className="form-label">Price</label>
                    <input type="number" name="price" className="form-control" onChange={handleInputChange} id="price" value={product.price} placeholder="Enter Description"/>
                </div>
                <div className="col-12">
                    <label for="image" className="form-label">Product Image</label>
                    <input type="file" name="image" onChange={handleFileChange} className="form-control" id="image" placeholder="Upload Product Image" accept="image/png, image/jpeg" required/>
                </div>
                <div className="col-12">
                    <label for="description" className="form-label">Description</label>
                    <textarea name="description" className="form-control" onChange={handleInputChange} id="description" value={product.description} rows="8" placeholder="Enter Description"/>
                </div>
                <hr className="text-secondary my-5"></hr>
                <h4 className="fs-4">Colors and Sizes</h4>
                
                {attributes && varList ? varList.map(item => item) : ''}

                <hr className="text-secondary my-5"></hr>
                {attributes ? 
                <>
                <h5 className="fs-5">Add New Variant</h5>
                    <div className="col-3">
                        <label>Color:</label>
                        <select onChange={(e) => handleNewVariant('color', e.target.value)} className="form-select text-capitalize" aria-label="select color">
                            {attrList(attributes['colors'])}
                        </select>
                    </div> 
                    <div className="col-3">
                        <label>Size:</label>
                        <select onChange={(e) => handleNewVariant('size', e.target.value)} className="form-select text-capitalize" aria-label="select color">
                            {attrList(attributes['sizes'])}
                        </select>
                    </div> 
                    <div className="col-3">
                        <label>Quantity:</label>
                        <input className="form-control" type="number" min="1" value={newVariant['quantity']} onChange={(e) => handleNewVariant('quantity', e.target.value)}/>
                    </div> 
                    <div className="col-3 pt-3">
                        <button onClick={submitNewVariant} className="btn btn-primary">+</button> 
                    </div>
                    
                </>
                : '' }
                
                <hr className="text-secondary my-5"></hr>
                
                <h5 className="fs-5 mb-4">Select Categories</h5>
                <div className="row">
                    {cats.map(item => (
                        <div className="form-check mb-2">
                            <input className="form-check-input" type="checkbox" value={item.id} id={item.id} onChange={handleCatCheck}/>
                            <label className="form-check-label" for={item.id}>
                            {item.name}
                            </label>
                        </div>
                    ))}
                </div>
                <hr className="text-secondary my-5"></hr>
                <button onClick={handleSubmit} className="btn btn-primary">Submit</button>
                
                </div>
        </>
    )
}