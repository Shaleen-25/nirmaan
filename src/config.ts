/** The person building Nirmaan in public. Shown on the site and the demo video's end card. */
export const OWNER = {
  name: 'Shaleen Kachhara',
  role: 'Product manager, building Nirmaan in public',
  linkedin: 'https://www.linkedin.com/in/shaleen-kachhara-3522a615a/',
  email: 'shaleenkachhara.sk@gmail.com',
  github: 'https://github.com/Shaleen-25/nirmaan',
}

/**
 * Web3Forms access key (public by design) that delivers the feedback box to OWNER.email.
 * Web3Forms keys are meant to ship in client code; VITE_WEB3FORMS_KEY can override it per environment.
 * If submission fails, feedback falls back to a prefilled email.
 */
export const WEB3FORMS_KEY: string = import.meta.env.VITE_WEB3FORMS_KEY ?? '7dede04f-4ae7-4264-88fa-49ee8c1d9feb'
