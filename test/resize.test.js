import assert from 'assert'
import resize from '../src/index.js'

const domain = 'example.com'
const imagePath = '/4-formatOriginal.jpg'
const cropPrefix = '/cdn-cgi/image/'

describe('Google Storage and Domains', function() {
    it('Original image from Google Storage', function() {
        assert.strictEqual(
            resize(`https://storage.googleapis.com/${domain}${imagePath}`),
            `https://${domain}${cropPrefix}q=85${imagePath}`
        )
    })

    it('Original image from CDN', function() {
        assert.strictEqual(
            resize(`https://${domain}${imagePath}`),
            `https://${domain}${cropPrefix}q=85${imagePath}`
        )
    })

    it("Original image with custom domain and HTTPS (params: width: null, aspect: '')", function() {
        assert.strictEqual(
            resize(`https://dev.${domain}${imagePath}`, null, '', {
                domain: 'example.com'
            }),
            `https://${domain}${cropPrefix}q=85${imagePath}`
        )
    })

    it('Original image with custom domain HTTP (params: width: 0, aspect: null)', function() {
        assert.strictEqual(
            resize(`http://dev.${domain}${imagePath}`, 0, null, {
                domain: 'example.com'
            }),
            `http://${domain}${cropPrefix}q=85${imagePath}`
        )
    })

    it('Original image with custom Domain and custom protocol (params: width: undefined, aspect: undefined)', function() {
        assert.strictEqual(
            resize(`http://dev.${domain}${imagePath}`, undefined, undefined, {
                domain: 'example.com',
                protocol: 'https'
            }),
            `https://${domain}${cropPrefix}q=85${imagePath}`
        )
    })

    it('Subdomain should be as a subdomain (params: width: undefined, aspect: 0)', function() {
        assert.strictEqual(
            resize(`http://dev.${domain}${imagePath}`, undefined, 0, {
                protocol: 'https'
            }),
            `https://dev.${domain}${cropPrefix}q=85${imagePath}`
        )
    })
})

describe('Crop testing', function() {
    it('width 1600 and aspect ratio 16x9', function() {
        assert.strictEqual(
            resize(
                `https://storage.googleapis.com/${domain}${imagePath}`,
                1600,
                '16x9'
            ),
            `https://${domain}${cropPrefix}h=900,gravity=0.5x0.5,fit=cover,w=1600,q=85${imagePath}`
        )
    })
    it('width 1600 and aspect ratio wrong ration 16', function() {
        assert.strictEqual(
            resize(
                `https://storage.googleapis.com/${domain}${imagePath}`,
                1600,
                16
            ),
            `https://${domain}${cropPrefix}h=900,gravity=0.5x0.5,fit=cover,w=1600,q=85${imagePath}`
        )
    })
    it('width 1600 and aspect ratio 4:3', function() {
        assert.strictEqual(
            resize(
                `https://storage.googleapis.com/${domain}${imagePath}`,
                1600,
                '4x3'
            ),
            `https://${domain}${cropPrefix}h=1200,gravity=0.5x0.5,fit=cover,w=1600,q=85${imagePath}`
        )
    })
    it('width 1200 and aspect ratio 3X4 and custom options', function() {
        assert.strictEqual(
            resize(
                `https://storage.googleapis.com/${domain}${imagePath}`,
                1200,
                '3x4',
                { options: { q: 75 } }
            ),
            `https://${domain}${cropPrefix}h=1600,gravity=0.5x0.5,fit=cover,w=1200,q=75${imagePath}`
        )
    })
})

describe('Customization', function() {
    it('prefix should be customized', function() {
        assert.strictEqual(
            resize(
                `https://storage.googleapis.com/${domain}${imagePath}`,
                null,
                null,
                { prefix: '/test/' }
            ),
            `https://${domain}/test/q=85${imagePath}`
        )
    })
})
