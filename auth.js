const supabaseUrl = 'https://ulljqihdxklweoodxrfq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVsbGpxaWhkeGtsd2Vvb2R4cmZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM2NTk3NjMsImV4cCI6MjA5OTIzNTc2M30.Dvdka6E6WPUNqeDZzuTz_EkRHGNmsGXfF9nJpVFH1vQ';

const supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);

const authForm = document.querySelector('[data-auth-form]');
const authTitle = document.querySelector('[data-auth-title]');
const authCopy = document.querySelector('[data-auth-copy]');
const authMessage = document.querySelector('[data-auth-message]');
const providerButtons = document.querySelectorAll('.provider-btn');

function showMessage(message, isError = false) {
  if (!authMessage) return;
  authMessage.textContent = message;
  authMessage.style.color = isError ? '#ff7f9f' : '#8dddb9';
}

async function signInWithProvider(provider) {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin + '/index.html'
      }
    });

    if (error) {
      throw error;
    }
  } catch (error) {
    showMessage(error.message || 'Authentication failed.', true);
  }
}

async function updateAuthUI() {
  const { data: { session } } = await supabase.auth.getSession();
  const nav = document.querySelector('.nav-list');
  const authLink = document.querySelector('[data-auth-link]');

  if (!nav) return;

  if (session?.user) {
    const existing = document.querySelector('[data-auth-link]');
    if (!existing) {
      const li = document.createElement('a');
      li.href = 'index.html';
      li.className = 'nav-link';
      li.setAttribute('data-auth-link', 'true');
      li.textContent = 'Logout';
      li.addEventListener('click', async (event) => {
        event.preventDefault();
        await supabase.auth.signOut();
        window.location.href = 'index.html';
      });
      nav.appendChild(li);
    }
  } else if (authLink) {
    authLink.remove();
  }
}

providerButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const provider = button.getAttribute('data-provider');
    if (!provider) return;
    showMessage('Redirecting to ' + provider + '…');
    signInWithProvider(provider);
  });
});

updateAuthUI();
