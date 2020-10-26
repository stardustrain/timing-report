import React from 'react'

import styled from '../styles/styled'

import type { MouseEvent } from 'react'

interface StyleProps {
  color: 'primary' | 'default' | 'secondary'
  disabled?: boolean
}

interface Props extends StyleProps {
  className?: string
  title: string
  type?: 'button' | 'submit' | 'reset'
  onClick: (e: MouseEvent) => void
}

const themeMap = {
  default: '#e0e0e0',
  primary: '#90caf9',
  secondary: '#f48fb1',
  disabled: 'rgba(255, 255, 255, 0.3)',
}

const StyledButton = styled.button<StyleProps>`
  position: relative;
  background-color: ${props => themeMap[props.color]};
  padding: 0.6rem 1.6rem;
  border-radius: 0.4rem;
  font-size: 2rem;
  cursor: pointer;
  box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14),
    0px 1px 5px 0px rgba(0, 0, 0, 0.12);

  :disabled {
    background-color: ${themeMap.disabled};
    cursor: not-allowed;
    user-select: none;
  }

  :hover {
    span {
      background-color: black;
      transition: background-color 0.2s linear;
    }
  }

  span {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    opacity: 0.2;
    border-radius: 0.4rem;
  }
`

export default function Button({ type = 'button', title, color, className, onClick, disabled }: Props) {
  return (
    <StyledButton className={className} type={type} color={color} onClick={onClick} disabled={disabled}>
      <span></span>
      {title}
    </StyledButton>
  )
}
