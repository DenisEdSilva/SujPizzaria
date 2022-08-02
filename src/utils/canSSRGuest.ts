import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { parseCookies } from 'nookies';

// Função para paginas que só podem ser acessadas por visitantes
export function canSSRGuest<P>(fn: GetServerSideProps<P>) {
	return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {

		const cookies = parseCookies(ctx);
		//Se o cara tentar acessar a pagina porem tendo ja um login salvo, redirecionar
		if(cookies['@sujeitoPizzaria.token']){
			return {
				redirect: {
					destination: '/dashboard',
					permanent: false,
				}
			}
		}
		


		return await fn(ctx)
	}
}