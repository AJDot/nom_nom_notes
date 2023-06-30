import * as mathjs from 'mathjs'
const math = mathjs.create(mathjs.all, {})

math.createUnit({
  tsp: '1 teaspoon',
  tbsp: '1 tablespoon',
  can: {},
})

export default math
