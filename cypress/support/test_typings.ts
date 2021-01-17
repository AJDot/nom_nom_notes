interface AssertInputByLabelOptions {
  by: 'label'
  label: string
  value: string
}

interface AssertInputByAttributeOptions {
  by: 'locator'
  locator: string
  value: string
  tag?: string
  method?: string
}

export type AssertInputOptionTypes = AssertInputByLabelOptions | AssertInputByAttributeOptions

interface AssertTextDefaultOptions {
  by: 'text'
  value: string
  not?: boolean
}

export type AssertTextOptionTypes = AssertTextDefaultOptions
