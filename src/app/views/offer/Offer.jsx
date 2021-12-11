import React, { useState } from 'react'
import EditOffer from './AddOffer';
import ManageOffer from './ManageOffer';

const Offer = () => {
    const [showEditOffer, setShowEditOffer] = useState(false)
    const [OfferId, setOfferId] = useState('')

    const offerEdit = (id) => {
        setShowEditOffer(!showEditOffer)
        setOfferId(id)
    }

    return (
        <>
            {
                showEditOffer ?
                    <EditOffer
                        offerEdit={offerEdit}
                        isNewOffer={OfferId}
                    />
                    :
                    <ManageOffer
                        offerEdit={offerEdit}
                    />
            }
        </>
    )
}

export default Offer;