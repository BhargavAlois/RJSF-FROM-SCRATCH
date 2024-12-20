import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { fetchOptions ,selectError,selectOptions,selectLoading} from './reduxSlices/optionSlice'
import { useDispatch, useSelector } from 'react-redux'

const AutoCompleteField = ({ id, value, onChange, schema, uiSchema }) => {

  const dispatch = useDispatch()
  const options = useSelector(selectOptions)
  const loading = useSelector(selectLoading)
  const error = useSelector(selectError)

  const { isMulti,placeholder } = uiSchema['ui:options']
  const { valueKey, labelKey, endpoint, arrayKey } = uiSchema.source

  useEffect(() => {
    if (!options[endpoint]) {
      dispatch(fetchOptions({ endpoint, arrayKey }));
    }
  }, [dispatch, endpoint, options]);

    const handleChange = (selectedOption) => {
    if (isMulti) {
      onChange(selectedOption ? selectedOption.map((option) => option.value) : []);
    } else {
      onChange(selectedOption ? selectedOption.value : '');
    }
  };

  const formattedOptions = (options[endpoint] || []).map((item) => ({
    value: item[valueKey],
    label: item[labelKey],
  }));


  if (loading) return <p>Loading options...</p>
  if (error) return <p>Error fetching options!</p>

  return (
    <Select
      id={id}
      isMulti={isMulti}
      value={
        isMulti
          ? formattedOptions.filter((option) => value.includes(option.value))
          : formattedOptions.find((option) => option.value === value) || null
      }
      isClearable
      onChange={handleChange}
      options={formattedOptions}
      placeholder={placeholder}
      styles={{
        container: (provided) => ({
          ...provided,
          width: '100%',
        }),
      }}
    />
  )
}

export default AutoCompleteField
