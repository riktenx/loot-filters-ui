import { ListDiff, StyleConfigSpec } from '../parsing/UiTypesSpec'

export const isConfigEmpty = (config: any): boolean => {
    if (config === undefined || config === null) {
        return true
    }

    if (Array.isArray(config)) {
        return config.length === 0
    }

    if (typeof config === 'object') {
        const keys = Object.keys(config)
        if (keys.includes('added') && keys.includes('removed')) {
            const listDiff = config as ListDiff
            return (
                isConfigEmpty(listDiff.added) && isConfigEmpty(listDiff.removed)
            )
        }

        return Object.keys(StyleConfigSpec.shape).every((key) =>
            isConfigEmpty(config[key])
        )
    }

    return false
}
