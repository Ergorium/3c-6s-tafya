import { Token } from './Token'

export class SyntaxError extends Error {
  constructor(msg: string, token: Token | undefined) {
    let message = `Ошибка синтаксического разбора. Ожидался "${msg}"`
    if (token) {
      message += ` Текущее значение "${
        token.value || token.type || 'отсутсвует'
      }"`
    }
    super(message)
  }
}
