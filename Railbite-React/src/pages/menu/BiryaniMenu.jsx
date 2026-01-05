import React from 'react';
import BackButton from '../../components/layout/BackButton';
import MenuGrid from '../../components/menu/MenuGrid';
import { BIRYANI_ITEMS } from '../../utils/constants';

function BiryaniMenu() {
  return (
    <div className="menu-page">
      <BackButton />
      <div className="container">
        <div className="menu-header">
          <h1>🍛 Biryani Menu</h1>
          <p className="ordering-from">
            Authentic Bengali & Hyderabadi Biryani
          </p>
        </div>
        <MenuGrid items={BIRYANI_ITEMS} />
      </div>
    </div>
  );
}

export default BiryaniMenu;
