import { FormEvent, useState, useContext } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../../../styles/home.module.scss';

import LogoImg from '../../../public/logo.svg';

import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-toastify';
import Link from 'next/link';

import { AuthContext } from '../../contexts/AuthContext';
import { canSSRGuest } from '../../utils/canSSRGuest';

export default function Home() {
	const { signUp } = useContext(AuthContext)
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const [loading, setLoading] = useState(false);

	async function handleSignUp(event: FormEvent) {
		event.preventDefault();

		if(name === '' || email === '' || password === '') {
			toast.warning("Preencha todos os campos")
			return;
		}

		setLoading(true)

		let data = {
			name: name,
			email: email,
			password: password
		}

		await signUp(data)

		setLoading(false)
	}
	
  return (
    <>
			<Head>
				<title>Sujeito Pizza - Faça seu cadastro agora!</title>
			</Head>
			<div className={styles.containerCenter}>
				<Image src={LogoImg} alt="Logo Sujeito Pizzaria" />
				<div className={styles.login}>
					<h1>Criando sua conta</h1>
					<form onSubmit={handleSignUp} className={styles.formLogin}>
						<Input 
							type="text" 
							placeholder='Nome seu nome'
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						<Input 
							type="text" 
							placeholder='Digite seu email'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Input 
							type="password" 
							placeholder='Digite sua Senha'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/> 

						<Button
							type='submit'
							loading={loading}
						>
							Cadastrar
						</Button>
					</form>

					<Link href="/">
						<a className={styles.text}>Já possui uma conta? Acesse aqui</a>
					</Link>
				</div>
			</div>
		</>
  )
}

export const getServerSideProps = canSSRGuest(async (ctx) => {
	return {
		props: {}
	}
})