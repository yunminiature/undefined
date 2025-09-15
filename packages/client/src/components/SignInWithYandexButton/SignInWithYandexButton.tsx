import { useLazyGetServiceIdQuery } from '@/api/OAuth';
import { Button } from '../ui';
import { YandexLogo } from '../ui/icons/YandexLogo';
import { OAUTH_REDIRECT_URI } from '@/constants';

function genState(len = 24) {
  const buf = new Uint8Array(len);
  crypto.getRandomValues(buf);
  return Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('');
}

export const SignInWithYandexButton = () => {
  const [getServiceId, { isFetching }] = useLazyGetServiceIdQuery();

  const onClick = async () => {
    if (isFetching) return;

    const { service_id } = await getServiceId().unwrap();

    if (service_id) {
      const state = genState();
      sessionStorage.setItem('ya_oauth_state', state);

      const url = new URL('https://oauth.yandex.ru/authorize');
      url.searchParams.set('response_type', 'code');
      url.searchParams.set('client_id', service_id);
      url.searchParams.set('redirect_uri', OAUTH_REDIRECT_URI);
      url.searchParams.set('state', state);

      window.location.href = url.toString();
    }
  };

  return (
    <Button type='button' size='lg' className='w-full [&_svg]:size-5' disabled={isFetching} onClick={onClick}>
      <YandexLogo />
      {isFetching ? 'Singing in…' : 'Sign in with Yandex ID'}
    </Button>
  );
};
