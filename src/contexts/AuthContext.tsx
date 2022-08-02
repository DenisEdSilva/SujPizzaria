import { createContext, ReactNode, useState, useEffect } from 'react';

import { destroyCookie, setCookie, parseCookies } from 'nookies'
import Router from 'next/router';
import { toast } from 'react-toastify';

import { api } from '../services/apiClient';
import path from 'path';
import axios from 'axios';

type AuthContextData = {
	user: UserProps;
	isAuthenticated: boolean;
	signIn: (credentials: SignInProps) => Promise<void>;
	signUp: (credentials: SignUpProps) => Promise<void>;
	signOut: () => void;
}

type UserProps = {
	id: string;
	name: string;
	email: string;
}

type SignInProps = {
	email: string;
	password: string;
}

type SignUpProps = {
	name: string;
	email: string;
	password: string;
}

type AuthProviderProps = {
	children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut() {
	try {
		destroyCookie(undefined, '@sujeitoPizzaria.token')
		Router.push('/')
	}catch {
		console.log('Erro ao deslogar')
	}
}


export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<UserProps>();
	const isAuthenticated = !!user;

	useEffect(() => {
		
		//tentar pegar o token pelo cookie
		const { '@sujeitoPizzaria.token':token } = parseCookies();

		if (token) {
			api.get('/me').then(response => {
				const {id, name, email} = response.data;
				
				setUser({
					id, 
					name, 
					email
				})
				
			})
			.catch(() => {
				// se der erro, deslogar usuario
				signOut();
			})
		}

	}, [])

	async function signIn({email, password}: SignInProps) {
		try {
			const response = await api.post('/session', {
				email,
				password
			})

			const { id, name, token } = response.data

			setCookie(undefined, '@sujeitoPizzaria.token', token, {
				maxAge: 60 * 60 * 24 * 30, // expirar em 1 mês
				path: '/'
			})

			setUser({
				id,
				name,
				email,
			})

			// Passar para as proximas requisições de rotas o token
			api.defaults.headers['Authorization'] = `Beader ${token}`

			toast.success("Login realizado com sucesso")

			// Redirecionar o user para /dashboard
			Router.push('/dashboard')

		} catch (error) {
			toast.error("Erro ao acessar")
			console.log("Erro ao acessar ", error)
		}
	}

	async function signUp({ name, email, password }: SignUpProps) {

		try {
			const response = await api.post('/users', {
				name,
				email, 
				password
			})

			toast.success("Cadastro realizado com sucesso")
			Router.push('/')

		} catch (error) {
			toast.error("Erro ao cadastrar")
			console.log('Não foi possivel realizar o cadastro ', error)
		}

	}
	
	return (
		<AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
			{ children }
		</AuthContext.Provider>
	)
}