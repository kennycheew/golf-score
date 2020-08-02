import React from 'react'
import Link from 'next/link'

import { Context, Container, FullBackground, Button } from '../components/baseComponents'
import Navbar from '../components/Navbar'
import styled from 'styled-components'
import firebase from '../libs/firebase'
import config from '../config'

const rootRef = firebase.database().ref('golfscore/tspgalivegolfscore')

const TableWrapper = styled.div`
  height: 100vh;
`

const Table = styled.div`
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
`

const TableHead = styled.div`
  width: 100%;
  margin: auto;
`

const TableBody = styled.div`
  overflow-y: scroll;
  height: 100%;
  width: 100%;
  margin: auto;
  ::-webkit-scrollbar {
    display: none;
  }
`

const TableRow = styled.div`
  display: flex;
  background: ${props => props.bgColor || 'transparent'};
  height: ${props => props.feedRowHeight ? `${props.feedRowHeight}px` : 'auto'};
`

const TableItem = styled.div`
  /* padding: 6px 8px; */
  overflow: hidden;
  white-space: nowrap;
  height: fit-content;
  margin: auto;
  text-align: center;
  font-weight: ${props => props.bold ? 'bold' : 'normal'};
  background-color: ${props => props.bgColor || 'transparent'};
  color: ${props => props.color || 'black'};
`

const Rank = styled(TableItem)`
  width: 5vw;
  font-size: ${(props) => props.feedSize ? 1.7 + (props.feedSize / 10) : 1.7 }vw;
`

const Name = styled(TableItem)`
  width: 28vw;
  text-overflow: ellipsis;
  font-size: ${(props) => props.feedSize ? 1.7 + (props.feedSize / 10) : 1.7 }vw;
  text-align: left;
`

const Hole = styled(TableItem)`
  width: 1.9vw;
  white-space: pre-wrap;
  font-size: ${(props) => {
    const feedSize = props.feedSize / 10 || 0
    const valueSize = props.value > 9 ? -1 : 0
    return 1.9 + feedSize + valueSize
  }}vw;
`
const HoleHeader = styled(TableItem)`
  width: 1.9vw;
  white-space: pre-wrap;
  font-size: ${(props) => props.feedSize ? 0.9 + (props.feedSize / 10) : 0.9 }vw;
`
const Par = styled.span`
  font-size: ${(props) => props.feedSize ? 1.4 + (props.feedSize / 10) : 1.4 }vw;
`
const Score = styled(TableItem)`
  width: 4.5vw;
  white-space: pre-wrap;
  font-size: ${(props) => props.feedSize ? 1.9 + (props.feedSize / 10) : 1.9 }vw;
  text-align: right;
`
const ScoreHeader = styled(TableItem)`
  width: 4.5vw;
  white-space: pre-wrap;
  font-size: ${(props) => props.feedSize ? 0.7 + (props.feedSize / 10) : 0.7 }vw;
`
const Round = styled(TableItem)`
  width: 3.8vw;
  white-space: pre-wrap;
  font-size: ${(props) => {
    const feedSize = props.feedSize / 10 || 0
    const valueSize = props.value > 99 ? -0.5 : 0
    return 1.9 + feedSize + valueSize
  }}vw;
`



const getSumShot = (data) => {
  let sum = 0
  data.forEach(shot => sum += +shot)
  return sum
}

const checkDiffUserCourt = (userRaw, courtRaw) => {
  let userDataWithIndex = userRaw.map((data, index) => {return {data, index}})
  userDataWithIndex = userDataWithIndex.filter(data => data.data)
  const userData = userDataWithIndex.map(data => data.data)
  const userIndex = userDataWithIndex.map(data => data.index)
  const courtWithUserlength = courtRaw.filter((data, index) => {
    if (userIndex.includes(index)) {
      return true
    }
    return false
  })
  const sumCourt = getSumShot(courtWithUserlength)
  const sumShot = getSumShot(userData)
  return {
    sumCourt,
    sumShot
  }
}

const rowColorConfig = {
  '"a"': ['#bbbbbb', '#b3b3b3'],
  '"b"': ['#d6adad', '#d68989'],
  '"c"': ['#75c375', '#9abf9a'],
}

const getRowColor = (userData, userIndex) => {
  const keys = Object.keys(rowColorConfig)
  console.log(keys, userData.group)
  if (keys.includes(userData.group)) {
    return rowColorConfig[userData.group][userIndex % 2]
  }
  return rowColorConfig['"a"'][userIndex % 2]
}

const tableConfig = ['25px', '200px', '50px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '75px']


class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dayDisplay: 'dayThree',
      textDb: null,
      title: '',
      subTitle: '',
      selectedDay: '',
      defaultDay: '1',
      skipping: 0,
      feedSize: 0
    }
    rootRef.child('feed').on('value', (snapshot) => {
      const data = snapshot.val()
      const updatedTime = Date.now()
      this.setState({ textDb: data, updatedTime })
    })
    rootRef.child('title').on('value', (snapshot) => {
      const data = snapshot.val()
      this.setState({ title: data })
    })
    rootRef.child('subTitle').on('value', (snapshot) => {
      const data = snapshot.val()
      this.setState({ subTitle: data })
    })

    rootRef.child('defaultDay').on('value', (snapshot) => {
      const data = snapshot.val()
      this.setState({ defaultDay: data })
    })

    rootRef.child('feedDelay').on('value', (snapshot) => {
      const data = snapshot.val()
      clearInterval(this.autoReload)
      this.autoReload = setInterval(() => {
        this.loadNext()
      }, data)
      this.setState({ feedDelay: data })
    })

    rootRef.child('feedPerPage').on('value', (snapshot) => {
      const data = snapshot.val()
      this.setState({ feedPerPage: parseInt(data) })
    })

    rootRef.child('feedSize').on('value', (snapshot) => {
      const data = snapshot.val()
      this.setState({ feedSize: parseInt(data) })
    })

    rootRef.child('feedRowHeight').on('value', (snapshot) => {
      const data = snapshot.val()
      this.setState({ feedRowHeight: parseInt(data) })
    })

  }

  componentWillUnmount() {
    clearInterval(this.autoReload)
  }

  loadNext() {
    if (!this.state.textDb || !this.state.feedPerPage) {
      return null
    }
    const row = this.state.textDb.split('""')

    const emptyData = {
      dayOne: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      dayThree: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      dayTwo: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      name: '',
      ranking: '',
      score: ''
    }

    const data = row.map(rowData => {
      const splitData = rowData.split('	')
      const userData = {}
      userData.ranking = splitData[1]
      userData.score = splitData[2]
      userData.name = splitData[3]
      if (splitData[3]) {
        userData.name = splitData[3].replace(/"/g, '')
      }
      userData.dayOne = []
      for (const i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]) {
        userData.dayOne.push(splitData[3+i])
      }
      userData.dayTwo = []
      for (const i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]) {
        userData.dayTwo.push(splitData[3+18+i])
      }
      userData.dayThree = []
      for (const i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]) {
        userData.dayThree.push(splitData[3+18+18+i])
      }
      return userData
    })
    const head = data[0]
    let body = data.slice(1)
    if (this.state.skipping + this.state.feedPerPage >= body.length - 1) {
      this.setState({ skipping: 0 })
    } else {
      this.setState({ skipping: this.state.skipping + this.state.feedPerPage })
    }
  }

  selectDay(day) {
    this.setState({ selectedDay: day })
  }

  render() {
    if (!this.state.textDb || !this.state.feedPerPage) {
      return (null)
    }
    const row = this.state.textDb.split('""')

    const emptyData = {
      dayOne: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      dayThree: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      dayTwo: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
      name: '',
      ranking: '',
      score: ''
    }

    const data = row.map(rowData => {
      const splitData = rowData.split('	')
      const userData = {}
      userData.ranking = splitData[1]
      userData.score = splitData[2]
      userData.name = splitData[3]
      if (splitData[3]) {
        userData.name = splitData[3].replace(/"/g, '')
      }
      userData.dayOne = []
      for (const i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]) {
        userData.dayOne.push(splitData[3+i])
      }
      userData.dayTwo = []
      for (const i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]) {
        userData.dayTwo.push(splitData[3+18+i])
      }
      userData.dayThree = []
      for (const i of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18]) {
        userData.dayThree.push(splitData[3+18+18+i])
      }
      userData.group = splitData[59]
      return userData
    })
    const head = data[0]
    let body = data.slice(1)
    body.pop()
    body = body.map((userData, userIndex, array) => {
      let { ranking } = userData
      if (userIndex != 0 && userData.score === body[userIndex - 1].score ) {
        ranking = array.find(ele => ele.score === userData.score).ranking
      }
      return Object.assign({}, userData, { ranking } )
    })
    body = body.slice(this.state.skipping, this.state.skipping + this.state.feedPerPage)
    while(body.length < this.state.feedPerPage) {
      body.push(emptyData)
    }


    const sumCourt = head[this.state.dayDisplay].reduce((a,b) => +a + + b)

    let dayDisplay = 'dayOne'
    if (this.state.selectedDay) {
      if (this.state.selectedDay == 2) dayDisplay = 'dayTwo'
      if (this.state.selectedDay == 3) dayDisplay = 'dayThree'
    } else {
      if (this.state.defaultDay === '2') dayDisplay = 'dayTwo'
      if (this.state.defaultDay === '3') dayDisplay = 'dayThree'
    }
    return (
      <FullBackground color="#cecece">
        <Context>
          <Container>
            <TableWrapper>
              <Table>
                <TableHead>
                  <TableRow bgColor="linear-gradient(#76af70, white)">
                    <Rank feedSize={this.state.feedSize}>
                      No.
                    </Rank>
                    <Name feedSize={this.state.feedSize}>
                      Name<span style={{ color: '#e92121', paddingLeft: '2vw'}}>{`(Round ${this.state.defaultDay})`}</span>
                    </Name>
                    {
                      head[dayDisplay].map((par, index) => {
                        let prefix = 0
                        if (dayDisplay === 'dayTwo') prefix = 1
                        if (dayDisplay === 'dayThree') prefix = 2
                        if (index === 9) {
                          return (
                            <HoleHeader feedSize={this.state.feedSize} width={tableConfig[3+index]} style={{ paddingLeft: '2.2vw'}}>
                              {index + 1  }<br/><Par>({par})</Par>
                            </HoleHeader>
                          )
                        }
                        return (
                          <HoleHeader feedSize={this.state.feedSize} width={tableConfig[3+index]}>
                            {index + 1  }<br/><Par>({par})</Par>
                          </HoleHeader>
                        )
                      })
                    }
                    <ScoreHeader feedSize={this.state.feedSize}>
                      Score
                      <br />
                      {
                        head[dayDisplay].reduce((acc,cur) => +acc + +cur, 0)
                      }
                    </ScoreHeader>
                    <Round feedSize={this.state.feedSize}>
                      R1
                    </Round>
                    <Round feedSize={this.state.feedSize}>
                      R2
                    </Round>
                    <Round feedSize={this.state.feedSize}>
                      R3
                    </Round>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    body.map((userData, userIndex) => {
                      const shotData = checkDiffUserCourt(userData[dayDisplay], head[dayDisplay])
                      const shotData1 = checkDiffUserCourt(userData['dayOne'], head['dayOne'])
                      const shotData2 = checkDiffUserCourt(userData['dayTwo'], head['dayTwo'])
                      const shotData3 = checkDiffUserCourt(userData['dayThree'], head['dayThree'])
                      // const sumUser = userData[dayDisplay].reduce((a,b) => +a + + b)
                      let { ranking } = userData
                      if (userIndex != 0 && userData.score === body[userIndex - 1].score ) {
                        ranking = ''
                      }
                      return (
                        <TableRow {...this.state} bgColor={getRowColor(userData, userIndex)}>
                          <Rank feedSize={this.state.feedSize}>
                            {ranking}
                          </Rank>
                          <Name feedSize={this.state.feedSize} align="left">
                            {userData.name}
                          </Name>
                          {
                            userData[dayDisplay].map((hole, index) => {
                              const style = {}
                              if (index === 9)
                              style.paddingLeft = '2.2vw'
                              if (hole == 0) {
                                return (
                                  <Hole value={hole} feedSize={this.state.feedSize} color="red" style style={style}>
                                    {''}
                                  </Hole>
                                )
                              }
                              if (hole == head[dayDisplay][index]) {
                                return (
                                  <Hole value={hole} feedSize={this.state.feedSize} color="white" style={style}>
                                    {hole}
                                  </Hole>
                                )
                              }
                              if (parseInt(hole) < parseInt(head[dayDisplay][index] - 1) && hole) {
                                return (
                                  <Hole value={hole} feedSize={this.state.feedSize} color="#e6e66d" style={Object.assign(style, {fontWeight: 'bold',textShadow: '0px 0px 8px #636363'})}>
                                    {hole}
                                  </Hole>
                                )
                              }
                              if (parseInt(hole) < parseInt(head[dayDisplay][index])) {
                                return (
                                  <Hole value={hole} feedSize={this.state.feedSize} color="red" style={style}>
                                    {hole}
                                  </Hole>
                                )
                              }
                              return (
                                <Hole value={hole} feedSize={this.state.feedSize} style={style}>
                                  {hole}
                                </Hole>
                              )
                            })
                          }
                          <Score feedSize={this.state.feedSize} color={userData.score < 0 ? 'red' : userData.score > 0 ? 'blue' : null}>
                            {
                              userData.score == 0 ? 'E' : userData.score > 0 ? `+${userData.score}` : userData.score
                            }
                          </Score>
                          <Round value={shotData1.sumShot} feedSize={this.state.feedSize} color={shotData1.sumShot - shotData1.sumCourt < 0 ? 'red' : shotData1.sumShot - shotData1.sumCourt > 0 ? 'blue' : null} width={tableConfig[21]}>
                            <span style={{color: "black"}}>
                              {shotData1.sumShot}
                            </span>
                          </Round>
                          <Round value={shotData2.sumShot} feedSize={this.state.feedSize} color={shotData2.sumShot - shotData2.sumCourt < 0 ? 'red' : shotData2.sumShot - shotData2.sumCourt > 0 ? 'blue' : null} width={tableConfig[21]}>
                            <span style={{color: "black"}}>
                              {shotData2.sumShot}
                            </span>
                          </Round>
                          <Round value={shotData3.sumShot} feedSize={this.state.feedSize} color={shotData3.sumShot - shotData3.sumCourt < 0 ? 'red' : shotData3.sumShot - shotData3.sumCourt > 0 ? 'blue' : null} width={tableConfig[21]}>
                            <span style={{color: "black"}}>
                              {shotData3.sumShot}
                            </span>
                          </Round>
                        </TableRow>
                      )
                    })
                  }
                </TableBody>
              </Table>
            </TableWrapper>
          </Container>
        </Context>
      </FullBackground>
    )
  }
}

export default Home