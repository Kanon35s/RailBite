import React from 'react';
import BackButton from '../../components/layout/BackButton';
import MenuGrid from '../../components/menu/MenuGrid';
import { SNACKS_ITEMS } from '../../utils/constants';

function SnacksMenu() {
  return (
    <div className="menu-page">
      <BackButton />
      <div className="container">
        <div className="menu-header">
          <h1>🍿 Snacks Menu</h1>
          <p className="ordering-from">
            Quick Bites for Your Journey
          </p>
        </div>
        <MenuGrid items={SNACKS_ITEMS} />
      </div>
    </div>
  );
}

export default SnacksMenu;
