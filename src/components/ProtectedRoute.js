import React from "react";
import { Route, Redirect } from 'react-router-dom';

function ProtectedRoute({ component: Component, path, ...props }) {
    return (
        <Route path={path}>
            {() =>
                props.loggedIn ? <Component {...props} /> : <Redirect to='./sign-in' />
            }
        </Route>
    )
}

export default ProtectedRoute;