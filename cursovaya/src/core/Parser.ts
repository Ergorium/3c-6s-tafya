import LexicalException from './LexicalException'
import { Token } from './Token'
import { TokenType } from './TokenType'
import UndefinedSymbolException from './UndefinedSymbolException'

const Delimiters: TokenType[] = [
  TokenType.comma,
  TokenType.dot,
  TokenType.semicolon,
  TokenType.gt,
  TokenType.lt,
  TokenType.equals,
  TokenType.lpar,
  TokenType.rpar,
  TokenType.plus,
  TokenType.minus,
  TokenType.minus,
  TokenType.delimiter,
]

const SpecialWords: Record<string, TokenType> = {
  var: TokenType.var,
  integer: TokenType.integer,
  real: TokenType.real,
  string: TokenType.string,
  begin: TokenType.begin,
  end: TokenType.end,
  repeat: TokenType.repeat,
  until: TokenType.until,
}
const SpectialSymbols: Record<string, TokenType> = {
  ',': TokenType.comma,
  ':': TokenType.colon,
  '.': TokenType.dot,
  ';': TokenType.semicolon,
  '>': TokenType.gt,
  '<': TokenType.lt,
  '=': TokenType.equals,
  '(': TokenType.lpar,
  ')': TokenType.rpar,
  '+': TokenType.plus,
  '-': TokenType.minus,
  '*': TokenType.multy,
  '/': TokenType.delimiter,
}

class EndException extends Error {
  /**
   *
   */
  constructor() {
    super()
  }
}

export class LexicalParser {
  constructor(
    private symbols: string[] = [],
    private buffer: string = '',
    private active: string | undefined = '',
    public table: Token[] = [],
    public errors: string[] = []
  ) {}
  init(input: string) {
    this.symbols = input.split('')
    try {
      this.next()
      this.add()
      this.s()
    } catch (err) {
      const error = err as Error
      const ctor = Object.getPrototypeOf(err).constructor.name
      if (ctor === UndefinedSymbolException.name) {
        return this.errors.push(error.message)
      }
      if (ctor === LexicalException.name) {
        return this.errors.push(error.message)
      }
      if (ctor === EndException.name) {
        return
      }
      throw err
    }
  }
  reset() {
    this.symbols = []
    this.buffer = ''
    this.active = ''
    this.table = []
  }

  add() {
    const v = this.symbols.shift()
    if (v === undefined) {
      if (this.buffer.length > 0) this.out()
      throw new EndException()
    } else {
      this.active = '' + v
    }
  }
  next() {
    this.buffer += this.active
  }
  out() {
    if (this.isSpecialWord(this.buffer)) {
      return this.table.push(new Token(SpecialWords[this.buffer]))
    }
    if (this.isSpecialSymbol(this.buffer)) {
      return this.table.push(new Token(SpectialSymbols[this.buffer]))
    }

    if (/^[a-zA-Z_][a-zA-Z0-9_]*/gm.test(this.buffer)) {
      return this.table.push(new Token(TokenType.id, this.buffer))
    }
    if (/[0-9]*/.test(this.buffer)) {
      return this.table.push(new Token(TokenType.literal, this.buffer))
    }
  }
  clear() {
    this.buffer = ''
  }

  s(): any {
    this.log('state s')
    if (this.active === undefined) return
    if (/[a-zA-Z_]/.test(this.active)) {
      return this.i()
    }
    if (/[0-9]/.test(this.active)) {
      return this.d()
    }
    if (this.active === ' ' || this.active === '\n') {
      this.clear()
      this.add()
      return this.s()
    }
    if (/:|,|\.|;|>|<|=|\(|\)|\+|-|\*|\//gm.test(this.active)) {
      return this.r()
    }
    throw new UndefinedSymbolException('Неккоректный символ', this.active)
  }
  end() {
    return
  }

  i(): any {
    this.next()
    this.add()
    this.log('State I')
    if ((this.buffer + this.active).length > 8) {
      throw new LexicalException(
        'Слишком длинное им переменной',
        (this.buffer + this.active) as string
      )
    }
    if (/[a-zA-Z_]/.test(this.active as string)) {
      return this.i()
    }
    if (/[0-9]/.test(this.active as string)) {
      return this.i()
    }
    if (!/:|,|\.|;|>|<|=|\(|\)|\+|-|\*|\/|\s/gm.test(this.active as string)) {
      throw new LexicalException(
        'Неккоректное значение',
        (this.buffer + this.active) as string
      )
    }
    this.out()
    this.clear()
    this.s()
  }

  d(): any {
    this.next()
    this.add()
    this.log('State D')
    if (/[0-9]/.test(this.active as string)) {
      return this.d()
    }
    if (/[a-zA-Z]/.test(this.active as string)) {
      throw new LexicalException(
        'Неккоректное описание ',
        this.buffer + this.active
      )
    }
    this.out()
    this.clear()
    this.s()
  }

  r() {
    this.next()
    this.add()
    this.log('State R')
    this.out()
    this.clear()
    this.s()
  }

  log(name = '') {
    // console.log(name, {
    //   buffer: this.buffer,
    //   activeSymbol: this.active,
    //   table: [...this.table],
    //   symbols: this.symbols,
    // })
  }

  isDelimiter(token: Token): boolean {
    return Delimiters.includes(token.type)
  }
  isSpecialWord(word: string): boolean {
    if (word === '') return false
    return Object.keys(SpecialWords).includes(word)
  }
  isSpecialSymbol(word: string): boolean {
    return Object.keys(SpectialSymbols).includes(word)
  }
}
