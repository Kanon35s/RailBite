import React from 'react';
import BackButton from '../../components/layout/BackButton';
import MenuGrid from '../../components/menu/MenuGrid';
import { SMOOTHIE_ITEMS } from '../../utils/constants';

function SmoothieMenu() {
  return (
    <div className="menu-page">
      <BackButton />
      <div className="container">
        <div className="menu-header">
          <h1>🥤 Smoothie Menu</h1>
          <p className="ordering-from">
            Fresh & Healthy Smoothies
          </p>
        </div>
        <MenuGrid items={SMOOTHIE_ITEMS} />
      </div>
    </div>
  );
}

export default SmoothieMenu;
