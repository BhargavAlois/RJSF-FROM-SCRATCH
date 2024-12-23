class CommanActions {
  // Format Date based on the given format
  formatDate(dateInput, format) {
    if (dateInput === null || dateInput === undefined) {
      return dateInput
    }

    if (format) {
      if (typeof dateInput !== 'string') {
        throw new Error('dateInput must be a string in yyyy-mm-dd or yyyy-mm-ddThh:mm:ss format')
      }

      const dateObj = new Date(dateInput)

      const day = String(dateObj.getDate()).padStart(2, '0')
      const month = String(dateObj.getMonth() + 1).padStart(2, '0')
      const year = dateObj.getFullYear()
      const hours = String(dateObj.getHours()).padStart(2, '0')
      const minutes = String(dateObj.getMinutes()).padStart(2, '0')
      const seconds = String(dateObj.getSeconds()).padStart(2, '0')

      const monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ]

      switch (format.toLowerCase()) {
        case 'dd-mm-yyyy':
          return `${day}-${month}-${year}`
        case 'yyyy-dd-mm':
          return `${year}-${day}-${month}`
        case 'mm-dd-yyyy':
          return `${month}-${day}-${year}`
        case 'yyyy-mm-dd':
          return `${year}-${month}-${day}`
        case 'iso':
          return dateObj.toISOString()
        case 'year':
          return year
        case 'month':
          return monthNames[dateObj.getMonth()]
        case 'day':
          return day
        case 'date':
          return dateObj.toDateString()
        case 'time':
          return `${hours}:${minutes}:${seconds}`
        case 'new date':
          return new Date(dateObj)
        case 'dd-mm-yyyy hh:mm:ss':
          return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`
        case 'yyyy-mm-dd hh:mm:ss':
          return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
        default:
          throw new Error('Invalid format provided')
      }
    }
    return dateInput
  }

  generateDailyToken() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const day = String(today.getDate()).padStart(2, '0');
    
    // Format the token as YYYY-MM-DD
    return `${year}-${month}-${day}`;
  }

  // Download a file from a given image URL
  downloadFile(filename, imageUrl) {
    const link = document.createElement('a')
    link.href = imageUrl
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    link.parentNode.removeChild(link)
  }

  // Convert an array of base64 strings to an array of File objects
  base64ArrayToFiles(base64Strings, fileInfo = null) {
    return base64Strings.map((base64String) => {
      const filename =  fileInfo?.name || `${Math.floor(1000000000 + Math.random() * 9000000000)}.${base64String.split(';')[0].split('/')[1]}`
      const [metadata, base64Data] = base64String.split(';base64,')
      if (!metadata || !base64Data) {
        throw new Error('Invalid base64 string format.')
      }

      const mimeType = fileInfo?.type || metadata.split(':')[1]
      const binaryString = window.atob(base64Data)
      const len = binaryString.length
      const bytes = new Uint8Array(len)

      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }

      const blob = new Blob([bytes], { type: mimeType })
      return new File([blob],filename, { type: mimeType })
    })
  }

  // Convert a File, Blob, or URL to a Base64 string
  async fileOrUrlToBase64(fileOrUrl) {
    return new Promise((resolve, reject) => {
      if (typeof fileOrUrl === 'string') {
        // If it's a URL, fetch the file and convert it
        fetch(fileOrUrl)
          .then((response) => response.blob())
          .then((blob) => convertBlobToBase64(blob))
          .then((base64) => resolve(base64))
          .catch((err) => reject('Error fetching file: ' + err))
      } else if (fileOrUrl instanceof Blob || fileOrUrl instanceof File) {
        // If it's a Blob or File, directly convert it
        convertBlobToBase64(fileOrUrl)
          .then((base64) => resolve(base64))
          .catch((err) => reject('Error converting file to base64: ' + err))
      } else {
        reject('Invalid input type. Must be a File, Blob, or URL.')
      }
    })
  }

  // Helper function to convert a Blob or File to a Base64 string
  convertBlobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob) // This will result in a data URI (Base64)
    })
  }

  getFileInfo(file) {
    return new Promise((resolve, reject) => {
      if (file instanceof Blob) {
        // If file is a Blob (e.g., from an <input> element or a FileReader)
        resolve({
          name: file.name || 'Unknown',
          size: file.size,
          type: file.type || 'Unknown',
        })
      } else if (typeof file === 'string' && file.startsWith('data:')) {
        // If file is a Base64 string (starts with "data:")
        const base64Data = file.split(',')[1]
        const fileType = file.split(';')[0].split(':')[1]
        const size = (base64Data.length * 3) / 4 // Calculate size of base64-encoded string
        const regex = /name=([^;]+)/;
        const match = file.match(regex);
      
        resolve({
          name: match[1] ? match[1] : "Unknown",
          size: size,
          type: fileType,
        })
      } else if (
        typeof file === 'string' &&
        (file.startsWith('http://') || file.startsWith('https://'))
      ) {
        // If file is a URL (URL pointing to a file)
        const img = new Image()
        img.onload = () => {
          resolve({
            name: file.split('/').pop(),
            size: 0, // Cannot get size from URL directly
            type: img.src.split('.').pop(),
          })
        }
        img.onerror = () => reject('Failed to load image from URL')
        img.src = file
      } else {
        reject('Invalid input type. Expected Blob, URL, or Base64 string.')
      }
    })
  }

  isValidUrl(str) {
    const regex = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i
    return regex.test(str)
  }

  base64ToBlob(base64, mimeType) {
    // Decode the base64 string into a byte array
    const byteCharacters = atob(base64);
    
    // Create a Uint8Array to hold the byte data
    const byteArray = new Uint8Array(byteCharacters.length);
    
    // Populate the Uint8Array with byte data
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    
    // Create and return a Blob with the specified MIME type
    return new Blob([byteArray], { type: mimeType });
  }  
  
  areBase64FilesSame(base64File1, base64File2) {
    // Extract the Base64 content after the metadata prefix
    const content1 = base64File1.split(",")[1];
    const content2 = base64File2.split(",")[1];
  
    // Compare the Base64 content
    return content1 === content2;
  }
}

// Export methods individually
export const {
  formatDate,
  generateDailyToken,
  downloadFile,
  base64ArrayToFiles,
  fileOrUrlToBase64,
  convertBlobToBase64,
  getFileInfo,
  isValidUrl,
  base64ToBlob,
  areBase64FilesSame,
} = new CommanActions()
