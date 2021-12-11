import React from 'react';
import { Breadcrumb } from "@gull";

const Reports = () => {
    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Dashboard", path: "/" },
                    { name: "Reports" }
                ]}
            />
        </>
    )
}

export default Reports;