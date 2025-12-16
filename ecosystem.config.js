module.exports = {
    apps: [
        {
            name: 'tijdloze-frontend',
            port: '3000',
            exec_mode: 'cluster',
            instances: 'max',
            script: './.output/server/index.mjs',
            env: {
                "NUXT_PUBLIC_API_URI_CLIENT": "",
                "NUXT_PUBLIC_API_URI_SERVER": "",
                "NUXT_PUBLIC_AUTH0_CLIENT_ID": "",
                "NUXT_PUBLIC_AUTH0_CLIENT_DOMAIN": "",
                "NUXT_PUBLIC_AUTH0_AUDIENCE": "",
                "NUXT_PUBLIC_AUTH0_CALLBACK_URI": "",
                "NUXT_PUBLIC_AUTH0_LOGOUT_URI": "",
                "NUXT_PUBLIC_GTAG_ID": ""
            }
        }
    ]
}