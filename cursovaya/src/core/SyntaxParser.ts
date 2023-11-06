import { Token } from './Token'
import { TokenType } from './TokenType'
import { SyntaxError } from './SyntaxError'

export class SyntaxParser {
  private currentToken!: Token

  constructor(public list: Token[]) {}
  static Init(list: Token[]) {
    return new SyntaxParser(list)
  }
  start() {
    if (this.list.length === 0) {
      throw new Error('Ничего не введено')
    }
    this.next()
    this.rules['<программа>']()
  }

  private rules = {
    '<программа>': () => {
      switch (this.currentToken.type) {
        case TokenType.var:
          this.rules['глобальное объявление']()
          break
      }
      if (this.currentToken.type !== TokenType.begin) {
        this.err('begin')
      }
      this.next()
      this.rules['<список операторов>']()
      if (this.currentToken.type !== TokenType.end) {
        this.err('end')
      }
      this.next()
      if (this.currentToken.type !== TokenType.dot) {
        this.err('.')
      }
    },
    'глобальное объявление': () => {
      if (this.currentToken.type !== TokenType.var) {
        this.err('var')
      }
      this.next()
      this.rules['<список объявлений>']()
    },
    '<список объявлений>': () => {
      this.rules['<объявление>']()
      if (this.currentToken.type !== TokenType.semicolon) {
        this.err(';')
      }
      this.next()
      this.rules['<список об>']()
    },
    '<объявление>': () => {
      if (this.currentToken.type !== TokenType.id) {
        this.err('id')
      }
      this.next()
      this.rules['<об>']()
    },
    '<список об>': () => {
      switch (this.currentToken.type) {
        case TokenType.begin:
          return
        case TokenType.id:
          this.rules['<список объявлений>']()
          break
        default:
          this.err('begin или id')
      }
    },
    '<об>': () => {
      switch (this.currentToken.type) {
        case TokenType.colon:
          this.next()
          this.rules['<тип>']()
          break
        case TokenType.comma:
          this.next()
          this.rules['<объявление>']()
          break
        default:
          this.err(', или :')
      }
    },
    '<тип>': () => {
      if (
        ![TokenType.real, TokenType.integer, TokenType.string].includes(
          this.currentToken.type
        )
      ) {
        this.err('real  integer | string')
      }
      this.next()
    },
    '<список операторов>': () => {
      this.rules['<оператор>']()
      this.rules['<оп>']()
    },
    '<оп>': () => {
      switch (this.currentToken.type) {
        case TokenType.id:
        case TokenType.repeat:
          this.rules['<список операторов>']()
          break
        case TokenType.until:
          break
        case TokenType.end:
          break
        default:
          this.err('end, untill, id', this.currentToken, this.list)
      }
    },
    '<оператор>': () => {
      switch (this.currentToken.type) {
        case TokenType.id:
          this.rules['<присваивание>']()
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          if (this.currentToken.type !== TokenType.semicolon) {
            this.err(';')
          }
          this.next()
          break
        case TokenType.repeat:
          this.rules['<цикл>']()
          break
      }
    },
    '<присваивание>': () => {
      if (this.currentToken.type !== TokenType.id) {
        this.err('id')
      }
      this.next()
      if (this.currentToken.type !== TokenType.colon) {
        this.err(':')
      }
      this.next()
      if (this.currentToken.type !== TokenType.equals) {
        this.err('=')
      }
      this.next()
      this.rules['<арифметическая операция>']()
    },
    '<арифметическая операция>': () => {
      this.rules['<операнд>']()
      this.rules['<ао>']()
    },
    '<ао>': () => {
      switch (this.currentToken.type) {
        case TokenType.semicolon:
          break
        case TokenType.plus:
        case TokenType.minus:
        case TokenType.multy:
        case TokenType.delimiter:
          this.rules['<арифметический знак>']()
          this.rules['<операнд>']()
          break
        default:
          this.err(';, +, -, *, /')
      }
    },
    '<арифметический знак>': () => {
      if (
        ![
          TokenType.plus,
          TokenType.minus,
          TokenType.minus,
          TokenType.delimiter,
        ].includes(this.currentToken.type)
      ) {
        this.err('+, -, *, /')
      }
      this.next()
    },
    '<операнд>': () => {
      if (![TokenType.id, TokenType.literal].includes(this.currentToken.type)) {
        this.err('id или lit')
      }
      this.next()
    },
    '<цикл>': () => {
      if (this.currentToken.type !== TokenType.repeat) {
        this.err('repeat')
      }
      this.next()
      this.rules['<список операторов>']()
      if (this.currentToken.type !== TokenType.until) {
        this.err('until')
      }
      this.next()
      if (this.currentToken.type !== TokenType.lpar) {
        this.err('(')
      }
      this.next()
      this.rules['<условие>']()
      if (this.currentToken.type !== TokenType.rpar) {
        this.err(')')
      }
      this.next()
    },
    '<условие>': () => {
      this.rules['<операнд>']()
      this.rules['<условный знак>']()
      this.rules['<операнд>']()
    },
    '<условный знак>': () => {
      switch (this.currentToken.type) {
        case TokenType.lt:
        case TokenType.gt:
          this.next()
          break
        case TokenType.equals:
          this.next()
          if (this.currentToken.type !== TokenType.equals) {
            this.err('==')
          }
          this.next()
          break
        default:
          this.err('==, <, >')
      }
    },
  }

  private next() {
    const a = this.list.shift()
    if (a) this.currentToken = a
  }

  private err(value = '', ...arg: any) {
    if (arg) {
      console.log(...arg)
    }
    // throw new Error('Ожидалось ' + value)
    throw new SyntaxError(value, this.currentToken)
  }

  private test(str = '', ...arg: any) {
    console.log(str, this, ...arg)
  }
}
