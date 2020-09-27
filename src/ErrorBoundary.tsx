import React, { Component } from 'react'
import { Result } from 'antd'

interface Props {
  extra?: string | React.ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
    }
  }

  static getDerivedStateFromError() {
    return {
      hasError: true,
    }
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return <Result status="warning" title="Something wrong!" extra={this.props.extra} />
    }

    return <div className="ErrorBoundary"></div>
  }
}

export default ErrorBoundary
