import './App.css';
import './ReFlash.js'
import ReFlash from './ReFlash.js';
import React from 'react';
import axios from 'axios';

export default class App extends React.Component {

  state = {
    loggedIn:false,
    data:[],
    loading:true,
    authed:false,
    userIn:"",
    newUserIn:"",
  }

  //address of the public facing ec2 instance 
  SERVER_ADDR = 'https://reflash-server.be:3000'

  componentDidMount(){
    this.getData()
  }

  componentWillUnmount() {
    // fix Warning: Can't perform a React state update on an unmounted component
    this.setState = (state,callback)=>{
        return;
    };
  }

  //fetch data from server
  getData = () =>{
    fetch(this.SERVER_ADDR).then(res => res.json()).then((result) => 
      {
        this.setState({data:result, loading:false})
      })
  }

  authUser = (e) => {

    e.preventDefault()
    //test if user in top level of ds
    var i;
    let found = false
    for(i=0; i<this.state.data.length; i++){
      if(this.state.data[i][0] === this.state.userIn){
        this.setState({data:this.state.data[i], authed:true})
        found = true
      }
    }
    if(!found){
      alert("User not found")
    }
  }

  addUser = (e) =>{

    e.preventDefault()

    let userIn = this.state.newUserIn

    this.setState({loading:true}, () => {
      let payload = JSON.stringify(['new user', '', userIn])

      axios.post(this.SERVER_ADDR,  payload)
          .then(res => {
              console.log(res)
              this.getData()
              alert("new user ",userIn, " added. You may now log in.")
          }).catch(e => {
              console.log("ERROR**   ", e)
      })

    })
  }


  render(){
    // display login if not authed else reflash

    return (
      <div className="App">
        <h1>ReFlash: Spatial Memory Training</h1>
        {this.state.loading ? <p>Loading ... </p> : (this.state.authed ? <ReFlash data={this.state.data} SERVER_ADDR={this.SERVER_ADDR}/> :
          <div className="LoginContainer">
            <div>
              <h2>Existing User Login:</h2>
              <form >
                <input className="LoginForm" placeholder="username" onChange={e => this.setState({userIn:e.target.value})}/>
                <input className="LoginForm" type="submit" onClick={(e) => this.authUser(e)}/>
              </form>
            </div>
            <div>
              <h2>New User Sign Up:</h2>
              <form>
                <input className="LoginForm" placeholder="new username" onChange={e => this.setState({newUserIn:e.target.value})}/>
                <input className="LoginForm" type="submit" onClick={(e) => this.addUser(e)}/>
              </form>
            </div>
          </div>
        )}
      </div>
    );
  }


}
