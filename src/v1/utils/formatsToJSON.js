export default function formatsToJSON(formats) {
  return formats.map((format) => {
    const parts = format.split(' -- ');
    return {
      name: parts[0],
      description: parts[1],
      text: format,
    };
  });
}
