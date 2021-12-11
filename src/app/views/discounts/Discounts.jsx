import React from 'react';
import { Breadcrumb } from "@gull";

const Discounts = () => {
    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Dashboard", path: "/" },
                    { name: "Discounts" }
                ]}
            />
        </>
    )
}

export default Discounts;