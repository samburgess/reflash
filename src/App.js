import './App.css';
import './ReFlash.js'
import ReFlash from './ReFlash.js';
import React from 'react';

export default class App extends React.Component {

  state = {
    loggedIn:false,
    data:[],
    loading:true,
    authed:false,
    userIn:"",
  }

  componentDidMount(){
    fetch('https://34.214.100.161:3000').then(res => res.json()).then((result) => 
      {
        this.setState({data:result[0], loading:false})
      })
  }

  authUser = (e) => {

    e.preventDefault()
    //test if user in top level of ds
    var i;
    for(i=0; i<this.state.data.length; i++){
      if(this.state.data[i][0] === this.state.userIn){
        this.setState({data:this.state.data[i], authed:true})
      }else{
        alert("User not found")
      }
    }
  }

  addUser = () =>{
    //TODO** add user to top level ds
  }


  render(){
    // display login if not authed else reflash

    return (
      <div>
        {this.state.loading ? <p>Loading ... </p> : (this.state.authed ? <ReFlash data={this.state.data}/> : 
          <form>
            <input placeholder="username" onChange={e => this.setState({userIn:e.target.value})}/>
            <input type="submit" onClick={(e) => this.authUser(e)}/>
          </form>
        )}
      </div>
    );
  }


}