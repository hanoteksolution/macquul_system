/**
 * Hermes-safe replacement for expo-asset/build/AssetUris.js
 * Avoids `urlObject.protocol = …` which crashes with "protocol has only a getter".
 */
export function getFilename(url) {
  const { pathname, searchParams } = new URL(url, 'https://e');
  if (__DEV__) {
    if (searchParams.has('unstable_path')) {
      const encodedFilePath = decodeURIComponent(searchParams.get('unstable_path'));
      return getBasename(encodedFilePath);
    }
  }
  return getBasename(pathname);
}

function getBasename(pathname) {
  return pathname.substring(pathname.lastIndexOf('/') + 1);
}

export function getFileExtension(url) {
  const filename = getFilename(url);
  const dotIndex = filename.lastIndexOf('.');
  return dotIndex > 0 ? filename.substring(dotIndex) : '';
}

export function getManifestBaseUrl(manifestUrl) {
  const urlObject = new URL(manifestUrl);
  let nextProtocol = urlObject.protocol;
  if (nextProtocol === 'exp:') {
    nextProtocol = 'http:';
  } else if (nextProtocol === 'exps:') {
    nextProtocol = 'https:';
  }

  const directory = urlObject.pathname.substring(0, urlObject.pathname.lastIndexOf('/') + 1);
  return `${nextProtocol}//${urlObject.host}${directory}`;
}
