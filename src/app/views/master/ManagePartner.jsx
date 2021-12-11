import React, { useState } from 'react'
import Partner from './Partner';
import ListPartner from './ListPartner';

const ManagePartner = () => {
    const [showPartner, setShowPartner] = useState(false)
    const [partnerId, setPartnerId] = useState('')

    const partnerEdit = (id) => {
        setShowPartner(!showPartner)
        setPartnerId(id)
    }

    const partnerAdd = () => {
        setShowPartner(!showPartner)
        setPartnerId('')
    }

    const partnerManage = () => {
        setShowPartner(!showPartner)
    }

    return (
        <>
            {
                showPartner ?
                    <Partner
                        isNewPartner={partnerId}
                        partnerEdit={partnerEdit}
                        partnerAdd={partnerAdd}
                        partnerManage={partnerManage}
                    />
                    :
                    <ListPartner
                        partnerEdit={partnerEdit}
                        partnerAdd={partnerAdd}
                    />
            }
        </>
    )
}

export default ManagePartner;