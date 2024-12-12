const sharp = require("sharp");

const minimized = async (input: string, output: string, format = "jpeg") => {
  try {
    const destination = `${output}${format}`;
    console.log("MINIMIZED IMAGE destination", destination);

    await sharp(input)
      .resize(100, 100, {
        fit: sharp.fit.outside,
        withoutEnlargement: true,
      })
      .toFormat(format)
      .toFile(destination);
    return true;
    // Write code to store image to the database
  } catch (e) {
    console.log("MINIMIZED IMAGE ERROR");
    console.log(e);
    return false;
  }
};

const normal = async (input: string, output: string, format = "jpeg") => {
  try {
    const destination = `${output}${format}`;
    console.log("Normal IMAGE destination", destination);

    await sharp(input)
      .resize(600, 600, {
        fit: sharp.fit.outside,
        withoutEnlargement: true,
      })
      .toFormat(format)
      .toFile(destination);
    return true;

    // Write code to store image to the database
  } catch (e) {
    console.log("Normal IMAGE ERROR");
    console.log(e);
    return false;
    // handles error if any
  }
};

const custom = async (
  input: string,
  output: string,
  width: number,
  height: number,
  format = "jpeg"
) => {
  try {
    console.log({ input });
    const destination = `${output}${format}`;
    console.log("custom IMAGE destination", destination);

    await sharp(input)
      .resize(width, height, {
        fit: sharp.fit.outside,
        withoutEnlargement: true,
      })
      .toFormat(format)
      .toFile(destination);
    return true;

    // Write code to store image to the database
  } catch (e) {
    console.log("custom IMAGE ERROR");
    console.log(e);
    return false;
    // handles error if any
  }
};

const withoutConfig = async (
  input: string,
  output: string,
  format = "jpeg"
) => {
  try {
    const destination = `${output}${format}`;
    console.log("withoutConfig IMAGE destination", destination);

    await sharp(input).toFormat(format).toFile(destination);

    return true;
    // Write code to store image to the database
  } catch (e) {
    console.log("withoutConfig IMAGE ERROR");
    console.log(e);
    return false;
    // handles error if any
  }
};

const Image = { minimized, normal, withoutConfig, custom };

export default Image;
