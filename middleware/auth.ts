// middleware/auth.ts
export default function ({ redirect }: { redirect: Function }) {
  if (process.client) {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return redirect('/login'); // Redirect to login if no token is found
    }
  }
}
