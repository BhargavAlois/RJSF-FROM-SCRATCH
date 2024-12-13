import React from 'react'

export default function MyPasswordWidget(props) {
  console.log("props from mypasswordwidget : ", props);
  return (
    <div>
        <label className='form-label'>{props.schema.title}</label>
        {/* <input type="password" onChange={props.onChange}/> */}
        <input type="password" onChange={(e) => {props.onChange(props.fieldName, e.target.value)}}/>
        {props.errors && props.errors.map((error, index) => (
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}
    </div>
  )
}
