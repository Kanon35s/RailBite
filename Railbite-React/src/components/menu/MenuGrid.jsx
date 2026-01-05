import React from 'react';
import MenuItem from './MenuItem';

function MenuGrid({ items }) {
  return (
    <div className="menu-grid">
      {items.map((item, index) => (
        <MenuItem key={index} {...item} />
      ))}
    </div>
  );
}

export default MenuGrid;
