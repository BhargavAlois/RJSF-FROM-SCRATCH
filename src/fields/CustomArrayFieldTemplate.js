// CustomArrayFieldTemplate.js
import React from 'react';
import { CButton } from '@coreui/react';

const CustomArrayFieldTemplate = ({ items, canAdd, onAddClick, onDropIndexClick }) => (
  <div>
    {items.map(element => (
      <div key={element.index} className="array-item">
        {element.children}
        {element.hasRemove && (
          <CButton
            color="danger"
            onClick={() => onDropIndexClick(element.index)}
            className="ml-2"
          >
            Remove
          </CButton>
        )}
      </div>
    ))}
    {canAdd && (
      <CButton
        onClick={onAddClick}
        className="mt-2 primaryButton"
      >
        Add Option
      </CButton>
    )}
  </div>
);

export default CustomArrayFieldTemplate;
