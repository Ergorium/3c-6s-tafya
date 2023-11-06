export default class LexicalException extends Error {
  constructor(m: string, buffer: string) {
    super(m + ': ' + buffer)
  }
}
