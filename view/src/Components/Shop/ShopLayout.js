import React from "react";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

export default function ShopLayout() {
    return(
        <div className="container">
            <div className="row">
                <div className="col-md-3">
                    <SideBar/>
                </div>
                <div className="col-md-9">
                    <Outlet/>
                </div>
            </div>
        </div>
        
    )
}