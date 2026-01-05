import React from 'react';
import BackButton from '../../components/layout/BackButton';
import MenuGrid from '../../components/menu/MenuGrid';
import { DRINKS_ITEMS } from '../../utils/constants';

function DrinksMenu() {
  return (
    <div className="menu-page">
      <BackButton />
      <div className="container">
        <div className="menu-header">
          <h1>🥤 Drinks Menu</h1>
          <p className="ordering-from">
            Refreshing Beverages for Your Journey
          </p>
        </div>
        <MenuGrid items={DRINKS_ITEMS} />
      </div>
    </div>
  );
}

export default DrinksMenu;
