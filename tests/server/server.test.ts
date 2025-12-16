import { describe, expect, it } from 'vitest'
import { readGlobals } from '../../src/server/server'

describe('globalsDatabase', () => {
    it('should open the globals.json file', async () => {
        const globalsData = await readGlobals();
        expect(globalsData).toEqual({title: 'Blok-Test'})
    })
})