const encodeUrl = require('encodeurl')
const url = require('url')
const isProtoless = require('url-is-protoless')

/**
 * Pass in CSS from stylesheets or inline css tags and receive back CSS with all urls resolved to an absolute url.
 * @param {string} css - the css string to resolve to an absolute url
 * @param {string} resolveTo - the absolute url to resolve relative urls (urls without a protocol) to
 *
 * @example
 * const absCss = require('css-absolutely', 'http://www.example.com/')
 * const input = `<div style="background-image: url('assets/icon.png');"></div>`
 * const expected = `<div style="background-image: url('http://www.example.com/assets/icon.png');"></div>`
 * const css = abs(input, baseUrl)
 * console.log(css === expected) // true
 *
 * @returns {string} an example return type
 */
function absoluteCss (css, resolveTo) {
  const urlRegex = /url\(\s?["']?([^)'"]+)["']?\s?\).*/i

  let index = 0
  let found
  while ((found = urlRegex.exec(css.substring(index))) !== null) {
    const rawSrc = found[1]
    const encodedSrc = encodeUrl(rawSrc.trim())
    if (isProtoless(encodedSrc)) {
      const resolvedSrc = url.resolve(resolveTo, encodedSrc)
      const foundIndex = found.input.indexOf(rawSrc)

      css =
        css.slice(0, index + foundIndex) +
        resolvedSrc +
        css.slice(index + foundIndex + rawSrc.length)

      index += resolvedSrc.length - rawSrc.length
    }
    index += found.index + rawSrc.length
  }

  return css
}

module.exports = absoluteCss
