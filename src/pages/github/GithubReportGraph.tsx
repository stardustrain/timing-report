import React from 'react'
import { useRecoilValue } from 'recoil'
import { Empty } from 'antd'

import { githubSelector } from '../../recoil/github'

import Summary from './Summary'
import CommitGraph from './CommitGraph'
import ContributionGrarph from './ContributionGrarph'

import styled from '../../styles/styled'

const Div = styled.div`
  section {
    margin-top: 2rem;
  }

  h2 {
    margin-bottom: 1rem;
  }
`

export default function GithubReportGraph() {
  const githubData = useRecoilValue(githubSelector)

  const isEmpty = githubData.filter(node => node.data).length === 0

  return isEmpty ? (
    <Empty />
  ) : (
    <Div>
      <Summary data={githubData} />
      <section>
        <h2>Commit</h2>
        <CommitGraph />
      </section>
      <section>
        <h2>Contribution</h2>
        <ContributionGrarph />
      </section>
    </Div>
  )
}
