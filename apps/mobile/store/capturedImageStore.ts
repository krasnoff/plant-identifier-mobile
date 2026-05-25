/**
 * Simple in-memory store to share the captured image URI between the search
 * and results screens without going through expo-router URL params.
 *
 * expo-router v4 (Expo 56) URL-encodes route params, which mangles file://
 * URIs and makes them unresolvable by expo-image on the receiving screen.
 */
let _capturedImageUri: string = '';

export function setCapturedImageUri(uri: string): void {
  _capturedImageUri = uri;
}

export function getCapturedImageUri(): string {
  return _capturedImageUri;
}
