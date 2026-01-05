import React from 'react';
import BackButton from '../../components/layout/BackButton';
import MenuGrid from '../../components/menu/MenuGrid';
import { SHWARMA_ITEMS } from '../../utils/constants';

function ShwarmaMenu() {
  return (
    <div className="menu-page">
      <BackButton />
      <div className="container">
        <div className="menu-header">
          <h1>🌯 Shwarma Menu</h1>
          <p className="ordering-from">
            Authentic Middle Eastern Shwarma
          </p>
        </div>
        <MenuGrid items={SHWARMA_ITEMS} />
      </div>
    </div>
  );
}

export default ShwarmaMenu;
