import React from 'react';
import BackButton from '../../components/layout/BackButton';
import MenuGrid from '../../components/menu/MenuGrid';
import { DINNER_ITEMS } from '../../utils/constants';

function DinnerMenu() {
  return (
    <div className="menu-page">
      <BackButton />
      <div className="container">
        <div className="menu-header">
          <h1>🍽️ Dinner Menu</h1>
          <p className="ordering-from">
            Hearty Dinner Options for Your Journey
          </p>
        </div>
        <MenuGrid items={DINNER_ITEMS} />
      </div>
    </div>
  );
}

export default DinnerMenu;
