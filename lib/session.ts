const MAX_AGE = 60 * 60 * 24 // 1 day in seconds

function setCookie(name: string, value: string): void {
  document.cookie = `${name}=${value}; path=/; max-age=${MAX_AGE}; SameSite=Lax`
}

function removeCookie(name: string): void {
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`
}

export function setSession(token: string, role: string): void {
  setCookie('token', token)
  setCookie('role', role)
}

export function clearSession(): void {
  removeCookie('token')
  removeCookie('role')
}
