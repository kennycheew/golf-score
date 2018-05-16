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
      textData: ''
    }
  }

  onUpdateText() {
    const textData = this.state.textData
    rootRef.child('/textDb/').set(textData)
    // const newPostKey = rootRef.child('/users/').push().parent;
    // console.log(newPostKey)   
    // const updates = {}  
    // updates['/users/' + newPostKey] = {
    //   _id: "0001",
    //   firstName: "kenny",
    //   lastName: "cheew",
    //   score: [0, 0, 0, 0]
    // } 
    // rootRef.update(updates)
  }

  onRemoveUser() {
    const userList = this.state.users || []
    userList.pop()
    rootRef.child('/users/').set(userList)
  }

  render() {
    return (
      <div>
        <textarea onChange={(e) => this.setState({ textData: e.target.value})}></textarea>
        <button onClick={() => this.onUpdateText()}>Update Text</button>
      </div>
    )
  }
}

export default Admin
