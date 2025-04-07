import React from 'react'
import EventSlider from './EventNavbar/EventSlider';
import SpecialOffers from './specialOffers/SpecialOffers';
import Products from './products/Products';

export default function Body() {
    return (
        <div className='body'>
            <EventSlider />
            <SpecialOffers />
            <Products />
        </div>
    )
}
