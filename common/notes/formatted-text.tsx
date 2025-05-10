export function parseFormattedText(text: string) {
  const lines = text.split('\n');
  return lines.map((line, index) => {
    if (line.startsWith('* ')) {
      return <li key={index}>{line.substring(2)}</li>;
    } else if (line.startsWith('- ')) {
      return <p key={index}>{line}</p>;
    } else if (line.match(/^\d+[.)] /)) {
      return <p key={index}>{line}</p>;
    } else if (line.match(/^[a-z][.)] /)) {
      return <p key={index}>{line}</p>;
    } else {
      return <p key={index}>{line}</p>;
    }
  });
}
