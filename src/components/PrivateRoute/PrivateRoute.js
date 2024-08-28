// import React from 'react';
// import { Route, Navigate } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// export function PrivateRoute({ element: Component, ...rest }) {
//     const isAuthenticated = useSelector((store) => store.USERINFO.userInfo?.isAuthenticated);

//     return (
//         <Route
//             {...rest}
//             element={isAuthenticated ? <Component /> : <Navigate to="/login" />}
//         />
//     );
// }


import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export function PrivateRoute({ element: Component, ...rest }) {
    const isAuthenticated = useSelector((store) => store.USERINFO.userInfo?.isAuthenticated);

    return (
        <Route
            {...rest}
            element={isAuthenticated ? <Component /> : <Navigate to="/login" />}
        />
    );
}
