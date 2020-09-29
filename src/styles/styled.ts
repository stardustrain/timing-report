import styled, { CreateStyled } from '@emotion/styled'

enum BreakPoint {
  XS,
  MEDIUM,
  LARGE,
  XLARGE,
  MAX,
}
const breakPoints = [450, 756, 1024, 1200, 1500]

export const bp = {
  BreakPoint,
  mq: breakPoints.map(bp => `@media (max-width: ${bp}px)`),
}

export const theme = {
  colors: {
    fbBlue: '#4267b2',
    fbFont: '#1d2129',
    white: '#fff',
  },
}

type Theme = typeof theme

export default styled as CreateStyled<Theme>
