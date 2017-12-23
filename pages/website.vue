<template>
    <div>
        <h2>Over de Tijdloze Website</h2>

        <tijdloze-tabs :tabs="[{ to: '/website', title: 'Over de website' }, { to: '/website/geschiedenis', title: 'Geschiedenis' }, { to: '/website/contact', title: 'Contact' }]">
            <nuxt-child />
        </tijdloze-tabs>
    </div>
</template>
