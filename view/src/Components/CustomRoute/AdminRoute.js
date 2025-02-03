import React from "react";
import { useSelector } from "react-redux";
import { selectSession, selectUser } from "../../features/session/sessionSlice";
import { Navigate } from "react-router-dom";
//import { fetchSession } from "../../utils";

export default function AdminRoute ({ children }) {
    const session = useSelector(selectSession);

    if(!session.user || session.role !== 'admin') {
        return <Navigate to="/"/>
    }
    return children;
}