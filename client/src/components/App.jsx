import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import _ from 'underscore';
import Product from './po_components/Product.jsx';
import Related from './ri_components/RelatedItemsAndOutfits.jsx';
import Reviews from './rr_components/Reviews.jsx';
import calculateStarRating from '../starRating.js';

const App = () => {
  const [currentItemID, setCurrentItemID] = useState(40344);
  const [currentItem, setCurrentItem] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [metaData, setMetaData] = useState({});
  const [reviewCount, setReviewCount] = useState(0);
  const [averageRating, setAverageRating] = useState(0);
  const [allReviews, setAllReviews] = useState({});
  const [reviews, setReviews] = useState({});
  const [averageStarRating, setAverageStarRating] = useState(<div />);
  const ref = useRef(null);

  useEffect(() => {
    axios.get(`product/?id=${currentItemID}`)
      .then((results) => {
        setCurrentItem(results.data);
        setIsLoading(false);
      })
      .catch((err) => { console.log(err); });
  }, [currentItemID]);

  useEffect(() => {
    axios.get('/reviewdata', { params: { product_id: currentItemID } })
      .then((data) => {
        const recommended = parseInt(data.data.recommended.true, 10) || 0;
        const notRecommended = parseInt(data.data.recommended.false, 10) || 0;
        const count = notRecommended + recommended;
        let allRatings = 0;
        if (Object.keys(data.data.ratings).length === 0) {
          setAverageRating(0);
        } else {
          _.each(data.data.ratings, (rating, i) => {
            allRatings += rating * i;
          });
          setAverageRating(Math.round((allRatings / count) * 10) / 10);
        }
        setMetaData(data.data);
        setAverageRating(Math.round((allRatings / count) * 10) / 10);
        setAverageStarRating(calculateStarRating(Math.round((allRatings / count) * 10) / 10));
      })
      .catch((err) => { console.log(err); });

    axios.get('/reviews', {
      params: {
        product_id: currentItemID,
        sort: 'relevance',
        count: 999999,
      },
    }).then((results) => {
      setAllReviews(results.data);
      setReviews(results.data.results.slice(0, 2));
      setReviewCount(results.data.results.length);
    })
      .catch((err) => { console.log(err); });
  }, [currentItem]);

  const scrollToReviews = () => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  if (isLoading) {
    return (<div>Loading</div>);
  }

  return (
    <div>
      <div className="page-top">
        <div className="title-text">Lucky & Charm</div>
        <div className="categories">
          <div>New Arrivals</div>
          <div>Pants</div>
          <div>Jackets</div>
          <div>Kicks</div>
          <div>Dress shoes</div>
          <div>Accesories</div>
        </div>
      </div>
      <div id="merchandise-directory">
        {' > '}
        New Arrivals
      </div>
      <Product
        currentItem={currentItem}
        scrollToReviews={scrollToReviews}
        averageRating={averageRating}
        reviewCount={reviewCount}
        averageStarRating={averageStarRating}
      />
      <Related
        currentItem={currentItem}
        setCurrentItemID={setCurrentItemID}
        getStars={calculateStarRating}
      />
      <div ref={ref}>
        <Reviews
          currentItem={currentItem}
          data={metaData}
          count={reviewCount}
          averageRating={averageRating}
          allReviews={allReviews}
          reviews={reviews}
          setAllReviews={setAllReviews}
          setReviews={setReviews}
          averageStarRating={averageStarRating}
        />
      </div>
    </div>
  );
};

export default App;
