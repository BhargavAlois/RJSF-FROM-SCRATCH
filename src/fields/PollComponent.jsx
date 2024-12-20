import React, { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'
import { CFormInput, CContainer, CAlert } from '@coreui/react'

const PollComponent = ({ onChange }) => {
  const [question, setQuestion] = useState('')
  const [options, setOptions] = useState(['',''])
  const [alertVisible, setAlertVisible] = useState(false)
  const optionRefs = useRef([])

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value)
  }

  const handleOptionChange = (index, e) => {
    const newOptions = [...options]
    newOptions[index] = e.target.value
    setOptions(newOptions)
    onChange(newOptions)
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const currentOption = options[index].trim()
      if (currentOption) {
        addOption(index + 1)
      }
    }
  }

  const addOption = (focusIndex) => {
    setOptions((prevOptions) => [...prevOptions, ''])
    setTimeout(() => {
      if (optionRefs.current[focusIndex]) {
        optionRefs.current[focusIndex].focus()
      }
    }, 0)
  }

  const removeOption = (index) => {
    options.length > 2 && setOptions(options.filter((_, i) => i !== index))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (question && options.some((option) => option)) {
      setAlertVisible(true)
    }
  }

  return (
    <CContainer>
      <div className="d-flex mb-3 flex-column">
        <div className="poll-options d-flex flex-column gap-2">
          {options.map((option, index) => (
            <div className="d-flex align-items-center" key={index}>
              <CFormInput
                type="text"
                ref={(el) => (optionRefs.current[index] = el)}
                value={option}
                onChange={(e) => handleOptionChange(index, e)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                required={index < 2}
                placeholder={`Option ${index + 1}`}
                style={{
                  borderTop: '0',
                  borderLeft: '0',
                  borderRight: '0',
                  borderBottom: '1px solid #D9D9D9',
                  flex: 1,
                }}
              />
              <button
                type="button"
                onClick={() => removeOption(index)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FF5100',
                  marginLeft: '10px',
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>
          ))}
        </div>
        <p
          onClick={() => addOption(options.length)}
          style={{
            color: '#ff5722',
            cursor: 'pointer',
            textDecoration: 'underline',
            marginTop: '10px',
          }}
        >
          Add option +
        </p>
      </div>
      {alertVisible && (
        <CAlert color="success" dismissible onClose={() => setAlertVisible(false)} className="mt-3">
          Poll submitted successfully!
        </CAlert>
      )}
    </CContainer>
  )
}

export default PollComponent
