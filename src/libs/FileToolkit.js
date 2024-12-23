// Import the file-saver package for file downloads
import { saveAs } from 'file-saver';

class FileToolkit {

    /**
     * Extracts file information (name, width, height, and type) from a URL, filename, or Blob, with optional resizing.
     * 
     * This method takes a file input (URL, filename, or Blob) and returns its file information. Additionally, it allows resizing 
     * of the image based on the `imageSize` parameter. The available values are:
     * - 'sm' (small): Scales the image to a smaller size while maintaining the aspect ratio.
     * - 'md' (medium): The default size, returns the image's original dimensions.
     * - 'lg' (large): Scales the image to a larger size while maintaining the aspect ratio.
     * - 'xl' (extra large): Scales the image to an extra-large size while maintaining the aspect ratio.
     * 
     * @param {string|Blob} file - The file input, which can be a URL (string), a filename (string), or a Blob (File object).
     * @param {string} [imageSize='md'] - The desired image size ('sm', 'md', 'lg', 'xl').
     * @returns {Promise<object>} Resolves with an object containing the file information or rejects with an error message.
     * 
     * @throws {Error} If the input is neither a URL, filename, nor Blob.
     * 
     * @example
     * // Example usage with a URL
     * extractFileInfo('https://example.com/image_1920x1080.jpg', 'sm')
     *   .then((fileInfo) => {
     *     console.log(fileInfo);
     *     // Expected output with 'sm': { name: 'image_1920x1080.jpg', width: 320, height: 180, type: 'jpg' }
     *   })
     *   .catch((error) => console.error(error));
     * 
     * // Example usage with a filename
     * extractFileInfo('image_1920x1080.jpg', 'lg')
     *   .then((fileInfo) => {
     *     console.log(fileInfo);
     *     // Expected output with 'lg': { name: 'image', width: 2560, height: 1440, type: 'jpg' }
     *   })
     *   .catch((error) => console.error(error));
     */
    extractFileInfo(file, imageSize = 'md') {
        return new Promise((resolve, reject) => {
            if (typeof file === 'string') {
                // Check if it's a URL or a filename
                if (file.startsWith('http://') || file.startsWith('https://')) {
                    this.extractFromURL(file, resolve, reject, imageSize);
                } else {
                    this.extractFromFileName(file, resolve, reject, imageSize);
                }
            } else if (file instanceof Blob) {
                this.getFileInfo(file, imageSize).then(resolve).catch(reject);
            } else {
                reject('Invalid input. Expected a URL, filename, or Blob.');
            }
        });
    }

    /**
  * Extracts file information (name, width, height, and type) from an image URL, with optional resizing.
  * 
  * This method accepts an image URL, loads the image, and extracts the file's name, width, height, and file type.
  * If the `imageSize` parameter is provided, the image will be resized while maintaining the aspect ratio.
  * 
  * @param {string} url - The URL of the image to extract information from (e.g., "https://example.com/image.jpg").
  * @param {function} resolve - The resolve function to call when the image is successfully loaded and information is extracted.
  * @param {function} reject - The reject function to call when the image fails to load.
  * @param {string} [imageSize='md'] - The desired image size ('sm', 'md', 'lg', 'xl').
  * 
  * @returns {void} Resolves with an object containing the image's file information or rejects with an error message.
  * 
  * @throws {Error} If the image fails to load from the provided URL.
  */
    extractFromURL(url, resolve, reject, imageSize = 'md') {
        const img = new Image();
        img.onload = () => {
            const fileName = url.split('/').pop();
            const fileType = fileName.split('.').pop();
            let { width, height } = img;

            // Resize the image based on the imageSize parameter while maintaining the aspect ratio
            ({ width, height } = this.resizeImage(width, height, imageSize));

            resolve({
                name: fileName,
                width: width,
                height: height,
                type: fileType,
            });
        };
        img.onerror = () => reject('Failed to load image from URL');
        img.src = url;
    }


    /**
  * Extracts file information (name, width, height, and type) from a filename string, with optional resizing.
  * 
  * This method assumes that the filename follows the pattern `name_widthxheight.extension`, and extracts the file's 
  * name, width, height, and type. If the `imageSize` parameter is provided, it scales the image while maintaining the aspect ratio.
  * 
  * @param {string} fileName - The filename string to extract information from (e.g., "image_1920x1080.jpg").
  * @param {function} resolve - The resolve function to call when the extraction is successful.
  * @param {function} reject - The reject function to call when the filename doesn't match the expected pattern.
  * @param {string} [imageSize='md'] - The desired image size ('sm', 'md', 'lg', 'xl').
  * 
  * @returns {void} Resolves with an object containing the file information or rejects with an error message.
  * 
  * @throws {Error} If the filename does not match the expected pattern.
  */
    extractFromFileName(fileName, resolve, reject, imageSize = 'md') {
        console.log("FILE NAME",fileName)
        const regex = /^(.*?)(?:_(\d+)x(\d+))\.(\w+)$/;
        const match = fileName.match(regex);

        if (match) {
            const name = match[1];
            let width = parseInt(match[2]);
            let height = parseInt(match[3]);
            const fileType = match[4];

            // Resize the image based on the imageSize parameter while maintaining the aspect ratio
            ({ width, height } = this.resizeImage(width, height, imageSize));

            resolve({
                name: name,
                width: width,
                height: height,
                type: fileType,
            });
        } else {
            reject('Filename does not match expected pattern (e.g., "image_1920x1080.jpg")');
        }
    }

    /**
     * Resizes the image dimensions based on the requested size, maintaining the aspect ratio.
     * 
     * This helper function takes the original width and height of an image and scales the image dimensions
     * based on the provided size ('sm', 'md', 'lg', 'xl'). The scaling factors are hardcoded for each size.
     * 
     * @param {number} width - The original width of the image.
     * @param {number} height - The original height of the image.
     * @param {string} imageSize - The size to scale the image to ('sm', 'md', 'lg', 'xl').
     * @returns {Object} - An object containing the scaled width and height.
     */
    resizeImage(width, height, imageSize) {
        let newWidth = width;
        let newHeight = height;

        // Define scaling factors for each size
        const sizeFactors = {
            sm: 0.2,  // 20% of the original size
            md: 1,    // Default (no scaling)
            lg: 1.5,  // 150% of the original size
            xl: 2,    // 200% of the original size
        };

        const factor = sizeFactors[imageSize] || 1; // Default to 'md' if invalid size is passed
        newWidth = Math.round(width * factor);
        newHeight = Math.round(height * factor);

        return { width: newWidth, height: newHeight };
    }


    /**
  * Extracts file information (name, size, type, width, height) from a Blob or URL, with optional resizing.
  * 
  * This method handles Blob (File) objects, Base64 strings, or URLs. If the file is an image, it extracts its
  * dimensions and file type. Additionally, it allows resizing the image based on the `imageSize` parameter.
  * 
  * @param {Blob|File|string} file - The file or URL for which to extract information. Can be a Blob, File, or a URL/Base64 string.
  * @param {string} [imageSize='md'] - The desired image size ('sm', 'md', 'lg', 'xl').
  * @returns {Promise<Object>} Resolves with an object containing the extracted file information (name, width, height, type).
  */
    getFileInfo(file, imageSize = 'md') {
        return new Promise((resolve, reject) => {
            if (file instanceof Blob) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const img = new Image();
                    img.onload = () => {
                        let { width, height } = img;
                        ({ width, height } = this.resizeImage(width, height, imageSize));
                        resolve({
                            name: file.name,
                            width: width,
                            height: height,
                            type: file.type,
                        });
                    };
                    img.onerror = () => reject('Failed to load image from Blob');
                    img.src = reader.result;
                };
                reader.onerror = () => reject('Failed to read Blob');
                reader.readAsDataURL(file);
            } else {
                reject('Invalid file format, expected a Blob or File.');
            }
        });
    }


    /**
 * Handles the processing of a `Blob` (or `File`) by loading the image and extracting its file information.
 * 
 * This method creates an object URL from the provided `Blob`, loads the image, and then extracts the file's 
 * name, size, type, and the image's dimensions (width and height). After the image is successfully loaded, 
 * it resolves with a file information object. The method also cleans up the object URL after use. 
 * If the image fails to load, the promise is rejected with an error message.
 * 
 * @param {Blob|File} file - The `Blob` or `File` object representing the image. 
 * @param {Function} resolve - The function to call with the file information once the image is successfully loaded.
 * @param {Function} reject - The function to call if there is an error loading the image from the `Blob`.
 * 
 * @returns {void} - This method does not return a value. It resolves or rejects a promise based on the result of the image loading.
 * 
 * @throws {Error} - Throws an error if the image fails to load from the `Blob`.
 * 
 * @example
 * // Example usage: Handle a Blob or File and get the file info
 * handleBlob(file, (fileInfo) => {
 *   console.log(fileInfo);
 *   // Output:
 *   // {
 *   //   name: "image.jpg",
 *   //   size: 1024,
 *   //   type: "image/jpeg",
 *   //   width: 800,
 *   //   height: 600
 *   // }
 * }, (error) => {
 *   console.error("Failed to load image:", error);
 * });
 */
    handleBlob(file, resolve, reject) {
        const img = new Image();
        const objectURL = URL.createObjectURL(file);
        img.onload = () => {
            const fileInfo = this.createFileInfo(file.name, file.size, file.type, img.width, img.height);
            resolve(fileInfo);
            URL.revokeObjectURL(objectURL); // Clean up the object URL
        };
        img.onerror = () => reject('Failed to load image from Blob');
        img.src = objectURL;
    }

    /**
 * Handles the processing of a Base64-encoded image string by extracting its file information.
 * 
 * This method takes a Base64 string representing an image, calculates its size from the Base64 data,
 * extracts the file type from the string, and loads the image to get its dimensions. The method resolves
 * with an object containing the file's name, size, type, width, and height. If the image cannot be loaded,
 * the promise is rejected with an error message.
 * 
 * @param {string} base64String - The Base64-encoded string representing the image, including the metadata.
 * @param {Function} resolve - The function to call with the file information once the image is successfully loaded.
 * @param {Function} reject - The function to call if there is an error loading the image from the Base64 string.
 * 
 * @returns {void} - This method does not return a value, it resolves or rejects a promise based on the result of the image loading.
 * 
 * @throws {Error} - Throws an error if the image fails to load from the Base64 string.
 * 
 * @example
 * // Example usage: Handle a Base64 string and get the file info
 * handleBase64("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAAAD...", (fileInfo) => {
 *   console.log(fileInfo);
 *   // Output:
 *   // {
 *   //   name: "Unknown", // Or the name extracted from the Base64 string metadata
 *   //   size: 3456, // Calculated size of the Base64 string in bytes
 *   //   type: "image/jpeg",
 *   //   width: 800,
 *   //   height: 600
 *   // }
 * }, (error) => {
 *   console.error("Failed to load image:", error);
 * });
 */
    handleBase64(base64String, resolve, reject) {
        const base64Data = base64String.split(',')[1];
        const fileType = base64String.split(';')[0].split(':')[1];
        const size = (base64Data.length * 3) / 4; // Calculate size of base64-encoded string
        const regex = /name=([^;]+)/;
        const match = base64String.match(regex);

        const img = new Image();
        img.onload = () => {
            const fileInfo = this.createFileInfo(match[1] || "Unknown", size, fileType, img.width, img.height);
            resolve(fileInfo);
        };
        img.onerror = () => reject('Failed to load image from Base64 string');
        img.src = base64String;
    }

    /**
 * Handles the processing of an image URL by loading the image and extracting its file information.
 * 
 * This method takes a URL, loads the image from the URL, and extracts the file's name, size (which is set to 0 as it's not available from the URL directly), type (extracted from the URL's extension), 
 * and the dimensions (width and height) of the image once it's loaded. It then resolves a promise with this file information.
 * If the image fails to load, it rejects the promise with an error message.
 * 
 * @param {string} url - The URL of the image to process.
 * @param {Function} resolve - The function to call with the file information once the image is successfully loaded.
 * @param {Function} reject - The function to call if there is an error loading the image from the URL.
 * 
 * @returns {void} - This method does not return a value, it resolves or rejects a promise based on the result of the image loading.
 * 
 * @throws {Error} - Throws an error if the image fails to load from the URL.
 * 
 * @example
 * // Example usage: Handle an image URL and get the file info
 * handleURL("https://example.com/path/to/image.jpg", (fileInfo) => {
 *   console.log(fileInfo);
 *   // Output:
 *   // {
 *   //   name: "image.jpg",
 *   //   size: 0,
 *   //   type: "jpg",
 *   //   width: 800,
 *   //   height: 600
 *   // }
 * }, (error) => {
 *   console.error("Failed to load image:", error);
 * });
 */
    handleURL(url, resolve, reject) {
        const img = new Image();
        img.onload = () => {
            const fileInfo = this.createFileInfo(url.split('/').pop(), 0, img.src.split('.').pop(), img.width, img.height);
            resolve(fileInfo);
        };
        img.onerror = () => reject('Failed to load image from URL');
        img.src = url;
    }

    /**
 * Creates an object containing file information, including the file name, size, type, and dimensions.
 * 
 * This method takes the file's `name`, `size`, `type`, and dimensions (`width` and `height`),
 * appends the dimensions to the file name, and returns an object that includes the updated file name, 
 * size, and type. If no file type is provided, it defaults to `'Unknown'`.
 * 
 * @param {string} name - The base name of the file (e.g., "image.jpg").
 * @param {number} size - The size of the file in bytes.
 * @param {string} [type] - The MIME type of the file (e.g., "image/jpeg"). Defaults to `'Unknown'` if not provided.
 * @param {number} width - The width dimension of the file (e.g., 1920).
 * @param {number} height - The height dimension of the file (e.g., 1080).
 * 
 * @returns {Object} - An object containing the following properties:
 *   - `name`: The updated file name with the dimensions appended (e.g., "image_1920x1080.jpg").
 *   - `size`: The size of the file in bytes.
 *   - `type`: The MIME type of the file, or `'Unknown'` if not provided.
 * 
 * @example
 * // Example usage: Create file info with dimensions appended
 * const fileInfo = createFileInfo("image.jpg", 102400, "image/jpeg", 1920, 1080);
 * console.log(fileInfo);
 * // Output: 
 * // {
 * //   name: "image_1920x1080.jpg",
 * //   size: 102400,
 * //   type: "image/jpeg"
 * // }
 */
    createFileInfo(name, size, type, width, height) {
        const nameWithDimensions = this.appendDimensions(name, width, height);
        return {
            name: nameWithDimensions,
            size: size,
            type: type || 'Unknown',
        };
    }

    /**
 * Appends width and height dimensions to a file name, just before the file extension.
 * 
 * This method takes a `fileName` (e.g., "image.jpg") and appends the provided `width` and `height` 
 * in the format `_widthxheight` to the base name of the file, preserving the file extension.
 * The result is a new file name that includes the dimensions.
 * 
 * @param {string} fileName - The original file name (including extension) to which dimensions will be appended.
 * @param {number} width - The width dimension to append to the file name.
 * @param {number} height - The height dimension to append to the file name.
 * 
 * @returns {string} - A new file name with the appended dimensions, in the format `name_widthxheight.extension`.
 * 
 * @example
 * // Example usage: Append dimensions to a file name
 * const newFileName = appendDimensions("image.jpg", 1920, 1080);
 * console.log(newFileName); // Outputs: "image_1920x1080.jpg"
 */
    appendDimensions(fileName, width, height) {
        const fileExtension = fileName.split('.').pop();
        const nameWithoutExtension = fileName.replace(`.${fileExtension}`, '');
        return `${nameWithoutExtension}_${width}x${height}.${fileExtension}`;
    }

    /**
 * Converts a File, Blob, or URL to a Base64-encoded string.
 * 
 * This method checks if the input is a URL, a File, or a Blob. If it's a URL, it fetches the
 * file from the URL and converts it into Base64. If it's a File or Blob, it directly converts it.
 * The method returns a promise that resolves with the Base64-encoded string.
 * 
 * @param {(string | File | Blob)} fileOrUrl - The file (as a File or Blob) or a URL to convert to Base64.
 * 
 * @returns {Promise<string>} - A promise that resolves to the Base64-encoded string of the file or content at the URL.
 * 
 * @throws {Error} - Throws an error if the input type is not a valid URL, File, or Blob, or if there is an issue with the conversion.
 * 
 * @example
 * // Example usage: Convert a file object (Blob or File) to Base64
 * const fileBlob = new Blob([fileData], { type: 'image/jpeg' });
 * convertFileOrUrlToBase64(fileBlob)
 *   .then(base64String => {
 *     console.log(base64String); // Logs the Base64 string
 *   })
 *   .catch(error => {
 *     console.error('Error converting file to Base64:', error);
 *   });
 * 
 * @example
 * // Example usage: Convert a URL to Base64
 * const imageUrl = 'https://example.com/path/to/image.jpg';
 * convertFileOrUrlToBase64(imageUrl)
 *   .then(base64String => {
 *     console.log(base64String); // Logs the Base64 string of the image
 *   })
 *   .catch(error => {
 *     console.error('Error fetching or converting file:', error);
 *   });
 */
    convertFileOrUrlToBase64(fileOrUrl) {
        return new Promise((resolve, reject) => {
            if (typeof fileOrUrl === 'string') {
                // If it's a URL, fetch the file and convert it
                fetch(fileOrUrl)
                    .then((response) => response.blob())
                    .then((blob) => this.convertBlobToBase64(blob))
                    .then((base64) => resolve(base64))
                    .catch((err) => reject('Error fetching file: ' + err));
            } else if (fileOrUrl instanceof Blob || fileOrUrl instanceof File) {
                // If it's a Blob or File, directly convert it
                this.convertBlobToBase64(fileOrUrl)
                    .then((base64) => resolve(base64))
                    .catch((err) => reject('Error converting file to base64: ' + err));
            } else {
                reject('Invalid input type. Must be a File, Blob, or URL.');
            }
        });
    }

    /**
   * Converts a Blob (or File) object to a Base64-encoded string.
   * 
   * This method uses the `FileReader` API to read the Blob and convert it into a Data URL
   * (Base64-encoded string). The method returns a promise that resolves with the Base64 string
   * when the conversion is complete.
   * 
   * @param {Blob} blob - The Blob (or File) object to convert to Base64.
   * 
   * @returns {Promise<string>} - A promise that resolves to the Base64-encoded string representation of the Blob.
   * 
   * @throws {Error} - Throws an error if there is an issue reading the Blob.
   * 
   * @example
   * // Example usage: Convert a Blob to Base64
   * const fileBlob = new Blob([fileData], { type: 'image/jpeg' });
   * convertBlobToBase64(fileBlob)
   *   .then(base64String => {
   *     console.log(base64String); // Logs the Base64 string
   *   })
   *   .catch(error => {
   *     console.error('Error converting Blob to Base64:', error);
   *   });
   */
    convertBlobToBase64(blob) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }

    /**
   * Downloads a file from a given image URL.
   * 
   * This method uses the `file-saver` library to trigger the download of a file
   * from the provided URL. If no filename is specified, the file will be saved
   * with a default name of "Unknown".
   * 
   * @param {string} imageUrl - The URL of the image (or file) to be downloaded.
   * @param {string} [filename="Unknown"] - The name to assign to the downloaded file. 
   * If not provided, the filename defaults to "Unknown".
   * 
   * @throws {Error} Throws an error if the `imageUrl` is not provided or is invalid.
   * 
   * @example
   * // Example usage: Download an image with a custom filename
   * downloadFile('https://example.com/image.jpg', 'my_image.jpg');
   * 
   * @example
   * // Example usage: Download an image with the default filename
   * downloadFile('https://example.com/image.jpg');
   */
    downloadFile(imageUrl, filename) {
        if (!imageUrl) {
            throw new Error('Image URL is required');
        }
        saveAs(imageUrl, filename || "Unknown");
    }

    /**
    * Converts an array of base64-encoded strings into an array of File objects.
    * 
    * This method processes each base64 string, decodes it, and generates a `File` object
    * with the appropriate filename and mimeType. If the `fileInfo` is provided, it uses that 
    * information for the files. If `fileInfo` is `null`, it attempts to extract file info 
    * asynchronously using the `getFileInfo` method.
    * 
    * @param {string[]} base64Strings - An array of base64-encoded strings representing the files to convert.
    * @param {Object | null} [fileInfo=null] - Optional file information object. If not provided, the method tries to extract file information asynchronously using `getFileInfo`.
    * 
    * @returns {Promise<File[]>} - A promise that resolves to an array of File objects created from the base64 strings.
    * 
    * @throws {Error} - Throws an error if the base64 string is invalid or if there is an issue with extracting file info.
    * 
    * @example
    * // Example usage: Convert an array of base64 strings with custom fileInfo
    * const base64Strings = [
    *   'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAAA...',
    *   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...'
    * ];
    * const fileInfo = { name: 'image', type: 'image/jpeg' };
    * convertBase64ArrayToFiles(base64Strings, fileInfo).then(files => {
    *   files.forEach(file => {
    *     console.log(file.name);  // Logs file name, e.g., "image.jpg"
    *     console.log(file.type);  // Logs mime type, e.g., "image/jpeg"
    *   });
    * }).catch(error => {
    *   console.error('Error converting files:', error);
    * });
    * 
    * @example
    * // Example usage: Convert base64 strings without providing fileInfo (will extract file info)
    * convertBase64ArrayToFiles(base64Strings).then(files => {
    *   files.forEach(file => {
    *     console.log(file.name);  // Logs generated file name
    *     console.log(file.type);  // Logs mime type
    *   });
    * }).catch(error => {
    *   console.error('Error converting files:', error);
    * });
    */
    async convertBase64ArrayToFiles(base64Strings, fileInfo = null) {
        const files = await Promise.all(base64Strings.map(async (base64String) => {
            const [metadata, base64Data] = base64String.split(';base64,');
            if (!metadata || !base64Data) {
                throw new Error('Invalid base64 string format.');
            }

            // Use fileInfo if available
            const filename = fileInfo?.name || `${Math.floor(1000000000 + Math.random() * 9000000000)}.${metadata.split('/')[1]}`;
            const mimeType = fileInfo?.type || metadata.split(':')[1];

            const binaryString = window.atob(base64Data);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);

            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }

            const blob = new Blob([bytes], { type: mimeType });
            return new File([blob], filename, { type: mimeType });
        }));

        return files;
    }
}

// Export the instance of FileToolkit for use
export const fileToolkit = new FileToolkit();
