import React from 'react';
import BackButton from '../../components/layout/BackButton';
import MenuGrid from '../../components/menu/MenuGrid';
import { BURGER_ITEMS } from '../../utils/constants';

function BurgerMenu() {
  return (
    <div className="menu-page">
      <BackButton />
      <div className="container">
        <div className="menu-header">
          <h1>🍔 Burger Menu</h1>
          <p className="ordering-from">
            Juicy Burgers with Premium Ingredients
          </p>
        </div>
        <MenuGrid items={BURGER_ITEMS} />
      </div>
    </div>
  );
}

export default BurgerMenu;
