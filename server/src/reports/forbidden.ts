export function forbidden(response) {
  response.status(403).json({ title: 'User does not have access to read this resources' });
  return;
}
