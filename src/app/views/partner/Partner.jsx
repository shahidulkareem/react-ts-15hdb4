import React, { useState } from 'react'
import EditPartner from './NewPartner';
import ManagePartner from './ManagePartner';

const Partner = () => {
    const [showEditPartner, setShowEditPartner] = useState(false)
    const [partnerId, setPartnerId] = useState('')

    const partnerEdit = (id) => {
        console.log(id);
        setShowEditPartner(!showEditPartner)
        setPartnerId(id)
    }

    return (
        <>
            {
                showEditPartner ?
                    <EditPartner
                        partnerEdit={partnerEdit}
                        isNewPartner={partnerId}
                    />
                    :
                    <ManagePartner
                        partnerEdit={partnerEdit}
                    />
            }
        </>
    )
}

export default Partner;