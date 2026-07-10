(async function () {
  const supabaseUrl = 'https://ulljqihdxklweoodxrfq.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsbGpxaWhkeGtsd2Vvb2R4cmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NTk3NjMsImV4cCI6MjA5OTIzNTc2M30.Dvdka6E6WPUNqeDZzuTz_EkRHGNmsGXfF9nJpVFH1vQ';
  const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
  const currentPath = window.location.pathname;
  const isLoginPage = currentPath.endsWith('/login.html') || currentPath.endsWith('/login');
  const publicPaths = ['/login.html', '/login'];

  if (publicPaths.includes(currentPath)) {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      window.location.replace('/');
      return;
    }
    return;
  }

  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    window.location.replace('/login.html');
  }
})();
