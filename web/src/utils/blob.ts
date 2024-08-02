// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
const download = (res: any, type: string) => {
  const blob = new Blob([res.file], {
    type,
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  if ('download' in link) {
    link.download = res.fileName;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } else {
    window.location.href = url;
  }
  URL.revokeObjectURL(url);
};

export const downloadXlsx = (res: any) => {
  download(
    res,
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );
};

export const downloadZip = (res: any) => {
  download(res, 'application/zip');
};
