import { Client } from "minio";
import { Buffer } from "buffer";
import { fileToolkit } from "./FileToolkit";
class MinioService {
    constructor() {
        this.minioClient = new Client({
            endPoint: import.meta.env.VITE_MINIO_END_POINT,
            useSSL: true,
            accessKey: import.meta.env.VITE_MINIO_ACCESS_KEY,
            secretKey: import.meta.env.VITE_MINIO_SECRET_KEY,
        });
        this.bucket = import.meta.env.VITE_DEFAULT_BUCKET;
    }

    ListBuckets = () => {
        return this.minioClient.listBuckets(function (err, buckets) {
            if (err) return console.log(err);
            return buckets;
        });
    };

    ListObject() {
        var data = [];
        var stream = this.minioClient.listObjects(this.bucket, "", true);
        stream.on("data", function (obj) {
            data.push(obj);
        });
        stream.on("end", function (obj) {
            console.log(data);
        });
        stream.on("error", function (err) {
            console.log(err);
        });
    }

    BucketExist = async () => {
        try {
            const exists = await new Promise((resolve, reject) => {
                this.minioClient.bucketExists(this.bucket, (err, exists) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(exists);
                    }
                });
            });

            return exists;
        } catch (err) {
            throw err;
        }
    };

    async getBufferValue(file) {
        //return Buffer of file-object required to use minio putObject method.
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = function () {
                const arrayBuffer = reader.result; // This is the ArrayBuffer of the selected image
                const bufferValue = Buffer.from(arrayBuffer);
                resolve(bufferValue);
            };

            reader.onerror = function (error) {
                reject(error);
            };
            reader.readAsArrayBuffer(file);
        });
    }

    getContentType(fileName) {
        if (fileName) {
            try {
                const ext = fileName.split(".").pop().toLowerCase();
                if (ext === "pdf") {
                    return "application/pdf";
                } else if (
                    ext === "jpg" ||
                    ext === "jpeg" ||
                    ext === "png" ||
                    ext === "gif"
                ) {
                    return "image/*";
                }
                // Add more conditions for other file types as needed
                return "application/octet-stream";
            } catch (error) {
                return error;
            }
        }
    }

    async convertFilesToWebpFormat(fileBlobs) {
        const convertedFiles = [];
        for (const fileBlob of fileBlobs) {
            const fileType = fileBlob.type.split('/')[0];

            if (fileType === 'image') {
                // Skip conversion if the image is a GIF (based on file extension)
                if (fileBlob.name.toLowerCase().endsWith('.gif')) {
                    convertedFiles.push(fileBlob);
                    continue;
                }

                // Convert image to WebP
                const image = await createImageBitmap(fileBlob);
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);

                const webpBlob = await new Promise((resolve) => {
                    canvas.toBlob((blob) => {
                        resolve(blob);
                    }, 'image/webp');
                });
                convertedFiles.push(new File([webpBlob], fileBlob.name.replace(/\.\w+$/, '.webp'), { type: 'image/webp' }));

            } else if (fileType === 'video') {

                const video = document.createElement('video');
                video.src = URL.createObjectURL(fileBlob);

                // Wait for the video to be loaded
                await new Promise((resolve, reject) => {
                    video.onloadedmetadata = () => {
                        const mediaRecorder = new MediaRecorder(video.captureStream());
                        const chunks = [];

                        mediaRecorder.ondataavailable = (event) => {
                            if (event.data.size > 0) {
                                chunks.push(event.data);
                                console.log('Chunk size:', event.data.size);
                            }
                        };

                        mediaRecorder.onstop = () => {
                            const webmBlob = new Blob(chunks, { type: 'video/webm' });
                            if (webmBlob.size > 0) {
                                convertedFiles.push(new File([webmBlob], fileBlob.name.replace(/\.\w+$/, '.webm'), { type: 'video/webm' }));
                            } else {
                                console.error('WebM blob size is 0.');
                            }
                            URL.revokeObjectURL(video.src); // Clean up
                            resolve();
                        };

                        mediaRecorder.onerror = (error) => {
                            console.error('MediaRecorder error:', error);
                            reject(error);
                        };

                        video.play();
                        mediaRecorder.start();

                        video.onended = () => {
                            mediaRecorder.stop();
                        };
                    };

                    video.onerror = (error) => {
                        console.error('Video loading error:', error);
                        reject(error);
                    };
                });
            } else {
                // For other file types, keep them as is
                convertedFiles.push(fileBlob);
            }
        }

        return convertedFiles;
    }

    async UploadFile(filesArr, folderName = "/Buzz/", originalFormat = false) {
        // convert blob file into webp 
        let convertedFiles = filesArr;
        if (!originalFormat)
            convertedFiles = await this.convertFilesToWebpFormat(filesArr);

        let uploadDetails = [];
        try {
            // Create an array of Promises for each upload
            // console.log("minio function", filesArr);
            const uploadPromises = convertedFiles.map(async (file) => {

                const contentType = this.getContentType(file.name);
                const headers = {
                    "Content-Type": contentType,
                    "X-Amz-Meta-Testing": "1234",
                    example: "5678",
                };
                const bufferValue = await this.getBufferValue(file);
                return new Promise((resolve, reject) => {
                    this.minioClient.putObject(
                        this.bucket,
                        `${folderName}/${file.name}`,
                        bufferValue,
                        bufferValue.length,
                        headers,
                        function (error, etag) {
                            if (error) {
                                console.error("Error:", error);
                                reject(error);
                            } else {
                                const uploadinfoObj = {
                                    filename: file.name,
                                    etag,
                                };
                                uploadDetails.push(uploadinfoObj);
                                resolve();
                            }
                        }
                    );
                });
            });

            // Wait for all uploads to complete before returning uploadDetails
            await Promise.all(uploadPromises);
            return uploadDetails;
        } catch (error) {
            console.error("Error reading and uploading the file:", error);
            throw error; // Rethrow the error to handle it elsewhere if needed
        }
    }


    DownloadFile(eid) {
        const client = this.minioClient;
        var data = [];
        var stream = this.minioClient.listObjects(this.bucket, "", true);
        stream.on("data", function (obj) {
            data.push(obj);
        });
        stream.on("end", function (obj) {
            const find = data.filter((data) => data.etag == eid);
            if (find.length > 0) {
                client.fGetObject(this.bucket, find[0].name, "../download", function (e) {
                    if (e) {
                        console.log(e);
                    }
                    return "done";
                });
            } else {
                return "file not found";
            }
        });
        stream.on("error", function (err) {
            console.log(err);
        });
    }

    async getPresignedUrlByEtag(etag, expiryInSeconds, bucketName = this.bucket) {
        try {
            // Initialize a variable to store the matching object
            let matchingObject = null;

            // Create a promise to list objects and find the matching one
            const listObjectsPromise = new Promise((resolve, reject) => {
                const objects = [];
                const stream = this.minioClient.listObjects(bucketName, "", true);
                stream.on("data", (obj) => objects.push(obj));
                stream.on("end", () => {
                    matchingObject = objects.find((obj) => obj.etag === etag);
                    if (matchingObject) {
                        resolve();
                    } else {
                        reject(new Error("File with the specified ETag not found."));
                    }
                });
                stream.on("error", reject);
            });

            await listObjectsPromise;

            // Generate a presigned URL for the matching object
            const url = await this.minioClient.presignedGetObject(
                bucketName,
                matchingObject.name,
                expiryInSeconds
            );
            return url;
        } catch (error) {
            console.error("Error generating presigned URL:", error);
            throw error;
        }
    }

    async CreateBucket(bucketName) {
        try {
            const resp = await this.minioClient.makeBucket(bucketName, "us-west-1");
            return resp;
        } catch (error) {
            console.log("Bucket already created!");
        }

        // return new Promise((resolve, reject) => {
        //   this.minioClient.makeBucket(bucketName, "us-west-1", function (e) {
        //     if (e) {
        //       console.error(e);
        //       reject(e);
        //     } else {
        //       console.log("Success");
        //       resolve(true);
        //     }
        //   });
        // });
    }

    async ChangeBucketPolicy(bucketName) {
        const policy = {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: "Allow",
                    Principal: "*",
                    Action: ["s3:GetObject"],
                    Resource: [`arn:aws:s3:::${bucketName}/*`],
                },
            ],
        };

        return new Promise((resolve, reject) => {
            this.minioClient.setBucketPolicy(
                bucketName,
                JSON.stringify(policy),
                function (err) {
                    if (err) {
                        console.error(err);
                        reject(err);
                    } else {
                        console.log(`Bucket ${bucketName} is now public.`);
                        resolve(true);
                    }
                }
            );
        });
    }

    DeleteBucket(bucketName) {
        this.minioClient.removeBucket(bucketName, function (e) {
            if (e) {
                return console.log(e);
            }
            return "success";
        });
    }

    SearchFile = async (eid, bucketName = this.bucket) => {
        return new Promise((resolve, reject) => {
            const client = this.minioClient;
            const data = [];

            const stream = client.listObjects(bucketName, '', true);

            stream.on('data', function (obj) {
                data.push(obj);
            });
            stream.on('end', function () {
                // console.log("data", data)
                const find = data.find((data) => data.etag == eid);
                if (find) {
                    let obj = {};
                    const fileUrl = client.protocol + '//' + client.host + ':' + client.port + '/' + bucketName + '/' + find.name;
                    obj.fileName = find.name;
                    obj.url = fileUrl;
                    resolve(obj);
                } else {
                    console.log('No file found!');
                    reject(new Error('No file found'));
                }
            });

            stream.on('error', function (err) {
                console.log(err);
                reject(err);
            });
        });
    };

    async DeleteFile(eid) {
        const client = this.minioClient;
        var data = [];
        var stream = this.minioClient.listObjects(this.bucket, "", true);
        stream.on("data", function (obj) {
            data.push(obj);
        });
        stream.on("end", function (obj) {
            const find = data.filter((data) => data.etag == eid);
            if (find.length > 0) {
                client.removeObject(this.bucket, find[0].name, function (err) {
                    if (err) {
                        return console.log("Unable to remove object", err);
                    }
                    console.log("Removed the object");
                    return "Removed the object";
                });
            } else {
                console.log("No file found!");
                return "No file found";
            }
        });
        stream.on("error", function (err) {
            console.log(err);
        });
    }

    async DeleteUsingFilePath(filePath, editedImagePath) {
        const client = this.minioClient;

        try {
            const data = await new Promise((resolve, reject) => {
                const data = [];
                const stream = this.minioClient.listObjects(this.bucket, "", true);

                stream.on("data", (obj) => {
                    data.push(obj);
                });

                stream.on("end", () => {
                    resolve(data);
                });

                stream.on("error", (err) => {
                    reject(err);
                });
            });

            const find = data.filter((data) => data.name === filePath);
            const find2 = data.filter(
                (data) => data.name === editedImagePath + "/" + filePath
            );

            if (find.length > 0) {
                await client.removeObject(this.bucket, find[0].name);
            } else {
                return "No file found";
            }

            if (find2.length > 0) {
                await client.removeObject(this.bucket, find2[0].name);
            } else {
                return "No file found";
            }

            return "Removed the edited object";
        } catch (error) {
            console.error("Error in DeleteUsingFilePath: ", error);
        }
    }

    async uploadBase64Files(fileArray, path, originalFormat = false) {
        if (fileArray.length === 0) {
            return { error: 'No files provided for upload.' };
        }

        if (!Array.isArray(fileArray)) {
            fileArray = [fileArray];
        }

        for (const file of fileArray) {
            if (typeof file !== 'string' || !file.startsWith('data:') || !file.includes('base64,')) {
                return { error: 'Invalid file format. One or more files are not in base64 format.' };
            }
        }

        // let response = fileArray.map(async(item) => {
        //     return await fileToolkit.convertBase64ArrayToFiles([item])[0]
        // })
        let response = await fileToolkit.convertBase64ArrayToFiles(fileArray);

        return await this.UploadFile(response, path, originalFormat);
    }

}

export default new MinioService();