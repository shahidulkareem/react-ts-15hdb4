import React from 'react';
import { Breadcrumb } from "@gull";

const Settings = () => {
    return (
        <>
            <Breadcrumb
                routeSegments={[
                    { name: "Dashboard", path: "/" },
                    { name: "Settings" }
                ]}
            />
        </>
    )
}

export default Settings;