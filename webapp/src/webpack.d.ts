declare module '*.module.scss' {
    /** Typescript support for SASS CSS modules. */
    const classes: { readonly [key: string]: string }
    export default classes
}
