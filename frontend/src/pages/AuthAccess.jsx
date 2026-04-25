import React from 'react';
import {Navigate} from 'react-router-dom';
import { useAuthentication } from '../Auth';

function ProtectedRoute({children}){
    const {isAuthorized} = useAuthentication();
    if(isAuthorized === null ){
        return <div> loading..........</div>

    }
    if(
        isAuthorized &&
        (window.location.pathname === "/login" ||
            window.location.pathname === "/register"
        )

        
    ){
        return children;
    }

}
export default ProtectedRoute;