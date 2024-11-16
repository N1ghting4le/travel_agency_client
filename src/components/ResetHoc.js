'use client';

import { useState } from "react";

const ResetHoc = (Component) => function WrappedComponent(props) {
    const [resetKey, setResetKey] = useState(0);
    
    return <Component key={resetKey} {...props} reset={() => setResetKey(val => val + 1)}/>;
}

export default ResetHoc;