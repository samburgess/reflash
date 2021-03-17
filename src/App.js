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
    newUserIn:""
  }

  componentDidMount(){
    fetch('https://34.214.100.161:3000').then(res => res.json()).then((result) => 
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
      console.log(this.state.data[i][0])
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
    axios.post('https://34.214.100.161:3000',  this.state.newUserIn )
      .then(res => {
        console.log(res);
        console.log(res.data);
      })

  }


  render(){
    // display login if not authed else reflash

    return (
      <div>
        {this.state.loading ? <p>Loading ... </p> : (this.state.authed ? <ReFlash data={this.state.data}/> :
          <div>
            Existing User Login: 
            <form>
              <input placeholder="username" onChange={e => this.setState({userIn:e.target.value})}/>
              <input type="submit" onClick={(e) => this.authUser(e)}/>
            </form>
            New User Sign Up:
            <form>
              <input placeholder="new username" onChange={e => this.setState({newUserIn:e.target.value})}/>
              <input type="submit" onClick={(e) => this.addUser(e)}/>
            </form>
          </div>
        )}
      </div>
    );
  }


}