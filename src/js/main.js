/**
 * Created by haiming.zeng on 2017/7/31.
 */
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import ContactsApp from './components/ContactApp';
import ContactsApp from 'components/ContactApp';
import '../sass/style.scss';
class AppContainer extends React.Component{
	render(){
		return(
			<div>
				<img src="../images/m01.png"/>
				<img src={require('../images/m05.png')}/>
				<App/>
				<ContactsApp/>
			</div>
		)
	}
}
ReactDOM.render(<AppContainer/>,document.getElementById('app'));