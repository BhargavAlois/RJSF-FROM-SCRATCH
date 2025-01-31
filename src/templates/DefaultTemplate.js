import React from 'react'

export default function MainTemplate(props) {
  const { schema, content, onSubmit, submitBtnOptions } = props
  const submitBtnClass = submitBtnOptions?.props?.className || 'primaryButton'
  return (
    <div className="d-flex flex-column">
      {schema.title || schema.description && (
        <header className="mb-2">
        <h3>{schema.title}</h3>
        <p style={{ fontSize: '15px', fontStyle: 'normal', fontWeight: 'normal' }}>
          {schema.description}
        </p>
      </header>
      )} 
      <form
        onSubmit={onSubmit}
        // className="bg-light d-flex flex-column align-items-center justify-content-center p-2 border border-dark border-opacity-25 rounded-4 shadow needs-validation"
        className='d-flex flex-column p-1 align-items-center justify-content-center needs-validation'
        style={{ overflow: 'auto' }}
      >
        {content}
        <button
          type="submit"
          className={`${submitBtnClass} mt-3`}
          disabled={submitBtnOptions?.props?.disabled}
        >
          {submitBtnOptions?.submitText || 'Submit'}
        </button>
      </form>

      {schema.footerContent && (<footer className="mt-3 text-center">{schema.footerContent}</footer>)}
    </div>
  )
}
