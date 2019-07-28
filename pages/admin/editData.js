import React from 'react'
import Link from 'next/link'

import styled from 'styled-components'
import firebase from '../../libs/firebase'

const rootRef = firebase.database().ref('golfscore/tctlivegolfscore')

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
    rootRef.child('textDb').on('value', (snapshot) => {
      const data = snapshot.val()
      this.setState({ textData: data })
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
      this.setState({ feedDelay: data })
    })

    rootRef.child('feedPerPage').on('value', (snapshot) => {
      const data = snapshot.val()
      this.setState({ feedPerPage: data })
    })

    rootRef.child('feedSize').on('value', (snapshot) => {
      const data = snapshot.val()
      this.setState({ feedSize: data })
    })

    rootRef.child('feedRowHeight').on('value', (snapshot) => {
      const data = snapshot.val()
      this.setState({ feedRowHeight: data })
    })
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

  onUpdateFeedDelay() {
    const feedDelay = this.state.feedDelay
    rootRef.child('/feedDelay/').set(feedDelay)
  }

  onUpdateFeedPerPage() {
    const feedPerPage = this.state.feedPerPage
    rootRef.child('/feedPerPage/').set(feedPerPage)
  }

  onUpdateFeedSize() {
    const feedSize = this.state.feedSize
    rootRef.child('/feedSize/').set(feedSize)
  }

  onUpdateFeedRowHeight() {
    const feedRowHeight = this.state.feedRowHeight
    rootRef.child('/feedRowHeight/').set(feedRowHeight)
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
        <textarea onChange={(e) => this.setState({ textData: e.target.value})} value={this.state.textData}></textarea>
        <button onClick={() => this.onUpdateText()}>Update Score</button>
        <br/>
        <br/>
        <input type="number" style={{ width: '500px'}} onChange={(e) => this.setState({ feedDelay: e.target.value})} value={this.state.feedDelay}></input>
        <button onClick={() => this.onUpdateFeedDelay  ()}>Set feed delay(ms)</button>
        <br/>
        <br/>
        <input type="number" style={{ width: '500px'}} onChange={(e) => this.setState({ feedPerPage: e.target.value})} value={this.state.feedPerPage}></input>
        <button onClick={() => this.onUpdateFeedPerPage  ()}>Set feed per page</button>
        <br/>
        <br/>
        <input type="number" style={{ width: '500px'}} onChange={(e) => this.setState({ feedSize: e.target.value})} value={this.state.feedSize}></input>
        <button onClick={() => this.onUpdateFeedSize  ()}>Set feed size</button>
        <br/>
        <br/>
        <input type="number" style={{ width: '500px'}} onChange={(e) => this.setState({ feedRowHeight: e.target.value})} value={this.state.feedRowHeight}></input>
        <button onClick={() => this.onUpdateFeedRowHeight  ()}>Set feed row height</button>
      </div>
    )
  }
}

export default Admin
