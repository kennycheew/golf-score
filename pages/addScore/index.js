import React from 'react'
import Link from 'next/link'

import { Context, Container, FullBackground } from '../../components/baseComponents'
import Navbar from '../../components/Navbar'
import styled from 'styled-components'
import firebase from '../../libs/firebase'
import config from '../../config'

const rootRef = firebase.database().ref('golfscore')

const TableWrapper = styled.div`
  height: 100vh;
`

const Table = styled.div`
  height: 100%;
  overflow-x: scroll;
  overflow-y: hidden;
`

const TableHead = styled.div`
  width: fit-content;
  margin: auto;
`

const TableBody = styled.div`
  overflow-y: scroll;
  height: 91vh;
  width: fit-content;
  margin: auto;
  ::-webkit-scrollbar { 
    display: none; 
  }
`

const TableRow = styled.div`
  display: flex;
  background: ${props => props.bgColor || 'transparent'};  
`

const TableItem = styled.div` 
  padding: 6px 8px;
  border: 1px solid black;
  overflow: hidden;
  width: ${props => props.width || 'auto'};
  text-align: ${props => props.align || 'center'};
  font-weight: ${props => props.bold ? 'bold' : 'normal'};
  background-color: ${props => props.bgColor || 'transparent'};
  color: ${props => props.color || 'black'};
`

const getSumShot = (data) => {
  let sum = 0
  data.forEach(shot => sum += +shot)
  return sum
}

const checkDiffUserCourt = (userRaw, courtRaw) => {
  const userData = userRaw.filter(data => data)
  const userLength = userData.length
  const courtWithUserlength = courtRaw.slice(0, userLength)
  const sumCourt = getSumShot(courtWithUserlength)
  const sumShot = getSumShot(userData)
  return {
    sumCourt,
    sumShot
  }
}

const tableConfig = ['25px', '25px', '200px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '25px', '75px']
  

class Home extends React.Component {  
  constructor(props) {
    super(props)
    this.state = {
      formData: null
    }
    rootRef.child('formData').on('value', (snapshot) => {
      const data = snapshot.val()
      const updatedTime = Date.now()
      this.setState({ formData: data, updatedTime })
    })
  }

  render() {
    if (!this.state.formData) {
      return (null)
    }
    console.log(this.state.formData)

   
    return (
      <FullBackground color="#cecece">
        <Context>
          <Container> 
            <TableWrapper>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableItem width={tableConfig[0]}>Group</TableItem>
                    <TableItem width={tableConfig[1]}>Ball</TableItem>
                    <TableItem width={tableConfig[2]}>Name</TableItem>
                    <TableItem width={tableConfig[3]}>1</TableItem>
                    <TableItem width={tableConfig[4]}>2</TableItem>
                    <TableItem width={tableConfig[5]}>3</TableItem>
                    <TableItem width={tableConfig[6]}>4</TableItem>
                    <TableItem width={tableConfig[7]}>5</TableItem>
                    <TableItem width={tableConfig[8]}>6</TableItem>
                    <TableItem width={tableConfig[9]}>7</TableItem>
                    <TableItem width={tableConfig[10]}>8</TableItem>
                    <TableItem width={tableConfig[11]}>9</TableItem>
                    <TableItem width={tableConfig[12]}>10</TableItem>
                    <TableItem width={tableConfig[13]}>11</TableItem>
                    <TableItem width={tableConfig[14]}>12</TableItem>
                    <TableItem width={tableConfig[15]}>13</TableItem>
                    <TableItem width={tableConfig[16]}>14</TableItem>
                    <TableItem width={tableConfig[17]}>15</TableItem>
                    <TableItem width={tableConfig[18]}>16</TableItem>
                    <TableItem width={tableConfig[19]}>17</TableItem>
                    <TableItem width={tableConfig[20]}>18</TableItem>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    this.state.formData.map(rowData => {
                      return (
                        <TableRow>
                          <TableItem width={tableConfig[0]}>{rowData[0]}</TableItem>
                          <TableItem width={tableConfig[1]}>{rowData[1]}</TableItem>
                          <TableItem width={tableConfig[2]}>{rowData[2]}</TableItem>
                          {
                            rowData[3].map((hole, index) => {
                              if (hole === 'empty') {
                                return <TableItem width={tableConfig[3+index]} style={{ borderLeft: `1px solid ${index === 9 ? 'white' : 'black '}`, borderRight: `1px solid ${index === 8 ? 'white' : 'black '}`}}></TableItem>
                              }
                              return <TableItem width={tableConfig[3+index]} style={{ borderLeft: `1px solid ${index === 9 ? 'white' : 'black '}`, borderRight: `1px solid ${index === 8 ? 'white' : 'black '}`}}>{hole}</TableItem>
                            })
                          }
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
