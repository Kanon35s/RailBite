import React from 'react';
import BackButton from '../../components/layout/BackButton';
import MenuGrid from '../../components/menu/MenuGrid';
import { BREAKFAST_ITEMS } from '../../utils/constants';

function BreakfastMenu() {
  return (
    <div className="menu-page">
      <BackButton />
      <div className="container">
        <div className="menu-header">
          <h1>🍳 Breakfast Menu</h1>
          <p className="ordering-from">
            Start Your Day with a Delicious Breakfast
          </p>
        </div>
        <MenuGrid items={BREAKFAST_ITEMS} />
      </div>
    </div>
  );
}

export default BreakfastMenu;
