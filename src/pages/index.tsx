import { FormEvent, useContext, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/home.module.scss';
import LogoImg from '../../public/logo.svg';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { toast } from 'react-toastify';
import { AuthContext } from '../contexts/AuthContext';
import Link from 'next/link';

import { canSSRGuest } from '../utils/canSSRGuest';

export default function Home() {
	const { signIn } = useContext(AuthContext)
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false)

	async function handleLogin(event: FormEvent) {
		event.preventDefault();
		if (email === '' || password === '') {
			toast.warning("Preencha todos os campos")
			return;
		}

		setLoading(true);
		
		let data = {
			email: email,
			password: password
		}

		await signIn(data)

		setLoading(false);
	}

  return (
    <>
			<Head>
				<title>Sujeito Pizza - Faça seu login</title>
			</Head>
			<div className={styles.containerCenter}>
				<Image src={LogoImg} alt="Logo Sujeito Pizzaria" />
				<div className={styles.login}>
					<form onSubmit={handleLogin}>
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
							type="submit"
							loading={loading}
						>
							Acessar
						</Button>
					</form>

					<Link href="/signup">
						<a className={styles.text}>Não possui uma conta? Cadastre-se</a>
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