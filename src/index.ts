import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

export function hi(name?: string) {
    console.log('Hello', name)
}

hi(__dirname + ': Justorez')
