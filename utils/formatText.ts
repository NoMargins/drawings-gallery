function convertToGuillemets(text: string): string {
    // Замінюємо прямі лапки на ялинкові парами
    let isOpen = true
    return text.replace(/["']/g, () => {
      const mark = isOpen ? '«' : '»'
      isOpen = !isOpen
      return mark
    })
  }

  export default convertToGuillemets;