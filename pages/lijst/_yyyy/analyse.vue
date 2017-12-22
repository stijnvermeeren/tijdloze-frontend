<template>
    <div class="toelichting">
        <ul>
            <li v-for="text in analyse">
                <tijdloze-links :text="text" />
            </li>
        </ul>
    </div>
</template>

<script>
  export default {
    props: ["analyse"]
  }
</script>

<style lang="less" scoped>
    div.toelichting {
        margin: 0 auto 2em auto;
        width: 54em;

        ul {
            padding-left: 0;
            li {
                margin-bottom: 0.4em;
                font-size: 90%;
            }
        }
    }
</style>
