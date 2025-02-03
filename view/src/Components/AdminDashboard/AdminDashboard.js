import React from "react";
import { Link, Outlet } from "react-router-dom";

export default function AdminDashboard() {
    return(
        <div className="container">            
            <div className="row">
                <div className="col-4 px-3 py-4">
                    <h2 className="mb-5">Dashboard</h2>
                    <h3 className="mb-3"><Link to="/admin/products">All Products</Link></h3>
                    <h3 className="mb-3"><Link to="/admin/add-new-product">Add New Product</Link></h3>
                    <h3 className="mb-3"><Link to="/admin/categories">Categories</Link></h3>
                    <h3 className="mb-3"><Link to="/admin/attr/sizes">Sizes</Link></h3>
                    <h3 className="mb-3"><Link to="/admin/attr/colors">Colors</Link></h3>
                </div>
                <div className="col-8 py-5">
                    <Outlet/>
                </div>
            </div>           
        </div>
        
    )
}