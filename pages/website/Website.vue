<template>
    <div>
        <h2>Over de Tijdloze Website</h2>

        <tabs :tabs="[{ to: '/website', title: 'Over de website' }, { to: '/website/geschiedenis', title: 'Geschiedenis' }, { to: '/website/contact', title: 'Contact' }]">
            <router-view></router-view>
        </tabs>
    </div>
</template>

<script>
    import Tabs from '../../components/Tabs.vue'

    export default {
      components: {
        'tabs': Tabs
      }
    }
</script>