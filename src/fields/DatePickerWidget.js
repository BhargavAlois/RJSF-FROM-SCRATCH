import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const DatePickerWidget = (props) => {
  const { value, onChange, schema } = props;

  const [error, setError] = useState('');
  const [minDate, setMinDate] = useState(schema.min ? schema.min : undefined);
  const [maxDate, setMaxDate] = useState(schema.max ? schema.max : undefined);

  const get21YearAgoDate = () => {
    const today = new Date();
    let minDate = new Date(today.setFullYear(today.getFullYear() - 21));
    let year = minDate.getFullYear();
    let month = String(minDate.getMonth() + 1).padStart(2, '0');
    let day = String(minDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }


  const formatDate = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0'); 
    return `${year}-${month}-${day}`;
  }

  const handleChange = (event) => {
    const selectedDate = event.target.value;

    let todayFormatted = formatDate();
    
    if(selectedDate === '') {
      onChange('')
      return;
    }

    if(schema.allowed.includes('future') && schema.allowed.includes('past') && schema.allowed.includes('today')) {
      onChange(selectedDate);
      setError('')
      return;
    }
    
    if(schema.allowed.includes('future') && (selectedDate < todayFormatted)) {      
      setError('You cannot select a past date.');
      onChange('')
      return;
    }
    
    if (schema.allowed.includes('past') && (selectedDate > todayFormatted)) {      
      setError('You cannot select a future date.');
      onChange('')
      return;
    } 

    onChange(selectedDate);
    setError('')
  };

  useEffect(() => {
    if (schema.dateType === 'dateOfBirth') {
      const calculatedMaxDate = get21YearAgoDate();
      setMaxDate(calculatedMaxDate);
    }
  }, []);

  return (
    <div className="form-group">
      <input
        type="date"
        className="form-control"
        value={value || ""}
        onChange={handleChange}
        min={minDate}
        max={maxDate}
      />
      {props.errors && props.errors.map((error, index) => (
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}
    </div>
  );
};

export default DatePickerWidget;