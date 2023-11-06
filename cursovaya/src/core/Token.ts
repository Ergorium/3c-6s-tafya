export class Token {
  public id: string
  constructor(public type: TokenType, public value: string = '') {
    this.id = new Date() + type + value
  }
  toString() {
    return `${this.type}, ${this.value}`
  }
}
