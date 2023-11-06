export default class UndefinedSymbolException extends Error {
  constructor(m: string, buffer: string) {
    super(m + ': ' + buffer)
  }
}
