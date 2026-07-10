(function () {
  const isLoginPage = window.location.pathname.endsWith('/login.html') || window.location.pathname.endsWith('/login');
  const publicPaths = ['/login.html', '/login'];
  const currentPath = window.location.pathname;

  if (!isLoginPage && publicPaths.includes(currentPath)) {
    window.location.replace('login.html');
    return;
  }
})();
