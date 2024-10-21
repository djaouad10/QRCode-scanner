const QRCode = require("qrcode");

const generateQRCode = async (classId) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(classId);
    return qrCodeDataUrl;
  } catch (error) {
    console.log(error);
    return null;
  }
};
