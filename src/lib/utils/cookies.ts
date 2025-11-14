import { browser } from '$app/environment';

export function setCookie(
    name: string,
    value: string,
    options: { [key: string]: any } = {}
) {
    if (!browser) return; // server can't set cookies

    let cookieString = `${name}=${value};`;
    for (const propName in options) {
        cookieString += `${propName}=${options[propName]};`;
    }
    document.cookie = cookieString;
}

export function deleteCookie(
    name: string,
    path: string = '/',
    domain: string | null = null
) {
    if (!browser) return; // server can't delete cookies

    const cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path};${
        domain ? ` domain=${domain};` : ''
    }`;
    document.cookie = cookieString;
}

export function getCookie(name: string): string | null {
    if (!browser) return null; // server cannot read document.cookie

    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i].trim();
        if (c.startsWith(nameEQ)) {
            return c.substring(nameEQ.length);
        }
    }
    return null;
}
