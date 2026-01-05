import React from 'react';
import BackButton from '../../components/layout/BackButton';
import MenuGrid from '../../components/menu/MenuGrid';
import { PIZZA_ITEMS } from '../../utils/constants';

function PizzaMenu() {
  return (
    <div className="menu-page">
      <BackButton />
      <div className="container">
        <div className="menu-header">
          <h1>🍕 Pizza Menu</h1>
          <p className="ordering-from">
            Hot & Fresh Italian Style Pizza
          </p>
        </div>
        <MenuGrid items={PIZZA_ITEMS} />
      </div>
    </div>
  );
}

export default PizzaMenu;
