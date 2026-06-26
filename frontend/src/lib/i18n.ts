const dict: Record<string, string> = {
  login_title: 'Masuk ke Procuris', email: 'Email', password: 'Password', sign_in: 'Masuk',
}
export const t = (k: keyof typeof dict | string) => dict[k] ?? k
