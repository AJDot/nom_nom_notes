import { Mutable } from "~/interfaces/utilInterfaces"

class SelectionUtils {
  static getCaret(element: HTMLElement): number {
    let position = 0
    const isSupported = typeof window.getSelection !== "undefined"
    if (isSupported) {
      const selection = window.getSelection()
      if (selection && selection.rangeCount !== 0) {
        const range = selection.getRangeAt(0)
        const preCaretRange = range.cloneRange()
        preCaretRange.selectNodeContents(element)
        preCaretRange.setEnd(range.endContainer, range.endOffset)
        position = preCaretRange.toString().length
      }
    }
    return position
  }

  static moveCaret(element: HTMLElement, position: number): void {
    const isSupported = typeof window.getSelection !== "undefined"
    if (isSupported) {
      const range = document.createRange()
      const selection = window.getSelection()
      if (!selection) return

      const lastNode: HTMLElement | ChildNode | Text = element.childNodes[element.childNodes.length - 1] ?? element
      const length = ('length' in lastNode ? (lastNode.length || 0) : 0) as number

      range.setStart(lastNode, Math.min(length, position))
      range.collapse(true)

      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  static getCaretRect(): Omit<DOMRectReadOnly, 'toJSON'> | null {
    let position: Mutable<Omit<DOMRectReadOnly, 'toJSON'>> | null = null
    const isSupported = typeof window.getSelection !== "undefined"
    if (isSupported) {
      const selection = window.getSelection()
      if (!selection) return null
      if (selection.rangeCount !== 0) {
        const range = selection.getRangeAt(0).cloneRange()
        range.collapse(true)
        const rect = range.getBoundingClientRect()
        if (rect) {
          position = rect.toJSON() as Mutable<Omit<DOMRectReadOnly, 'toJSON'>>
          position.x += window.scrollX
          position.left += window.scrollX
          position.right += window.scrollX
          position.y += window.scrollY
          position.top += window.scrollY
          position.bottom += window.scrollY
        }
      }
    }

    return position
  }
}

export default SelectionUtils