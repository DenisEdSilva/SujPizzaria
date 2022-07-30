import Head from 'next/head';
import Image from 'next/image';
import styles from '../../styles/home.module.scss';

import LogoImg from '../../public/logo.svg';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

export default function Home() {
  return (
    <>
			<Head>
				<title>Sujeito Pizza - Faça seu login</title>
			</Head>
			<div className='styles.containerCenter'>
				<Image src={LogoImg} alt="Logo Sujeito Pizzaria" />
				<div className={styles.login}>
					<form action="">
						<Input 
							type="text" 
							placeholder='Digite seu email'
						/>
						<Input 
							type="password" 
							placeholder='Digite sua Senha'
						/> 

						<Button
							type="submit"
							loading={false}
						>
							Acessar
						</Button>
					</form>
				</div>
			</div>
		</>
  )
}
