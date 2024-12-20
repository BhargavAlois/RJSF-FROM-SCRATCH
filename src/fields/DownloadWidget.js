import React from 'react';

const DownloadWidget = (props) => {
  const { value } = props;

  return (
    <a href={value} download>
      example csv file
    </a>
  );
};

export default DownloadWidget;
