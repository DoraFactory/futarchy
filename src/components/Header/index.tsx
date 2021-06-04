import React from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useWallet } from '../../contexts/wallets';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
	toolBar: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 64,
	},
	link: {
		color: 'white',
		textDecoration: 'none',
	},
}));

const Header = () => {
	const classes = useStyles();
	const { isAdmin, connected, address } = useWallet();

	return (
		<AppBar position="relative">
			<Toolbar className={classes.toolBar}>
				<Link to="/" className={classes.link}>
					<Typography variant="h6" noWrap>
						FUTARCHY
					</Typography>
				</Link>

				{connected && (
					<Typography>
						{address?.slice(0, 10)}... {isAdmin && '(Admin)'}
					</Typography>
				)}
			</Toolbar>
		</AppBar>
	);
};

export default Header;
