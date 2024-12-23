import { decode, encode } from "blurhash";

class BlurHash {
    /**
     * Loads an image from a given URL and returns it as an Image object.
     * @param {string} src - The URL of the image.
     * @returns {Promise<HTMLImageElement>}
     */
    loadImage = async (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous"; // Must be set before src
            img.onload = () => resolve(img);
            img.onerror = (...args) => reject(new Error("Failed to load image."));
            img.src = src;
        });
    };

    /**
     * Extracts image data (pixels) from a given HTMLImageElement.
     * @param {HTMLImageElement} image - The loaded image.
     * @returns {ImageData}
     */
    getImageData = (image) => {
        const canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;

        const context = canvas.getContext("2d");
        if (!context) throw new Error("Failed to get 2D context.");

        context.drawImage(image, 0, 0);
        return context.getImageData(0, 0, image.width, image.height);
    };

    /**
     * Encodes an image URL into a BlurHash string.
     * @param {string} imageUrl - The URL of the image.
     * @returns {Promise<string>}
     */
    encodeImageToBlurhash = async (imageUrl) => {
        const image = await this.loadImage(imageUrl);
        const imageData = this.getImageData(image);

        // Encode the image data into a BlurHash string
        return encode(imageData.data, imageData.width, imageData.height, 4, 4);
    };

    /**
     * Decodes a BlurHash string into an image placeholder.
     * @param {string} blurhash - The BlurHash string.
     * @returns {HTMLCanvasElement}
     */
    decodeImageToBlurhash = async (blurhash) => {
        const width = 32; // Decoded image placeholder width
        const height = 32; // Decoded image placeholder height

        const pixels = decode(blurhash, width, height);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Failed to get 2D context.");

        const imageData = ctx.createImageData(width, height);
        imageData.data.set(pixels);
        ctx.putImageData(imageData, 0, 0);

        return canvas; // Return the canvas with the decoded placeholder
    };
}

export const {
    encodeImageToBlurhash,
    decodeImageToBlurhash,
} = new BlurHash();
