import React from 'react'
import Link from 'next/link'

import { Context, Container } from '../../components/baseComponents'
import styled from 'styled-components'
import firebase from '../../libs/firebase'

const rootRef = firebase.database().ref('golfscore')

const Table = styled.table`
  border-collapse: collapse;
` 

const TableRow = styled.tr`
  border-collapse: collapse;
`

const TableItem = styled.td`
  border-collapse: collapse;
`
class Admin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      textData: '',
      title: '',
      subTitle: '',
      defaultDay: '1'
    }
  }

  onUpdateText() {
    const textData = this.state.textData
    rootRef.child('/textDb/').set(textData)
  }

  onUpdateTitle() {
    const title = this.state.title
    rootRef.child('/title/').set(title)
  }

  onUpdateSubTitle() {
    const subTitle = this.state.subTitle
    rootRef.child('/subTitle/').set(subTitle)
  }

  onUpdateDefaultDay() {
    const defaultDay = this.state.defaultDay
    rootRef.child('/defaultDay/').set(defaultDay)
  }

  render() {
    return (
      <div>
        <input style={{ width: '500px'}} onChange={(e) => this.setState({ title: e.target.value})} value={this.state.title}></input>
        <button onClick={() => this.onUpdateTitle()}>Set Title</button>
        <br/>
        <br/>
        <input style={{ width: '500px'}} onChange={(e) => this.setState({ subTitle: e.target.value})} value={this.state.subTitle}></input>
        <button onClick={() => this.onUpdateSubTitle()}>Set SubTitle</button>
        <br/>
        <br/>
        <input style={{ width: '500px'}} onChange={(e) => this.setState({ defaultDay: e.target.value})} value={this.state.defaultDay}></input>
        <button onClick={() => this.onUpdateDefaultDay  ()}>Set default day</button>
        <br/>
        <br/>
        <textarea onChange={(e) => this.setState({ textData: e.target.value})}></textarea>
        <button onClick={() => this.onUpdateText()}>Update Score</button>
        
        

      </div>
    )
  }
}

export default Admin
