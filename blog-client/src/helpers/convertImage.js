export default function convertBinaryImageData(binaryImgData) {
  if (!binaryImgData || !binaryImgData.data) return null;
  const binaryString = binaryImgData.data
    .map(byte => window.String.fromCharCode(byte))
    .join('');
  return `data:image/png;base64,${window.btoa(binaryString)}`;
}
