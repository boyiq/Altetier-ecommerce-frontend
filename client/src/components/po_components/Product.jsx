import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Info from './Info.jsx';
import Gallery from './Gallery.jsx';
import AdditionalInfo from './AdditionalInfo.jsx';
import StyleSelector from './StyleSelector.jsx';
import Cart from './Cart.jsx';

const Product = ({ currentItem }) => {
//  Example data to use for now
  const [isLoading, setIsLoading] = useState(true);
  const [productStyles, setProductStyles] = useState([]);
  const product = currentItem;

  useEffect(() => {
    axios.get('/productstyles', { params: { id: product.id } })
      .then((response) => {
        console.log(response.data.results);
        setProductStyles(response.data.results);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  if (isLoading) {
    return (<div>Loading</div>);
  }

  return (
    <div id="AllPO">
      <div id="PO">
        <div id="imageGallery">
          <Gallery product={product} />
        </div>
        <div id="sideInfo">
          <Info product={product} />
          <StyleSelector productStyles={productStyles} />
          <Cart productStyles={productStyles} />
        </div>
      </div>
      <AdditionalInfo product={product} />
    </div>
  );
};

export default Product;
