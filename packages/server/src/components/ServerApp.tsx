import React from 'react';

// Простые серверные компоненты для SSR
const HomePage = () => (
  <div>
    <h1>Добро пожаловать в игру!</h1>
    <p>Это серверный рендеринг главной страницы.</p>
    <nav>
      <a href='/game'>Игра</a> |<a href='/leaderboard'>Рейтинг</a> |<a href='/forum'>Форум</a> |
      <a href='/sign-in'>Вход</a>
    </nav>
  </div>
);

const GamePage = () => (
  <div>
    <h1>Игра</h1>
    <p>Страница игры загружается...</p>
    <a href='/'>← Назад на главную</a>
  </div>
);

const LeaderboardPage = () => (
  <div>
    <h1>Рейтинг игроков</h1>
    <p>Таблица лидеров загружается...</p>
    <a href='/'>← Назад на главную</a>
  </div>
);

const ForumPage = () => (
  <div>
    <h1>Форум</h1>
    <p>Форум загружается...</p>
    <a href='/'>← Назад на главную</a>
  </div>
);

const SignInPage = () => (
  <div>
    <h1>Вход в систему</h1>
    <p>Форма входа загружается...</p>
    <a href='/'>← Назад на главную</a>
  </div>
);

const SignUpPage = () => (
  <div>
    <h1>Регистрация</h1>
    <p>Форма регистрации загружается...</p>
    <a href='/'>← Назад на главную</a>
  </div>
);

const NotFoundPage = () => (
  <div>
    <h1>404 - Страница не найдена</h1>
    <p>Запрашиваемая страница не существует.</p>
    <a href='/'>← Назад на главную</a>
  </div>
);

// Главный серверный компонент приложения
interface ServerAppProps {
  url: string;
}

const ServerApp: React.FC<ServerAppProps> = ({ url }) => {
  // Простая логика роутинга без react-router
  const renderPageByUrl = () => {
    switch (url) {
      case '/game':
        return <GamePage />;
      case '/leaderboard':
        return <LeaderboardPage />;
      case '/forum':
        return <ForumPage />;
      case '/sign-in':
        return <SignInPage />;
      case '/sign-up':
        return <SignUpPage />;
      case '/profile':
        return <SignInPage />;
      case '/':
        return <HomePage />;
      default:
        return <NotFoundPage />;
    }
  };

  return (
    <div
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
      }}
    >
      {renderPageByUrl()}

      {/* Скрипт для активации клиентского приложения */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            console.log('SSR контент загружен, готовимся к гидратации...');
          `,
        }}
      />
    </div>
  );
};

export default ServerApp;
