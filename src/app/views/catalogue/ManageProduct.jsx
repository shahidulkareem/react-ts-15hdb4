import React, { useState } from 'react';
import Product from './Product'
import ListProduct from './ListProduct';

const ManageProduct = () => {
    const [showProduct, setshowProduct] = useState(false)
    const [productId, setProductId] = useState('')

    const productEdit = (id) => {
        setshowProduct(!showProduct)
        setProductId(id)
    }

    const productAdd = () => {
        setshowProduct(!showProduct)
        setProductId('')
    }

    const productManage = () => {
        setshowProduct(!showProduct)
    }


    return (
        <div>
            {
                showProduct ?
                    <Product
                        productEdit={productEdit}
                        productAdd={productAdd}
                        productManage={productManage}
                        isNewProduct={productId}
                    />
                    :
                    <ListProduct
                        productEdit={productEdit}
                        productAdd={productAdd}
                    />
            }
        </div>
    )
}

export default ManageProduct;