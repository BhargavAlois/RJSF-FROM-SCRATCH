import React, { useRef, useState, useEffect } from 'react';
import { fileOrUrlToBase64, isValidUrl } from '../libs/commanActions';
import { CButton } from '@coreui/react';

const FileUploadWithPreview = ({ onChange, value, options, errors }) => {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(value);

  useEffect(() => {
    const setInitialFileInfo = async (fileurl) => {
      const base64file = await fileOrUrlToBase64(fileurl);
      setPreviewUrl(fileurl);
      onChange(base64file);
    }

    if (value && isValidUrl(value)) {
      setInitialFileInfo(value)
    }
  }, [value])

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxFileSize = (options?.size || 5) * 1024 * 1024; // 5MB OR given size in schema in bytes
      if (options?.accept && !options.accept.includes(file.type)) {
        alert(`File "${file.name}" must be one of the following types: ${options.accept.join(', ')}.`);
        return null; // Skip files that don't match the accepted type
      }

      if (file.size > maxFileSize) {
        alert(`File "${file.name}" exceeds the ${options?.size || 5}MB limit and will not be added.`);
        return null; // Skip files that exceed the limit
      }

      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setPreviewUrl(base64String);
        onChange(base64String);
      };
      reader.onerror = () => {
        alert('Failed to read the file.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePicture = () => {
    fileInputRef.current.click();
  };

  const handleDeletePicture = () => {
    setPreviewUrl(null);
    onChange(undefined);
  };

  return (
    <div className="fileupload-preview d-flex align-items-center">
      <img
        src={previewUrl}
        alt="Profile preview"
        className="single-user-profile"
        onClick={handleChangePicture}
        name="profile"
        style={{ width: '130px', height: '130px', marginRight: '10px', cursor: 'pointer' }}
      />

      <div className='d-flex gap-2'>
        <CButton
          size='sm'
          type='button'
          className="btn btn-primary primaryButton "
          onClick={handleChangePicture}
        >
          Change Picture
        </CButton>

        {value && (
          <CButton
            size='sm'
            type='button'
            className="btn btn-primary primaryButton "
            onClick={handleDeletePicture}
          >
            Remove Picture
          </CButton>
        )}
      </div>

      <input
        type="file"
        name="profile"
        capture="user"
        onChange={onChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept={options?.accept?.join(',') || 'image/*'}
      />
    </div>
  );
};

export default FileUploadWithPreview;