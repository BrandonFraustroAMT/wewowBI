// plugins/link-resolver.js
export default function (doc) {
  if (doc.type === 'page') {
    return `/${doc.uid}`;
  }
  return '/';
}
  