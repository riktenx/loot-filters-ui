import { Typography } from '@mui/material'
import {
    EnumListInput,
    FilterConfiguration,
    ListDiff,
    ListDiffSpec,
} from '../../parsing/UiTypesSpec'
import {
    applyDiff,
    convertToListDiff,
    EMPTY_DIFF,
} from '../../utils/ListDiffUtils'
import { Option, UISelect } from './UISelect'

export const EnumInputComponent: React.FC<{
    input: EnumListInput
    config: FilterConfiguration
    onChange: (diff: ListDiff) => void
    readonly: boolean
}> = ({ input, config, onChange, readonly }) => {
    const configuredDiff = ListDiffSpec.optional()
        .default(EMPTY_DIFF)
        .parse(config?.inputConfigs?.[input.macroName])

    const currentSetting = applyDiff(input.default, configuredDiff)

    const options: Option<string>[] = input.enum.map((enumValue) => {
        if (typeof enumValue === 'string') {
            return {
                label: enumValue,
                value: enumValue,
            }
        }
        return enumValue
    })

    const selectedOptions = Array.isArray(currentSetting)
        ? currentSetting
              .filter((value): value is string => typeof value === 'string')
              .map((value) => {
                  const found = options.find((o) => o.value === value)
                  if (found) {
                      return found
                  }
                  return {
                      label: value,
                      value: value,
                  }
              })
        : []

    return (
        <div>
            <div style={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Typography variant="h6" color="primary">
                    {input.label}
                </Typography>
            </div>
            <UISelect<string>
                disabled={readonly}
                options={options}
                value={selectedOptions}
                onChange={(newValue: Option<string>[] | null) => {
                    onChange(
                        convertToListDiff(
                            newValue
                                ? newValue.map((option) => option.value)
                                : [],
                            input.default
                        )
                    )
                }}
                multiple
                label="Select options"
            />
        </div>
    )
}
