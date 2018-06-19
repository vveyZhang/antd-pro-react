// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority() {
  const authorityString = localStorage.getItem('authority') || 'guest';
  const authority = authorityString.split('-');
  return authority
}

export function setAuthority(authority) {
  if (typeof authority == "string") return localStorage.setItem('authority', authority);
  authority = authority.join('-')
  return localStorage.setItem('authority', authority);
}
