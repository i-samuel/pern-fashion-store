import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { isLoadingAccount, loadAccount, selectAddresses, selectDefault, selectExtra, selectInfo } from "./accountSlice";
import UserInfoModal from "../../Components/AccountModals/UserInfoModal";
import AddressEditModal from "../../Components/AccountModals/AddressEditModal";
import NewAddressModal from "../../Components/AccountModals/NewAddressModal";
import './account.css';
import { addNewAddress, deleteAddress, updateAddress, updateUser } from "../../utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPlus } from "@fortawesome/free-solid-svg-icons";
import { selectUser } from "../session/sessionSlice";

export default function Account() {
    const dispatch = useDispatch();
    const user = useSelector(selectUser);
    const isLoading = useSelector(isLoadingAccount);
    
    //set Edit user modal open/close
    const [userModalOpen, setUserModalOpen] = useState(false);

    //set address edit modal open/close
    const [editAddressOpen, setEditAddressOpen] = useState(false);

    //state to manage the current editing address of the edit address modal
    const [editAddressObj, setEditAddressObj] = useState(null);

    //set new address modal open/close
    const [newAddressOpen, setNewAddressOpen] = useState(false);

    //user info from state
    const personalInfo = useSelector(selectInfo) || {email: '', first_name: '', last_name: '', username: ''};

    //all addresses 
    const shippingAddresses = useSelector(selectAddresses);

    //defaut address
    const defaultShipping = useSelector(selectDefault);

    //other addtress(non-default)
    const additionalShipping = useSelector(selectExtra);
   
    useEffect(() =>{
        if(user){
            dispatch(loadAccount(user));
        }        
    },[dispatch, user]);
    
    //User Info Edit and Update
    //open edit user info modal
    const handleOpenUserModal = () => {        
        setUserModalOpen(true);        
    }

    //close edit user info modal
    const handleCloseUserModal = () =>{
        setUserModalOpen(false);
    }

    //submit user info data
    const handlePersonInfoSubmit = async ({ first_name, last_name, email }) => {
        const updateInfo = await updateUser(personalInfo.id, first_name, last_name, email );
        if(updateInfo){
            alert('update succesfull');
            
            dispatch(loadAccount(user));
            handleCloseUserModal();
        } else {
            alert('update failed');
        }        
    }

    //Address Edit & update

    //open edit address form modal
    const handleEditAddressBtn = (addressId) => {
        setEditAddressObj(shippingAddresses.find(item => item.id === addressId));

        setEditAddressOpen(true);
    }

    //close edit address form modal
    const CloseEditAddressModal = () =>{
        setEditAddressOpen(false);

        //remove edit address object in local state
        setEditAddressObj(null);
    }

    //send update address request
    const handleAddressUpdate = async(addressStateObj) => {
        const { id, first_name, last_name, address_1, address_2, postal_code, city, state, country, isdefault } = addressStateObj;

        const reqObj = {
            firstName: first_name,
            lastName: last_name,
            address1: address_1,
            address2: address_2,
            city,
            state,
            postalCode: postal_code,
            country,
            isDefault: isdefault
        };

        const updateAdd = await updateAddress(personalInfo.id, id, reqObj);

        if(updateAdd){
            alert('update succesfull');
            
            dispatch(loadAccount(user));
            CloseEditAddressModal();
        } else {
            alert('update failed');
        }  
    }
    
    //Delele Address
    const handleAddressDelete = async (addressId) => {
        const success = await deleteAddress(personalInfo.id, addressId);
        if (success) {
            alert('delete success');
            dispatch(loadAccount(user));
        }else {
            alert('delete failed');
        }
    }

    //Add New Address

    //open new address form
    const handleNewAddressBtn = () => {
        setNewAddressOpen(true);
    }
    //close new address form
    const CloseNewAddressModal = () =>{
        setNewAddressOpen(false);
    }

    //send add new address request to server
    const handleAddressAddNew = async (newAddressObj) => {
        const { first_name, last_name, address_1, address_2, postal_code, city, state, country, isdefault } = newAddressObj;

        const reqObj = {
            firstName: first_name,
            lastName: last_name,
            address1: address_1,
            address2: address_2,
            city,
            state,
            postalCode: postal_code,
            country,
            isDefault: isdefault
        };

        const added = await addNewAddress(personalInfo.id, reqObj);
        if(added){
            alert('New Address Added');            
            dispatch(loadAccount(user));
            CloseNewAddressModal();
            return true;
        } else {
            alert('update failed');
            return false;
        }  
    }

    return(
        <>
        <div className="container">
            <div className="row mt-4 mb-5">
                <div className="col-6">
                    <h1 className="fs-4">My Account</h1> 
                </div>
            </div> 
            {/*toggle buttons*/}
            <div className="row d-flex align-items-start">
                <div className="col-4 px-4">
                    <div className="nav flex-column nav-pills me-3" id="v-pills-tab" role="tablist" aria-orientation="vertical">
                        <button className="nav-link active text-start rounded-0" 
                            id="v-pills-info-tab" data-bs-toggle="pill" 
                            data-bs-target="#v-pills-info" type="button" 
                            role="tab" aria-controls="v-pills-info" 
                            aria-selected="true">
                                General Information
                        </button>
                        <button 
                            className="nav-link text-start rounded-0" 
                            id="v-pills-shipping-tab" data-bs-toggle="pill" 
                            data-bs-target="#v-pills-shipping" type="button" 
                            role="tab" aria-controls="v-pills-shipping" 
                            aria-selected="false">
                                Shipping
                        </button>
                        
                    </div>
                </div>
                {/*Personal Info tab*/}
                <div className="col-8  tab-content" id="v-pills-tabContent">
                    <div className="col tab-pane fade show active" id="v-pills-info" role="tabpanel" aria-labelledby="v-pills-info-tab" tabIndex="0">
                            <div className="row ">
                                <div className="col-md-6 col-lg-4">
                                    <h4 className="fs-6 fw-medium text-uppercase">Email</h4>
                                    <p className="text-secondary mt-3">{personalInfo.email}</p>
                                </div>
                                <div className="col-md-6 col-lg-4 pt-3 pt-md-0">
                                    <h4 className="fs-6 fw-medium text-uppercase">Username</h4>
                                    <p className="text-secondary mt-3">{personalInfo.username}</p>
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6 col-lg-4">
                                    <h4 className="fs-6 fw-medium text-uppercase">First Name</h4>
                                    <p className="text-secondary mt-3">{personalInfo.first_name}</p>
                                </div>
                                <div className="col-md-6 col-lg-4 pt-3 pt-md-0">
                                    <h4 className="fs-6 fw-medium text-uppercase">Last Name</h4>
                                    <p className="text-secondary mt-3">{personalInfo.last_name}</p>
                                </div>
                            </div>
                            <div className="row mt-3 justify-content-end">
                                <div className="col justify-content-end">
                                    <button className="btn btn-secondary rounded-0" onClick={handleOpenUserModal}>
                                        <FontAwesomeIcon icon={faGear} style={{color: "#ffffff",}} />
                                        {' Edit Details'}
                                    </button>
                                </div>
                            </div>                                
                    </div>                       
                    
                    {/*addresss tab*/}
                    <div className="col tab-pane fade" id="v-pills-shipping" role="tabpanel" aria-labelledby="v-pills-shipping-tab" tabIndex="0">
                        {/*Default address*/}
                        <div className="row">                            
                            <div className="col">  
                                <h4 className="fs-6 fw-medium text-uppercase">Default Shipping Addresses</h4> 
                                {defaultShipping ?                      
                                <div className="row">
                                    <AddressCard editHandler={handleEditAddressBtn} deleteHandler={handleAddressDelete} addressObj={defaultShipping}/>
                                </div>
                                :
                                ''}
                            </div>                                
                        </div>
                        {/*Other Addresses*/}
                        <div className="row mt-5">                            
                            <div className="col">
                                <h4 className="fs-6 fw-medium text-uppercase">Aditional Addresses</h4>
                                <div className="row">
                                {additionalShipping ?
                                    additionalShipping.map((item, index) => 
                                        <AddressCard key={index} editHandler={handleEditAddressBtn} deleteHandler={handleAddressDelete} addressObj={item}/>
                                    ) 
                                    : ''
                                }
                                </div>
                            </div>
                        </div>
                        <div className="row mt-5">
                            <div className="col">
                                <button className="btn btn-secondary rounded-0" onClick={handleNewAddressBtn}>
                                    <FontAwesomeIcon icon={faPlus} style={{color: "#ffffff",}} />
                                    {' Add New Address'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
            {/* Modals */}
            <UserInfoModal userData={personalInfo} isOpen={userModalOpen} onSubmit={handlePersonInfoSubmit} onClose={handleCloseUserModal}/>
            <AddressEditModal addressData={editAddressObj} onSubmit={handleAddressUpdate} isOpen={editAddressOpen} onClose={CloseEditAddressModal}/>
            <NewAddressModal onSubmit={handleAddressAddNew} isOpen={newAddressOpen} onClose={CloseNewAddressModal}/>            
        </>
    )
}

//Single Address Component
const AddressCard = ({addressObj, editHandler, deleteHandler}) => {
    return (
        <div className="col-sm-6 col-md-4 col-lg-3 text-secondary address-card">
            <p className="mt-3">{`${addressObj.first_name} ${addressObj.last_name}`}</p>
            <p className="address-card-address">{addressObj.address_1}</p>

            {addressObj.address_2 ? 
            <p className="address-card-address">{addressObj.address_2}</p>
            : '' } 

            <p className="address-card-address">{`${addressObj.city}, ${addressObj.state} ${addressObj.postal_code}`}</p>
            <p className="address-card-address">{addressObj.country}</p>
            <div className="row mt-2 justify-content-start">
                <div className="col-6 pe-1">
                    <button onClick={()=> editHandler(addressObj.id)} className="btn btn-link p-0">
                        Edit
                    </button>
                </div>
                <div className="col-6 ps-1">
                    <button onClick={() => deleteHandler(addressObj.id)} className="btn btn-link p-0">
                        Delete
                    </button>
                </div>
            </div>
        </div>        
    )
}