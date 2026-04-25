import React from "react";
import { useState, useEffect} from "react";
import AuthForm from "../Components/AuthForm";

const AuthPage = ({route,initialMethod}) =>{
    const[method, setMethod] = useState(initialMethod);
    

    useEffect(() =>{
        setMethod(initialMethod);

    },[initialMethod]);

    const eoute = method === 'login'? '/api/token' : '/api/user/register/';

    return(
        <div>
            <AuthForm route={route} method={method} />
        </div>
    );
};
export default AuthPage;