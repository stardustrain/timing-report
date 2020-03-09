import styled, { CreateStyled } from '@emotion/styled'

export const theme = {
  colors: {
    fbBlue: '#4267b2',
    fbFont: '#1d2129',
    white: '#fff',
  },
}

type Theme = typeof theme

export default styled as CreateStyled<Theme>
