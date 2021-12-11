import React, { useState } from 'react';
import Offer from './Offer'
import ManageOffer from './ManageOffer';

const DiscountsOffer = () => {
    const [showEditOffer, setShowEditOffer] = useState(false)
    const [OfferId, setOfferId] = useState('')

    const offerEdit = (id) => {
        setShowEditOffer(!showEditOffer)
        setOfferId(id)
    }

    const offerAdd = () => {
        setShowEditOffer(!showEditOffer)
        setOfferId('')
    }

    const offerManage = () => {
        setShowEditOffer(!showEditOffer)
    }


    return (
        <div>
            {
                showEditOffer ?
                    <Offer
                        offerEdit={offerEdit}
                        offerAdd={offerAdd}
                        offerManage={offerManage}
                        isNewOffer={OfferId}
                    />
                    :
                    <ManageOffer
                        offerEdit={offerEdit}
                        offerAdd={offerAdd}
                    />
            }
        </div>
    )
}

export default DiscountsOffer;