let version: string

try {
    // Running in a container this will be present
    version = 'git' + require('./version.json').version
}
catch (ignored) {
    // Probably running locally
    version = 'in-dev'
}

export default version