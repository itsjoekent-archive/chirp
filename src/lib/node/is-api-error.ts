export default function isApiErrorType(error: any) {
  return !(!error || !('error' in error));
}
