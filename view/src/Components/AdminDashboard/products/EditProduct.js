import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isLoadingProduct, loadProductData, selectProductData, selectProductVariants } from "../../../features/singleProduct/singleProductSlice";
import { Link, useParams } from "react-router-dom";
import { fetchAttrCats, fetchAttributes } from "../../../utils";
import { isEmpty, trim } from "validator";

export default function EditProduct(){
    const { id } = useParams();
    const dispatch = useDispatch();

    const isLoading = useSelector(isLoadingProduct);
    let productData = useSelector(selectProductData);
    let productVariants = useSelector(selectProductVariants); 
    const [ attributes, setAttributes] = useState(null);
    const [ cats, setCats ] = useState([]);
    const [varList, setVarList ] = useState([]);
    const [ product, setProduct ] = useState({ 
            id: '',
            title: '',
            description: '',
            price: 0,
            image: '',
        });
    const[ productCats, setProductCats ] = useState([]);
    const [ variants, setVariants ] = useState({});
    const [ newVariant, setNewVariant ] = useState({
        color: null,
        size: null,
        quantity: 1
    })

    useEffect(() => {
        dispatch(loadProductData(id));        
    },[dispatch, id])

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
    }, [])

    useEffect(() =>{
            if(Object.keys(productData).length > 0 && productData.data.id == id){
                setProduct({
                    id,
                    title: productData['data']['title'],
                    description: productData['data'].description,
                    price: parseFloat(productData['data'].price),
                    image: productData['data'].image_url,
                });
                const variantObj = {};
                for(let color in productVariants){
                    variantObj[color] = {};
                    productVariants[color].forEach((item => {
                        variantObj[color][item['size_id']] = item['quantity'];
                    }))
                }
                setVariants(variantObj);

                const arr = productData.categories.map(item => item.id);
                setProductCats(arr);
                //console.log('vars', variantObj);
            }
    }, [productData])

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
    console.log(productData);
    console.log(attributes);
    console.log('product', product);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct((prevObj) => ({...prevObj, [name] : value}));
    };

    const handleCatCheck = (e) => {
        
        /*if(e.target.checked === true){
            setProductCats(prev => [...prev, parseInt(e.target.value)]);
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
        /*
        const formData = new FormData();
        for(const key in product){
            formData.append(key, product[key]);
        }*/
        
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

        //formData.append('variantArr', JSON.stringify(variantArr));

        const response = await fetch(`/api/admin/products/${id}`, {
            method : 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({...product, variantArr, catsArr: productCats })
        }

        );
        if(response.ok){            
            alert('Product Updated succesfully');
            
        } else {
            alert('Failed!!! Please check details and try again');
        }
        dispatch(loadProductData(id));
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
                        <input className="col-3 me-3" type="text" value={attributes['colors'][colorId]} readOnly={true}/>
                        <input className="col-3 me-3" type="text" value={attributes['sizes'][sizeId]}  readOnly={true}/>
                        <input className="col-2 me-3" type="number" value={obj[colorId][sizeId]} onChange={(e) => handleVarCountChange(colorId, sizeId, e.target.value)}/>
                        <button className="btn btn-danger fs-6" onClick={()=> removeVariant(colorId, sizeId)}>X</button>
                    </div>)
                )
            }
        }
        return arr;
    }
    console.log(productCats);
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
            <h1 className="fs-3 my-5">Edit Product</h1>
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
                    <input type="file" name="image" className="form-control" id="image" placeholder="Upload Product Image" accept="image/png, image/jpeg" required/>
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
                
                <h5 className="fs-5 mb-4">Categories</h5>
                <div className="row">
                    {cats.map(item => (
                        <div className="form-check mb-2">
                            <input className="form-check-input" type="checkbox" value={item.id} id={item.id} onChange={handleCatCheck} checked={productCats.includes(item.id)}/>
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