import React from 'react'

export default function CustomFileWidget(props) {
  return (
    <div>
    <label>{props.schema.title}</label>
    <input type="file" onChange={props.onChange}/>
    {/* <input type="file" onChange={(e) => {props.onChange(props.fieldName, e.target.files[0])}}/> */}
    {props.errors && props.errors.map((error, index) => (
              <p key={index} className='text-danger m-0'>{error}</p>
            ))}
    </div>
  )
}
