// JoditEditorField.js
import React, { useRef, useCallback, useEffect } from 'react';
import JoditEditor from 'jodit-react';
import debounce from 'lodash.debounce';

const JoditEditorField = ({ value, onChange }) => {
  const editorRef = useRef(null);
  const lastValue = useRef(value);

  // Debounced function to handle value changes
  const debouncedHandleChange = useCallback(
    debounce((newValue) => {
      if (onChange) {
        onChange(newValue);
      }
    }, 3000), // Adjust the debounce delay as needed
    [onChange]
  );

  // Handle changes in JoditEditor
  const handleChange = (newValue) => {
    if (newValue !== lastValue.current) {
      debouncedHandleChange(newValue);
      lastValue.current = newValue;
    }
  };

  // Restore focus if needed
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  }, [value]);

  return (
    <JoditEditor
      ref={editorRef}
      value={value || ''}
      onChange={handleChange}
      config={{
        readonly: false,
        toolbar: true,
        buttons: [
          'bold', 'italic', 'underline', '|', 'ul', 'ol', '|', 'link', 'image', 'video', 'file'
        ]
      }}
      editorRef={(editor) => (editorRef.current = editor)}
    />
  );
};

export default JoditEditorField;
