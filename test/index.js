/* global describe, it */
require('should')

const abs = require('../src')
const baseUrl = 'https://www.example.com/'

describe('module', () => {
  it('should return a string', () => {
    abs('test').should.be.a.String()
  })
})

describe('resolve', () => {
  it('should resolve urls inside inline css (style attribute)', () => {
    const input = `<div style="background-image: url('assets/icon.png');"></div>`
    const expected = `<div style="background-image: url('${baseUrl}assets/icon.png');"></div>`
    const css = abs(input, baseUrl)
    css.should.eql(expected)
  })

  it('should resolve urls inside style tags', () => {
    const input = `
      <style>
        body {
          background: url(logo.png)
        }
      </style>
    `
    const expected = input.replace('logo.png', `${baseUrl}logo.png`)
    const css = abs(input, baseUrl)
    css.should.eql(expected)
  })

  it('should ignore css urls that identify a html element, e.g. for svgs', () => {
    const input = `
      <style>
        body {
          background: url(#element)
        }
      </style>
    `
    const css = abs(input, baseUrl)
    css.should.eql(input)
  })
})
