import {reportError} from './errors'

export const pickQuery = node => {
    if (!node || !node.loc || !node.loc.source) {
        reportError(['Malformed Query'])
    } else {
        return node.loc.source.body
    }
}