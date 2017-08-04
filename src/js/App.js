/**
 * Created by haiming.zeng on 2017/7/31.
 */
import React,{Component} from 'react';

class GroceryList extends Component{
	render(){
		return(
			<ul>
				<i className="iconfont icon-anquan"></i>
				<ListItem quantity="2">Bread<span>zhang</span></ListItem>
				<ListItem quantity="5">Eggs<span>Li777</span></ListItem>
				<ListItem quantity="711">Milk</ListItem>
			</ul>
		)
	}
}
class ListItem extends Component{
	constructor(props){
		super(props);
	}
	render(){
		let {quantity,children} = this.props;
		return (
			<li>{quantity} x {children}</li>
		)
	}
}
class App extends React.Component{
	render(){
		return(
			<div className="list">
				<GroceryList/>
			</div>
		)
	}
}

export default App