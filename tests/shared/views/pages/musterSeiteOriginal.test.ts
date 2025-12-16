import { join } from 'path'
import { describe, expect, it } from 'vitest'
import pug from 'pug'
import { load } from 'cheerio'

describe('page: form', () => {
    const pathToViews = join('src', 'shared', 'views')
    const pathToTemplate = join('src', 'shared', 'views', 'pages', 'musterSeiteOriginal.pug')
    const template = pug.compileFile('pathToTemplate')

    it('should contain a list of fruits', () => {
        const data = {
            theTitle: 'Hans',
            serverTime: new Date(),
            fruits: ['apple', 'ei', 'banana']
        }
        const html = template(data)
        const $ = load(html)

        const h1 = $('h1').text()
        expect(h1).toContain(data.theTitle)

    })
})
