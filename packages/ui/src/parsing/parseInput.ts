import { parse as parseYaml } from 'yaml'
import { InputSpec as FilterSpecInput } from './FilterTypesSpec'
import {
    BooleanInputSpec,
    EnumListInputSpec,
    Input,
    InputSpec,
    NumberInputSpec,
    StringListInputSpec,
    StyleInputSpec,
    TextInputSpec,
} from './UiTypesSpec'
import { parseDefine, Rs2fDefine } from './rs2fParser'
import { TokenStream } from './tokenstream'

export const parseInput = (comment: string, define: TokenStream): Input => {
    const declarationContent = comment.substring(
        comment.indexOf('\n'), // chop the structured declaration
        comment.indexOf('*/')
    )

    // FUTURE: actually consume the token stream in parseDefine
    const line = define.peek()!!.location.line
    const inputDefault: Rs2fDefine = parseDefine(define.toString(), line)

    const baseInput = {
        // ensure base input is correct - it should not have a default field - we define that in the macro only
        // This throws if the core input fields are incorrect
        ...FilterSpecInput.parse(parseYaml(declarationContent)),
        macroName: inputDefault.name,
        default: inputDefault.type === 'null' ? undefined : inputDefault.value,
    }
    const input = InputSpec.parse(baseInput)

    // validate the input with a default field; to check that the default field is correct
    switch (input.type as unknown as string) {
        case 'boolean':
            return BooleanInputSpec.parse(input)
        case 'number':
            return NumberInputSpec.parse(input)
        case 'stringlist':
            return StringListInputSpec.parse(input)
        case 'enumlist':
            return EnumListInputSpec.parse(input)
        case 'style':
            return StyleInputSpec.parse(input)
        case 'text':
            return TextInputSpec.parse(input)
        default:
            throw new Error(`Invalid input type: ${input.type}`)
    }
}
