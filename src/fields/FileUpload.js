import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Plus } from 'lucide-react';
import { CButton, CCol, CRow } from '@coreui/react';
import { fileOrUrlToBase64, getFileInfo, isValidUrl, base64ArrayToFiles } from '../../../libs/commanActions';

const FileUpload = ({ ...props }) => {
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);
    const [inputType, setInputType] = useState(null);

    useEffect(() => {
        if (props?.schema?.type === "array")
            props.onChange(files.map((file) => file.data));
        else
            props.onChange(files[0]?.data);

    }, [files]);

    // // NOTE: THIS IS HERE TO CHECK VALUE OF RJSF
    // useEffect(() => {
    //     console.log('PROPS : files', props, files)
    // }, [props])

    useEffect(() => {

        const setInitialFileInfo = async (fileurl) => {
            const base64file = await fileOrUrlToBase64(fileurl);
            props.onChange(base64file);
            const fileInfo = await getFileInfo(fileurl);
            const fileBlob = base64ArrayToFiles([base64file], fileInfo);
            setFiles(prev => [...prev, fileBlob[0]]);
        }


        // if (props.value === undefined && files.length > 0) {
        //     fileInputRef.current.value = '';
        //     setFiles([]);
        // }
        if (props.value && isValidUrl(props.value)) {
            setInitialFileInfo(props.value)
        }
        else if (Array.isArray(props.value) && props.value.length > 0) {
            for (let idx = 0; idx < props.value.length; idx++) {
                if (isValidUrl(props.value[idx])) {
                    setInitialFileInfo(props.value[idx])
                }
            }
        }
    }, [props.value])

    const handleFileChange = async (event) => {
        const maxFileSize = (props?.options?.size || 5) * 1024 * 1024; // 5MB OR given size in schema in bytes

        const newFiles = await Promise.all(
            Array.from(event.target.files || []).map(async (file) => {

                if (props?.options?.accept && !props.options.accept.includes(file.type)) {
                    alert(`File "${file.name}" must be one of the following types: ${props.options.accept.join(', ')}.`);
                    return null; // Skip files that don't match the accepted type
                }

                if (file.size > maxFileSize) {
                    alert(`File "${file.name}" exceeds the ${props?.options?.size || 5}MB limit and will not be added.`);
                    return null; // Skip files that exceed the limit
                }

                return {
                    id: Math.random().toString(36).substr(2, 9),
                    name: file.name,
                    size: file.size,
                    data: await fileToDataUrl(file),
                };
            })
        );

        // Filter out null values from files that exceeded the size limit
        const validFiles = newFiles.filter(file => file !== null);

        if (inputType === "upload") {
            setFiles(validFiles);
        } else if (inputType === "add-more") {
            setFiles(prevFiles => [...prevFiles, ...validFiles]);
        }
    };

    const fileToDataUrl = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result.split(',')[1];
                const dataUrl = `data:${file.type};name=${file.name};base64,${base64String}`;
                resolve(dataUrl);
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    };

    const removeFile = (id) => {
        if (files.length == 1) {
            fileInputRef.current.value = '';
        }
        setFiles(prevFiles => prevFiles.filter(file => file.id !== id));
    };

    const triggerFileInput = (btnType) => {
        setInputType(btnType);
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    return (
        <div className="mx-auto p-2 rounded">
            <CRow className={props?.uiSchema?.["ui:options"]?.className || ''}>
                <CCol>
                    <div className="mb-1">
                        <CButton onClick={() => triggerFileInput("upload")} style={{
                            background: "#FF5100", color: "white", paddingLeft: '1rem',
                        }} className="w-100" size='sm' title={`Upload File${props?.schema?.type === "array" ? 's' : ''}`}>
                            <Upload className="me-2" size={16} /> {`Upload File${props?.schema?.type === "array" ? 's' : ''}`}
                        </CButton>
                        <div className='overflow-hidden h-0 w-100 bg-white' style={{ position: 'relative' }}>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className='border-0 '
                                style={{ width: '1px', height: '1px', pointerEvents: 'none', position: 'absolute', top: -15, left: '15%' }} //Don't change this css 
                                placeholder={props?.placeholder}
                                autoFocus={props?.autoFocus}
                                disabled={props?.disabled}
                                readOnly={props?.readonly}
                                required={props?.required}
                                accept={props?.uiSchema?.["ui:options"]?.accept?.join(',') || '*'}
                                multiple={props?.schema?.type === "array"}
                            />
                        </div>
                    </div>
                </CCol>
                {
                    props?.schema?.type === "array" &&
                    <CCol>
                        <CButton onClick={() => triggerFileInput("add-more")} color={`${props?.schema?.type === "array" ? 'secondary' : 'light'}`} className={`${props?.schema?.type === "array" ? 'w-100' : 'w-100 cursor-not-allowed'} `} size='sm' title="Add More Files" style={{ paddingLeft: "1rem" }}>
                            <Plus className="me-2" size={16} /> Add More Files
                        </CButton>
                    </CCol>
                }
            </CRow>

            {files.length > 0 && (
                <div className="mb-1">
                    <div className="text-sm fw-bold mb-2">Uploaded Files:</div>
                    <ul className="list-unstyled" style={{ display: 'block' }}>
                        {files.map(file => (
                            <li key={file.id} className="d-flex align-items-center justify-content-between bg-light p-2 rounded mb-2">
                                <span className="text-truncate flex-grow-1 me-2">{file.name}</span>
                                <span className="small text-muted me-2">{formatFileSize(file.size)}</span>
                                <CButton
                                    color="danger"
                                    size="sm"
                                    onClick={() => removeFile(file.id)}
                                    className="d-flex align-items-center justify-content-center"
                                    style={{ width: '24px', height: '24px', padding: 0 }}
                                >
                                    <X size={16} />
                                </CButton>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default FileUpload;