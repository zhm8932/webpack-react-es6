/**
 * Created by haiming.zeng on 2017/7/31.
 */

import React, {Component,PropTypes} from 'react';
import {render} from 'react-dom';
import 'whatwg-fetch';

export default class ContactAppContainer extends Component{
	constructor(){
		super();
		this.state = {
			contacts:[],
		}
	}
	componentDidMount(){
		fetch('/data/contacts.json')
			.then((response)=>response.json())
			.then((responseData)=>{
				this.setState({
					contacts:responseData
				})
			})
	}
	render(){
		return(
			<ContactsApp contacts= {this.state.contacts}/>
		)
	}
}
class ContactsApp extends Component{
	constructor(){
		super()
		this.state = {
			filterText:''
		}
	}
	onUserInput(searchText){
		console.log("searchText:",searchText)
		this.setState({
			filterText:searchText
		})
	}
	render(){
		let {contacts} = this.props;
		let {filterText} = this.state;
		console.log("filterText:",filterText,"contacts:",contacts)
		let filteredContacts = contacts.filter(
			(contact) => {
				return contact.name.indexOf(filterText) !== -1||contact.email.indexOf(filterText)!==-1;
			}
		);
		console.log("filteredContacts111:",filteredContacts)
		filteredContacts = filteredContacts.length?filteredContacts:contacts;
		// console.log("filteredContacts2:",filteredContacts)
		return(
			<div>
				<SearchBar filterText={filterText} onUserInput={this.onUserInput.bind(this)}/>
				<ul>
					{filteredContacts.map((contact,index)=>{
						return <li key = {index}>
								<label htmlFor="">{contact.name}</label>
								<span>{contact.email}</span>
							</li>
					})}
				</ul>
			</div>
		)
	}
}
class SearchBar extends Component{
	handleChange(event){
		// console.log("event:",event.target.value)
		let {value} = event.target;
		this.props.onUserInput(value)
	}
	render(){
		return(
			<div>
				<input type="search"
				       placeholder="search name or email"
				       defaultValue={this.props.filterText}
						onChange={this.handleChange.bind(this)}
				/>
			</div>
		)
	}
}