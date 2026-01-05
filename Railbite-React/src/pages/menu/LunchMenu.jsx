import React from 'react';
import BackButton from '../../components/layout/BackButton';
import MenuGrid from '../../components/menu/MenuGrid';
import { LUNCH_ITEMS } from '../../utils/constants';

function LunchMenu() {
  return (
    <div className="menu-page">
      <BackButton />
      <div className="container">
        <div className="menu-header">
          <h1>🍱 Lunch Menu</h1>
          <p className="ordering-from">
            Traditional Bengali Lunch Specials
          </p>
        </div>
        <MenuGrid items={LUNCH_ITEMS} />
      </div>
    </div>
  );
}

export default LunchMenu;
