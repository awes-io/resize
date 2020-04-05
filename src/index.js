import { merge } from 'lodash'

// quality of image by default
const IMAGE_QUALITY = 85
// proxy endpoint path for resize service
const CROP_ENDPOINT = '/cdn-cgi/image/'
// default crop options
const CROP_OPTIONS = {
    fit: 'cover',
    gravity: '0.5x0.5'
}

/**
 * resize() - URL generation with parameters for resizing
 *
 * @param {string}  url - Link to the original image
 * @param {number:optional}  width - Width of the image, undefined by default
 * @param {string:optional}  aspect - Aspect ratio of the image, ie 16:9 or 4x3. By default: `null`
 * @param {object:optional}  options
 *      domain - Custom static domain without protocol, by default: `null`
        protocol - Customization for protocol, by default has used protocol from @url
        crop - Mode for croping (center, top, bottom), by default: `center`
        prefix - Prefix for crop server, by default: `cdn-cgi/image`
 *      options - List of options for modify parameters for image. More info: https://developers.cloudflare.com/images/about/
 * */
function resize(url, width, aspect, options) {
    url = _filterUrl(url)

    let parsedUrl = {}
    try {
        parsedUrl = new URL(url)
    } catch (e) {
        console.error(e)
    }

    // default crop options
    let cropOptions = {}
    let cropEndpoint = CROP_ENDPOINT
    let cdnDomain = parsedUrl.hostname
    let cdnProtocol = parsedUrl.protocol

    // -- Validation & Formating

    // aspect ratio
    if (
        typeof aspect !== 'undefined' &&
        aspect !== '' &&
        aspect &&
        aspect !== 'undefined'
    ) {
        cropOptions = merge(
            CROP_OPTIONS,
            _getHeightInOptionsByAspect(width, aspect)
        )
    }

    // crop options.domain
    if (
        typeof options !== 'undefined' &&
        typeof options.domain !== 'undefined'
    ) {
        cdnDomain = options.domain
    }

    // crop options.protocol
    if (
        typeof options !== 'undefined' &&
        typeof options.protocol !== 'undefined'
    ) {
        cdnProtocol = (options.protocol + ':').replace('::', ':')
    }

    // crop options.prefix
    if (
        typeof options !== 'undefined' &&
        typeof options.prefix !== 'undefined'
    ) {
        cropEndpoint = options.prefix
    }

    // crop options.options
    if (
        typeof options !== 'undefined' &&
        typeof options.options !== 'undefined'
    ) {
        cropOptions = merge(cropOptions, options.options)
    }

    //// ------

    if (typeof customDomain !== 'undefined' && customDomain != '') {
        cdnDomain = customDomain
    }
    // customDomain
    return `${cdnProtocol}//${cdnDomain}${cropEndpoint}${_getOptions(
        width,
        cropOptions
    )}${parsedUrl.pathname}`
}

const _filterUrl = url => {
    return url.replace('https://storage.googleapis.com/', 'https://')
}

const _getHeightInOptionsByAspect = (width, aspect) => {
    const aspectRation = _parseAspectRatio(aspect)
    if (!aspectRation) {
        return {}
    }
    return {
        h: _getHeightByFormat(width, aspectRation)
    }
}

const _parseAspectRatio = ratio => {
    if (typeof ratio === 'undefined') {
        return null
    }

    if (
        !ratio ||
        ratio === '' ||
        ratio === 'undefined' ||
        typeof ratio !== 'string'
    ) {
        return null
    }

    ratio = ratio.replace(':', 'x').toLowerCase()

    if (ratio.indexOf('x') === -1) {
        return null
    }

    const ratioObject = ratio.split('x')

    if (Object.keys(ratioObject).length === 2) {
        Object.keys(ratioObject).forEach(function(key) {
            if (parseInt(ratioObject[key]) <= 0) {
                return null
            }
        })
    }
    return ratioObject
}

const _getHeightByFormat = (width, aspectRation) => {
    return Math.round((width * aspectRation[1]) / aspectRation[0])
}

// get string with paramentes
const _getOptions = (width, options) => {
    // save default quality of image
    let parameters = {
        q: IMAGE_QUALITY
    }
    // push width of the image if exists
    if (typeof width !== 'undefined' && parseInt(width) > 0) {
        parameters = Object.assign({ w: parseInt(width) }, parameters)
    }

    // apply custom options
    if (typeof options !== 'undefined' && options) {
        Object.keys(options).forEach(function(key) {
            if (parameters.hasOwnProperty(key)) {
                parameters[key] = options[key]
            } else {
                parameters = Object.assign({ [key]: options[key] }, parameters)
            }
        })
    }

    // return formatted parameter
    return Object.keys(parameters)
        .map(function(key) {
            return `${key}=${parameters[key]}`
        })
        .join(',')
}

export default resize
